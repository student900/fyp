import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BookOpen, MessageCircle, ArrowRight, Sparkles, Crosshair } from 'lucide-react';
import { Link } from 'react-router';

export function LearnPathSelect() {
  return (
    <div className="game-page">
      <div className="max-w-5xl mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full game-pill text-xs font-semibold uppercase tracking-[0.14em] mb-4">
            <Crosshair className="w-3.5 h-3.5" />
            Select Your Mission
          </p>
          <h1 className="text-5xl font-bold text-slate-100 mb-4 game-title-glow">Choose Learning Track</h1>
          <p className="text-lg text-slate-300">Pick the skill lane you want to conquer today. You can switch tracks anytime.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 game-soft-panel rounded-2xl hover:border-cyan-300/50 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-cyan-400/20 border border-cyan-300/40 flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-cyan-300" />
            </div>
            <h2 className="text-3xl font-bold text-slate-100 mb-3">Alphabet</h2>
            <p className="text-slate-300 mb-6">Build your fundamentals with precise letter forms and memory-friendly repetition.</p>
            <Link to="/learn/alphabet">
              <Button className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400" size="lg">
                Open Alphabet Track
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>

          <Card className="p-8 game-soft-panel rounded-2xl hover:border-emerald-300/50 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-emerald-400/20 border border-emerald-300/40 flex items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-emerald-300" />
            </div>
            <h2 className="text-3xl font-bold text-slate-100 mb-3">Greetings</h2>
            <p className="text-slate-300 mb-6">Train conversational signs with movement-based cues and practical scenarios.</p>
            <Link to="/learn/greetings">
              <Button className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400" size="lg">
                Open Greetings Track
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>

        <Card className="mt-8 p-5 game-panel rounded-2xl">
          <p className="text-slate-200 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Pro tip: complete one full micro-track in a session, then jump to Practice mode to lock in retention.
          </p>
        </Card>
      </div>
    </div>
  );
}
