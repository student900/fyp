import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  BookOpen,
  Trophy,
  Camera,
  ArrowRight,
  Award,
  Zap,
  Users,
  Target
} from 'lucide-react';
import { Link } from 'react-router';

export function Home() {
  const features = [
    {
      icon: BookOpen,
      title: 'Learn',
      description: 'Master the ASL alphabet with comprehensive video tutorials and step-by-step instructions',
      color: 'from-blue-500 to-blue-600',
      path: '/learn',
      stats: '26 Letters'
    },
    {
      icon: Trophy,
      title: 'Quiz',
      description: 'Test your knowledge with interactive quizzes and get instant feedback on your progress',
      color: 'from-purple-500 to-purple-600',
      path: '/quiz',
      stats: 'Multiple Levels'
    },
    {
      icon: Camera,
      title: 'Practice',
      description: 'Practice with webcam recognition and receive real-time AI-powered feedback',
      color: 'from-green-500 to-teal-600',
      path: '/practice',
      stats: 'Live Recognition'
    }
  ];

  const stats = [
    { icon: Award, label: 'Total Lessons', value: '26', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { icon: Target, label: 'Quiz Questions', value: '50+', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { icon: Zap, label: 'Practice Sessions', value: '∞', color: 'text-green-600', bgColor: 'bg-green-100' },
    { icon: Users, label: 'Active Players', value: '1K+', color: 'text-orange-600', bgColor: 'bg-orange-100' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center space-y-8">
            <div className="inline-block px-6 py-2 bg-purple-100 rounded-full">
              <span className="text-sm font-semibold text-purple-700">Interactive ASL Learning</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 leading-tight">
              Learn Sign Language
              <br />
              <span className="text-purple-600">
                The Modern Way
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master American Sign Language through interactive lessons,
              quizzes, and practice sessions with real-time feedback.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/learn">
                <Button size="lg" className="text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700">
                  Start Learning
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/practice">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-purple-600 text-purple-600 hover:bg-purple-50">
                  <Camera className="w-5 h-5 mr-2" />
                  Try Practice
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-6 text-center bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your <span className="text-purple-600">Learning Path</span>
          </h2>
          <p className="text-gray-600 text-lg">Three interactive modes to master sign language</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 bg-white">
              <div className="p-8">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <div className="inline-block px-3 py-1 bg-purple-50 rounded-full mb-3">
                    <span className="text-xs font-semibold text-purple-700">{feature.stats}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>

                <Link to={feature.path}>
                  <Button className={`w-full bg-gradient-to-r ${feature.color}`} size="lg">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 overflow-hidden">
          <div className="p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands learning American Sign Language with our interactive platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/learn">
                <Button size="lg" className="text-lg px-8 py-6 bg-white text-purple-600 hover:bg-gray-100">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start Learning
                </Button>
              </Link>
              <Link to="/quiz">
                <Button size="lg" className="text-lg px-8 py-6 bg-purple-800 text-white hover:bg-purple-900">
                  <Trophy className="w-5 h-5 mr-2" />
                  Take a Quiz
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}