import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { WebcamRecognition } from '../components/WebcamRecognition';
import { alphabetLessons } from '../data/alphabetLessons';
import {
  CheckCircle2,
  ArrowRight,
  Trophy,
  Target,
  Star,
  RefreshCcw,
  Flame
} from 'lucide-react';

export function PracticeModule() {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [completedLetters, setCompletedLetters] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const currentLetter = alphabetLessons[currentLetterIndex];
  const progressPercentage = (completedLetters.length / alphabetLessons.length) * 100;

  const handleStartRecognition = () => {
    setIsRecognizing(true);
    setAttempts(attempts + 1);
  };

  const handleStopRecognition = () => {
    setIsRecognizing(false);
  };

  const handleNextLetter = () => {
    if (!completedLetters.includes(currentLetter.letter)) {
      setCompletedLetters([...completedLetters, currentLetter.letter]);
      setStreak(streak + 1);
    }

    if (currentLetterIndex < alphabetLessons.length - 1) {
      setCurrentLetterIndex(currentLetterIndex + 1);
      setIsRecognizing(false);
    }
  };

  const handleReset = () => {
    setCurrentLetterIndex(0);
    setCompletedLetters([]);
    setStreak(0);
    setAttempts(0);
    setIsRecognizing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Practice Mode
              </h1>
              <p className="text-gray-600 text-lg">Perfect your signs with AI-powered feedback</p>
            </div>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-2 border-green-600 text-green-600 hover:bg-green-50"
              size="lg"
            >
              <RefreshCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
          
          {/* Progress Card */}
          <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-white" />
                <div>
                  <p className="text-white font-bold text-lg">Session Progress</p>
                  <p className="text-green-100 text-sm">Keep up the good work</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-white">{completedLetters.length}</p>
                <p className="text-green-100 text-sm">/ {alphabetLessons.length} letters</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-100 font-medium">Progress</span>
                <span className="font-semibold text-white">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="h-3 bg-green-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Practice Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Letter Card */}
            <Card className="p-8 border border-gray-200 shadow-lg bg-white">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-white">{currentLetter.letter}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentLetter.title}</h2>
                    <p className="text-gray-600 mt-1">{currentLetter.description}</p>
                  </div>
                </div>
                <Badge className={`capitalize text-sm px-3 py-1 ${
                    currentLetter.difficulty === 'easy'
                      ? 'bg-green-100 text-green-700'
                      : currentLetter.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                  {currentLetter.difficulty}
                </Badge>
              </div>

              {/* Key Points */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Key Points:</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  {currentLetter.keyPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center justify-between p-4 bg-green-100 rounded-xl">
                <span className="text-sm font-medium text-green-900">
                  Letter {currentLetterIndex + 1} of {alphabetLessons.length}
                </span>
                <Button
                  onClick={handleNextLetter}
                  disabled={currentLetterIndex >= alphabetLessons.length - 1}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                  size="lg"
                >
                  Next Letter
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>

            {/* Webcam Recognition */}
            <WebcamRecognition
              targetLetter={currentLetter.letter}
              isRecognizing={isRecognizing}
              onStartRecognition={handleStartRecognition}
              onStopRecognition={handleStopRecognition}
            />
          </div>

          {/* Stats Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Session Stats */}
            <Card className="p-6 border border-gray-200 shadow-lg bg-white">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900 text-lg">Session Stats</h3>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: Flame,
                    label: 'Streak',
                    value: streak,
                    color: 'bg-orange-100 text-orange-700'
                  },
                  {
                    icon: CheckCircle2,
                    label: 'Completed',
                    value: completedLetters.length,
                    color: 'bg-green-100 text-green-700'
                  },
                  {
                    icon: Target,
                    label: 'Attempts',
                    value: attempts,
                    color: 'bg-blue-100 text-blue-700'
                  }
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className={`p-4 ${stat.color} rounded-xl`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <stat.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tips Card */}
            <Card className="p-6 border border-gray-200 shadow-lg bg-white">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900 text-lg">Practice Tips</h3>
              </div>

              <ul className="space-y-2 text-sm">
                {[
                  'Ensure good lighting',
                  'Center your hand in frame',
                  'Hold steady for 2-3 seconds',
                  'Practice regularly for best results'
                ].map((tip, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="text-purple-600 font-semibold">•</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Letter Progress Grid */}
            <Card className="p-6 border border-gray-200 shadow-lg bg-white">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Letter Progress</h3>
              <div className="grid grid-cols-4 gap-2">
                {alphabetLessons.map((lesson) => (
                  <div
                    key={lesson.letter}
                    className={`aspect-square rounded-lg flex items-center justify-center font-semibold text-base transition-all ${
                      completedLetters.includes(lesson.letter)
                        ? 'bg-green-500 text-white'
                        : currentLetter.letter === lesson.letter
                        ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                        : 'bg-gray-100 text-gray-400 border border-gray-300'
                    }`}
                  >
                    {lesson.letter}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
