import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, Lock, Play, BookOpen, Award, Star, Zap, Trophy, Flame } from 'lucide-react';
import { alphabetLessons } from '../data/alphabetLessons';
import { useState } from 'react';
import { Link } from 'react-router';
import { AvatarDisplay } from '../components/AvatarDisplay';
import { AchievementBadge } from '../components/AchievementBadge';

export function LearnModule() {
  const [selectedLesson, setSelectedLesson] = useState(alphabetLessons[0]);
  const completedCount = alphabetLessons.filter(l => l.completed).length;
  const progressPercentage = (completedCount / alphabetLessons.length) * 100;
  const currentLevel = Math.floor(completedCount / 5) + 1;
  const currentXP = (completedCount % 5) * 20;

  const achievements = [
    { icon: Star, title: 'First Steps', description: 'Complete first letter', unlocked: completedCount >= 1, color: 'from-blue-500 to-blue-600' },
    { icon: Flame, title: 'On Fire!', description: 'Complete 5 letters', unlocked: completedCount >= 5, color: 'from-orange-500 to-red-600' },
    { icon: Trophy, title: 'Champion', description: 'Complete all 26 letters', unlocked: completedCount >= 26, color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Avatar */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Learn ASL
              </h1>
              <p className="text-gray-600 text-lg">Master the ASL alphabet step by step</p>
            </div>

            <AvatarDisplay
              level={currentLevel}
              xp={currentXP}
              maxXp={100}
              streak={completedCount}
            />
          </div>
          
          {/* Progress Card */}
          <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-7 h-7 text-white" />
                <div>
                  <p className="text-white font-bold text-lg">Course Progress</p>
                  <p className="text-purple-100 text-sm">Keep up the great work</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-white">{completedCount}</p>
                <p className="text-purple-100 text-sm">/ {alphabetLessons.length} Letters</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-100 font-medium">Overall Progress</span>
                <span className="font-semibold text-white">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="h-3 bg-purple-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Lesson List */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 border border-gray-200 shadow-lg bg-white">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-gray-900 text-lg">Alphabet Lessons</h2>
              </div>
              
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {alphabetLessons.map((lesson) => (
                  <button
                    key={lesson.letter}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedLesson.letter === lesson.letter
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                            lesson.completed
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {lesson.letter}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{lesson.title}</p>
                          <Badge
                            className={`mt-1 text-xs ${
                              lesson.difficulty === 'easy'
                                ? 'bg-green-100 text-green-700'
                                : lesson.difficulty === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {lesson.difficulty}
                          </Badge>
                        </div>
                      </div>
                      {lesson.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-6 border border-gray-200 shadow-lg bg-white">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900 text-lg">Achievements</h3>
              </div>
              <div className="space-y-3">
                {achievements.map((achievement, idx) => (
                  <AchievementBadge
                    key={idx}
                    icon={achievement.icon}
                    title={achievement.title}
                    description={achievement.description}
                    unlocked={achievement.unlocked}
                    color={achievement.color}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Lesson Detail */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Section */}
            <div>
              <Card className="overflow-hidden border border-gray-200 shadow-lg">
                <div className="aspect-video bg-gradient-to-br from-purple-900 to-purple-800 flex items-center justify-center relative">
                  <div className="text-center space-y-4 relative z-10">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto cursor-pointer hover:bg-white/30 transition-colors">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                    <p className="text-white text-lg font-semibold">Video Tutorial: Letter {selectedLesson.letter}</p>
                    <p className="text-purple-200 text-sm">Click to play demonstration</p>
                  </div>

                  {/* Letter Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/95 px-5 py-2 rounded-xl shadow-lg">
                      <span className="text-4xl font-bold text-purple-600">{selectedLesson.letter}</span>
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="capitalize text-sm px-3 py-1 bg-purple-100 text-purple-700">
                      {selectedLesson.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6 space-y-4 bg-white">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedLesson.title}</h3>
                    <p className="text-gray-600">{selectedLesson.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Points:</h4>
                    <div className="space-y-2">
                      {selectedLesson.keyPoints.map((point, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" size="lg">
                      {selectedLesson.completed ? 'Completed' : 'Mark Complete'}
                    </Button>
                    <Link to="/practice" className="flex-1">
                      <Button variant="outline" className="w-full h-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50" size="lg">
                        Practice
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: completedCount, label: 'Completed', icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
                { value: alphabetLessons.length - completedCount, label: 'Remaining', icon: Zap, color: 'bg-orange-100 text-orange-700' },
                { value: alphabetLessons.length, label: 'Total', icon: Star, color: 'bg-purple-100 text-purple-700' },
              ].map((stat, idx) => (
                <Card key={idx} className={`p-6 text-center ${stat.color}`}>
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
