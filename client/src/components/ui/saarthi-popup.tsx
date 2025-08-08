import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ThumbsUp, Lightbulb, Target, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SAArthiPopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'mcq' | 'image';
  data: {
    isCorrect?: boolean;
    correctAnswer?: string;
    userAnswer?: string;
    feedback: string;
    score?: number;
    strengths?: string[];
    improvements?: string[];
    suggestions?: string[];
    explanation?: string;
  };
}

export function SAArthiPopup({ isOpen, onClose, type, data }: SAArthiPopupProps) {
  const [currentView, setCurrentView] = useState<'main' | 'tips'>('main');

  // The formatText function is no longer needed as ReactMarkdown will handle rendering.

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Popup */}
          <motion.div
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 md:p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <i className="fas fa-robot text-white text-xl"></i>
                  </motion.div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">SAARthi Analysis</h2>
                    <p className="text-white/80 text-sm">Your learning companion</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <AnimatePresence mode="wait">
                  {currentView === 'main' ? (
                    <motion.div
                      key="main"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      {/* Score/Result Section */}
                      {type === 'mcq' && (
                        <div className={`p-4 rounded-2xl ${data.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                          <div className="flex items-center space-x-3 mb-3">
                            {data.isCorrect ? (
                              <ThumbsUp className="h-6 w-6 text-green-600" />
                            ) : (
                              <Target className="h-6 w-6 text-red-600" />
                            )}
                            <h3 className={`font-bold text-lg ${data.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                              {data.isCorrect ? 'Correct! 🎉' : 'Not quite right 😊'}
                            </h3>
                          </div>

                          {!data.isCorrect && data.correctAnswer && (
                            <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Correct Answer:</p>
                              <p className="text-primary font-semibold">Option {data.correctAnswer}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {type === 'image' && data.score !== undefined && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                          <div className="flex items-center space-x-3 mb-3">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                            <h3 className="font-bold text-lg text-blue-800">
                              Your Score: {data.score}/5
                            </h3>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <motion.div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(data.score / 5) * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Feedback Section */}
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <i className="fas fa-comment-dots text-primary mr-2"></i>
                          SAARthi's Feedback
                        </h4>
                        <div className="text-gray-700 leading-relaxed prose">
                          <ReactMarkdown>{data.feedback}</ReactMarkdown>
                        </div>
                      </div>

                      {/* Explanation for MCQ */}
                      {type === 'mcq' && data.explanation && (
                        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
                          <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                            <BookOpen className="h-5 w-5 mr-2" />
                            Detailed Explanation
                          </h4>
                          <div className="text-purple-700 leading-relaxed prose">
                            <ReactMarkdown>{data.explanation}</ReactMarkdown>
                          </div>
                        </div>
                      )}

                      {/* Detailed Analysis for Image */}
                      {type === 'image' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {data.strengths && data.strengths.length > 0 && (
                            <div className="bg-green-50 p-4 rounded-2xl border border-green-200">
                              <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                                <ThumbsUp className="h-5 w-5 mr-2" />
                                Strengths
                              </h4>
                              <ul className="space-y-2">
                                {data.strengths.map((strength, index) => (
                                  <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start text-green-700"
                                  >
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span className="text-sm">{strength}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {data.improvements && data.improvements.length > 0 && (
                            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200">
                              <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                                <Target className="h-5 w-5 mr-2" />
                                Areas to Improve
                              </h4>
                              <ul className="space-y-2">
                                {data.improvements.map((improvement, index) => (
                                  <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start text-orange-700"
                                  >
                                    <span className="text-orange-500 mr-2">→</span>
                                    <span className="text-sm">{improvement}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Study Tips Button */}
                      {data.suggestions && data.suggestions.length > 0 && (
                        <div className="text-center">
                          <Button
                            onClick={() => setCurrentView('tips')}
                            className="bg-gradient-to-r from-accent to-primary text-white hover:from-accent/90 hover:to-primary/90"
                          >
                            <Lightbulb className="h-4 w-4 mr-2" />
                            View Study Tips
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="tips"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                          <Lightbulb className="h-6 w-6 mr-2 text-accent" />
                          Study Tips & Tricks
                        </h3>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentView('main')}
                          size="sm"
                        >
                          ← Back
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {data.suggestions?.map((tip, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-r from-accent/10 to-primary/10 p-4 rounded-xl border border-accent/20"
                          >
                            <div className="flex items-start">
                              <span className="bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                                {index + 1}
                              </span>
                              <p className="text-gray-700 flex-1">{tip}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 md:p-6">
                <Button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90"
                >
                  Continue Learning 🚀
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}