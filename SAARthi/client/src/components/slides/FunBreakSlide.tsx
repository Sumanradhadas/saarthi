import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FunBreak } from '@/types/test';

interface FunBreakSlideProps {
  funBreak: FunBreak;
  onNext: () => void;
}

export function FunBreakSlide({ funBreak, onNext }: FunBreakSlideProps) {
  const [userInput, setUserInput] = useState('');

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-accent/10 via-secondary/5 to-primary/10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute top-8 sm:top-16 left-4 sm:left-8 w-16 sm:w-24 h-16 sm:h-24 bg-accent/30 rounded-full"
          animate={{ y: [-10, 20, -10], rotate: [0, 180, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: -0.5 }}
        />
        <motion.div 
          className="absolute top-20 sm:top-32 right-6 sm:right-12 w-14 sm:w-20 h-14 sm:h-20 bg-secondary/30 rounded-full"
          animate={{ y: [20, -10, 20], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: -1.5 }}
        />
        <motion.div 
          className="absolute bottom-24 sm:bottom-40 left-8 sm:left-16 w-12 sm:w-16 h-12 sm:h-16 bg-primary/30 rounded-full"
          animate={{ y: [-5, 15, -5], x: [-3, 3, -3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: -2.5 }}
        />
        <motion.div 
          className="absolute top-40 sm:top-60 right-16 sm:right-24 w-8 sm:w-12 h-8 sm:h-12 bg-accent/20 rounded-full"
          animate={{ scale: [0.5, 1.5, 0.5], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: -1 }}
        />
      </div>

      <motion.div 
        className="text-center max-w-xs sm:max-w-md w-full px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Fun Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div 
            className="text-4xl sm:text-5xl lg:text-6xl mb-4"
            animate={{ y: [-5, 5, -5], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {funBreak.content.emoji}
          </motion.div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
            {funBreak.content.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 px-2">
            {funBreak.content.description}
          </p>
        </motion.div>

        {/* Content Based on Type */}
        {funBreak.type === 'meme' ? (
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 transform hover:scale-105 transition-all duration-300 border border-white/20"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
          >
            <motion.div 
              className="w-full h-32 sm:h-40 lg:h-48 bg-gradient-to-br from-accent/20 via-secondary/10 to-primary/20 rounded-xl mb-4 flex items-center justify-center text-4xl sm:text-5xl lg:text-6xl shadow-inner"
              animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.span
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                📚😴
              </motion.span>
            </motion.div>
            <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mb-2 leading-relaxed">
              {funBreak.content.memeText}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Don't worry, even the best students feel this way sometimes! 🤓
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg border border-white/30"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-4">
              {funBreak.content.question}
            </h3>
            <div className="space-y-3">
              <Input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={funBreak.content.placeholder}
                className="text-center bg-white/90 border-primary/30 focus:border-primary text-sm sm:text-base h-10 sm:h-auto"
              />
              <p className="text-xs sm:text-sm text-gray-500">
                {funBreak.content.description}
              </p>
            </div>
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button 
            onClick={onNext}
            className="bg-gradient-to-r from-primary to-secondary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base lg:text-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center"
            >
              Let's Continue! <motion.i 
                className="fas fa-rocket ml-2"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              ></motion.i>
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
