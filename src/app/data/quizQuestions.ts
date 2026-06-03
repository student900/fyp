export interface QuizQuestion {
  id: number;
  letter: string;
  question: string;
  options: string[];
  correctAnswer: number;
  imageUrl?: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    letter: 'A',
    question: 'Which hand position represents the letter A?',
    options: [
      'Closed fist with thumb on the side',
      'Flat palm with fingers together',
      'Curved hand in C shape',
      'Index finger pointing up'
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    letter: 'B',
    question: 'How should your thumb be positioned for the letter B?',
    options: [
      'Extended outward',
      'Tucked across the palm',
      'Touching the index finger',
      'Pointing upward'
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    letter: 'C',
    question: 'What shape does the hand form for letter C?',
    options: [
      'A straight line',
      'A circle',
      'A curved C shape',
      'A tight fist'
    ],
    correctAnswer: 2
  },
  {
    id: 4,
    letter: 'D',
    question: 'Which finger is extended for the letter D?',
    options: [
      'Thumb',
      'Index finger',
      'Middle finger',
      'Pinky finger'
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    letter: 'F',
    question: 'Which fingers touch for the letter F?',
    options: [
      'Thumb and pinky',
      'Thumb and middle finger',
      'Thumb and index finger',
      'Index and middle finger'
    ],
    correctAnswer: 2
  }
];
