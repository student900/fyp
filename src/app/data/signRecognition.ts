import { sequentialPracticeLessons } from './alphabetLessons';

export interface SimpleLandmark {
  x: number;
  y: number;
  z: number;
}

export interface MotionPoint {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export interface MotionFeatures {
  xRange: number;
  yDelta: number;
  zDelta: number;
}

const FINGER_TIPS = [4, 8, 12, 16, 20] as const;
const FINGER_PIPS = [3, 6, 10, 14, 18] as const;

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function landmarkDistance(a: SimpleLandmark, b: SimpleLandmark): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function getFingerState(landmarks: SimpleLandmark[]) {
  const thumbExtended = Math.abs(landmarks[FINGER_TIPS[0]].x - landmarks[FINGER_PIPS[0]].x) > 0.04;

  const indexExtended = landmarks[FINGER_TIPS[1]].y < landmarks[FINGER_PIPS[1]].y;
  const middleExtended = landmarks[FINGER_TIPS[2]].y < landmarks[FINGER_PIPS[2]].y;
  const ringExtended = landmarks[FINGER_TIPS[3]].y < landmarks[FINGER_PIPS[3]].y;
  const pinkyExtended = landmarks[FINGER_TIPS[4]].y < landmarks[FINGER_PIPS[4]].y;

  return {
    thumbExtended,
    indexExtended,
    middleExtended,
    ringExtended,
    pinkyExtended,
  };
}

function getOpenPalmScore(landmarks: SimpleLandmark[]): number {
  const fingers = getFingerState(landmarks);
  const extendedCount = [
    fingers.thumbExtended,
    fingers.indexExtended,
    fingers.middleExtended,
    fingers.ringExtended,
    fingers.pinkyExtended,
  ].filter(Boolean).length;

  return (extendedCount / 5) * 100;
}

function scoreLetterShape(sign: string, landmarks: SimpleLandmark[]): number {
  const fingers = getFingerState(landmarks);
  const thumbToIndex = landmarkDistance(landmarks[4], landmarks[8]);
  const thumbToMiddle = landmarkDistance(landmarks[4], landmarks[12]);
  const indexCurve = landmarkDistance(landmarks[8], landmarks[5]);

  if (sign === 'A') {
    let score = 100;
    if (fingers.indexExtended) score -= 30;
    if (fingers.middleExtended) score -= 20;
    if (fingers.ringExtended) score -= 20;
    if (fingers.pinkyExtended) score -= 20;
    if (!fingers.thumbExtended) score -= 10;
    return clampScore(score);
  }

  if (sign === 'B') {
    let score = 100;
    if (!fingers.indexExtended) score -= 20;
    if (!fingers.middleExtended) score -= 20;
    if (!fingers.ringExtended) score -= 20;
    if (!fingers.pinkyExtended) score -= 20;
    if (fingers.thumbExtended) score -= 20;
    return clampScore(score);
  }

  if (sign === 'C') {
    let score = 70;
    if (indexCurve > 0.13 && indexCurve < 0.32) score += 30;
    if (!fingers.indexExtended && !fingers.middleExtended) score += 10;
    return clampScore(score);
  }

  if (sign === 'D') {
    let score = 100;
    if (!fingers.indexExtended) score -= 30;
    if (fingers.middleExtended) score -= 20;
    if (fingers.ringExtended) score -= 20;
    if (fingers.pinkyExtended) score -= 20;
    if (thumbToMiddle > 0.08) score -= 20;
    return clampScore(score);
  }

  if (sign === 'E') {
    let score = 100;
    if (fingers.indexExtended) score -= 20;
    if (fingers.middleExtended) score -= 20;
    if (fingers.ringExtended) score -= 20;
    if (fingers.pinkyExtended) score -= 20;
    if (fingers.thumbExtended) score -= 20;
    return clampScore(score);
  }

  if (sign === 'F') {
    let score = 100;
    if (thumbToIndex > 0.06) score -= 30;
    if (!fingers.middleExtended) score -= 20;
    if (!fingers.ringExtended) score -= 20;
    if (!fingers.pinkyExtended) score -= 20;
    return clampScore(score);
  }

  return 0;
}

function scoreGreetingShape(sign: string, landmarks: SimpleLandmark[], motion: MotionFeatures): number {
  const openPalm = getOpenPalmScore(landmarks);
  const closedFist = 100 - openPalm;
  const absYDelta = Math.abs(motion.yDelta);
  const absZDelta = Math.abs(motion.zDelta);

  if (sign === 'HELLO') {
    const movementScore = motion.xRange > 0.08 ? 100 : motion.xRange * 1200;
    return clampScore(openPalm * 0.7 + movementScore * 0.3);
  }

  if (sign === 'GOODBYE') {
    const movementScore = motion.xRange > 0.12 ? 100 : motion.xRange * 900;
    return clampScore(openPalm * 0.65 + movementScore * 0.35);
  }

  if (sign === 'THANK YOU') {
    const forwardMotionScore = absZDelta > 0.05 ? 100 : absZDelta * 1800;
    const verticalMotionScore = absYDelta > 0.04 ? 100 : absYDelta * 2000;
    return clampScore(openPalm * 0.6 + forwardMotionScore * 0.25 + verticalMotionScore * 0.15);
  }

  if (sign === 'PLEASE') {
    const circularXScore = motion.xRange > 0.06 && motion.xRange < 0.2 ? 100 : Math.min(100, motion.xRange * 1500);
    const circularYScore = absYDelta > 0.03 ? 100 : absYDelta * 2200;
    return clampScore(openPalm * 0.55 + circularXScore * 0.25 + circularYScore * 0.2);
  }

  if (sign === 'SORRY') {
    const circularXScore = motion.xRange > 0.05 ? 100 : motion.xRange * 1800;
    const circularYScore = absYDelta > 0.03 ? 100 : absYDelta * 2200;
    return clampScore(closedFist * 0.6 + circularXScore * 0.25 + circularYScore * 0.15);
  }

  if (sign === 'SEE YOU') {
    const directionScore = motion.xRange > 0.09 ? 100 : motion.xRange * 1300;
    const depthScore = absZDelta > 0.04 ? 100 : absZDelta * 2100;
    return clampScore(openPalm * 0.4 + directionScore * 0.35 + depthScore * 0.25);
  }

  return 0;
}

export function getMotionFeatures(history: MotionPoint[]): MotionFeatures {
  if (history.length < 2) {
    return { xRange: 0, yDelta: 0, zDelta: 0 };
  }

  const start = history[0];
  const end = history[history.length - 1];

  let minX = start.x;
  let maxX = start.x;

  history.forEach((point) => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
  });

