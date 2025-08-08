import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '@/components/ui/progress-bar';
import { WelcomeSlide } from '@/components/slides/WelcomeSlide';
import { MCQSlide } from '@/components/slides/MCQSlide';
import { ImageUploadSlide } from '@/components/slides/ImageUploadSlide';
import { FunBreakSlide } from '@/components/slides/FunBreakSlide';
import { SummarySlide } from '@/components/slides/SummarySlide';
import { useSlideNavigation } from '@/hooks/use-slide-navigation';
import { mcqQuestions, imageQuestions, funBreaks } from '@/data/questions';
import { TestSession } from '@/types/test';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function Home() {
  const [sessionId, setSessionId] = useState<string>('');

  const slideOrder = useMemo(() => {
    const generatedSlides = [
      { type: 'welcome' as const, id: 'welcome' }
    ];

    // Add all MCQ questions dynamically
    mcqQuestions.forEach((question, index) => {
      generatedSlides.push({
        type: 'mcq' as const,
        id: question.id,
        question: question
      });

      // Add fun breaks after every 3-4 questions
      if ((index + 1) % 4 === 0 && index < mcqQuestions.length - 1) {
        const breakIndex = Math.floor((index + 1) / 4) - 1;
        if (breakIndex < funBreaks.length) {
          generatedSlides.push({
            type: 'fun-break' as const,
            id: funBreaks[breakIndex].id,
            funBreak: funBreaks[breakIndex]
          });
        }
      }
    });

    // Add all image upload questions dynamically
    imageQuestions.forEach((question) => {
      generatedSlides.push({
        type: 'image-upload' as const,
        id: question.id,
        question: question
      });
    });

    // Add any remaining fun breaks
    const remainingBreaks = funBreaks.slice(Math.floor(mcqQuestions.length / 4));
    remainingBreaks.forEach((funBreak) => {
      generatedSlides.push({
        type: 'fun-break' as const,
        id: funBreak.id,
        funBreak: funBreak
      });
    });

    // Add summary slide at the end
    generatedSlides.push({ type: 'summary' as const, id: 'summary' });

    return generatedSlides;
  }, []);


  const { currentSlide, progress, nextSlide, previousSlide, resetToStart } = useSlideNavigation({
    totalSlides: slideOrder.length,
    onSlideChange: (slide) => {
      // Update session progress
      if (sessionId) {
        updateSession.mutate({
          currentSlide: slide,
          isCompleted: slide === slideOrder.length - 1
        });
      }
    }
  });

  // Create session mutation
  const createSession = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/sessions', {
        currentSlide: 0,
        answers: {},
        isCompleted: false
      });
      return response.json();
    },
    onSuccess: (data: TestSession) => {
      setSessionId(data.id);
    }
  });

  // Update session mutation
  const updateSession = useMutation({
    mutationFn: async (updates: Partial<TestSession>) => {
      const response = await apiRequest('PATCH', `/api/sessions/${sessionId}`, updates);
      return response.json();
    }
  });

  // Initialize session on mount
  useEffect(() => {
    createSession.mutate();
  }, []);

  const handleRestart = () => {
    resetToStart();
    createSession.mutate();
  };

  const getCurrentSlideContent = () => {
    const currentSlideConfig = slideOrder[currentSlide];

    switch (currentSlideConfig.type) {
      case 'welcome':
        return <WelcomeSlide onNext={nextSlide} />;

      case 'mcq':
        return (
          <MCQSlide
            question={currentSlideConfig.question}
            questionNumber={currentSlide}
            totalQuestions={slideOrder.length - 3} // Exclude welcome, summary, and fun slides
            onNext={nextSlide}
            onPrevious={previousSlide}
            sessionId={sessionId}
          />
        );

      case 'image-upload': // Changed from 'image' to 'image-upload'
        return (
          <ImageUploadSlide
            question={currentSlideConfig.question}
            questionNumber={currentSlide}
            totalQuestions={slideOrder.length - 3}
            onNext={nextSlide}
            onPrevious={previousSlide}
            sessionId={sessionId}
          />
        );

      case 'fun-break': // Changed from 'fun' to 'fun-break'
        return <FunBreakSlide funBreak={currentSlideConfig.funBreak} onNext={nextSlide} />;

      case 'summary':
        return <SummarySlide onRestart={handleRestart} sessionId={sessionId} />;

      default:
        return null;
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard shortcuts when not typing in input fields
      const isInputFocused = document.activeElement?.tagName === 'INPUT' || 
                           document.activeElement?.tagName === 'TEXTAREA';

      if (!isInputFocused) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          nextSlide();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          previousSlide();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, previousSlide]);

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      <ProgressBar progress={progress} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="h-full w-full relative"
          initial={{ opacity: 0, x: 100, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {getCurrentSlideContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}