# Project Structure and Major Files

This document explains the main folders and files in this ASL Learning Platform.

## High-Level Structure

```text
fyp/
  index.html
  package.json
  vite.config.ts
  README.md
  src/
    main.tsx
    styles/
      index.css
      tailwind.css
      theme.css
      fonts.css
    app/
      App.tsx
      routes.tsx
      pages/
        Home.tsx
        LearnPathSelect.tsx
        LearnModule.tsx
        PracticeModule.tsx
        QuizModule.tsx
      components/
        WebcamRecognition.tsx
        QuizCard.tsx
        ui/...
      data/
        alphabetLessons.ts
        quizQuestions.ts
        signRecognition.ts
      services/
        roboflowInference.ts
```

## Root Files

- index.html
  - HTML entry template used by Vite.

- package.json
  - Project scripts and dependency definitions.
  - Main scripts: `npm run dev`, `npm run build`.

- vite.config.ts
  - Vite build/dev server configuration.

- README.md
  - Project overview, setup, and environment variable notes.

## Application Entry

- src/main.tsx
  - React bootstrap file.
  - Mounts the app to the root DOM element and imports global styles.

- src/app/App.tsx
  - Top-level app component.
  - Renders the router provider.

- src/app/routes.tsx
  - Central route map for all pages.
  - Defines navigation paths: home, learn, practice, and quiz.

## Styling Layer

- src/styles/index.css
  - Global style entry point that imports the rest of style files.

- src/styles/tailwind.css
  - Tailwind setup and source scanning configuration.

- src/styles/theme.css
  - Design tokens and global base styles.
  - Includes app-wide visual theme (dark/gamified styling classes).

- src/styles/fonts.css
  - Font imports for app typography.

## Pages (Feature Screens)

- src/app/pages/Home.tsx
  - Dashboard-like landing page.
  - Shows progress summary and quick navigation cards.

- src/app/pages/LearnPathSelect.tsx
  - Track selector (Alphabet or Greetings).

- src/app/pages/LearnModule.tsx
  - Learning content page for selected track.
  - Shows master tutorial video and per-lesson details.

- src/app/pages/PracticeModule.tsx
  - Guided practice progression.
  - Handles unlock logic, scoring, session stats, and path progression UI.

- src/app/pages/QuizModule.tsx
  - Quiz flow with start, active, and completion states.

## Components

- src/app/components/WebcamRecognition.tsx
  - Webcam capture and live recognition loop.
  - Uses Roboflow first, with MediaPipe fallback.
  - Emits confidence and recognition updates to practice page.

- src/app/components/QuizCard.tsx
  - Reusable quiz question card.
  - Manages answer selection, submission, and feedback display.

- src/app/components/ui/*
  - Shared UI primitives (button, card, badge, dialog, etc.).
  - Foundation for consistent visual components across pages.

## Data and Domain Logic

- src/app/data/alphabetLessons.ts
  - Core lesson data model and lesson list.
  - Source of truth for learning/practice sequence.
  - Includes lesson typing and track filtering exports.

- src/app/data/quizQuestions.ts
  - Quiz question bank and expected answers.

- src/app/data/signRecognition.ts
  - On-device sign evaluation logic for fallback mode.
  - Contains motion/landmark scoring helpers and AI feedback text generation.

## Service Layer

- src/app/services/roboflowInference.ts
  - API integration for Roboflow model inference.
  - Handles env-based endpoint setup, response parsing, and confidence filtering.

## How The Main Flow Connects

1. `main.tsx` boots app and loads global styles.
2. `App.tsx` loads router from `routes.tsx`.
3. Pages use data from `data/` and components from `components/`.
4. Practice page uses `WebcamRecognition.tsx`.
5. Webcam recognition calls `roboflowInference.ts`; if unavailable, fallback logic in `signRecognition.ts` is used.
6. Progression and points are persisted in browser localStorage.
