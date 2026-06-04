export interface RoboflowPrediction {
  sign: string;
  confidence: number;
}

export interface RoboflowResult {
  predictions: RoboflowPrediction[];
  modelId?: string;
}

const inferenceUrl = import.meta.env.VITE_ROBOFLOW_INFER_URL as string | undefined;
const apiKey = import.meta.env.VITE_ROBOFLOW_API_KEY as string | undefined;
const confidenceThreshold = Number(import.meta.env.VITE_ROBOFLOW_CONFIDENCE_THRESHOLD ?? 0.4);

function normalizeSignLabel(label: string): string {
  return label
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/[^A-Za-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

function buildUrl(): string | null {
  if (!inferenceUrl || !apiKey) {
    return null;
  }

  const separator = inferenceUrl.includes('?') ? '&' : '?';
  return `${inferenceUrl}${separator}api_key=${encodeURIComponent(apiKey)}`;
}

function extractPredictions(payload: unknown): RoboflowPrediction[] {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const body = payload as {
    predictions?: Array<{ class?: string; confidence?: number; class_confidence?: number; top?: string; score?: number }>;
    predicted_classes?: string[];
    confidence?: number[];
  };

  const predictionsFromArray = Array.isArray(body.predictions)
    ? body.predictions
        .map((prediction) => {
          const label = prediction.class ?? prediction.top;
          const confidence = prediction.confidence ?? prediction.class_confidence ?? prediction.score;

          if (!label || typeof confidence !== 'number') {
            return null;
          }

          return {
            sign: normalizeSignLabel(label),
            confidence: Math.max(0, Math.min(100, Math.round(confidence * 100))),
          } as RoboflowPrediction;
        })
        .filter((prediction): prediction is RoboflowPrediction => Boolean(prediction))
    : [];

  if (predictionsFromArray.length > 0) {
    return predictionsFromArray.sort((a, b) => b.confidence - a.confidence);
  }

  if (Array.isArray(body.predicted_classes) && Array.isArray(body.confidence)) {
    return body.predicted_classes
      .map((label, index) => {
        const conf = body.confidence?.[index];
        if (typeof conf !== 'number') {
          return null;
        }

        return {
          sign: normalizeSignLabel(label),
          confidence: Math.max(0, Math.min(100, Math.round(conf * 100))),
        } as RoboflowPrediction;
      })
      .filter((prediction): prediction is RoboflowPrediction => Boolean(prediction))
      .sort((a, b) => b.confidence - a.confidence);
  }

  return [];
}

export function isRoboflowConfigured(): boolean {
  return Boolean(buildUrl());
}

export async function inferSignFromBlob(imageBlob: Blob): Promise<RoboflowResult | null> {
  const url = buildUrl();
  if (!url) {
    return null;
  }

  const formData = new FormData();
  formData.append('file', imageBlob, 'frame.jpg');

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Roboflow request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  const predictions = extractPredictions(payload).filter(
    (prediction) => prediction.confidence >= confidenceThreshold * 100
  );

  return {
    predictions,
    modelId: typeof payload === 'object' && payload && 'model' in payload ? String((payload as { model?: string }).model ?? '') : undefined,
  };
}
