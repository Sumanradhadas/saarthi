export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestion {
  id: string;
  subject: 'Pharmacology' | 'Pathology' | 'Genetics';
  text: string;
  options: MCQOption[];
  correctAnswer: string;
  explanation: string;
  icon: string;
}

export interface ImageQuestion {
  id: string;
  subject: 'Pharmacology' | 'Pathology' | 'Genetics';
  text: string;
  marks: number;
  markingScheme: {
    keyPoints: string[];
    fullMarksCriteria: string[];
  };
  icon: string;
}

export interface FunBreak {
  id: string;
  type: 'meme' | 'question';
  content: {
    emoji?: string;
    title: string;
    description?: string;
    memeText?: string;
    question?: string;
    placeholder?: string;
  };
}

export interface TestSession {
  id: string;
  currentSlide: number;
  answers: Record<string, any>;
  isCompleted: boolean;
  score?: number;
}

export interface QuestionResponse {
  id: string;
  sessionId: string;
  questionId: string;
  questionType: 'mcq' | 'image_upload';
  userAnswer?: string;
  imageUrl?: string;
  aiScore?: number;
  aiFeedback?: string;
  isCorrect?: boolean;
}

export interface AIFeedback {
  isCorrect?: boolean;
  score?: number;
  feedback: string;
  suggestions?: string[];
  strengths?: string[];
  improvements?: string[];
}

export interface PerformanceSummary {
  overallScore: number;
  mcqCorrect: number;
  mcqTotal: number;
  writtenAverage: number;
  subjectPerformance: {
    [key: string]: number;
  };
}
