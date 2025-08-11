import { type User, type InsertUser, type MicroApp, type InsertMicroApp, type Transaction, type InsertTransaction, type AiMessage, type InsertAiMessage, type PlatformStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserReputation(id: string, score: number): Promise<User | undefined>;

  // Micro-app methods
  getMicroApps(): Promise<MicroApp[]>;
  getMicroApp(id: string): Promise<MicroApp | undefined>;
  createMicroApp(microApp: InsertMicroApp): Promise<MicroApp>;
  incrementTransactionCount(id: string): Promise<void>;

  // Transaction methods
  getTransactionsByUserId(userId: string): Promise<Transaction[]>;
  getRecentTransactions(limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // AI message methods
  createAiMessage(message: InsertAiMessage): Promise<AiMessage>;
  getAiMessagesByUserId(userId: string): Promise<AiMessage[]>;

  // Platform stats
  getPlatformStats(): Promise<PlatformStats>;
  updatePlatformStats(stats: Partial<PlatformStats>): Promise<PlatformStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private microApps: Map<string, MicroApp>;
  private transactions: Map<string, Transaction>;
  private aiMessages: Map<string, AiMessage>;
  private platformStats: PlatformStats;

  constructor() {
    this.users = new Map();
    this.microApps = new Map();
    this.transactions = new Map();
    this.aiMessages = new Map();
    
    this.platformStats = {
      id: randomUUID(),
      activeMicroApps: 6,
      transactionsToday: 47,
      dataNodes: 1247,
      contributors: 2856,
      updatedAt: new Date(),
    };

    // Initialize with default user
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    // Create default user
    const defaultUser: User = {
      id: randomUUID(),
      name: "Alex Chen",
      username: "alex.chen",
      walletAddress: "0x1a2b...c3d4",
      reputationScore: 87.5,
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Create default micro-apps
    const defaultMicroApps: MicroApp[] = [
      {
        id: randomUUID(),
        name: "Customer Hub",
        description: "Manage customer relationships, contacts, and communication history with AI-powered insights.",
        version: "v2.1.0",
        apiSchema: "customer.*",
        icon: "users",
        color: "from-blue-500 to-blue-600",
        isActive: true,
        transactionCount: 47,
        rating: 4.8,
        reviewCount: 127,
        pricePerCall: "0.0003 ETH",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Smart Invoicing",
        description: "Create, send, and track invoices with automated payment reminders and blockchain verification.",
        version: "v1.8.2",
        apiSchema: "invoice.*",
        icon: "file-invoice-dollar",
        color: "from-workbindr-emerald to-green-600",
        isActive: true,
        transactionCount: 23,
        rating: 4.9,
        reviewCount: 89,
        pricePerCall: "0.0001 ETH",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Task Flow",
        description: "Organize projects, assign tasks, and track progress with AI-powered productivity insights.",
        version: "v3.0.1",
        apiSchema: "task.*",
        icon: "tasks",
        color: "from-workbindr-purple to-purple-600",
        isActive: true,
        transactionCount: 92,
        rating: 4.7,
        reviewCount: 156,
        pricePerCall: "0.0002 ETH",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "AI Assistant",
        description: "Your personal AI assistant trained on your business data for intelligent automation and insights.",
        version: "v4.2.0",
        apiSchema: "OpenAI GPT-4",
        icon: "robot",
        color: "from-workbindr-cyan to-teal-600",
        isActive: true,
        transactionCount: 156,
        rating: 5.0,
        reviewCount: 234,
        pricePerCall: "0.001 ETH/query",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Analytics Hub",
        description: "Comprehensive business intelligence with real-time dashboards and predictive analytics.",
        version: "v2.5.0",
        apiSchema: "analytics.*",
        icon: "chart-line",
        color: "from-workbindr-amber to-orange-600",
        isActive: true,
        transactionCount: 31,
        rating: 4.6,
        reviewCount: 78,
        pricePerCall: "0.0005 ETH/report",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Doc Manager",
        description: "Secure document storage, collaboration, and version control with blockchain verification.",
        version: "v1.9.0",
        apiSchema: "IPFS Storage",
        icon: "file-alt",
        color: "from-indigo-500 to-indigo-600",
        isActive: true,
        transactionCount: 78,
        rating: 4.4,
        reviewCount: 92,
        pricePerCall: "0.0001 ETH/doc",
        createdAt: new Date(),
      },
    ];

    defaultMicroApps.forEach(app => {
      this.microApps.set(app.id, app);
    });

    // Create some sample transactions
    const sampleTransactions: Transaction[] = [
      {
        id: randomUUID(),
        userId: defaultUser.id,
        microAppId: Array.from(this.microApps.values())[0].id,
        description: "Customer.add API call",
        amount: "0.0003 ETH",
        status: "Confirmed",
        transactionHash: "0x1a2b3c4d...",
        createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      },
      {
        id: randomUUID(),
        userId: defaultUser.id,
        microAppId: null,
        description: "Reputation reward received",
        amount: "+2.5 WBR",
        status: "Confirmed",
        transactionHash: "0x5e6f7g8h...",
        createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      },
      {
        id: randomUUID(),
        userId: defaultUser.id,
        microAppId: Array.from(this.microApps.values())[2].id,
        description: "Task.create API call",
        amount: "0.0001 ETH",
        status: "Confirmed",
        transactionHash: "0x9i0j1k2l...",
        createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      },
    ];

    sampleTransactions.forEach(tx => {
      this.transactions.set(tx.id, tx);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      reputationScore: insertUser.reputationScore ?? 0
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserReputation(id: string, score: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      user.reputationScore = score;
      this.users.set(id, user);
      return user;
    }
    return undefined;
  }

  async getMicroApps(): Promise<MicroApp[]> {
    return Array.from(this.microApps.values());
  }

  async getMicroApp(id: string): Promise<MicroApp | undefined> {
    return this.microApps.get(id);
  }

  async createMicroApp(insertMicroApp: InsertMicroApp): Promise<MicroApp> {
    const id = randomUUID();
    const microApp: MicroApp = { 
      ...insertMicroApp, 
      id, 
      createdAt: new Date(),
      isActive: insertMicroApp.isActive ?? true,
      transactionCount: insertMicroApp.transactionCount ?? 0,
      rating: insertMicroApp.rating ?? 0,
      reviewCount: insertMicroApp.reviewCount ?? 0
    };
    this.microApps.set(id, microApp);
    return microApp;
  }

  async incrementTransactionCount(id: string): Promise<void> {
    const microApp = this.microApps.get(id);
    if (microApp) {
      microApp.transactionCount = (microApp.transactionCount || 0) + 1;
      this.microApps.set(id, microApp);
    }
  }

  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(tx => tx.userId === userId);
  }

  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      createdAt: new Date(),
      microAppId: insertTransaction.microAppId ?? null,
      transactionHash: insertTransaction.transactionHash ?? null
    };
    this.transactions.set(id, transaction);
    
    // Update platform stats
    this.platformStats.transactionsToday = (this.platformStats.transactionsToday ?? 0) + 1;
    
    return transaction;
  }

  async createAiMessage(insertMessage: InsertAiMessage): Promise<AiMessage> {
    const id = randomUUID();
    const message: AiMessage = { ...insertMessage, id, createdAt: new Date() };
    this.aiMessages.set(id, message);
    return message;
  }

  async getAiMessagesByUserId(userId: string): Promise<AiMessage[]> {
    return Array.from(this.aiMessages.values())
      .filter(msg => msg.userId === userId)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }

  async getPlatformStats(): Promise<PlatformStats> {
    return this.platformStats;
  }

  async updatePlatformStats(stats: Partial<PlatformStats>): Promise<PlatformStats> {
    this.platformStats = { ...this.platformStats, ...stats, updatedAt: new Date() };
    return this.platformStats;
  }
}

export const storage = new MemStorage();
