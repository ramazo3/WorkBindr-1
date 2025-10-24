import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupSessionAndPassport } from "./sessionAuth";
import { setupGoogleAuth } from "./googleAuth";
import passport from "passport";
import { insertAiMessageSchema, insertTransactionSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "your-api-key"
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Google-only auth setup (Passport strategies)
  setupGoogleAuth();

  // Google OAuth routes
  app.get('/api/auth/google', (req, res, next) => {
    console.log('Initiating Google OAuth...');
    console.log('Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Present' : 'Missing');
    const host = req.get('host');
    const proto = (req.get('x-forwarded-proto') || req.protocol || 'https') as string;
    const callbackURL = `${proto}://${host}/api/auth/google/callback`;
    console.log('Request host:', host);
    console.log('Computed Google callbackURL:', callbackURL);
    passport.authenticate('google', { 
      scope: ['profile', 'email'],
      accessType: 'offline',
      prompt: 'consent',
      callbackURL,
    })(req, res, next);
  });

  app.get('/api/auth/google/callback', 
    (req, res, next) => {
      console.log('Google OAuth callback received');
      console.log('Query params:', req.query);
      console.log('Full URL:', req.url);
      
      if (req.query.error) {
        console.error('Google OAuth error:', req.query.error);
        console.error('Error description:', req.query.error_description);
        return res.redirect('/?error=google_auth_failed');
      }
      next();
    },
    (req, res, next) => {
      const host = req.get('host');
      const proto = (req.get('x-forwarded-proto') || req.protocol || 'https') as string;
      const callbackURL = `${proto}://${host}/api/auth/google/callback`;
      console.log('Authenticating Google callback with URL:', callbackURL);
      const frontendUrl = process.env.FRONTEND_URL || '';
      const postLoginPath = process.env.POST_LOGIN_PATH || '/dashboard';
      const successRedirect = `${frontendUrl}${postLoginPath}` || '/dashboard';
      passport.authenticate('google', { 
        failureRedirect: `${frontendUrl}/?error=google_auth_failed`,
        successRedirect,
        callbackURL,
      })(req, res, next);
    }
  );

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      if (req.isAuthenticated && req.isAuthenticated() && req.user?.id) {
        return res.json(req.user);
      }
      return res.json(null);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Logout endpoints
    app.post('/api/auth/logout', (req: any, res, next) => {
        req.logout((err) => {
            if (err) {
                console.error("Error during req.logout:", err);
                // We can still try to destroy the session even if logout had an error
            }

            if (req.session) {
                req.session.destroy((destroyErr) => {
                    if (destroyErr) {
                        console.error("Error destroying session:", destroyErr);
                    }
                    // In either case, clear cookie and send response
                    res.clearCookie('connect.sid');
                    res.status(204).end();
                });
            } else {
                // No session to destroy
                res.clearCookie('connect.sid');
                res.status(204).end();
            }
        });
    });

    app.get('/api/logout', (req: any, res, next) => {
        req.logout((err) => {
            if (err) {
                console.error("Error during req.logout:", err);
            }

            if (req.session) {
                req.session.destroy((destroyErr) => {
                    if (destroyErr) {
                        console.error("Error destroying session:", destroyErr);
                    }
                    // In either case, clear cookie and redirect
                    res.clearCookie('connect.sid');
                    res.redirect('/');
                });
            } else {
                // No session to destroy
                res.clearCookie('connect.sid');
                res.redirect('/');
            }
        });
    });

  // Current user endpoint (for backward compatibility)
  app.get("/api/user/current", async (req: any, res) => {
    try {
      if (req.isAuthenticated && req.isAuthenticated() && req.user?.id) {
        const user = req.user;
        return res.json({
          id: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || "User",
          email: user.email,
          walletAddress: user.walletAddress || "Not Connected",
          reputationScore: user.reputationScore || 0
        });
      }

      // dev/demo fallback (optional)
      if (process.env.NODE_ENV !== 'production') {
        return res.json({
          id: "demo-user",
          name: "Alex Chen",
          email: "alex.chen@workbindr.com",
          walletAddress: "0x1a2b...c3d4",
          reputationScore: 87.5
        });
      }

      return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
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

  // Project Management endpoints
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to get projects" });
    }
  });

  app.get("/api/projects/:id/tasks", async (req, res) => {
    try {
      const { id } = req.params;
      const tasks = await storage.getTasksByProject(id);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to get project tasks" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const task = await storage.updateTask(id, updates);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  // Donor Management endpoints
  app.get("/api/donors", async (req, res) => {
    try {
      const donors = await storage.getDonors();
      res.json(donors);
    } catch (error) {
      res.status(500).json({ message: "Failed to get donors" });
    }
  });

  // Governance endpoints
  app.get("/api/governance/proposals", async (req, res) => {
    try {
      const proposals = await storage.getGovernanceProposals();
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Failed to get governance proposals" });
    }
  });

  app.post("/api/governance/proposals/:id/vote", async (req, res) => {
    try {
      const { id } = req.params;
      const { vote, userId } = req.body;
      
      // Get user to use their reputation score as voting weight
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const proposal = await storage.voteOnProposal(id, vote, user.reputationScore || 0);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      res.json(proposal);
    } catch (error) {
      res.status(500).json({ message: "Failed to vote on proposal" });
    }
  });

  // Developer settings endpoints
  app.get("/api/developer/settings/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const settings = await storage.getDeveloperSettings(userId);
      res.json(settings || { preferredLLM: "gpt-4o", apiKeys: null });
    } catch (error) {
      res.status(500).json({ message: "Failed to get developer settings" });
    }
  });

  app.put("/api/developer/settings/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const settings = req.body;
      const updatedSettings = await storage.updateDeveloperSettings(userId, settings);
      res.json(updatedSettings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update developer settings" });
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
