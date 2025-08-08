import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export function ProgressBar({ progress, className = '' }: ProgressBarProps) {
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm ${className}`}>
      <div className="h-1 sm:h-1.5 bg-gray-200 relative overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary via-accent to-secondary relative"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-white/30"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
      <motion.div 
        className="absolute top-2 right-4 text-xs font-medium text-gray-600 hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {Math.round(progress)}% Complete
      </motion.div>
    </div>
  );
}
