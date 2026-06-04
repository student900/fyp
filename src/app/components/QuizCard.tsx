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
        ? 'border-cyan-300 bg-cyan-400/15'
        : 'border-slate-600 hover:border-cyan-300/70 bg-slate-900/45';
    }

    if (index === correctAnswer) {
      return 'border-emerald-300 bg-emerald-400/15';
    }

    if (selectedAnswer === index && index !== correctAnswer) {
      return 'border-red-300 bg-red-400/15';
    }

    return 'border-slate-700 bg-slate-900/35';
  };

  const getAiFeedback = () => {
    if (!hasAnswered || selectedAnswer === null) {
      return '';
    }

    if (selectedAnswer === correctAnswer) {
      return 'AI Coach: Excellent choice. Your sign recognition is getting stronger each round.';
    }

    return `AI Coach: Great attempt. Keep going, and compare your choice with option ${String.fromCharCode(65 + correctAnswer)} to improve your accuracy.`;
  };

  return (
    <Card className="p-8 game-soft-panel rounded-2xl">
      <div className="space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-cyan-100 bg-cyan-400/15 border border-cyan-300/35 px-4 py-2 rounded-lg">
            Question {currentQuestion} of {totalQuestions}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalQuestions }).map((_, idx) => (
              <div
                key={idx}
                className={`w-8 h-1.5 rounded-full ${
                  idx < currentQuestion - 1 ? 'bg-emerald-300' :
                  idx === currentQuestion - 1 ? 'bg-cyan-300' :
                  'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <div>
          <h3 className="text-2xl font-bold text-slate-100 mb-4">{question}</h3>
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
                      ? 'bg-cyan-400 text-slate-950'
                      : hasAnswered && index === correctAnswer
                      ? 'bg-emerald-400 text-slate-950'
                      : hasAnswered && selectedAnswer === index && index !== correctAnswer
                      ? 'bg-red-400 text-slate-950'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-slate-100">{option}</span>
                </div>
                {hasAnswered && (
                  <div>
                    {index === correctAnswer && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-300" />
                    )}
                    {selectedAnswer === index && index !== correctAnswer && (
                      <XCircle className="w-6 h-6 text-red-300" />
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
            className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-300"
            size="lg"
          >
            {selectedAnswer === null ? 'Select an Answer' : 'Submit Answer'}
          </Button>
        )}

        {/* Feedback */}
        {hasAnswered && (
          <div className={`p-4 rounded-lg border-2 ${
              selectedAnswer === correctAnswer
                ? 'bg-emerald-400/15 border-emerald-300/40'
                : 'bg-red-400/15 border-red-300/40'
            }`}
          >
            <p className={`font-semibold ${
              selectedAnswer === correctAnswer ? 'text-emerald-100' : 'text-red-100'
            }`}>
              {selectedAnswer === correctAnswer
                ? 'Correct! Well done.'
                : 'Incorrect. The correct answer is highlighted above.'}
            </p>
            <p className={`mt-2 text-sm ${
              selectedAnswer === correctAnswer ? 'text-emerald-200' : 'text-red-200'
            }`}>
              {getAiFeedback()}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
