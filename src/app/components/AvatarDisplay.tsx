import { Flame } from 'lucide-react';

interface AvatarDisplayProps {
  level?: number;
  xp?: number;
  maxXp?: number;
  streak?: number;
}

export function AvatarDisplay({ level = 1, xp = 0, maxXp = 100, streak = 0 }: AvatarDisplayProps) {
  const xpPercentage = (xp / maxXp) * 100;

  return (
    <div className="relative">
      {/* Avatar Circle */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 p-1 shadow-lg">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <div className="text-3xl">👋</div>
          </div>
        </div>

        {/* Level Badge */}
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white shadow-md">
          <span className="text-white font-bold text-xs">{level}</span>
        </div>

        {/* Streak Badge */}
        {streak > 0 && (
          <div className="absolute -top-1 -left-1 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white shadow-md">
            <Flame className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* XP Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-purple-600">Level {level}</span>
          <span className="text-xs text-gray-500">{xp}/{maxXp} XP</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