  return {
    xRange: maxX - minX,
    yDelta: end.y - start.y,
    zDelta: end.z - start.z,
  };
}

export function evaluateSignMatch(
  targetSign: string,
  lessonType: 'alphabet' | 'greeting',
  landmarks: SimpleLandmark[],
  motion: MotionFeatures
): number {
  if (lessonType === 'alphabet') {
    return scoreLetterShape(targetSign, landmarks);
  }

  return scoreGreetingShape(targetSign, landmarks, motion);
}

export function evaluateTopPredictions(
  targetSign: string,
  landmarks: SimpleLandmark[],
  motion: MotionFeatures
): { topSign: string; topScore: number; secondSign: string; secondScore: number } {
  const scores = sequentialPracticeLessons.map((lesson) => ({
    sign: lesson.letter,
    score: evaluateSignMatch(lesson.letter, lesson.lessonType, landmarks, motion),
  }));

  scores.sort((a, b) => b.score - a.score);

  const top = scores[0] ?? { sign: targetSign, score: 0 };
  const second = scores[1] ?? { sign: targetSign, score: 0 };

  return {
    topSign: top.sign,
    topScore: top.score,
    secondSign: second.sign,
    secondScore: second.score,
  };
}

export function buildPositiveAiFeedback(
  confidence: number,
  targetSign: string,
  lessonType: 'alphabet' | 'greeting'
): string {
  if (confidence >= 90) {
    return `Excellent ${lessonType} sign for ${targetSign}. Hold steady and you are ready to unlock the next step.`;
  }

  if (confidence >= 75) {
    return `Strong progress on ${targetSign}. Keep your hand centered and repeat the same shape once more.`;
  }

  if (confidence >= 60) {
    return `Nice effort on ${targetSign}. You are close, so slow down slightly and maintain the key hand shape.`;
  }

  return `Great attempt on ${targetSign}. Keep practicing with clear lighting and a steady motion. You can do this.`;
}
