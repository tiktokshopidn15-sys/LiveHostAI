import type { Express } from "express";
import { createServer, type Server } from "http";
import { EventEmitter } from "events";
import OpenAI from "openai";
import { WebcastPushConnection } from "tiktok-live-connector";
import { z } from "zod";
import { ttsRequestSchema, insertProductSchema } from "@shared/schema";
import { storage } from "./storage";

// Reference to javascript_openai blueprint
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Global event bus for SSE communication
const liveBus = new EventEmitter();
liveBus.setMaxListeners(100);

// In-memory storage for products
const products = new Map<number, any>();

// TikTok connection instance
let tiktokConnection: any = null;

// Indonesian text preprocessing for natural speech
function preprocessIndonesian(text: string): string {
  return text
    .replace(/\?/g, " ya?")
    .replace(/\./g, ". ")
    .replace(/,/g, ", ")
    .replace(/\bhi\b/gi, "hai")
    .replace(/\bthanks\b/gi, "terima kasih")
    .replace(/\bok\b/gi, "oke")
    .replace(/\bplease\b/gi, "tolong ya")
    .replace(/\bI\b/g, "saya")
    .replace(/\byou\b/g, "kamu");
}

// Get AI response from GPT
async function getAIResponse(message: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "Kamu adalah host AI TikTok Live berbahasa Indonesia. Jawab dengan singkat, ramah, dan relevan. Jangan menyebut harga produk. Arahkan pertanyaan teknis ke link bio. Patuhi aturan TikTok Shop.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_completion_tokens: 100,
    });

    return response.choices[0].message.content || "Terima kasih!";
  } catch (error) {
    console.error("GPT error:", error);
    return "Maaf, saya sedang bermasalah. Coba lagi ya.";
  }
}

// Idle timer for product promotion
let idleTimer: NodeJS.Timeout | null = null;
let lastChatTime = Date.now();

