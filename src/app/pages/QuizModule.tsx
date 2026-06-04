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
    if (percentage >= 90) return { message: 'Excellent Work!', color: 'text-amber-200', bg: 'from-amber-300 to-amber-500' };
    if (percentage >= 70) return { message: 'Great Job!', color: 'text-emerald-200', bg: 'from-emerald-300 to-emerald-500' };
    if (percentage >= 50) return { message: 'Good Effort', color: 'text-cyan-200', bg: 'from-cyan-300 to-sky-500' };
    return { message: 'Keep Practicing', color: 'text-orange-200', bg: 'from-orange-300 to-orange-500' };
  };

  if (quizState === 'start') {
    return (
      <div className="game-page flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <Card className="p-10 game-panel rounded-2xl">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Trophy className="w-10 h-10 text-white" />
              </div>

              <div>
                <h1 className="text-4xl font-bold text-slate-100 mb-3 game-title-glow">
                  ASL Quiz
                </h1>
                <p className="text-slate-300 text-lg">Battle through rapid questions and sharpen your sign decisions.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 py-6">
                {[
                  { value: quizQuestions.length, label: 'Questions', color: 'bg-cyan-400/20 text-cyan-200 border border-cyan-300/40' },
                  { value: '5', label: 'Minutes', color: 'bg-emerald-400/20 text-emerald-200 border border-emerald-300/40' },
                  { value: '70%', label: 'Pass Score', color: 'bg-amber-400/20 text-amber-200 border border-amber-300/40' }
                ].map((stat, idx) => (
                  <div key={idx} className={`p-6 ${stat.color} rounded-xl`}>
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 bg-slate-900/45 p-6 rounded-xl border border-slate-700">
                <h3 className="font-semibold text-slate-100 text-base">Instructions:</h3>
                <ul className="text-left space-y-2 text-slate-300 text-sm">
                  {[
                    'Select the correct answer for each question',
                    'Receive instant feedback after each answer',
                    'Track your score and accuracy',
                    'Review your answers at the end'
                  ].map((instruction, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5 flex-shrink-0" />
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={handleStartQuiz}
                size="lg"
                className="w-full mt-6 bg-cyan-500 text-slate-950 hover:bg-cyan-400 text-lg py-6"
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
      <div className="game-page p-4">
        <div className="max-w-3xl mx-auto py-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4 gap-4">
              <h1 className="text-3xl font-bold text-slate-100 game-title-glow">
                ASL Quiz
              </h1>
              
              <div className="flex gap-3">
                {/* Score Display */}
                <div className="flex items-center gap-2 px-5 py-2 bg-emerald-400/20 rounded-lg border border-emerald-300/40">
                  <Target className="w-5 h-5 text-emerald-200" />
                  <div className="text-left">
                    <p className="text-xs font-medium text-emerald-200">Score</p>
                    <p className="text-lg font-bold text-emerald-100">{score}/{quizQuestions.length}</p>
                  </div>
                </div>

                {/* Combo Display */}
                {combo > 1 && (
                  <div className="flex items-center gap-2 px-5 py-2 bg-amber-400/20 rounded-lg border border-amber-300/40">
                    <Zap className="w-5 h-5 text-amber-200" />
                    <div className="text-left">
                      <p className="text-xs font-medium text-amber-200">Streak</p>
                      <p className="text-lg font-bold text-amber-100">{combo}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Card className="p-4 game-soft-panel rounded-xl">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 font-medium">Progress</span>
                  <span className="font-semibold text-cyan-200">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-sky-300 rounded-full transition-all duration-300"
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
    <div className="game-page flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="p-10 game-panel rounded-2xl">
          <div className="text-center space-y-6">
            <div className={`w-24 h-24 bg-gradient-to-br ${performance.bg} rounded-xl flex items-center justify-center mx-auto shadow-lg`}>
              <Trophy className="w-12 h-12 text-white" />
            </div>

            <div>
              <h1 className={`text-4xl font-bold mb-2 ${performance.color}`}>
                {performance.message}
              </h1>
              <p className="text-slate-300 text-lg">Quiz Complete</p>
            </div>

            {/* Score Display */}
            <div className="py-6">
              <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 px-10 py-8 rounded-2xl shadow-lg">
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
                { icon: Award, value: score, label: 'Correct', color: 'bg-emerald-400/20 text-emerald-200 border border-emerald-300/40' },
                { icon: Target, value: quizQuestions.length - score, label: 'Incorrect', color: 'bg-red-400/20 text-red-200 border border-red-300/40' }
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
              <h3 className="font-semibold text-slate-100 mb-3 text-base">Your Answers:</h3>
              {answers.map((isCorrect, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isCorrect
                      ? 'bg-emerald-400/15 border-emerald-300/35'
                      : 'bg-red-400/15 border-red-300/35'
                  }`}
                >
                  <span className="font-medium text-slate-100 text-sm">Question {idx + 1}: {quizQuestions[idx].letter}</span>
                  <span className={`font-semibold text-sm ${isCorrect ? 'text-emerald-200' : 'text-red-200'}`}>
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
                className="flex-1 border-2 border-cyan-300/60 text-cyan-200 hover:bg-cyan-300/10"
                size="lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Try Again
              </Button>
              <Link to="/" className="flex-1">
                <Button className="w-full h-full bg-cyan-500 text-slate-950 hover:bg-cyan-400" size="lg">
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
