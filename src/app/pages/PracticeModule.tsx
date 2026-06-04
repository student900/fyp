import { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { WebcamRecognition, type RecognitionUpdate } from '../components/WebcamRecognition';
import { sequentialPracticeLessons } from '../data/alphabetLessons';
import {
  CheckCircle2,
  Lock,
  Trophy,
  Target,
  Star,
  RefreshCcw,
  Flame,
  Sparkles,
} from 'lucide-react';

const PROGRESS_STORAGE_KEY = 'asl.practice.progress.v2';
const POINTS_PER_SIGN = 100;

interface PracticeProgress {
  unlockedIndex: number;
  completedIds: string[];
  totalPoints: number;
}

function loadProgress(): PracticeProgress {
  const defaultProgress: PracticeProgress = {
    unlockedIndex: 0,
    completedIds: [],
    totalPoints: 0,
  };

  const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!raw) {
    return defaultProgress;
  }

  try {
    const parsed = JSON.parse(raw) as PracticeProgress;
    return {
      unlockedIndex: Math.max(0, Math.min(parsed.unlockedIndex ?? 0, sequentialPracticeLessons.length - 1)),
      completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
      totalPoints: typeof parsed.totalPoints === 'number' ? parsed.totalPoints : 0,
    };
  } catch {
    return defaultProgress;
  }
}

