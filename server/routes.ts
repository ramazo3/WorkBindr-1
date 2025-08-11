import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAiMessageSchema, insertTransactionSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "your-api-key"
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get current user (mock - in real app would be from auth)
  app.get("/api/user/current", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("alex.chen") || 
                   await storage.createUser({
                     name: "Alex Chen",
                     username: "alex.chen",
                     walletAddress: "0x1a2b...c3d4",
                     reputationScore: 87.5
                   });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get current user" });
    }
  });

  // Get all micro-apps
  app.get("/api/micro-apps", async (req, res) => {
    try {
      const microApps = await storage.getMicroApps();
      res.json(microApps);
    } catch (error) {
      res.status(500).json({ message: "Failed to get micro-apps" });
    }
  });

  // Get recent transactions
  app.get("/api/transactions/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const transactions = await storage.getRecentTransactions(limit);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recent transactions" });
    }
  });

  // Get platform stats
  app.get("/api/platform/stats", async (req, res) => {
    try {
      const stats = await storage.getPlatformStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get platform stats" });
    }
  });

  // Create transaction
  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedTransaction = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedTransaction);
      
      // Update micro-app transaction count if applicable
      if (transaction.microAppId) {
        await storage.incrementTransactionCount(transaction.microAppId);
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Failed to create transaction", error });
    }
  });

  // AI Assistant chat endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, userId } = req.body;
      
      if (!message || !userId) {
        return res.status(400).json({ message: "Message and userId are required" });
      }

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an AI assistant for WorkBindr, a decentralized business productivity platform. You help users with business tasks, provide insights about their micro-apps, and assist with workflow automation. Be helpful, professional, and knowledgeable about business processes."
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your request.";

      // Save the conversation
      const aiMessage = await storage.createAiMessage({
        userId,
        message,
        response
      });

      res.json({ response, messageId: aiMessage.id });
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ message: "Failed to process AI request" });
    }
  });

  // Update reputation score
  app.post("/api/user/:id/reputation", async (req, res) => {
    try {
      const { id } = req.params;
      const { score } = req.body;
      
      if (typeof score !== "number") {
        return res.status(400).json({ message: "Score must be a number" });
      }
      
      const user = await storage.updateUserReputation(id, score);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update reputation" });
    }
  });

  // Mock marketplace apps endpoint
  app.get("/api/marketplace", async (req, res) => {
    try {
      const marketplaceApps = [
        {
          id: "email-automation-pro",
          name: "Email Automation Pro",
          description: "Advanced email marketing and automation workflows with AI-powered personalization.",
          icon: "envelope",
          color: "from-red-500 to-red-600",
          rating: 4.8,
          reviewCount: 127,
          pricePerCall: "0.001 ETH/call",
          category: "Marketing"
        },
        {
          id: "advanced-reports",
          name: "Advanced Reports",
          description: "Generate comprehensive business reports with AI insights and predictive analytics.",
          icon: "chart-bar",
          color: "from-green-500 to-green-600",
          rating: 4.9,
          reviewCount: 89,
          pricePerCall: "0.002 ETH/report",
          category: "Analytics"
        }
      ];
      
      res.json(marketplaceApps);
    } catch (error) {
      res.status(500).json({ message: "Failed to get marketplace apps" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
