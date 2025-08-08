import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PerformanceSummary } from '@/types/test';
import { useQuery } from '@tanstack/react-query';
import { mcqQuestions, imageQuestions } from '@/data/questions';

interface SummarySlideProps {
  onRestart: () => void;
  sessionId: string;
}

export function SummarySlide({ onRestart, sessionId }: SummarySlideProps) {
  const [summary, setSummary] = useState<PerformanceSummary>({
    overallScore: 0,
    mcqCorrect: 0,
    mcqTotal: 0,
    writtenAverage: 0,
    subjectPerformance: {
      'Pharmacology': 0,
      'Pathology': 0,
      'Genetics': 0
    }
  });

  const { data: responses } = useQuery({
    queryKey: ['/api/sessions', sessionId, 'responses'],
    enabled: !!sessionId
  });

  useEffect(() => {
    if (responses && Array.isArray(responses) && responses.length > 0) {
      // Calculate actual performance based on responses
      const mcqResponses = responses.filter((r: any) => r.questionType === 'mcq');
      const imageResponses = responses.filter((r: any) => r.questionType === 'image_upload');
      
      const mcqCorrect = mcqResponses.filter((r: any) => r.isCorrect).length;
      const mcqTotal = mcqResponses.length;
      
      const writtenScores = imageResponses.map((r: any) => r.aiScore || 0);
      const writtenAverage = writtenScores.length > 0 
        ? writtenScores.reduce((a: number, b: number) => a + b, 0) / writtenScores.length 
        : 0;
      
      const overallScore = mcqTotal > 0 && imageResponses.length > 0 
        ? Math.round(((mcqCorrect / mcqTotal) * 50) + ((writtenAverage / 5) * 50))
        : mcqTotal > 0 
        ? Math.round((mcqCorrect / mcqTotal) * 100)
        : 0;

      // Calculate subject-wise performance
      const subjectPerformance: { [key: string]: number } = {
        'Pharmacology': 0,
        'Pathology': 0,
        'Genetics': 0
      };

      // Calculate MCQ performance by subject
      const subjectMCQStats: { [key: string]: { correct: number; total: number } } = {
        'Pharmacology': { correct: 0, total: 0 },
        'Pathology': { correct: 0, total: 0 },
        'Genetics': { correct: 0, total: 0 }
      };

      mcqResponses.forEach((response: any) => {
        // Find the actual question to get the correct subject
        const question = mcqQuestions.find(q => q.id === response.questionId);
        const subject = question ? question.subject : 'Pharmacology'; // fallback

        subjectMCQStats[subject].total++;
        if (response.isCorrect) {
          subjectMCQStats[subject].correct++;
        }
      });

      // Calculate subject-wise image performance
      const subjectImageStats: { [key: string]: { total: number; scoreSum: number } } = {
        'Pharmacology': { total: 0, scoreSum: 0 },
        'Pathology': { total: 0, scoreSum: 0 },
        'Genetics': { total: 0, scoreSum: 0 }
      };

      imageResponses.forEach((response: any) => {
        // Find the actual question to get the correct subject
        const question = imageQuestions.find(q => q.id === response.questionId);
        const subject = question ? question.subject : 'Pharmacology'; // fallback

        subjectImageStats[subject].total++;
        subjectImageStats[subject].scoreSum += (response.aiScore || 0);
      });

      // Calculate final subject performance (combining MCQ and written)
      Object.keys(subjectPerformance).forEach(subject => {
        const mcqScore = subjectMCQStats[subject].total > 0 
          ? (subjectMCQStats[subject].correct / subjectMCQStats[subject].total) * 100 
          : 0;
        
        const imageScore = subjectImageStats[subject].total > 0 
          ? (subjectImageStats[subject].scoreSum / subjectImageStats[subject].total) * 20 // Convert to percentage (assuming 5 is max)
          : 0;
        
        // Average MCQ and written performance
        if (subjectMCQStats[subject].total > 0 && subjectImageStats[subject].total > 0) {
          subjectPerformance[subject] = Math.round((mcqScore + imageScore) / 2);
        } else if (subjectMCQStats[subject].total > 0) {
          subjectPerformance[subject] = Math.round(mcqScore);
        } else if (subjectImageStats[subject].total > 0) {
          subjectPerformance[subject] = Math.round(imageScore);
        } else {
          subjectPerformance[subject] = 0;
        }
      });

      // Animate to final values after a delay
      setTimeout(() => {
        setSummary({
          overallScore,
          mcqCorrect,
          mcqTotal,
          writtenAverage,
          subjectPerformance
        });
      }, 1000); // 1 second delay for animation effect
    }
  }, [responses]);

  const getEncouragementMessage = () => {
    if (summary.overallScore >= 80) {
      return "You're absolutely crushing it! 🌟 Your understanding of these concepts is excellent. You're definitely ready for that retake!";
    } else if (summary.overallScore >= 70) {
      return "You're stronger than you think! 💪 Your pharmacology concepts are solid, and your genetics understanding is improving. Focus a bit more on pathology mechanisms, and you'll be ready to ace that retake!";
    } else {
      return "Every expert was once a beginner! 🌱 You've got great potential, and with a bit more practice on the key concepts, you'll see amazing improvement. Keep going!";
    }
  };

  return (
    <div className="h-full flex flex-col p-6 bg-gradient-to-br from-secondary/10 to-primary/10">
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-20 h-20 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6"
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <i className="fas fa-trophy"></i>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Great Job! 🎉</h1>
          <p className="text-gray-600 text-lg">Here's how you performed on this practice test</p>
        </motion.div>

        {/* Performance Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Overall Score */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="text-3xl font-bold text-primary mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              {summary.overallScore}%
            </motion.div>
            <p className="text-gray-600 font-medium">Overall Score</p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
              <motion.div 
                className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${summary.overallScore}%` }}
                transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* MCQ Performance */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="text-3xl font-bold text-secondary mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            >
              {summary.mcqCorrect}/{summary.mcqTotal}
            </motion.div>
            <p className="text-gray-600 font-medium">MCQ Correct</p>
            <div className="text-sm text-gray-500 mt-2">Strong concepts!</div>
          </motion.div>

          {/* Written Answers */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="text-3xl font-bold text-accent mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
            >
              {summary.writtenAverage}/5
            </motion.div>
            <p className="text-gray-600 font-medium">Avg. Written</p>
            <div className="text-sm text-gray-500 mt-2">Room to improve!</div>
          </motion.div>
        </motion.div>

        {/* Subject Breakdown */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject Performance</h3>
          <div className="space-y-4">
            {Object.entries(summary.subjectPerformance).map(([subject, score], index) => (
              <motion.div 
                key={subject}
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + (index * 0.1) }}
              >
                <span className="text-gray-700 flex items-center">
                  <i className={`fas ${
                    subject === 'Pharmacology' ? 'fa-pills text-primary' :
                    subject === 'Pathology' ? 'fa-microscope text-secondary' :
                    'fa-dna text-accent'
                  } mr-3`}></i>
                  {subject}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <motion.div 
                      className={`h-2 rounded-full ${
                        subject === 'Pharmacology' ? 'bg-primary' :
                        subject === 'Pathology' ? 'bg-secondary' :
                        'bg-accent'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ delay: 0.8 + (index * 0.1), duration: 0.8 }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600">{score}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Encouragement */}
        <motion.div 
          className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl p-6 border border-secondary/20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="flex items-start space-x-4">
            <motion.div 
              className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <i className="fas fa-robot text-white text-lg"></i>
            </motion.div>
            <div className="flex-1">
              <h3 className="font-semibold text-secondary mb-2">SAARthi says:</h3>
              <motion.p 
                className="text-gray-700 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                "{getEncouragementMessage()}"
              </motion.p>
              <div className="flex items-center text-sm text-secondary">
                <i className="fas fa-heart mr-2"></i>
                <span>You've got this! I believe in you.</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <Button 
            onClick={onRestart}
            className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <i className="fas fa-redo mr-2"></i>
            Try Again
          </Button>
          <Button 
            variant="outline"
            className="flex-1 bg-white text-primary border border-primary py-4 rounded-xl font-semibold text-lg hover:bg-primary/5 transform hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <i className="fas fa-book mr-2"></i>
            Review Answers
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
