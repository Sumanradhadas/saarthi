import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WelcomeSlideProps {
  onNext: () => void;
}

export function WelcomeSlide({ onNext }: WelcomeSlideProps) {
  const [answer, setAnswer] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const verifyAnswer = async () => {
    if (isVerifying || !answer.trim()) return;

    setIsVerifying(true);
    setError('');

    const normalizedAnswer = answer.toLowerCase().trim();

    if (normalizedAnswer === 'dosa' || normalizedAnswer === 'masala dosa') {
      // Animate success
      setTimeout(() => {
        onNext();
      }, 1000);
    } else {
      setError('Hmm, that\'s not what I was thinking! Try again 😊');
      setIsVerifying(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isVerifying && answer.trim()) {
      e.preventDefault();
      e.stopPropagation();
      verifyAnswer();
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    verifyAnswer();
  };

  const handleInputClick = (e: React.MouseEvent) => {
    // Prevent any parent handlers from interfering
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.focus();
      // Ensure the input is properly focused and ready for typing
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const handleInputTouch = (e: React.TouchEvent) => {
    // Handle touch events for mobile devices
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.focus();
      // Ensure the input is properly focused and ready for typing
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const handleInputFocus = () => {
    setError(''); // Clear any error when input is focused
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
    setError(''); // Clear error when typing
  };

  // Auto focus the input when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current && !isVerifying) {
        inputRef.current.focus();
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [isVerifying]);

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
            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center text-white text-4xl sm:text-6xl shadow-2xl shadow-primary/20"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.i 
              className="fas fa-robot"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            ></motion.i>
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

        {/* Verification Question */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="text-gray-700 mb-4 font-medium text-sm sm:text-base">
            Quick question to get started: <br className="hidden sm:block" />
            <span className="text-primary font-semibold">What's your brother's favorite dish?</span> 😉
          </p>
          <div className="space-y-3">
            <Input
              ref={inputRef}
              type="text"
              value={answer}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              onClick={handleInputClick}
              onTouchStart={handleInputTouch}
              onFocus={handleInputFocus}
              placeholder="Type your answer..."
              className={`text-center transition-all duration-300 text-sm sm:text-base h-12 sm:h-auto cursor-text select-text focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:outline-none ${error ? 'border-red-400 bg-red-50 animate-shake focus:border-red-400 focus:ring-red-200' : 'border-primary/30 focus:border-primary hover:border-primary/50 focus:bg-white'}`}
              disabled={isVerifying}
              autoComplete="off"
              tabIndex={0}
            />

            {error && (
              <motion.p 
                className="text-red-500 text-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {error}
              </motion.p>
            )}

            <Button 
              onClick={handleButtonClick}
              onTouchStart={handleButtonClick}
              disabled={isVerifying || !answer.trim()}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 sm:py-4 font-semibold hover:from-primary/90 hover:to-secondary/90 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25 text-sm sm:text-base mobile-friendly"
              type="button"
            >
              {isVerifying ? (
                <motion.div 
                  className="flex items-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Checking...
                </motion.div>
              ) : (
                <>
                  Let's Begin! <i className="fas fa-arrow-right ml-2"></i>
                </>
              )}
            </Button>
          </div>
          <motion.p 
            className="text-xs sm:text-sm text-gray-500 mt-3 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            💡 Hint: It's a South Indian dish that starts with 'D'
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}