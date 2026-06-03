import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { QuizCard } from '../components/QuizCard';
import { quizQuestions } from '../data/quizQuestions';
import { Trophy, RotateCcw, Home, Target, Award, CheckCircle2, Zap } from 'lucide-react';
import { Link } from 'react-router';

type QuizState = 'start' | 'active' | 'complete';

export function QuizModule() {
  const [quizState, setQuizState] = useState<QuizState>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [combo, setCombo] = useState(0);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  const handleStartQuiz = () => {
    setQuizState('active');
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setCombo(0);
  };

  const handleAnswer = (isCorrect: boolean) => {
    setAnswers([...answers, isCorrect]);

    if (isCorrect) {
      setScore(score + 1);
      setCombo(combo + 1);
    } else {
      setCombo(0);
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 500);
    } else {
      setTimeout(() => {
        setQuizState('complete');
      }, 500);
    }
  };

  const getScorePercentage = () => {
    return Math.round((score / quizQuestions.length) * 100);
  };

  const getPerformanceMessage = () => {
    const percentage = getScorePercentage();
    if (percentage >= 90) return { message: 'Excellent Work!', color: 'text-yellow-600', bg: 'from-yellow-400 to-yellow-500' };
    if (percentage >= 70) return { message: 'Great Job!', color: 'text-green-600', bg: 'from-green-400 to-green-600' };
    if (percentage >= 50) return { message: 'Good Effort', color: 'text-blue-600', bg: 'from-blue-400 to-blue-600' };
    return { message: 'Keep Practicing', color: 'text-orange-600', bg: 'from-orange-400 to-orange-600' };
  };

  if (quizState === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <Card className="p-10 border border-gray-200 shadow-lg bg-white">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Trophy className="w-10 h-10 text-white" />
              </div>

              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  ASL Quiz
                </h1>
                <p className="text-gray-600 text-lg">Test your ASL knowledge and track your progress</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 py-6">
                {[
                  { value: quizQuestions.length, label: 'Questions', color: 'bg-blue-100 text-blue-700' },
                  { value: '5', label: 'Minutes', color: 'bg-green-100 text-green-700' },
                  { value: '70%', label: 'Pass Score', color: 'bg-purple-100 text-purple-700' }
                ].map((stat, idx) => (
                  <div key={idx} className={`p-6 ${stat.color} rounded-xl`}>
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 text-base">Instructions:</h3>
                <ul className="text-left space-y-2 text-gray-600 text-sm">
                  {[
                    'Select the correct answer for each question',
                    'Receive instant feedback after each answer',
                    'Track your score and accuracy',
                    'Review your answers at the end'
                  ].map((instruction, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={handleStartQuiz}
                size="lg"
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-lg py-6"
              >
                Start Quiz
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (quizState === 'active') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-3xl mx-auto py-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4 gap-4">
              <h1 className="text-3xl font-bold text-gray-900">
                ASL Quiz
              </h1>
              
              <div className="flex gap-3">
                {/* Score Display */}
                <div className="flex items-center gap-2 px-5 py-2 bg-green-100 rounded-lg border border-green-300">
                  <Target className="w-5 h-5 text-green-700" />
                  <div className="text-left">
                    <p className="text-xs font-medium text-green-700">Score</p>
                    <p className="text-lg font-bold text-green-900">{score}/{quizQuestions.length}</p>
                  </div>
                </div>

                {/* Combo Display */}
                {combo > 1 && (
                  <div className="flex items-center gap-2 px-5 py-2 bg-orange-100 rounded-lg border border-orange-300">
                    <Zap className="w-5 h-5 text-orange-700" />
                    <div className="text-left">
                      <p className="text-xs font-medium text-orange-700">Streak</p>
                      <p className="text-lg font-bold text-orange-900">{combo}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Card className="p-4 bg-white border border-gray-200">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">Progress</span>
                  <span className="font-semibold text-purple-600">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Question Card */}
          <QuizCard
            question={currentQuestion.question}
            options={currentQuestion.options}
            correctAnswer={currentQuestion.correctAnswer}
            onAnswer={handleAnswer}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={quizQuestions.length}
          />
        </div>
      </div>
    );
  }

  // Complete state
  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="p-10 border border-gray-200 shadow-lg bg-white">
          <div className="text-center space-y-6">
            <div className={`w-24 h-24 bg-gradient-to-br ${performance.bg} rounded-xl flex items-center justify-center mx-auto shadow-lg`}>
              <Trophy className="w-12 h-12 text-white" />
            </div>

            <div>
              <h1 className={`text-4xl font-bold mb-2 ${performance.color}`}>
                {performance.message}
              </h1>
              <p className="text-gray-600 text-lg">Quiz Complete</p>
            </div>

            {/* Score Display */}
            <div className="py-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-10 py-8 rounded-2xl shadow-lg">
                <p className="text-white/80 font-medium mb-2 text-sm">Your Score</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl font-bold text-white">{score}</span>
                  <span className="text-3xl font-semibold text-white/70">/ {quizQuestions.length}</span>
                </div>
                <p className="text-2xl font-bold text-white mt-3">{getScorePercentage()}%</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Award, value: score, label: 'Correct', color: 'bg-green-100 text-green-700' },
                { icon: Target, value: quizQuestions.length - score, label: 'Incorrect', color: 'bg-red-100 text-red-700' }
              ].map((stat, idx) => (
                <div key={idx} className={`p-6 ${stat.color} rounded-xl`}>
                  <stat.icon className="w-6 h-6 mb-2 mx-auto" />
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Answer Review */}
            <div className="text-left space-y-2 max-h-48 overflow-y-auto">
              <h3 className="font-semibold text-gray-900 mb-3 text-base">Your Answers:</h3>
              {answers.map((isCorrect, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isCorrect
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <span className="font-medium text-gray-900 text-sm">Question {idx + 1}: {quizQuestions[idx].letter}</span>
                  <span className={`font-semibold text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleStartQuiz}
                variant="outline"
                className="flex-1 border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                size="lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Try Again
              </Button>
              <Link to="/" className="flex-1">
                <Button className="w-full h-full bg-purple-600 hover:bg-purple-700" size="lg">
                  <Home className="w-5 h-5 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
