import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface SlideConfig {
  totalSlides: number;
  onSlideChange?: (currentSlide: number) => void;
}

export function useSlideNavigation({ totalSlides, onSlideChange }: SlideConfig) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  const navigateToSlide = useCallback(async (slideIndex: number) => {
    if (slideIndex < 0 || slideIndex >= totalSlides || isAnimating) {
      return;
    }

    setIsAnimating(true);
    setCurrentSlide(slideIndex);
    onSlideChange?.(slideIndex);
    
    // Animation duration
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  }, [totalSlides, isAnimating, onSlideChange]);

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      navigateToSlide(currentSlide + 1);
    }
  }, [currentSlide, totalSlides, navigateToSlide]);

  const previousSlide = useCallback(() => {
    if (currentSlide > 0) {
      navigateToSlide(currentSlide - 1);
    }
  }, [currentSlide, navigateToSlide]);

  const resetToStart = useCallback(() => {
    navigateToSlide(0);
  }, [navigateToSlide]);

  const progress = ((currentSlide + 1) / totalSlides) * 100;

  return {
    currentSlide,
    progress,
    isAnimating,
    nextSlide,
    previousSlide,
    navigateToSlide,
    resetToStart,
    canGoNext: currentSlide < totalSlides - 1,
    canGoPrevious: currentSlide > 0
  };
}
