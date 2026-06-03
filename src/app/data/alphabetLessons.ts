export interface AlphabetLesson {
  letter: string;
  title: string;
  description: string;
  videoUrl: string;
  keyPoints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  completed?: boolean;
}

export const alphabetLessons: AlphabetLesson[] = [
  {
    letter: 'A',
    title: 'Letter A',
    description: 'Make a fist with your thumb resting on the side of your index finger.',
    videoUrl: 'https://example.com/asl-a.mp4',
    keyPoints: [
      'Closed fist position',
      'Thumb against the side',
      'Palm facing forward'
    ],
    difficulty: 'easy',
    completed: true
  },
  {
    letter: 'B',
    title: 'Letter B',
    description: 'Hold your hand flat with fingers together and thumb tucked across your palm.',
    videoUrl: 'https://example.com/asl-b.mp4',
    keyPoints: [
      'Flat palm position',
      'Fingers together',
      'Thumb tucked in'
    ],
    difficulty: 'easy',
    completed: true
  },
  {
    letter: 'C',
    title: 'Letter C',
    description: 'Curve your fingers and thumb to form the letter C shape.',
    videoUrl: 'https://example.com/asl-c.mp4',
    keyPoints: [
      'Curved hand shape',
      'Fingers and thumb parallel',
      'Opening faces left'
    ],
    difficulty: 'easy',
    completed: false
  },
  {
    letter: 'D',
    title: 'Letter D',
    description: 'Point your index finger up while touching your thumb to your other fingers.',
    videoUrl: 'https://example.com/asl-d.mp4',
    keyPoints: [
      'Index finger extended',
      'Thumb touches middle finger',
      'Circle shape with thumb and fingers'
    ],
    difficulty: 'medium',
    completed: false
  },
  {
    letter: 'E',
    title: 'Letter E',
    description: 'Curl all fingers down with thumb on top.',
    videoUrl: 'https://example.com/asl-e.mp4',
    keyPoints: [
      'All fingers bent',
      'Thumb overlays fingers',
      'Tight fist position'
    ],
    difficulty: 'easy',
    completed: false
  },
  {
    letter: 'F',
    title: 'Letter F',
    description: 'Touch your index finger and thumb together, keep other fingers up.',
    videoUrl: 'https://example.com/asl-f.mp4',
    keyPoints: [
      'OK sign with index and thumb',
      'Other three fingers extended',
      'Palm faces outward'
    ],
    difficulty: 'medium',
    completed: false
  }
];
