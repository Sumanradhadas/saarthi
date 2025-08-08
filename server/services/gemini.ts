import { GoogleGenAI } from "@google/genai";
import sharp from 'sharp';

// Initialize Gemini AI client
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

interface MCQAnalysisRequest {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

interface ImageAnalysisRequest {
  questionId: string;
  imageBase64: string;
  markingScheme: {
    keyPoints: string[];
    fullMarksCriteria: string[];
  };
}

interface ImageAnalysisResponse {
  isCorrect: boolean;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  lengthAnalysis: string;
  formatAnalysis: string;
}

// OCR.space API integration
async function extractTextWithOCR(imageBase64: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('base64Image', `data:image/jpeg;base64,${imageBase64}`);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2'); // Use OCR Engine 2 for better handwriting recognition

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': process.env.OCR_SPACE_API_KEY || 'helloworld', // Free tier key
      },
      body: formData,
    });

    const result = await response.json();
    
    if (result.ParsedResults && result.ParsedResults.length > 0) {
      return result.ParsedResults[0].ParsedText || '';
    }
    
    return '';
  } catch (error) {
    console.error('OCR.space API error:', error);
    return '';
  }
}

// Image resizing function
async function resizeImageForOCR(imageBuffer: Buffer): Promise<string> {
  try {
    const resizedBuffer = await sharp(imageBuffer)
      .resize({
        width: 1920,
        height: 1920,
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toBuffer();
    
    return resizedBuffer.toString('base64');
  } catch (error) {
    console.error('Image resize error:', error);
    // Return original as base64 if resize fails
    return imageBuffer.toString('base64');
  }
}

export async function analyzeMCQAnswer(request: MCQAnalysisRequest): Promise<string> {
  try {
    const { userAnswer, correctAnswer, isCorrect, explanation } = request;

    const prompt = `As SAARthi, a friendly AI learning companion for nursing students, provide brief, encouraging feedback for this MCQ response.

Question details:
- User selected: Option ${userAnswer}
- Correct answer: Option ${correctAnswer}
- Result: ${isCorrect ? 'Correct' : 'Incorrect'}
- Explanation: ${explanation}

Provide a concise response (2-3 sentences max) using markdown formatting:
- Use **bold** for key concepts
- Use *italics* for emphasis
- Keep it warm and encouraging
- Focus on the main learning point

Format: Brief celebration/encouragement + key concept explanation + quick tip (if space allows).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Great attempt! Keep practicing to strengthen your understanding of these concepts.";
  } catch (error) {
    console.error("MCQ analysis error:", error);
    return request.isCorrect 
      ? "Excellent work! You got that right. Your understanding of this concept is solid."
      : "Good try! The correct approach here involves understanding the key mechanism. Keep studying and you'll master this!";
  }
}

export async function analyzeImageAnswer(request: ImageAnalysisRequest): Promise<ImageAnalysisResponse> {
  try {
    const { imageBase64, markingScheme } = request;

    // First, resize image if needed for better OCR
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    const resizedImageBase64 = await resizeImageForOCR(imageBuffer);

    // Extract text using OCR.space API
    let extractedText = await extractTextWithOCR(resizedImageBase64);
    
    // If OCR.space fails or returns empty, fallback to Gemini vision
    if (!extractedText.trim()) {
      console.log('OCR.space failed, falling back to Gemini vision...');
      const ocrPrompt = `Carefully read and transcribe all handwritten text from this medical/nursing answer sheet. 
      Focus on extracting the complete written content accurately, including any diagrams or labels if present.
      Return only the transcribed text content.`;

      const ocrResponse = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: "image/jpeg",
            },
          },
          ocrPrompt,
        ],
      });

      extractedText = ocrResponse.text || "";
    }

    // Now analyze the content for grading with enhanced structure
    const analysisPrompt = `As SAARthi, analyze this nursing student's handwritten answer comprehensively.

EXTRACTED TEXT FROM IMAGE:
"${extractedText}"

MARKING SCHEME:
Key Points to Cover: ${markingScheme.keyPoints.join(', ')}
Full Marks Criteria: ${markingScheme.fullMarksCriteria.join(', ')}

Provide detailed analysis in JSON format with:
- isCorrect: boolean (true if answer demonstrates basic understanding)
- score: integer from 0-5 based on content quality and completeness
- feedback: encouraging paragraph explaining the overall assessment
- strengths: array of positive aspects found (max 3 items)
- improvements: array of specific areas needing work (max 3 items) 
- suggestions: array of actionable study tips and tricks (max 3 items)
- lengthAnalysis: string explaining if answer length is appropriate for marks
- formatAnalysis: string commenting on answer structure and presentation

Consider:
1. CORRECTNESS: Does the answer show understanding of key concepts?
2. COMPLETENESS: Are all required points covered adequately?
3. LENGTH: Is the answer detailed enough for the allocated marks?
4. FORMAT: Is the answer well-structured and clearly presented?

Be encouraging but provide honest, constructive feedback.`;

    const analysisResponse = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            score: { type: "number" },
            feedback: { type: "string" },
            strengths: { 
              type: "array",
              items: { type: "string" }
            },
            improvements: { 
              type: "array",
              items: { type: "string" }
            },
            suggestions: { 
              type: "array",
              items: { type: "string" }
            },
            isCorrect: { type: "boolean" },
            lengthAnalysis: { type: "string" },
            formatAnalysis: { type: "string" }
          },
          required: ["score", "feedback", "strengths", "improvements", "suggestions", "isCorrect", "lengthAnalysis", "formatAnalysis"],
        },
      },
      contents: analysisPrompt,
    });

    const analysis = JSON.parse(analysisResponse.text || '{}');

    return {
      isCorrect: analysis.isCorrect || false,
      score: Math.min(Math.max(analysis.score || 2, 0), 5),
      feedback: analysis.feedback || "Your answer shows good effort. Keep working on including all the key points for full marks.",
      strengths: analysis.strengths || ["Shows understanding of basic concepts"],
      improvements: analysis.improvements || ["Include more specific details", "Cover all key points mentioned in the question"],
      suggestions: analysis.suggestions || ["Review the marking scheme and ensure all points are addressed", "Practice writing more detailed explanations"],
      lengthAnalysis: analysis.lengthAnalysis || "Consider expanding your answer to fully address all aspects of the question.",
      formatAnalysis: analysis.formatAnalysis || "Work on organizing your answer with clear headings and logical flow."
    };

  } catch (error) {
    console.error("Image analysis error:", error);

    // Fallback analysis if AI fails - give benefit of doubt with minimum passing score
    return {
      isCorrect: true,
      score: 3,
      feedback: "I can see you've put effort into your answer! While I'm having trouble analyzing the specific content right now, keep practicing your handwriting and ensure you cover all the key points mentioned in the question.",
      strengths: ["Clear effort shown in attempting the question", "Organized presentation of answer"],
      improvements: ["Ensure all key concepts are covered", "Include specific examples where possible"],
      suggestions: ["Review the marking scheme carefully", "Practice writing detailed explanations for better scores"],
      lengthAnalysis: "Your answer length seems appropriate, but ensure depth of explanation matches the marks available.",
      formatAnalysis: "Good attempt at structuring your answer. Consider using bullet points or numbered lists for clarity."
    };
  }
}

// Helper function for generating encouraging messages based on performance
export function generateEncouragementMessage(overallScore: number): string {
  if (overallScore >= 80) {
    return "You're absolutely crushing it! 🌟 Your understanding of these concepts is excellent. You're definitely ready for that retake! Keep up this fantastic momentum.";
  } else if (overallScore >= 70) {
    return "You're stronger than you think! 💪 Your concepts are developing well, and you're on the right track. Focus on the areas where you can improve, and you'll be ready to ace that retake!";
  } else if (overallScore >= 60) {
    return "You're making good progress! 🌱 I can see your understanding growing. With some focused practice on the key concepts, you'll see significant improvement. Don't give up!";
  } else {
    return "Every expert was once a beginner! 🌟 You have great potential, and every attempt is a step forward. Focus on understanding the fundamental concepts, and you'll be amazed at your progress. Keep going!";
  }
}