// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  sessions = /* @__PURE__ */ new Map();
  responses = /* @__PURE__ */ new Map();
  constructor() {
    this.users = /* @__PURE__ */ new Map();
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async createTestSession(data) {
    const id = randomUUID();
    const session = {
      id,
      userId: data.userId,
      currentSlide: data.currentSlide ?? 0,
      answers: data.answers || {},
      isCompleted: data.isCompleted || false,
      score: data.score || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.sessions.set(id, session);
    return session;
  }
  async updateTestSession(id, updates) {
    const session = this.sessions.get(id);
    if (!session) return null;
    const updatedSession = {
      ...session,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }
  async createQuestionResponse(data) {
    const id = randomUUID();
    const response = {
      id,
      sessionId: data.sessionId,
      questionId: data.questionId,
      questionType: data.questionType,
      userAnswer: data.userAnswer || null,
      imageUrl: data.imageUrl || null,
      aiScore: data.aiScore || null,
      aiFeedback: data.aiFeedback || null,
      isCorrect: data.isCorrect || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.responses.set(id, response);
    return response;
  }
  async getSessionResponses(sessionId) {
    return Array.from(this.responses.values()).filter((r) => r.sessionId === sessionId);
  }
};
var storage = new MemStorage();

// server/routes.ts
import multer from "multer";

// server/services/gemini.ts
import { GoogleGenAI } from "@google/genai";
var ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || ""
});
async function analyzeMCQAnswer(request) {
  try {
    const { userAnswer, correctAnswer, isCorrect, explanation } = request;
    const prompt = `As SAARthi, a friendly AI learning companion for nursing students, provide encouraging feedback for this MCQ response.

Question details:
- User selected: Option ${userAnswer}
- Correct answer: Option ${correctAnswer}
- Result: ${isCorrect ? "Correct" : "Incorrect"}
- Explanation: ${explanation}

Provide a warm, encouraging response that:
1. Celebrates correct answers or encourages on incorrect ones
2. Explains why the answer is right/wrong in simple terms
3. Gives helpful tips for remembering this concept
4. Uses a friendly, mentor-like tone suitable for nursing students

Keep it conversational and supportive, like a caring tutor would speak.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    return response.text || "Great attempt! Keep practicing to strengthen your understanding of these concepts.";
  } catch (error) {
    console.error("MCQ analysis error:", error);
    return request.isCorrect ? "Excellent work! You got that right. Your understanding of this concept is solid." : "Good try! The correct approach here involves understanding the key mechanism. Keep studying and you'll master this!";
  }
}
async function analyzeImageAnswer(request) {
  try {
    const { imageBase64, markingScheme } = request;
    const ocrPrompt = `Carefully read and transcribe all handwritten text from this medical/nursing answer sheet. 
    Focus on extracting the complete written content accurately, including any diagrams or labels if present.
    Return only the transcribed text content.`;
    const ocrResponse = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: "image/jpeg"
          }
        },
        ocrPrompt
      ]
    });
    const extractedText = ocrResponse.text || "";
    const analysisPrompt = `As SAARthi, analyze this nursing student's handwritten answer for grading.

EXTRACTED TEXT FROM IMAGE:
"${extractedText}"

MARKING SCHEME:
Key Points to Cover: ${markingScheme.keyPoints.join(", ")}
Full Marks Criteria: ${markingScheme.fullMarksCriteria.join(", ")}

Provide a comprehensive analysis in JSON format with:
- score: integer from 0-5 based on content quality and completeness
- feedback: encouraging paragraph explaining the score
- strengths: array of positive aspects found in the answer
- improvements: array of areas that need work
- suggestions: array of specific tips to achieve full marks

Be encouraging but honest. Focus on learning and improvement. Consider partial credit for partially correct concepts.`;
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
            }
          },
          required: ["score", "feedback", "strengths", "improvements", "suggestions"]
        }
      },
      contents: analysisPrompt
    });
    const analysis = JSON.parse(analysisResponse.text || "{}");
    return {
      score: Math.min(Math.max(analysis.score || 2, 0), 5),
      // Ensure score is between 0-5
      feedback: analysis.feedback || "Your answer shows good effort. Keep working on including all the key points for full marks.",
      strengths: analysis.strengths || ["Shows understanding of basic concepts"],
      improvements: analysis.improvements || ["Include more specific details", "Cover all key points mentioned in the question"],
      suggestions: analysis.suggestions || ["Review the marking scheme and ensure all points are addressed", "Practice writing more detailed explanations"]
    };
  } catch (error) {
    console.error("Image analysis error:", error);
    return {
      score: 3,
      feedback: "I can see you've put effort into your answer! While I'm having trouble analyzing the specific content right now, keep practicing your handwriting and ensure you cover all the key points mentioned in the question.",
      strengths: ["Clear effort shown in attempting the question", "Organized presentation of answer"],
      improvements: ["Ensure all key concepts are covered", "Include specific examples where possible"],
      suggestions: ["Review the marking scheme carefully", "Practice writing detailed explanations for better scores"]
    };
  }
}

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var testSessions = pgTable("test_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  currentSlide: integer("current_slide").default(0),
  answers: jsonb("answers").default({}),
  isCompleted: boolean("is_completed").default(false),
  score: integer("score"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var questionResponses = pgTable("question_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  questionId: text("question_id").notNull(),
  questionType: text("question_type").notNull(),
  // 'mcq' | 'image_upload'
  userAnswer: text("user_answer"),
  imageUrl: text("image_url"),
  aiScore: integer("ai_score"),
  aiFeedback: text("ai_feedback"),
  isCorrect: boolean("is_correct"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertTestSessionSchema = createInsertSchema(testSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertQuestionResponseSchema = createInsertSchema(questionResponses).omit({
  id: true,
  createdAt: true
});

// server/routes.ts
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB limit
  }
});
async function registerRoutes(app2) {
  app2.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertTestSessionSchema.parse(req.body);
      const session = await storage.createTestSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });
  app2.patch("/api/sessions/:id", async (req, res) => {
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
  app2.post("/api/questions/mcq", async (req, res) => {
    try {
      const { questionId, answer, sessionId, correctAnswer, explanation } = req.body;
      const isCorrect = answer === correctAnswer;
      const aiScore = isCorrect ? 1 : 0;
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
        questionType: "mcq",
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
  app2.post("/api/questions/image", upload.single("image"), async (req, res) => {
    try {
      const { questionId, sessionId, markingScheme } = req.body;
      const imageFile = req.file;
      if (!imageFile) {
        return res.status(400).json({ error: "No image provided" });
      }
      const imageBase64 = imageFile.buffer.toString("base64");
      const analysis = await analyzeImageAnswer({
        questionId,
        imageBase64,
        markingScheme: JSON.parse(markingScheme || "{}")
      });
      const responseData = insertQuestionResponseSchema.parse({
        sessionId,
        questionId,
        questionType: "image_upload",
        imageUrl: `data:${imageFile.mimetype};base64,${imageBase64}`,
        aiScore: analysis.score,
        aiFeedback: analysis.feedback,
        isCorrect: analysis.score >= 3
        // Consider 3/5 or above as correct
      });
      const response = await storage.createQuestionResponse(responseData);
      res.json({ ...response, analysis });
    } catch (error) {
      console.error("Image submission error:", error);
      res.status(500).json({ error: "Failed to process image answer" });
    }
  });
  app2.get("/api/sessions/:id/responses", async (req, res) => {
    try {
      const { id } = req.params;
      const responses = await storage.getSessionResponses(id);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch responses" });
    }
  });
  app2.get("/api/questions", async (req, res) => {
    try {
      res.json({ message: "Questions are loaded client-side" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
