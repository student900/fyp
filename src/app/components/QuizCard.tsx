import { Card } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';

interface QuizCardProps {
  question: string;
  options: string[];
  correctAnswer: number;
  onAnswer?: (isCorrect: boolean) => void;
  currentQuestion?: number;
  totalQuestions?: number;
}

export function QuizCard({ 
  question, 
  options, 
  correctAnswer,
  onAnswer,
  currentQuestion = 1,
  totalQuestions = 5
}: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSelectAnswer = (index: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setHasAnswered(true);
    const isCorrect = selectedAnswer === correctAnswer;
    if (onAnswer) {
      setTimeout(() => onAnswer(isCorrect), 1500);
    }
  };

  const getOptionStyle = (index: number) => {
    if (!hasAnswered) {
      return selectedAnswer === index
        ? 'border-purple-500 bg-purple-50'
        : 'border-gray-300 hover:border-purple-400 bg-white';
    }

    if (index === correctAnswer) {
      return 'border-green-500 bg-green-50';
    }

    if (selectedAnswer === index && index !== correctAnswer) {
      return 'border-red-500 bg-red-50';
    }

    return 'border-gray-200 bg-gray-50';
  };

  return (
    <Card className="p-8 border border-gray-200 shadow-lg bg-white">
      <div className="space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-4 py-2 rounded-lg">
            Question {currentQuestion} of {totalQuestions}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalQuestions }).map((_, idx) => (
              <div
                key={idx}
                className={`w-8 h-1.5 rounded-full ${
                  idx < currentQuestion - 1 ? 'bg-green-500' :
                  idx === currentQuestion - 1 ? 'bg-purple-600' :
                  'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{question}</h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              disabled={hasAnswered}
              className={`w-full text-left p-4 border-2 rounded-lg transition-all ${getOptionStyle(index)} ${
                hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm ${
                    !hasAnswered && selectedAnswer === index
                      ? 'bg-purple-600 text-white'
                      : hasAnswered && index === correctAnswer
                      ? 'bg-green-600 text-white'
                      : hasAnswered && selectedAnswer === index && index !== correctAnswer
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
                {hasAnswered && (
                  <div>
                    {index === correctAnswer && (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    )}
                    {selectedAnswer === index && index !== correctAnswer && (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Submit Button */}
        {!hasAnswered && (
          <Button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400"
            size="lg"
          >
            {selectedAnswer === null ? 'Select an Answer' : 'Submit Answer'}
          </Button>
        )}

        {/* Feedback */}
        {hasAnswered && (
          <div className={`p-4 rounded-lg border-2 ${
              selectedAnswer === correctAnswer
                ? 'bg-green-50 border-green-300'
                : 'bg-red-50 border-red-300'
            }`}
          >
            <p className={`font-semibold ${
              selectedAnswer === correctAnswer ? 'text-green-900' : 'text-red-900'
            }`}>
              {selectedAnswer === correctAnswer
                ? 'Correct! Well done.'
                : 'Incorrect. The correct answer is highlighted above.'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
