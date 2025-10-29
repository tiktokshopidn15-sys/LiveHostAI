import { z } from "zod";

// Product schema for the showcase
export const productSchema = z.object({
  id: z.number(),
  url: z.string().url(),
  name: z.string().optional(),
  price: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const insertProductSchema = productSchema.omit({ id: true });

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Config schema for app settings
export const configSchema = z.object({
  developerMode: z.boolean(),
  tokenLimit: z.number(),
  tokensUsed: z.number(),
  voice: z.enum(["nova", "alloy", "echo", "coral", "verse", "flow"]),
});

export type Config = z.infer<typeof configSchema>;

// Chat log entry
export const chatLogSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  username: z.string().optional(),
  message: z.string(),
  type: z.enum(["system", "user", "ai"]),
});

export type ChatLog = z.infer<typeof chatLogSchema>;

// Live connection status
export type LiveStatus = "idle" | "connecting" | "online" | "reconnecting" | "error";

// TTS request
export const ttsRequestSchema = z.object({
  text: z.string(),
  voice: z.enum(["nova", "alloy", "echo", "coral", "verse", "flow"]),
});

export type TTSRequest = z.infer<typeof ttsRequestSchema>;

// Subscription plans
export const subscriptionPlanSchema = z.object({
  name: z.string(),
  duration: z.enum(["daily", "weekly", "monthly"]),
  tokens: z.number(),
  price: z.number(),
});

export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;
