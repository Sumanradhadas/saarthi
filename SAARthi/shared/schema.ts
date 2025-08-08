import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const testSessions = pgTable("test_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  currentSlide: integer("current_slide").default(0),
  answers: jsonb("answers").default({}),
  isCompleted: boolean("is_completed").default(false),
  score: integer("score"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const questionResponses = pgTable("question_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  questionId: text("question_id").notNull(),
  questionType: text("question_type").notNull(), // 'mcq' | 'image_upload'
  userAnswer: text("user_answer"),
  imageUrl: text("image_url"),
  aiScore: integer("ai_score"),
  aiFeedback: text("ai_feedback"),
  isCorrect: boolean("is_correct"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTestSessionSchema = createInsertSchema(testSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuestionResponseSchema = createInsertSchema(questionResponses).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type TestSession = typeof testSessions.$inferSelect;
export type QuestionResponse = typeof questionResponses.$inferSelect;
export type InsertTestSession = z.infer<typeof insertTestSessionSchema>;
export type InsertQuestionResponse = z.infer<typeof insertQuestionResponseSchema>;
