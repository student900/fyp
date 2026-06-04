
# ASL Learning Platform

Interactive ASL learning app with lessons, quizzes, and webcam-based practice.

## What Was Updated

### 1. Master Tutorial Videos
- Learn mode now uses one video for all alphabet signs and one video for all greeting signs.
- Both master videos are displayed at the top of Learn mode for quick reference.
- Individual lessons still keep GIF demonstrations for sign-level guidance.

### 2. Greeting Lessons Added
- Lessons now support two types:
  - `alphabet`
  - `greeting`
- Added greeting-focused entries:
  - Hello
  - Thank You
  - Good Morning
  - Goodbye
- Learn mode now displays lesson type badges and a quick count of alphabet vs greeting lessons.

### 3. Roboflow Sign Recognition (Primary)
- Practice mode now uses Roboflow inference as the primary sign recognizer.
- Webcam recognition pipeline:
  - Starts camera stream with `navigator.mediaDevices.getUserMedia`.
  - Captures frame snapshots.
  - Sends snapshots to the configured Roboflow inference endpoint.
  - Parses detected sign labels and confidence scores.
- If Roboflow is not configured or temporarily unavailable, the app automatically falls back to on-device MediaPipe recognition.

### 4. Duolingo-Style Path + Sequential Gated Practice
- Practice flow is now locked in order:
  - Users must pass sign 1 before sign 2 is unlocked, and so on.
  - Sequence order is letters first, then greetings.
- Practice sequence UI is rendered as a path of skill nodes (Duolingo-style inspired flow).
- Correct sign match awards points.
- Progress and points persist in local storage.
- Users can revisit previously unlocked signs, but cannot skip ahead.

### 5. Positive AI Reinforcement Loop
- If a sign is not yet matched, user receives constructive AI-style coaching feedback.
- Feedback remains supportive while guiding posture/motion improvements.
- Once matched, user gets a success message and next sign unlock confirmation.

## Key Files Changed

- `src/app/data/alphabetLessons.ts`
  - Extended lesson model (`id`, `gifUrl`, `lessonType`)
  - Added `masterTutorialVideos` for two-video learning model
  - Added greeting lessons
  - Added ordered practice exports (`practiceLessons`, `greetingLessons`, `sequentialPracticeLessons`)
- `src/app/data/signRecognition.ts`
  - Added sign matching heuristics and motion feature scoring helpers (fallback path)
- `src/app/services/roboflowInference.ts`
  - Added Roboflow inference client
  - Added prediction parsing and normalization utilities
- `src/app/pages/LearnModule.tsx`
  - Added two master tutorial video panels (alphabet and greetings)
  - Kept individual GIF demonstration per selected sign
  - Added greeting/alphabet lesson indicators
- `src/app/components/WebcamRecognition.tsx`
  - Replaced mock recognition with Roboflow-first webcam inference
  - Added automatic MediaPipe fallback for resilience
  - Added matched-sign stability check for progression unlock
- `src/app/pages/PracticeModule.tsx`
  - Added locked sequential progression and unlock gating
  - Added scoring system (+points on verified sign pass)
  - Added local persistence for points/unlocks/completed signs
  - Added AI coach feedback and confidence loop integration
  - Added Duolingo-like skill path visualization
- `src/app/components/QuizCard.tsx`
  - Added positive reinforcement AI coach quiz feedback
- `src/app/pages/Home.tsx`
  - Updated content to reflect greeting lessons and AI coaching behavior

## Run The Project

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Notes

- Webcam features require browser camera permission.
- Roboflow and tutorial media require internet access.

## Roboflow Setup

Create a `.env` file at the project root and add:

```bash
VITE_ROBOFLOW_INFER_URL=https://detect.roboflow.com/<your-model>/<version>
VITE_ROBOFLOW_API_KEY=<your-roboflow-api-key>
VITE_ROBOFLOW_CONFIDENCE_THRESHOLD=0.4
```

Notes:
- `VITE_ROBOFLOW_INFER_URL` should point to your existing sign-language model endpoint.
- Labels returned by Roboflow should match lesson signs (for example `A`, `B`, `HELLO`, `THANK YOU`).
- If these env vars are missing, the app uses on-device MediaPipe fallback for recognition.
  