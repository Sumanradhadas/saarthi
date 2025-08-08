import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MCQQuestion, AIFeedback } from '@/types/test';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { SAArthiPopup } from '@/components/ui/saarthi-popup';

interface MCQSlideProps {
  question: MCQQuestion;
  questionNumber: number;
  totalQuestions: number;
  onNext: () => void;
  onPrevious: () => void;
  sessionId: string;
}

export function MCQSlide({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onNext, 
  onPrevious,
  sessionId 
}: MCQSlideProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const submitMCQ = useMutation({
    mutationFn: async (answer: string) => {
      const response = await apiRequest('POST', '/api/questions/mcq', {
        questionId: question.id,
        answer,
        sessionId,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Update with detailed AI feedback after 5 seconds
      setFeedback({
        isCorrect: data.isCorrect,
        feedback: data.feedback,
        suggestions: data.suggestions,
        strengths: data.strengths
      });
      // Show popup after AI analysis completes
      setTimeout(() => setShowPopup(true), 500);
    }
  });

  const selectOption = (optionId: string) => {
    if (showFeedback) return;
    
    setSelectedOption(optionId);
    
    // Show immediate correct/wrong feedback
    const isCorrect = optionId === question.correctAnswer;
    setFeedback({
      isCorrect,
      feedback: isCorrect ? 'Correct!' : `Incorrect - Correct answer: ${question.correctAnswer}`,
      suggestions: [],
      strengths: []
    });
    setShowFeedback(true);
    
    // Wait 5 seconds before getting AI analysis
    setIsLoadingAnalysis(true);
    setTimeout(() => {
      submitMCQ.mutate(optionId);
      setIsLoadingAnalysis(false);
    }, 5000);
  };

  const getOptionStyles = (optionId: string) => {
    if (!selectedOption) return 'bg-gray-50 hover:bg-primary/5 border-gray-200 hover:border-primary/30';
    
    if (optionId === selectedOption) {
      if (feedback?.isCorrect) {
        return 'bg-green-50 border-green-300 text-green-800';
      } else {
        return 'bg-red-50 border-red-300 text-red-800';
      }
    }
    
    if (optionId === question.correctAnswer && feedback && !feedback.isCorrect) {
      return 'bg-green-50 border-green-300 text-green-800';
    }
    
    return 'bg-gray-50 border-gray-200 text-gray-400';
  };

  const getOptionIconStyles = (optionId: string) => {
    if (!selectedOption) return 'bg-white border-gray-300 group-hover:border-primary/50';
    
    if (optionId === selectedOption) {
      if (feedback?.isCorrect) {
        return 'bg-green-500 border-green-500 text-white';
      } else {
        return 'bg-red-500 border-red-500 text-white';
      }
    }
    
    if (optionId === question.correctAnswer && feedback && !feedback.isCorrect) {
      return 'bg-green-500 border-green-500 text-white';
    }
    
    return 'bg-gray-200 border-gray-300 text-gray-400';
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50/30">
      <div className="flex-1 flex flex-col justify-center max-w-sm sm:max-w-xl lg:max-w-2xl mx-auto w-full">
        {/* Question Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-flex items-center bg-gradient-to-r from-primary/10 to-secondary/10 px-3 sm:px-4 py-2 rounded-full mb-4 shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <motion.i 
              className={`${question.icon} text-primary mr-2 text-sm sm:text-base`}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            ></motion.i>
            <span className="text-primary font-medium text-xs sm:text-sm">{question.subject} • Question {questionNumber}</span>
          </motion.div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
            {question.text}
          </h2>
        </motion.div>

        {/* MCQ Options */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {question.options.map((option, index) => (
            <motion.button
              key={option.id}
              onClick={() => selectOption(option.id)}
              disabled={submitMCQ.isPending}
              className={`w-full p-3 sm:p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-102 hover:shadow-lg group border-2 ${getOptionStyles(option.id)}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-3 sm:mr-4 text-xs sm:text-sm font-semibold transition-all duration-300 ${getOptionIconStyles(option.id)}`}>
                  {selectedOption === option.id && feedback?.isCorrect ? (
                    <i className="fas fa-check text-xs"></i>
                  ) : selectedOption === option.id && !feedback?.isCorrect ? (
                    <i className="fas fa-times text-xs"></i>
                  ) : option.id === question.correctAnswer && feedback && !feedback.isCorrect ? (
                    <i className="fas fa-check text-xs"></i>
                  ) : (
                    option.id
                  )}
                </div>
                <span className="group-hover:text-gray-800 text-sm sm:text-base leading-relaxed">{option.text}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Result Display */}
        <AnimatePresence>
          {showFeedback && feedback && (
            <motion.div 
              className="mt-4 sm:mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className={`inline-flex items-center px-6 py-3 rounded-full font-semibold ${
                  feedback.isCorrect 
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
                animate={{ scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.6 }}
              >
                {feedback.isCorrect ? (
                  <>🎉 Correct!</>
                ) : (
                  <>❌ Incorrect - Correct answer: {question.correctAnswer}</>
                )}
              </motion.div>
              
              {/* Loading indicator for AI analysis */}
              {isLoadingAnalysis && (
                <motion.div
                  className="mt-3 text-sm text-gray-600 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  SAARthi is analyzing your answer...
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6 sm:mt-8 px-2">
          <Button 
            onClick={onPrevious}
            variant="ghost"
            className="flex items-center text-gray-500 hover:text-primary"
            disabled={submitMCQ.isPending}
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Previous
          </Button>
          
          <div className="text-xs sm:text-sm text-gray-500 font-medium">
            {questionNumber} of {totalQuestions}
          </div>
          
          <Button 
            onClick={onNext}
            disabled={!showFeedback || submitMCQ.isPending}
            className="flex items-center text-primary hover:text-primary/80 disabled:text-gray-400 disabled:cursor-not-allowed"
            variant="ghost"
          >
            Next
            <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </div>
      </div>

      {/* SAARthi Popup */}
      {feedback && (
        <SAArthiPopup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          type="mcq"
          data={{
            isCorrect: feedback.isCorrect,
            correctAnswer: question.correctAnswer,
            userAnswer: selectedOption || '',
            feedback: feedback.feedback,
            explanation: question.explanation,
            suggestions: feedback.suggestions
          }}
        />
      )}
    </div>
  );
}
