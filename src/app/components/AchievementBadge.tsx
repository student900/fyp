import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface AchievementBadgeProps {
  icon: LucideIcon;
  title: string;
  description: string;
  unlocked?: boolean;
  color?: string;
}

export function AchievementBadge({ 
  icon: Icon, 
  title, 
  description, 
  unlocked = false,
  color = 'from-purple-500 to-pink-500'
}: AchievementBadgeProps) {
  return (
    <motion.div
      whileHover={{ scale: unlocked ? 1.05 : 1 }}
      whileTap={{ scale: unlocked ? 0.95 : 1 }}
      className={`relative p-4 rounded-xl border-2 transition-all ${
        unlocked 
          ? 'bg-white border-purple-300 shadow-lg' 
          : 'bg-gray-100 border-gray-300 opacity-60'
      }`}
    >
      {/* Badge Icon */}
      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${unlocked ? color : 'from-gray-400 to-gray-500'} flex items-center justify-center mx-auto mb-3 shadow-md`}>
        <Icon className="w-8 h-8 text-white" />
      </div>

      {/* Badge Info */}
      <div className="text-center">
        <h4 className="font-bold text-sm text-gray-900 mb-1">{title}</h4>
        <p className="text-xs text-gray-600">{description}</p>
      </div>

      {/* Locked Overlay */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 rounded-xl">
          <div className="text-4xl">🔒</div>
        </div>
      )}

      {/* Sparkle Effect for Unlocked */}
      {unlocked && (
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <span className="text-xl">✨</span>
        </motion.div>
      )}
    </motion.div>
  );
}
