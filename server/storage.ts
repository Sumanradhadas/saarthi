import { type User, type InsertUser, type TestSession, type InsertTestSession, type QuestionResponse, type InsertQuestionResponse } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createTestSession(data: InsertTestSession): Promise<TestSession>;
  updateTestSession(id: string, updates: Partial<TestSession>): Promise<TestSession | null>;
  createQuestionResponse(data: InsertQuestionResponse): Promise<QuestionResponse>;
  getSessionResponses(sessionId: string): Promise<QuestionResponse[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private sessions: Map<string, TestSession> = new Map();
  private responses: Map<string, QuestionResponse> = new Map();

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createTestSession(data: InsertTestSession): Promise<TestSession> {
    const id = randomUUID();
    const session: TestSession = {
      id,
      userId: data.userId,
      currentSlide: data.currentSlide ?? 0,
      answers: data.answers || {},
      isCompleted: data.isCompleted || false,
      score: data.score || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sessions.set(id, session);
    return session;
  }

  async updateTestSession(id: string, updates: Partial<TestSession>): Promise<TestSession | null> {
    const session = this.sessions.get(id);
    if (!session) return null;
    
    const updatedSession = {
      ...session,
      ...updates,
      updatedAt: new Date(),
    };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async createQuestionResponse(data: InsertQuestionResponse): Promise<QuestionResponse> {
    const id = randomUUID();
    const response: QuestionResponse = {
      id,
      sessionId: data.sessionId,
      questionId: data.questionId,
      questionType: data.questionType,
      userAnswer: data.userAnswer || null,
      imageUrl: data.imageUrl || null,
      aiScore: data.aiScore || null,
      aiFeedback: data.aiFeedback || null,
      isCorrect: data.isCorrect || null,
      createdAt: new Date(),
    };
    this.responses.set(id, response);
    return response;
  }

  async getSessionResponses(sessionId: string): Promise<QuestionResponse[]> {
    return Array.from(this.responses.values()).filter(r => r.sessionId === sessionId);
  }
}

export const storage = new MemStorage();
