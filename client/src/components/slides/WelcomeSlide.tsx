import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface WelcomeSlideProps {
  onNext: () => void;
}

export function WelcomeSlide({ onNext }: WelcomeSlideProps) {

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className="absolute top-10 sm:top-20 left-4 sm:left-10 w-12 sm:w-20 h-12 sm:h-20 bg-primary/20 rounded-full"
          animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-20 sm:top-40 right-6 sm:right-16 w-10 sm:w-16 h-10 sm:h-16 bg-secondary/20 rounded-full"
          animate={{ y: [10, -10, 10], scale: [1, 1.2, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-20 sm:bottom-32 left-8 sm:left-20 w-8 sm:w-12 h-8 sm:h-12 bg-accent/20 rounded-full"
          animate={{ y: [-5, 15, -5], x: [-5, 5, -5] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute top-32 sm:top-60 right-20 sm:right-32 w-6 sm:w-10 h-6 sm:h-10 bg-primary/15 rounded-full"
          animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>

      <motion.div 
        className="text-center max-w-sm sm:max-w-md w-full px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* SAARthi Character */}
        <motion.div 
          className="mb-6 sm:mb-8"
          animate={{ y: [-10, 0, -10] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div 
            className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/30 to-secondary/30 rounded-full blur-md animate-pulse"></div>
            
            {/* Main icon container */}
            <div className="relative w-full h-full bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 border-4 border-white/20">
              {/* Inner highlight */}
              <div className="absolute top-2 left-2 w-4 h-4 sm:w-6 sm:h-6 bg-white/30 rounded-full blur-sm"></div>
              
              {/* Robot icon with enhanced styling */}
              <motion.div
                className="relative text-white text-3xl sm:text-5xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotateY: [0, 10, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0.5 
                }}
              >
                <i className="fas fa-robot drop-shadow-lg"></i>
                
                {/* Animated eyes */}
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    className="flex space-x-1"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                    <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Decorative particles */}
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: 0.8
                }}
              ></motion.div>
              <motion.div
                className="absolute -bottom-1 -left-1 w-2 h-2 bg-secondary rounded-full"
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: 1.2
                }}
              ></motion.div>
            </div>
            
            {/* Orbiting elements */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-1 h-1 bg-primary rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-1 h-1 bg-accent rounded-full"></div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1 h-1 bg-secondary rounded-full"></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1 w-1 h-1 bg-primary rounded-full"></div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Hi! I'm <motion.span 
            className="text-yellow-500 font-bold"
            style={{ 
              color: '#fbbf24',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            SAARthi
          </motion.span> 🤖
        </motion.h1>

        <motion.p 
          className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg leading-relaxed px-2"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Your Smart AI Test & Learning Companion! I'm here to help you ace your Pharmacology, Pathology, and Genetics retake. Let's make learning fun! 🎯
        </motion.p>

        {/* Let's Begin Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button 
            onClick={onNext}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 sm:py-4 font-semibold hover:from-primary/90 hover:to-secondary/90 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25 text-sm sm:text-base mobile-friendly"
            type="button"
          >
            Let's Begin! <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
