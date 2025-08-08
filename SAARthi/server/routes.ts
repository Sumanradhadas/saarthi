import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { analyzeMCQAnswer, analyzeImageAnswer } from "./services/gemini";
import { insertQuestionResponseSchema, insertTestSessionSchema } from "@shared/schema";
import { z } from "zod";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create new test session
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertTestSessionSchema.parse(req.body);
      const session = await storage.createTestSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  // Update test session
  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const session = await storage.updateTestSession(id, updates);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Failed to update session" });
    }
  });

  // Submit MCQ answer
  app.post("/api/questions/mcq", async (req, res) => {
    try {
      const { questionId, answer, sessionId, correctAnswer, explanation } = req.body;
      
      const isCorrect = answer === correctAnswer;
      const aiScore = isCorrect ? 1 : 0;
      
      // Get AI feedback
      const aiFeedback = await analyzeMCQAnswer({
        questionId,
        userAnswer: answer,
        correctAnswer,
        isCorrect,
        explanation
      });

      const responseData = insertQuestionResponseSchema.parse({
        sessionId,
        questionId,
        questionType: 'mcq',
        userAnswer: answer,
        aiScore,
        aiFeedback,
        isCorrect
      });

      const response = await storage.createQuestionResponse(responseData);
      res.json({ ...response, feedback: aiFeedback, isCorrect });
    } catch (error) {
      console.error("MCQ submission error:", error);
      res.status(500).json({ error: "Failed to process MCQ answer" });
    }
  });

  // Submit image answer (supports multiple images)
  app.post("/api/questions/image", upload.array('images', 5), async (req, res) => {
    try {
      const { questionId, sessionId, markingScheme } = req.body;
      const imageFiles = req.files as Express.Multer.File[];

      if (!imageFiles || imageFiles.length === 0) {
        return res.status(400).json({ error: "No images provided" });
      }

      // Process the first image (could be enhanced to analyze multiple)
      const primaryFile = imageFiles[0];
      
      // Image is already compressed from frontend, convert to base64 for analysis
      const imageBase64 = primaryFile.buffer.toString('base64');
      
      // Get AI analysis
      const analysis = await analyzeImageAnswer({
        questionId,
        imageBase64,
        markingScheme: JSON.parse(markingScheme || '{}')
      });

      const isCorrect = analysis.score >= 3; // Consider 3/5 or above as correct
      const finalScore = isCorrect ? analysis.score : 0; // Give 0 marks for incorrect answers
      
      const responseData = insertQuestionResponseSchema.parse({
        sessionId,
        questionId,
        questionType: 'image_upload',
        imageUrl: `data:${primaryFile.mimetype};base64,${imageBase64}`,
        aiScore: finalScore,
        aiFeedback: analysis.feedback,
        isCorrect: isCorrect
      });

      const response = await storage.createQuestionResponse(responseData);
      res.json({ ...response, analysis });
    } catch (error) {
      console.error("Image submission error:", error);
      res.status(500).json({ error: "Failed to process image answer" });
    }
  });

  // Get session responses
  app.get("/api/sessions/:id/responses", async (req, res) => {
    try {
      const { id } = req.params;
      const responses = await storage.getSessionResponses(id);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch responses" });
    }
  });

  // Get test questions
  app.get("/api/questions", async (req, res) => {
    try {
      // This would normally come from a database or external source
      // For now, we'll return the static questions structure
      res.json({ message: "Questions are loaded client-side" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
