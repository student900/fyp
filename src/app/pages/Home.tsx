import { useMemo } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BookOpen, Camera, ArrowRight, Target, Star, Flame, Sparkles, Trophy, Brain } from 'lucide-react';
import { Link } from 'react-router';
import { alphabetLessons } from '../data/alphabetLessons';

interface PracticeProgress {
  unlockedIndex: number;
  completedIds: string[];
  totalPoints: number;
}

const PROGRESS_STORAGE_KEY = 'asl.practice.progress.v2';

function getProgress(): PracticeProgress {
  const defaultValue: PracticeProgress = {
    unlockedIndex: 0,
    completedIds: [],
    totalPoints: 0,
  };

  const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!raw) {
    return defaultValue;
  }

  try {
    return JSON.parse(raw) as PracticeProgress;
  } catch {
    return defaultValue;
  }
}

export function Home() {
  const userName = localStorage.getItem('asl.user.name') || 'Learner';
  const totalLessons = alphabetLessons.length;
  const progress = getProgress();
  const completedCount = progress.completedIds.length;
  const unlockedCount = Math.min(progress.unlockedIndex + 1, totalLessons);

  const overallProgress = useMemo(() => {
    if (totalLessons === 0) {
      return 0;
    }
    return Math.round((completedCount / totalLessons) * 100);
  }, [completedCount, totalLessons]);

  return (
    <div className="game-page">
      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <div className="mb-10">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full game-pill text-xs font-semibold uppercase tracking-[0.14em]">
            <Sparkles className="w-3.5 h-3.5" />
            Daily Learning Arena
          </p>
          <h1 className="text-5xl font-bold text-slate-100 mb-3 mt-4 game-title-glow">Welcome back, {userName}</h1>
          <p className="text-lg text-slate-300 max-w-2xl">Build momentum with short wins. Every sign mastered unlocks the next level of confidence.</p>
        </div>

        <Card className="p-8 game-panel rounded-2xl mb-8">
          <div className="grid md:grid-cols-4 gap-4 mb-5">
            <div className="game-soft-panel rounded-xl p-4">
              <p className="text-slate-300 text-sm">Overall Progress</p>
              <p className="text-cyan-300 text-3xl font-bold">{overallProgress}%</p>
            </div>
            <div className="game-soft-panel rounded-xl p-4">
              <p className="text-slate-300 text-sm">Completed</p>
              <p className="text-emerald-300 text-3xl font-bold">{completedCount}</p>
            </div>
            <div className="game-soft-panel rounded-xl p-4">
              <p className="text-slate-300 text-sm">Unlocked</p>
              <p className="text-amber-300 text-3xl font-bold">{unlockedCount}</p>
            </div>
            <div className="game-soft-panel rounded-xl p-4 float-subtle">
              <p className="text-slate-300 text-sm">Points</p>
              <p className="text-violet-300 text-3xl font-bold">{progress.totalPoints}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-300">Learning Progress</span>
              <span className="text-slate-100 font-semibold">{overallProgress}%</span>
            </div>
            <div className="h-3 bg-slate-900/80 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-sky-300 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-8 game-soft-panel rounded-2xl">
            <div className="w-14 h-14 rounded-xl bg-cyan-400/20 game-accent-border flex items-center justify-center mb-5 glow-pulse">
              <BookOpen className="w-7 h-7 text-cyan-300" />
            </div>
            <h2 className="text-3xl font-bold text-slate-100 mb-3">Learn</h2>
            <p className="text-slate-300 mb-6">Pick a track, study deeply, and collect knowledge before entering challenge mode.</p>
            <Link to="/learn">
              <Button className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400" size="lg">
                Go to Learn
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>

          <Card className="p-8 game-soft-panel rounded-2xl">
            <div className="w-14 h-14 rounded-xl bg-emerald-400/20 border border-emerald-300/40 flex items-center justify-center mb-5">
              <Camera className="w-7 h-7 text-emerald-300" />
            </div>
            <h2 className="text-3xl font-bold text-slate-100 mb-3">Practice</h2>
            <p className="text-slate-300 mb-6">Use live recognition, clear stage objectives, and level up through each sign challenge.</p>
            <Link to="/practice">
              <Button className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400" size="lg">
                Go to Practice
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>

          <Card className="p-8 game-soft-panel rounded-2xl">
            <div className="w-14 h-14 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center mb-5">
              <Brain className="w-7 h-7 text-amber-200" />
            </div>
            <h2 className="text-3xl font-bold text-slate-100 mb-3">Quiz</h2>
            <p className="text-slate-300 mb-6">Lock in mastery with pressure-free quizzes and instant coach feedback each round.</p>
            <Link to="/quiz">
              <Button className="w-full bg-amber-400 text-slate-950 hover:bg-amber-300" size="lg">
                Go to Quiz
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[
            { icon: Target, title: 'Current Mission', value: overallProgress < 100 ? 'Complete next stage' : 'Mastery reached' },
            { icon: Star, title: 'Total Lessons', value: String(totalLessons) },
            { icon: Flame, title: 'Current Streak', value: String(completedCount) },
          ].map((item, idx) => (
            <Card key={idx} className="p-5 game-soft-panel rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">{item.title}</p>
                  <p className="text-xl font-bold text-slate-100">{item.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-5 game-panel rounded-2xl border-emerald-300/30">
          <div className="flex items-center gap-3 text-emerald-200">
            <Trophy className="w-5 h-5" />
            <p className="text-sm">Motivation Boost: You are {Math.max(1, 100 - overallProgress)}% away from your next milestone. Stay consistent and collect small wins.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
