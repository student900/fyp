import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, BookOpen, ArrowLeft, Zap, Star } from 'lucide-react';
import { alphabetLessons, masterTutorialVideos } from '../data/alphabetLessons';

export function LearnModule() {
  const { track } = useParams();
  const lessonType = track === 'greetings' ? 'greeting' : 'alphabet';

  const filteredLessons = useMemo(
    () => alphabetLessons.filter((lesson) => lesson.lessonType === lessonType),
    [lessonType]
  );

  const [selectedLesson, setSelectedLesson] = useState(filteredLessons[0]);

  useEffect(() => {
    setSelectedLesson(filteredLessons[0]);
  }, [filteredLessons]);

  if (!selectedLesson) {
    return (
      <div className="game-page p-6">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 game-panel text-center rounded-2xl">
            <h2 className="text-2xl font-bold text-slate-100 mb-2">No lessons available</h2>
            <p className="text-slate-300 mb-6">This track does not have content yet.</p>
            <Link to="/learn">
              <Button className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">Back to Track Selection</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const completedCount = filteredLessons.filter((lesson) => lesson.completed).length;
  const progressPercentage = (completedCount / filteredLessons.length) * 100;
  const trackTitle = lessonType === 'alphabet' ? 'Alphabet Track' : 'Greetings Track';
  const trackDescription =
    lessonType === 'alphabet'
      ? 'Learn ASL letters with focused examples and guided key points.'
      : 'Learn greeting signs with movement-oriented examples and guided key points.';
  const trackVideo = lessonType === 'alphabet' ? masterTutorialVideos.alphabet : masterTutorialVideos.greeting;

  return (
    <div className="game-page">
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="mb-6">
          <Link to="/learn" className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to track selection
          </Link>
        </div>

        <div className="mb-8">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full game-pill text-xs font-semibold uppercase tracking-[0.14em] mb-4">Live Track</p>
          <h1 className="text-4xl font-bold text-slate-100 mb-2 game-title-glow">{trackTitle}</h1>
          <p className="text-slate-300 text-lg">{trackDescription}</p>
        </div>

        <Card className="p-6 game-panel rounded-2xl mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-slate-100 font-bold text-lg">Track Progress</p>
              <p className="text-slate-300 text-sm">Complete lessons and reinforce in practice mode</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-cyan-300">{completedCount}</p>
              <p className="text-slate-300 text-sm">/ {filteredLessons.length} lessons</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Progress</span>
              <span className="text-slate-100 font-semibold">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-sky-300 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-6 game-soft-panel rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-cyan-300" />
                <h2 className="font-bold text-slate-100 text-lg">Track Lessons</h2>
              </div>

              <div className="space-y-2 max-h-[620px] overflow-y-auto">
                {filteredLessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedLesson.id === lesson.id
                        ? 'border-cyan-300 bg-cyan-400/10'
                        : 'border-slate-700 hover:border-cyan-400/60 bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                          lesson.completed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-200'
                        }`}>
                          {lessonType === 'alphabet' ? lesson.letter : lesson.letter[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-100">{lesson.title}</p>
                          <Badge className={`mt-1 text-xs ${
                            lesson.difficulty === 'easy'
                              ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-300/40'
                              : lesson.difficulty === 'medium'
                              ? 'bg-amber-400/20 text-amber-200 border border-amber-300/40'
                              : 'bg-red-400/20 text-red-200 border border-red-300/40'
                          }`}>
                            {lesson.difficulty}
                          </Badge>
                        </div>
                      </div>

                      {lesson.completed && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="p-4 game-soft-panel rounded-2xl">
              <h3 className="font-bold text-slate-100 mb-2">Master {trackTitle} Tutorial</h3>
              <div className="aspect-video rounded-lg overflow-hidden border border-slate-700">
                <iframe
                  className="w-full h-full"
                  src={trackVideo}
                  title={`${trackTitle} tutorial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </Card>

            <Card className="game-soft-panel rounded-2xl">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <Badge className="bg-cyan-400/20 text-cyan-200 border border-cyan-300/40">Current Sign: {selectedLesson.letter}</Badge>
                  <Badge className="capitalize text-sm px-3 py-1 bg-cyan-400/20 text-cyan-200 border border-cyan-300/40">
                    {selectedLesson.difficulty}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-2">{selectedLesson.title}</h3>
                  <p className="text-slate-300">{selectedLesson.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-100 mb-3">Key Points</h4>
                  <div className="space-y-2">
                    {selectedLesson.keyPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-slate-900/60 rounded-lg border border-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-200">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Link to="/practice" className="flex-1">
                    <Button className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400" size="lg">
                      Go to Practice
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              {[
                { value: completedCount, label: 'Completed', icon: CheckCircle2, color: 'bg-emerald-400/20 text-emerald-200 border border-emerald-300/40' },
                { value: filteredLessons.length - completedCount, label: 'Remaining', icon: Zap, color: 'bg-amber-400/20 text-amber-200 border border-amber-300/40' },
                { value: filteredLessons.length, label: 'Track Total', icon: Star, color: 'bg-cyan-400/20 text-cyan-200 border border-cyan-300/40' },
              ].map((stat, idx) => (
                <Card key={idx} className={`p-6 text-center rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6 mb-2 mx-auto" />
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm font-medium">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
