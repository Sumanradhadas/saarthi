import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ImageQuestion, AIFeedback } from '@/types/test';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { SAArthiPopup } from '@/components/ui/saarthi-popup';
import { X, Upload, Camera, Plus } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface ImageUploadSlideProps {
  question: ImageQuestion;
  questionNumber: number;
  totalQuestions: number;
  onNext: () => void;
  onPrevious: () => void;
  sessionId: string;
}

export function ImageUploadSlide({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onNext, 
  onPrevious,
  sessionId 
}: ImageUploadSlideProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const submitImages = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      
      // Add all images to form data
      files.forEach((file, index) => {
        formData.append('images', file);
      });
      
      formData.append('questionId', question.id);
      formData.append('sessionId', sessionId);
      formData.append('markingScheme', JSON.stringify(question.markingScheme));

      const response = await fetch('/api/questions/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit images');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setFeedback({
        score: data.analysis.score,
        feedback: data.analysis.feedback,
        suggestions: data.analysis.suggestions,
        strengths: data.analysis.strengths,
        improvements: data.analysis.improvements
      });
      setIsProcessing(false);
      setOcrProgress(100);
      // Show popup with results
      setTimeout(() => setShowPopup(true), 1000);
    },
    onError: () => {
      toast({
        title: "Upload Error",
        description: "Failed to process your images. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
      setOcrProgress(0);
    }
  });

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1, // Maximum size in MB
      maxWidthOrHeight: 1920, // Maximum width or height
      useWebWorker: true,
      quality: 0.8, // Compression quality
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Image compression error:', error);
      return file; // Return original file if compression fails
    }
  };

  const handleFileSelect = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const validUrls: string[] = [];

    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: `${file.name} is not an image file.`,
          variant: "destructive"
        });
        continue;
      }

      if (file.size > 10 * 1024 * 1024) { // Increased limit before compression
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 10MB.`,
          variant: "destructive"
        });
        continue;
      }

      // Compress the image
      const compressedFile = await compressImage(file);
      validFiles.push(compressedFile);
      validUrls.push(URL.createObjectURL(compressedFile));
    }

    if (validFiles.length === 0) return;

    // Add to existing files (up to 5 total)
    const newFiles = [...selectedFiles, ...validFiles].slice(0, 5);
    const newUrls = [...previewUrls, ...validUrls].slice(0, 5);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const removeImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const removeAllImages = () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    setFeedback(null);
    setOcrProgress(0);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Images",
        description: "Please upload at least one image before submitting.",
        variant: "destructive"
      });
      return;
    }

    // Start processing simulation
    setIsProcessing(true);
    setOcrProgress(0);
    
    // Simulate OCR progress
    const progressInterval = setInterval(() => {
      setOcrProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          // Start actual API call
          submitImages.mutate(selectedFiles);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50/30">
      <div className="flex-1 flex flex-col justify-center max-w-sm sm:max-w-xl lg:max-w-3xl mx-auto w-full">
        {/* Question Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2 rounded-full mb-4 shadow-sm">
            <motion.i 
              className={`${question.icon} text-primary mr-2`}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            ></motion.i>
            <span className="text-primary font-medium text-sm">{question.subject} • Question {questionNumber}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {question.text}
          </h2>
          <div className="text-sm text-primary bg-primary/10 px-4 py-2 rounded-lg inline-block">
            Total Marks: {question.marks} | Upload 1-5 images
          </div>
        </motion.div>

        {/* Upload Area or Image Grid */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {selectedFiles.length === 0 ? (
            // Upload Drop Zone
            <div 
              className="border-2 border-dashed border-gray-300 hover:border-primary transition-colors duration-300 rounded-xl p-8 text-center bg-gray-50/50 hover:bg-primary/5 cursor-pointer group"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <motion.div 
                className="group-hover:animate-pulse"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Upload className="w-12 h-12 text-gray-400 group-hover:text-primary mx-auto mb-4 transition-colors" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload Your Handwritten Answer</h3>
              <p className="text-gray-500 mb-4">Drag and drop multiple images or click to browse</p>
              <div className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                <Camera className="w-4 h-4 mr-2" />
                Choose Images
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*" 
                multiple
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              />
            </div>
          ) : (
            // Image Grid
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">
                  {selectedFiles.length} image{selectedFiles.length !== 1 ? 's' : ''} uploaded
                </h3>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={selectedFiles.length >= 5}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add More
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeAllImages}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                </div>
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <motion.div
                    key={url}
                    className="relative bg-gray-100 rounded-xl overflow-hidden group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <img 
                      src={url} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="text-white hover:text-red-400 hover:bg-red-500/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {selectedFiles[index]?.name?.slice(0, 15)}...
                    </div>
                  </motion.div>
                ))}
              </div>

              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*" 
                multiple
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              />
            </div>
          )}
        </motion.div>

        {/* Submit Button */}
        {selectedFiles.length > 0 && !feedback && (
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={handleSubmit}
              disabled={isProcessing || submitImages.isPending}
              className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 text-lg hover:from-primary/90 hover:to-secondary/90"
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-r-transparent mr-2" />
                  Analyzing... {Math.round(ocrProgress)}%
                </div>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Submit for Analysis
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Processing Animation */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div 
              className="mb-6 bg-primary/5 border border-primary/20 rounded-xl p-6 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <i className="fas fa-robot text-white text-xl"></i>
              </motion.div>
              <h3 className="font-semibold text-primary mb-2">SAARthi is analyzing your answer...</h3>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <motion.div 
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                  style={{ width: `${ocrProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {ocrProgress < 30 ? 'Compressing and resizing images...' :
                 ocrProgress < 70 ? 'Extracting text with OCR.space...' :
                 'Analyzing content with Gemini AI...'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <Button 
            onClick={onPrevious}
            variant="ghost"
            className="flex items-center text-gray-500 hover:text-primary"
            disabled={submitImages.isPending}
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Previous
          </Button>
          
          <div className="text-sm text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </div>
          
          <Button 
            onClick={onNext}
            disabled={!feedback || submitImages.isPending}
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
          type="image"
          data={{
            score: feedback.score,
            feedback: feedback.feedback,
            strengths: feedback.strengths,
            improvements: feedback.improvements,
            suggestions: feedback.suggestions
          }}
        />
      )}
    </div>
  );
}