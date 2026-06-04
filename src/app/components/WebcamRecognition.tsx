import { Camera, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import {
  buildPositiveAiFeedback,
  evaluateSignMatch,
  evaluateTopPredictions,
  getMotionFeatures,
  type MotionPoint,
  type SimpleLandmark,
} from '../data/signRecognition';
import {
  inferSignFromBlob,
  isRoboflowConfigured,
  type RoboflowPrediction,
} from '../services/roboflowInference';

const HAND_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
const WASM_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';
const PASS_CONFIDENCE_THRESHOLD = 80;

export interface RecognitionUpdate {
  targetConfidence: number;
  alternateSign: string;
  alternateConfidence: number;
  aiFeedback: string;
  detectedSign: string;
  matched: boolean;
  source: 'roboflow' | 'mediapipe';
}

interface MatchSuccess {
  confidence: number;
  targetSign: string;
}

interface WebcamRecognitionProps {
  targetSign?: string;
  targetLessonType: 'alphabet' | 'greeting';
  isRecognizing?: boolean;
  onStartRecognition?: () => void;
  onStopRecognition?: () => void;
  onRecognitionUpdate?: (update: RecognitionUpdate) => void;
  onSignMatched?: (result: MatchSuccess) => void;
}

function normalizeSignLabel(value: string): string {
  return value
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/[^A-Za-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

function toCanonicalSignKey(value: string): string {
  return normalizeSignLabel(value).replace(/\s+/g, '');
}

function toRecognitionUpdate(
  targetSign: string,
  targetLessonType: 'alphabet' | 'greeting',
  top: RoboflowPrediction | null,
  second: RoboflowPrediction | null
): RecognitionUpdate {
  const targetKey = toCanonicalSignKey(targetSign);
  const topKey = toCanonicalSignKey(top?.sign ?? 'No sign detected');
  const topConfidence = top?.confidence ?? 0;
  const matched = topKey === targetKey && topConfidence >= PASS_CONFIDENCE_THRESHOLD;

  return {
  targetConfidence: matched ? topConfidence : Math.min(topConfidence, PASS_CONFIDENCE_THRESHOLD - 1),
    alternateSign: second?.sign ?? 'None',
    alternateConfidence: second?.confidence ?? 0,
    aiFeedback: buildPositiveAiFeedback(topConfidence, targetSign, targetLessonType),
    detectedSign: top?.sign ?? 'No sign detected',
    matched,
    source: 'roboflow',
  };
}

export function WebcamRecognition({
  targetSign = 'A',
  targetLessonType,
  isRecognizing = false,
  onStartRecognition,
  onStopRecognition,
  onRecognitionUpdate,
  onSignMatched,
}: WebcamRecognitionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const motionHistoryRef = useRef<MotionPoint[]>([]);
  const consecutiveMatchesRef = useRef(0);
  const successTriggeredRef = useRef(false);
  const lastUiUpdateRef = useRef(0);
  const roboflowErrorsRef = useRef(0);
  const roboflowInFlightRef = useRef(false);
  const onRecognitionUpdateRef = useRef(onRecognitionUpdate);
  const onSignMatchedRef = useRef(onSignMatched);

  const [cameraReady, setCameraReady] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [processingSource, setProcessingSource] = useState<'roboflow' | 'mediapipe'>(
    isRoboflowConfigured() ? 'roboflow' : 'mediapipe'
  );
  const [latestResult, setLatestResult] = useState<RecognitionUpdate>({
    targetConfidence: 0,
    alternateSign: 'None',
    alternateConfidence: 0,
    aiFeedback: 'Start recognition to receive AI coaching feedback.',
    detectedSign: 'None',
    matched: false,
    source: isRoboflowConfigured() ? 'roboflow' : 'mediapipe',
  });

  useEffect(() => {
    onRecognitionUpdateRef.current = onRecognitionUpdate;
  }, [onRecognitionUpdate]);

  useEffect(() => {
    onSignMatchedRef.current = onSignMatched;
  }, [onSignMatched]);

  const stopLoops = () => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    motionHistoryRef.current = [];
    consecutiveMatchesRef.current = 0;
    successTriggeredRef.current = false;
    roboflowInFlightRef.current = false;
  };

  const stopCameraStream = () => {
    stopLoops();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const initMediaPipe = async () => {
    if (handLandmarkerRef.current) {
      setModelReady(true);
      return;
    }

    const vision = await FilesetResolver.forVisionTasks(WASM_CDN);
    handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: HAND_MODEL_URL },
      runningMode: 'VIDEO',
      numHands: 1,
      minHandDetectionConfidence: 0.6,
      minHandPresenceConfidence: 0.6,
      minTrackingConfidence: 0.5,
    });
    setModelReady(true);
  };

  const startCameraStream = async () => {
    try {
      setCameraError(null);
      await initMediaPipe();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraReady(true);
    } catch {
      setCameraError('Unable to initialize camera or sign model. Check webcam permission and try again.');
      setCameraReady(false);
      setModelReady(false);
    }
  };

  const commitRecognitionUpdate = (update: RecognitionUpdate) => {
    const now = performance.now();
    if (now - lastUiUpdateRef.current < 180) {
      return;
    }

    lastUiUpdateRef.current = now;
    setLatestResult(update);
    onRecognitionUpdateRef.current?.(update);

    if (update.matched) {
      consecutiveMatchesRef.current += 1;
    } else {
      consecutiveMatchesRef.current = 0;
    }

    const requiredFrames = update.source === 'roboflow' ? 2 : 10;
    if (consecutiveMatchesRef.current >= requiredFrames && !successTriggeredRef.current) {
      successTriggeredRef.current = true;
      onSignMatchedRef.current?.({ confidence: update.targetConfidence, targetSign });
    }
  };

  const snapshotVideoFrame = async (): Promise<Blob | null> => {
    if (!videoRef.current) {
      return null;
    }

    const video = videoRef.current;
    if (video.readyState < 2) {
      return null;
    }

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const context = canvas.getContext('2d');
    if (!context) {
      return null;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.7);
    });
  };

  const runMediaPipeLoop = () => {
    if (!videoRef.current || !handLandmarkerRef.current || !isRecognizing) {
      return;
    }

    setProcessingSource('mediapipe');

    const processFrame = () => {
      if (!videoRef.current || !handLandmarkerRef.current || !isRecognizing) {
        return;
      }

      const video = videoRef.current;
      const now = performance.now();

      if (video.readyState < 2) {
        frameRef.current = window.requestAnimationFrame(processFrame);
        return;
      }

      const result = handLandmarkerRef.current.detectForVideo(video, now);
      const landmarks = result.landmarks[0] as SimpleLandmark[] | undefined;

      if (!landmarks) {
        commitRecognitionUpdate({
          targetConfidence: 0,
          alternateSign: latestResult.alternateSign,
          alternateConfidence: latestResult.alternateConfidence,
          aiFeedback: `Great effort on ${targetSign}. Bring your hand fully into frame and try again.`,
          detectedSign: 'No hand detected',
          matched: false,
          source: 'mediapipe',
        });

        frameRef.current = window.requestAnimationFrame(processFrame);
        return;
      }

      motionHistoryRef.current.push({
        x: landmarks[0].x,
        y: landmarks[0].y,
        z: landmarks[0].z,
        timestamp: Date.now(),
      });

      motionHistoryRef.current = motionHistoryRef.current.filter(
        (point) => Date.now() - point.timestamp < 1200
      );

      const motion = getMotionFeatures(motionHistoryRef.current);
      const targetConfidence = evaluateSignMatch(targetSign, targetLessonType, landmarks, motion);
      const predictions = evaluateTopPredictions(targetSign, landmarks, motion);
      const matched = targetConfidence >= PASS_CONFIDENCE_THRESHOLD;

      commitRecognitionUpdate({
        targetConfidence,
        alternateSign: predictions.secondSign,
        alternateConfidence: predictions.secondScore,
        aiFeedback: buildPositiveAiFeedback(targetConfidence, targetSign, targetLessonType),
        detectedSign: predictions.topSign,
        matched,
        source: 'mediapipe',
      });

      frameRef.current = window.requestAnimationFrame(processFrame);
    };

    frameRef.current = window.requestAnimationFrame(processFrame);
  };

  const runRoboflowLoop = () => {
    if (!isRecognizing) {
      return;
    }

    setProcessingSource('roboflow');

    const processFrame = async () => {
      if (!isRecognizing) {
        return;
      }

      if (roboflowInFlightRef.current) {
        return;
      }

      roboflowInFlightRef.current = true;

      try {
        const blob = await snapshotVideoFrame();
        if (!blob) {
          roboflowInFlightRef.current = false;
          return;
        }

        const result = await inferSignFromBlob(blob);
        if (!result) {
          roboflowInFlightRef.current = false;
          runMediaPipeLoop();
          return;
        }

        roboflowErrorsRef.current = 0;
        const top = result.predictions[0] ?? null;
        const second = result.predictions[1] ?? null;

        const update = toRecognitionUpdate(targetSign, targetLessonType, top, second);
        commitRecognitionUpdate(update);
      } catch {
        roboflowErrorsRef.current += 1;
        if (roboflowErrorsRef.current >= 2) {
          setCameraError('Roboflow is unavailable right now. Falling back to on-device recognition.');
          stopLoops();
          runMediaPipeLoop();
        }
      } finally {
        roboflowInFlightRef.current = false;
      }
    };

    intervalRef.current = window.setInterval(() => {
      void processFrame();
    }, 900);
  };

  useEffect(() => {
    if (isRecognizing) {
      void startCameraStream().then(() => {
        if (isRoboflowConfigured()) {
          runRoboflowLoop();
        } else {
          runMediaPipeLoop();
        }
      });
    } else {
      stopCameraStream();
      setCameraReady(false);
    }

    return () => {
      stopCameraStream();
      setCameraReady(false);
    };
  }, [isRecognizing, targetLessonType, targetSign]);

  useEffect(() => {
    const source = isRoboflowConfigured() ? 'roboflow' : 'mediapipe';
    setProcessingSource(source);
    setLatestResult((current) => ({
      ...current,
      targetConfidence: 0,
      matched: false,
      aiFeedback: `Start recognition to practice ${targetSign}.`,
      detectedSign: 'None',
      source,
    }));
    consecutiveMatchesRef.current = 0;
    successTriggeredRef.current = false;
    motionHistoryRef.current = [];
  }, [targetSign]);

  return (
    <Card className="p-6 game-soft-panel rounded-2xl">
      <div className="space-y-4">
        <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-700">
          <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />

          {!cameraReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-3 px-4">
                <Camera className="w-16 h-16 mx-auto text-gray-600" />
                <p className="text-slate-300">Webcam Preview</p>
                <p className="text-sm text-slate-400">
                  {cameraError ?? (modelReady ? 'Camera ready for sign recognition' : 'Loading recognition model...')}
                </p>
              </div>
            </div>
          )}

          {isRecognizing && (
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="bg-slate-950/75 border border-cyan-300/35 backdrop-blur-sm px-3 py-2 rounded-lg">
                <p className="text-slate-100 text-sm">Target: <span className="font-bold text-lg text-cyan-300">{targetSign}</span></p>
              </div>
              <div className="bg-slate-950/75 border border-emerald-300/35 backdrop-blur-sm px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-slate-100 text-sm">{processingSource === 'roboflow' ? 'Roboflow analyzing' : 'On-device analyzing'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-900/55 border border-slate-700 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-800 rounded-full border border-cyan-300/30 flex items-center justify-center shadow-sm">
              <span className="text-2xl font-bold text-cyan-200">{targetSign}</span>
            </div>
            <div>
              <p className="font-medium text-slate-100">Practice Sign {targetSign}</p>
              <p className="text-sm text-slate-400">Recognition source: {processingSource}</p>
            </div>
          </div>

          {isRecognizing ? (
            <Button variant="destructive" onClick={onStopRecognition}>
              Stop
            </Button>
          ) : (
            <Button onClick={onStartRecognition} className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
              <Camera className="w-4 h-4 mr-2" />
              Start
            </Button>
          )}
        </div>

        {isRecognizing && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-300">Recognition Results:</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-emerald-400/15 border border-emerald-300/35 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span className="font-medium text-emerald-100">{targetSign}</span>
                </div>
                <span className="text-emerald-200 font-medium">{latestResult.targetConfidence}%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900/45 border border-slate-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-300">{latestResult.alternateSign}</span>
                </div>
                <span className="text-slate-400">{latestResult.alternateConfidence}%</span>
              </div>

              <div className={`p-3 rounded-lg border ${
                latestResult.matched ? 'bg-emerald-400/15 border-emerald-300/35' : 'bg-amber-400/15 border-amber-300/35'
              }`}>
                <p className={`text-sm font-medium ${
                  latestResult.matched ? 'text-emerald-100' : 'text-amber-100'
                }`}>
                  Detected sign: {latestResult.detectedSign}
                </p>
              </div>

              <div className="p-3 bg-cyan-400/15 border border-cyan-300/35 rounded-lg">
                <p className="text-sm text-cyan-100 font-medium">AI Coach</p>
                <p className="text-sm text-cyan-200 mt-1">{latestResult.aiFeedback}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