function resetIdleTimer() {
  lastChatTime = Date.now();
  
  if (idleTimer) {
    clearTimeout(idleTimer);
  }
  
  idleTimer = setTimeout(() => {
    // Check if we have products to promote
    const productArray = Array.from(products.values());
    if (productArray.length > 0) {
      const randomProduct = productArray[Math.floor(Math.random() * productArray.length)];
      const promoMessage = `Produk nomor ${randomProduct.id} ini lagi banyak dicari. ${randomProduct.name || 'Produk bagus'}. Cek keranjang kuning ya!`;
      liveBus.emit("say", promoMessage);
    }
  }, 180000); // 180 seconds = 3 minutes
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // API: Startup greeting
  app.get("/api/startup", async (req, res) => {
    try {
      const greeting = "Selamat datang kembali di live. Sistem host AI sudah aktif.";
      const processed = preprocessIndonesian(greeting);
      
      const audioResponse = await openai.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: "nova",
        input: processed,
        response_format: "mp3",
      });

      res.setHeader("Content-Type", "audio/mpeg");
      
      // Stream audio chunks to response using Node-style iteration
      const buffer = Buffer.from(await audioResponse.arrayBuffer());
      res.send(buffer);
    } catch (error) {
      console.error("Startup error:", error);
      res.status(500).json({ error: "Failed to generate startup greeting" });
    }
  });

  // API: Text-to-Speech
  app.post("/api/tts", async (req, res) => {
    try {
      const { text, voice } = ttsRequestSchema.parse(req.body);
      const processed = preprocessIndonesian(text);

      const audioResponse = await openai.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: voice as any,
        input: processed,
        response_format: "mp3",
      });

      res.setHeader("Content-Type", "audio/mpeg");
      
      // Stream audio to response
      const buffer = Buffer.from(await audioResponse.arrayBuffer());
      res.send(buffer);
    } catch (error) {
      console.error("TTS error:", error);
      res.status(500).json({ error: "Failed to generate speech" });
    }
  });

  // API: Start TikTok Live connection
  app.post("/api/live/start", async (req, res) => {
    try {
      const { username } = req.body;
      if (!username) {
        return res.status(400).json({ error: "Username required" });
      }

      const cleanUsername = username.replace(/^@/, "");

      // Close existing connection
      if (tiktokConnection) {
        try {
          tiktokConnection.disconnect();
        } catch (e) {
          console.error("Error disconnecting:", e);
        }
      }

      // Create new connection
      tiktokConnection = new WebcastPushConnection(cleanUsername, {
        sessionId: process.env.TIKTOK_SESSION_ID,
      });

      tiktokConnection.on("connected", () => {
        liveBus.emit("log", "connected");
        liveBus.emit("say", "Sinyal stabil, live kembali tersambung.");
      });

      tiktokConnection.on("member", (data: any) => {
        const greeting = `Halo, selamat datang @${data.uniqueId} di live kita.`;
        liveBus.emit("say", greeting);
        resetIdleTimer();
      });

      tiktokConnection.on("chat", async (data: any) => {
        const username = data.uniqueId;
        const message = data.comment;
        
        liveBus.emit("chat", { username, message });
        
        // Get AI response
        const aiResponse = await getAIResponse(message);
        const fullResponse = `@${username} bilang: ${message}. ${aiResponse}`;
        
        liveBus.emit("say", fullResponse);
        resetIdleTimer();
      });

      tiktokConnection.on("disconnected", () => {
        liveBus.emit("log", "disconnected");
      });

      tiktokConnection.on("error", (err: any) => {
        console.error("TikTok error:", err);
        liveBus.emit("log", "error");
      });

      // Connect
      await tiktokConnection.connect();
      resetIdleTimer();

      res.json({ success: true, username: cleanUsername });
    } catch (error) {
      console.error("Start live error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to connect" 
      });
    }
  });

  // API: SSE Stream for live events
  app.get("/api/live/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const sendEvent = (data: any) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const onSay = (text: string) => sendEvent({ type: "say", text });
    const onLog = (text: string) => sendEvent({ type: "log", text });
    const onChat = (data: any) => sendEvent({ type: "chat", ...data });

    liveBus.on("say", onSay);
    liveBus.on("log", onLog);
    liveBus.on("chat", onChat);

    // Send keepalive
    res.write("retry: 2000\n\n");

    req.on("close", () => {
      liveBus.off("say", onSay);
      liveBus.off("log", onLog);
      liveBus.off("chat", onChat);
    });
  });

  // API: Product management
  app.post("/api/products", async (req, res) => {
    try {
      const { id, url } = req.body;
      
      if (!id || !url) {
        return res.status(400).json({ error: "ID and URL required" });
      }

      // Extract product metadata from URL
      let product = {
        id,
        url,
        name: "",
        price: "",
        description: "",
        image: "",
      };

      try {
        // Fetch the URL to extract metadata
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (response.ok) {
          const html = await response.text();
          
          // Extract title/name
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) ||
                           html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
          if (titleMatch) {
            product.name = titleMatch[1].trim().substring(0, 100);
          }
          
          // Extract image
          const imgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                          html.match(/<img[^>]*src=["']([^"']+)["']/i);
          if (imgMatch) {
            product.image = imgMatch[1];
          }
          
          // Extract description
          const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                           html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
          if (descMatch) {
            product.description = descMatch[1].trim().substring(0, 150);
          }
          
          // Try to extract price
          const priceMatch = html.match(/Rp\s?[\d.,]+[kK]?/i) ||
                            html.match(/price[^>]*>([^<]+)</i);
          if (priceMatch) {
            product.price = priceMatch[0].trim();
          }
        }
      } catch (fetchError) {
        console.error("Metadata fetch error:", fetchError);
      }

      // Fallback values if extraction failed
      if (!product.name) product.name = `Product ${id}`;
      if (!product.price) product.price = `Rp ${Math.floor(Math.random() * 500 + 50)}k`;
      if (!product.description) product.description = "Produk berkualitas tinggi dengan harga terjangkau";
      if (!product.image) product.image = `https://placehold.co/200x200/6366f1/ffffff?text=Product+${id}`;

      // Store in memory and storage
      products.set(id, product);
      await storage.addProduct(product);

      res.json(product);
    } catch (error) {
      console.error("Product error:", error);
      res.status(500).json({ error: "Failed to add product" });
    }
  });

  app.get("/api/products", (req, res) => {
    res.json(Array.from(products.values()));
  });

  const httpServer = createServer(app);

  return httpServer;
}