export function PracticeModule() {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [latestConfidence, setLatestConfidence] = useState(0);
  const [aiFeedback, setAiFeedback] = useState('Start your camera session. You will unlock the next sign after a verified match.');

  const currentLesson = sequentialPracticeLessons[currentLessonIndex];
  const progressPercentage = (completedIds.length / sequentialPracticeLessons.length) * 100;
  const canAdvance = completedIds.includes(currentLesson.id);
  const sessionXp = completedIds.length * 10;

  useEffect(() => {
    const progress = loadProgress();
    setUnlockedIndex(progress.unlockedIndex);
    setCompletedIds(progress.completedIds);
    setTotalPoints(progress.totalPoints);
    setCurrentLessonIndex(Math.min(progress.unlockedIndex, sequentialPracticeLessons.length - 1));
  }, []);

  useEffect(() => {
    const payload: PracticeProgress = {
      unlockedIndex,
      completedIds,
      totalPoints,
    };
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(payload));
  }, [completedIds, totalPoints, unlockedIndex]);

  const stats = useMemo(() => {
    const lettersDone = completedIds.filter((id) => id.startsWith('alphabet-')).length;
    const greetingsDone = completedIds.filter((id) => id.startsWith('greeting-')).length;
    return { lettersDone, greetingsDone };
  }, [completedIds]);

  const handleStartRecognition = () => {
    setAttempts((value) => value + 1);
    setIsRecognizing(true);
  };

  const handleStopRecognition = () => {
    setIsRecognizing(false);
  };

  const handleRecognitionUpdate = (update: RecognitionUpdate) => {
    setLatestConfidence(update.targetConfidence);
    setAiFeedback(update.aiFeedback);
  };

  const handleSignMatched = ({ confidence, targetSign }: { confidence: number; targetSign: string }) => {
    if (completedIds.includes(currentLesson.id)) {
      setAiFeedback(`Great hold on ${targetSign}. This sign is already mastered, so you can continue practicing for consistency.`);
      setIsRecognizing(false);
      return;
    }

    const nextCompleted = [...completedIds, currentLesson.id];
    setCompletedIds(nextCompleted);
    setStreak((value) => value + 1);
    setTotalPoints((value) => value + POINTS_PER_SIGN);
    setAiFeedback(`Excellent work on ${targetSign}. +${POINTS_PER_SIGN} points awarded. You have unlocked the next sign.`);
    setIsRecognizing(false);

    if (currentLessonIndex >= unlockedIndex && currentLessonIndex < sequentialPracticeLessons.length - 1) {
      const nextUnlocked = currentLessonIndex + 1;
      setUnlockedIndex(nextUnlocked);
      setCurrentLessonIndex(nextUnlocked);
    }

    setLatestConfidence(confidence);
  };

  const handlePickLesson = (index: number) => {
    if (index > unlockedIndex) {
      return;
    }

    setCurrentLessonIndex(index);
    setIsRecognizing(false);
    setAiFeedback(`Practicing ${sequentialPracticeLessons[index].letter}. Keep your hand centered and stable.`);
  };

  const handleNextUnlocked = () => {
    if (!canAdvance) {
      return;
    }

    const nextIndex = Math.min(currentLessonIndex + 1, unlockedIndex, sequentialPracticeLessons.length - 1);
    setCurrentLessonIndex(nextIndex);
    setIsRecognizing(false);
  };

  const handleReset = () => {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    setCurrentLessonIndex(0);
    setUnlockedIndex(0);
    setCompletedIds([]);
    setTotalPoints(0);
    setStreak(0);
    setAttempts(0);
    setLatestConfidence(0);
    setIsRecognizing(false);
    setAiFeedback('Progress reset. Start with the first sign to unlock the sequence again.');
  };

  return (
    <div className="game-page">
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 gap-4">
            <div>
              <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full game-pill text-xs font-semibold uppercase tracking-[0.14em] mb-4">Challenge Ladder</p>
              <h1 className="text-4xl font-bold text-slate-100 mb-2 game-title-glow">Practice Progression</h1>
              <p className="text-slate-300 text-lg">Pass each sign to unlock the next one. Letters come first, then greetings.</p>
            </div>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-2 border-emerald-300/60 text-emerald-200 hover:bg-emerald-300/10"
              size="lg"
            >
              <RefreshCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>

          <Card className="p-6 game-panel rounded-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="game-soft-panel rounded-xl p-4">
                <p className="text-slate-300 text-sm">Total Points</p>
                <p className="text-violet-200 text-3xl font-bold">{totalPoints}</p>
              </div>
              <div className="game-soft-panel rounded-xl p-4">
                <p className="text-slate-300 text-sm">Completed Signs</p>
                <p className="text-emerald-200 text-3xl font-bold">{completedIds.length}</p>
              </div>
              <div className="game-soft-panel rounded-xl p-4">
                <p className="text-slate-300 text-sm">Letters Done</p>
                <p className="text-cyan-200 text-3xl font-bold">{stats.lettersDone}</p>
              </div>
              <div className="game-soft-panel rounded-xl p-4">
                <p className="text-slate-300 text-sm">Greetings Done</p>
                <p className="text-amber-200 text-3xl font-bold">{stats.greetingsDone}</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-300">Progress</span>
                <span className="text-slate-100 font-semibold">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-300 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 game-soft-panel rounded-2xl">
              <div className="flex items-center justify-between mb-6 gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg px-2">
                    <span className="text-xl font-bold text-slate-950 text-center leading-none">{currentLesson.letter}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100">{currentLesson.title}</h2>
                    <p className="text-slate-300 mt-1">{currentLesson.description}</p>
                    <p className="text-emerald-300 text-sm mt-2">Live confidence: {latestConfidence}%</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <Badge className={currentLesson.lessonType === 'alphabet' ? 'bg-cyan-400/20 text-cyan-200 border border-cyan-300/40' : 'bg-sky-400/20 text-sky-200 border border-sky-300/40'}>
                    {currentLesson.lessonType}
                  </Badge>
                  {canAdvance ? (
                    <Badge className="bg-emerald-400/20 text-emerald-200 border border-emerald-300/40">Mastered</Badge>
                  ) : (
                    <Badge className="bg-amber-400/20 text-amber-200 border border-amber-300/40">Needs Pass</Badge>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-slate-100 mb-3">Key Points</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  {currentLesson.keyPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-slate-900/55 rounded-lg border border-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-200">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-emerald-400/15 border border-emerald-300/35 rounded-xl">
                <span className="text-sm font-medium text-emerald-100">
                  Stage {currentLessonIndex + 1} of {sequentialPracticeLessons.length}
                </span>
                <Button
                  onClick={handleNextUnlocked}
                  disabled={!canAdvance || currentLessonIndex >= unlockedIndex}
                  className="bg-emerald-400 text-slate-950 hover:bg-emerald-300 disabled:bg-slate-600 disabled:text-slate-300"
                >
                  Next Unlocked Stage
                </Button>
              </div>
            </Card>

            <WebcamRecognition
              targetSign={currentLesson.letter}
              targetLessonType={currentLesson.lessonType}
              isRecognizing={isRecognizing}
              onStartRecognition={handleStartRecognition}
              onStopRecognition={handleStopRecognition}
              onRecognitionUpdate={handleRecognitionUpdate}
              onSignMatched={handleSignMatched}
            />

            <Card className="p-6 game-soft-panel rounded-2xl border-cyan-300/35">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-cyan-300" />
                <h3 className="text-lg font-semibold text-cyan-100">AI Coach Feedback</h3>
              </div>
              <p className="text-slate-200">{aiFeedback}</p>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 game-soft-panel rounded-2xl">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-slate-100 text-lg">Session Stats</h3>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Flame, label: 'Streak', value: streak, color: 'bg-orange-400/20 text-orange-200 border border-orange-300/40' },
                  { icon: Target, label: 'Attempts', value: attempts, color: 'bg-cyan-400/20 text-cyan-200 border border-cyan-300/40' },
                  { icon: Star, label: 'Session XP', value: sessionXp, color: 'bg-emerald-400/20 text-emerald-200 border border-emerald-300/40' },
                ].map((stat, idx) => (
                  <div key={idx} className={`p-4 ${stat.color} rounded-xl`}>
                    <div className="flex items-center gap-2 mb-1">
                      <stat.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 game-soft-panel rounded-2xl">
              <h3 className="font-bold text-slate-100 mb-2 text-lg">Skill Path</h3>
              <p className="text-xs text-slate-400 mb-4">Follow the path and clear each node to unlock the next lesson.</p>
              <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
                {sequentialPracticeLessons.map((lesson, index) => {
                  const locked = index > unlockedIndex;
                  const completed = completedIds.includes(lesson.id);
                  const active = index === currentLessonIndex;
                  const isLeft = index % 2 === 0;

                  return (
                    <div key={lesson.id} className={`flex ${isLeft ? 'justify-start' : 'justify-end'} relative`}>
                      {index > 0 && (
                        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-5 w-[2px] h-5 bg-slate-600" />
                      )}
                      <button
                        onClick={() => handlePickLesson(index)}
                        disabled={locked}
                        className={`w-[88%] p-3 rounded-2xl border text-left transition-all ${
                          active ? 'border-cyan-300 bg-cyan-400/12' : 'border-slate-700 bg-slate-900/45'
                        } ${locked ? 'opacity-70 cursor-not-allowed' : 'hover:border-cyan-400/70'}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              completed
                                ? 'bg-emerald-400 text-slate-950'
                                : locked
                                ? 'bg-slate-700 text-slate-400'
                                : 'bg-cyan-400 text-slate-950'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-slate-100">{lesson.letter}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{lesson.lessonType}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                            ) : locked ? (
                              <Lock className="w-4 h-4 text-slate-500" />
                            ) : (
                              <Badge className="bg-amber-400/20 text-amber-200 border border-amber-300/40">Ready</Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
