export interface AlphabetLesson {
  id: string;
  letter: string;
  title: string;
  description: string;
  videoUrl: string;
  gifUrl: string;
  lessonType: 'alphabet' | 'greeting';
  keyPoints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  completed?: boolean;
}

export const masterTutorialVideos = {
  alphabet: 'https://www.youtube.com/embed/tkMg8g8vVUo',
  greeting: 'https://www.youtube.com/embed/uKKvNqA9N20'
} as const;

const alphabetCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const mediumDifficultyLetters = new Set(['G', 'H', 'K', 'P', 'Q', 'R', 'U', 'V', 'W', 'X', 'Y']);
const hardDifficultyLetters = new Set(['J', 'Z']);

function getLetterDifficulty(letter: string): 'easy' | 'medium' | 'hard' {
  if (hardDifficultyLetters.has(letter)) {
    return 'hard';
  }

  if (mediumDifficultyLetters.has(letter)) {
    return 'medium';
  }

  return 'easy';
}

const alphabetLetterLessons: AlphabetLesson[] = alphabetCharacters.map((letter) => ({
  id: `alphabet-${letter.toLowerCase()}`,
  letter,
  title: `Letter ${letter}`,
  description: `Practice the ASL handshape for letter ${letter} with steady posture and clear finger placement.`,
  videoUrl: masterTutorialVideos.alphabet,
  gifUrl: '',
  lessonType: 'alphabet',
  keyPoints: [
    'Keep your hand centered and clearly visible to the camera',
    `Form the ${letter} handshape and hold it for 1-2 seconds`,
    'Relax your wrist and avoid unnecessary movement while signing',
  ],
  difficulty: getLetterDifficulty(letter),
  completed: letter === 'A' || letter === 'B',
}));

export const alphabetLessons: AlphabetLesson[] = [
  ...alphabetLetterLessons,
  {
    id: 'greeting-hello',
    letter: 'HELLO',
    title: 'Greeting: Hello',
    description: 'Touch your hand to your forehead and move it outward in a small wave.',
    videoUrl: 'https://www.youtube.com/embed/uKKvNqA9N20',
    gifUrl: 'https://media.giphy.com/media/26gsspfbt1HfVQ9va/giphy.gif',
    lessonType: 'greeting',
    keyPoints: [
      'Start near the forehead',
      'Use a smooth outward motion',
      'Keep the movement relaxed and friendly'
    ],
    difficulty: 'easy',
    completed: false
  },
  {
    id: 'greeting-thank-you',
    letter: 'THANK YOU',
    title: 'Greeting: Thank You',
    description: 'Start with fingertips near your chin and move your hand outward toward the person you are thanking.',
    videoUrl: masterTutorialVideos.greeting,
    gifUrl: '',
    lessonType: 'greeting',
    keyPoints: [
      'Begin near the chin with relaxed fingers',
      'Move the hand smoothly outward',
      'Keep the gesture warm and intentional'
    ],
    difficulty: 'easy',
    completed: false
  },
  {
    id: 'greeting-please',
    letter: 'PLEASE',
    title: 'Greeting: Please',
    description: 'Place an open hand on your chest and make a gentle circular movement.',
    videoUrl: masterTutorialVideos.greeting,
    gifUrl: '',
    lessonType: 'greeting',
    keyPoints: [
      'Use an open relaxed hand shape',
      'Make a soft circular motion on the chest area',
      'Keep the movement controlled and clear'
    ],
    difficulty: 'medium',
    completed: false
  },
  {
    id: 'greeting-sorry',
    letter: 'SORRY',
    title: 'Greeting: Sorry',
    description: 'Make a fist and move it in a small circular motion over your chest.',
    videoUrl: masterTutorialVideos.greeting,
    gifUrl: '',
    lessonType: 'greeting',
    keyPoints: [
      'Form a comfortable fist',
      'Draw small circles over your chest',
      'Keep your shoulder relaxed and motion smooth'
    ],
    difficulty: 'medium',
    completed: false
  },
  {
    id: 'greeting-see-you',
    letter: 'SEE YOU',
    title: 'Greeting: See You',
    description: 'Point from your eyes outward toward the other person with a clear forward motion.',
    videoUrl: masterTutorialVideos.greeting,
    gifUrl: '',
    lessonType: 'greeting',
    keyPoints: [
      'Start the sign near your eyes',
      'Point outward in one smooth motion',
      'Finish with your hand clearly directed forward'
    ],
    difficulty: 'medium',
    completed: false
  },
  {
    id: 'greeting-goodbye',
    letter: 'GOODBYE',
    title: 'Greeting: Goodbye',
    description: 'Open and close your hand while waving outward from your shoulder.',
    videoUrl: 'https://www.youtube.com/embed/TfVfA5W8CNA',
    gifUrl: 'https://media.giphy.com/media/QAsBwSjx9zVKoGp9nr/giphy.gif',
    lessonType: 'greeting',
    keyPoints: [
      'Start with hand near shoulder',
      'Open-close fingers in a gentle wave',
      'Face palm outward while waving'
    ],
    difficulty: 'easy',
    completed: false
  }
];

export const practiceLessons = alphabetLessons.filter(
  (lesson) => lesson.lessonType === 'alphabet'
);

export const greetingLessons = alphabetLessons.filter(
  (lesson) => lesson.lessonType === 'greeting'
);

export const sequentialPracticeLessons = [...practiceLessons, ...greetingLessons];
