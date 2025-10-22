import { type User, type InsertUser, type UpsertUser, type MicroApp, type InsertMicroApp, type Transaction, type InsertTransaction, type AiMessage, type InsertAiMessage, type PlatformStats, type Project, type InsertProject, type Task, type InsertTask, type Donor, type InsertDonor, type GovernanceProposal, type InsertGovernanceProposal, type DeveloperSettings, type InsertDeveloperSettings } from "@shared/schema";
import { randomUUID } from "crypto";
import { dbStorage } from "./dbStorage";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
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

  // Project methods
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined>;

  // Task methods
  getTasks(): Promise<Task[]>;
  getTasksByProject(projectId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined>;

  // Donor methods
  getDonors(): Promise<Donor[]>;
  getDonor(id: string): Promise<Donor | undefined>;
  createDonor(donor: InsertDonor): Promise<Donor>;
  updateDonor(id: string, updates: Partial<Donor>): Promise<Donor | undefined>;

  // Governance methods
  getGovernanceProposals(): Promise<GovernanceProposal[]>;
  getGovernanceProposal(id: string): Promise<GovernanceProposal | undefined>;
  createGovernanceProposal(proposal: InsertGovernanceProposal): Promise<GovernanceProposal>;
  voteOnProposal(id: string, vote: 'for' | 'against', voterReputationScore: number): Promise<GovernanceProposal | undefined>;

  // Developer settings
  getDeveloperSettings(userId: string): Promise<DeveloperSettings | undefined>;
  updateDeveloperSettings(userId: string, settings: Partial<InsertDeveloperSettings>): Promise<DeveloperSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private microApps: Map<string, MicroApp>;
  private transactions: Map<string, Transaction>;
  private aiMessages: Map<string, AiMessage>;
  private platformStats: PlatformStats;
  private projects: Map<string, Project>;
  private tasks: Map<string, Task>;
  private donors: Map<string, Donor>;
  private governanceProposals: Map<string, GovernanceProposal>;
  private developerSettings: Map<string, DeveloperSettings>;

  constructor() {
    this.users = new Map();
    this.microApps = new Map();
    this.transactions = new Map();
    this.aiMessages = new Map();
    this.projects = new Map();
    this.tasks = new Map();
    this.donors = new Map();
    this.governanceProposals = new Map();
    this.developerSettings = new Map();
    
    this.platformStats = {
      id: randomUUID(),
      activeMicroApps: 6,
      transactionsToday: 47,
      dataNodes: 1247,
      contributors: 2856,
      updatedAt: new Date(),
    };

    // Initialize with default data
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    // Create default user (for development only)
    const defaultUser: User = {
      id: randomUUID(),
      email: "alex.chen@workbindr.com",
      firstName: "Alex",
      lastName: "Chen",
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      walletAddress: "0x1a2b...c3d4",
      reputationScore: 87.5,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      {
        id: randomUUID(),
        name: "Donor Manager",
        description: "Track donations, manage donor relationships, and analyze contribution patterns with blockchain transparency.",
        version: "v2.0.1",
        apiSchema: "donor.*",
        icon: "heart",
        color: "from-pink-500 to-pink-600",
        isActive: true,
        transactionCount: 18,
        rating: 4.7,
        reviewCount: 52,
        pricePerCall: "0.0001 ETH/record",
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

    // Create sample projects
    const sampleProjects: Project[] = [
      {
        id: randomUUID(),
        name: "WorkBindr 2.0 MVP",
        description: "Development of the decentralized business platform MVP",
        status: "In Progress",
        priority: "High",
        progress: 75,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "AI Integration Enhancement",
        description: "Improve AI assistant capabilities and add multi-LLM support",
        status: "Planning",
        priority: "Medium",
        progress: 10,
        createdAt: new Date(),
      }
    ];

    sampleProjects.forEach(project => {
      this.projects.set(project.id, project);
    });

    // Create sample tasks
    const sampleTasks: Task[] = [
      {
        id: randomUUID(),
        projectId: sampleProjects[0].id,
        title: "Implement Kanban Board UI",
        description: "Create a draggable task management interface",
        status: "To Do",
        assignee: "Alex Chen",
        priority: "High",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        projectId: sampleProjects[0].id,
        title: "Add Web3 Wallet Integration",
        description: "Implement wallet connection for governance features",
        status: "In Progress",
        assignee: "Alex Chen",
        priority: "High",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        projectId: sampleProjects[1].id,
        title: "Research Multi-LLM Architecture",
        description: "Evaluate different AI model integration approaches",
        status: "Done",
        assignee: "Alex Chen",
        priority: "Medium",
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        createdAt: new Date(),
      }
    ];

    sampleTasks.forEach(task => {
      this.tasks.set(task.id, task);
    });

    // Create sample donors
    const sampleDonors: Donor[] = [
      {
        id: randomUUID(),
        name: "TechCorp Foundation",
        email: "grants@techcorp.org",
        totalDonated: "$50,000",
        lastDonation: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        donationCount: 3,
        status: "Active",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Innovation Fund LLC",
        email: "info@innovationfund.com",
        totalDonated: "$25,000",
        lastDonation: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        donationCount: 2,
        status: "Active",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Sarah Mitchell",
        email: "sarah.mitchell@email.com",
        totalDonated: "$5,000",
        lastDonation: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        donationCount: 5,
        status: "Active",
        createdAt: new Date(),
      }
    ];

    sampleDonors.forEach(donor => {
      this.donors.set(donor.id, donor);
    });

    // Create sample governance proposals
    const sampleProposals: GovernanceProposal[] = [
      {
        id: randomUUID(),
        title: "Implement Multi-Chain Support",
        description: "Proposal to expand WorkBindr to support Ethereum, Polygon, and Solana networks for broader accessibility and reduced transaction costs.",
        proposer: "Alex Chen",
        status: "Active",
        votesFor: 267,
        votesAgainst: 45,
        totalVotes: 312,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Developer Grant Program",
        description: "Allocate 100,000 WBR tokens for a quarterly developer grant program to incentivize high-quality micro-app development.",
        proposer: "Community DAO",
        status: "Active",
        votesFor: 156,
        votesAgainst: 89,
        totalVotes: 245,
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Update Fee Structure",
        description: "Reduce platform fees from 0.5% to 0.3% for all micro-app transactions to increase developer adoption.",
        proposer: "Developer Coalition",
        status: "Passed",
        votesFor: 423,
        votesAgainst: 67,
        totalVotes: 490,
        endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (ended)
        createdAt: new Date(),
      }
    ];

    sampleProposals.forEach(proposal => {
      this.governanceProposals.set(proposal.id, proposal);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date(),
      reputationScore: insertUser.reputationScore ?? 0
    };
    this.users.set(id, user);
    return user;
  }

  async upsertUser(upsertUser: UpsertUser): Promise<User> {
    const existing = upsertUser.id ? await this.getUser(upsertUser.id) : 
                     upsertUser.email ? await this.getUserByEmail(upsertUser.email) : 
                     undefined;

    if (existing) {
      const updated: User = {
        ...existing,
        ...upsertUser,
        updatedAt: new Date(),
      };
      this.users.set(existing.id, updated);
      return updated;
    } else {
      const id = upsertUser.id || randomUUID();
      const newUser: User = {
        ...upsertUser,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        reputationScore: upsertUser.reputationScore ?? 75.0,
      };
      this.users.set(id, newUser);
      return newUser;
    }
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

  // Project methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { ...insertProject, id, createdAt: new Date() };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (project) {
      const updatedProject = { ...project, ...updates };
      this.projects.set(id, updatedProject);
      return updatedProject;
    }
    return undefined;
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTasksByProject(projectId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.projectId === projectId);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = { ...insertTask, id, createdAt: new Date() };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (task) {
      const updatedTask = { ...task, ...updates };
      this.tasks.set(id, updatedTask);
      return updatedTask;
    }
    return undefined;
  }

  // Donor methods
  async getDonors(): Promise<Donor[]> {
    return Array.from(this.donors.values());
  }

  async getDonor(id: string): Promise<Donor | undefined> {
    return this.donors.get(id);
  }

  async createDonor(insertDonor: InsertDonor): Promise<Donor> {
    const id = randomUUID();
    const donor: Donor = { ...insertDonor, id, createdAt: new Date() };
    this.donors.set(id, donor);
    return donor;
  }

  async updateDonor(id: string, updates: Partial<Donor>): Promise<Donor | undefined> {
    const donor = this.donors.get(id);
    if (donor) {
      const updatedDonor = { ...donor, ...updates };
      this.donors.set(id, updatedDonor);
      return updatedDonor;
    }
    return undefined;
  }

  // Governance methods
  async getGovernanceProposals(): Promise<GovernanceProposal[]> {
    return Array.from(this.governanceProposals.values());
  }

  async getGovernanceProposal(id: string): Promise<GovernanceProposal | undefined> {
    return this.governanceProposals.get(id);
  }

  async createGovernanceProposal(insertProposal: InsertGovernanceProposal): Promise<GovernanceProposal> {
    const id = randomUUID();
    const proposal: GovernanceProposal = { ...insertProposal, id, createdAt: new Date() };
    this.governanceProposals.set(id, proposal);
    return proposal;
  }

  async voteOnProposal(id: string, vote: 'for' | 'against', voterReputationScore: number): Promise<GovernanceProposal | undefined> {
    const proposal = this.governanceProposals.get(id);
    if (proposal) {
      if (vote === 'for') {
        proposal.votesFor = (proposal.votesFor ?? 0) + Math.round(voterReputationScore);
      } else {
        proposal.votesAgainst = (proposal.votesAgainst ?? 0) + Math.round(voterReputationScore);
      }
      proposal.totalVotes = (proposal.votesFor ?? 0) + (proposal.votesAgainst ?? 0);
      this.governanceProposals.set(id, proposal);
      return proposal;
    }
    return undefined;
  }

  // Developer settings
  async getDeveloperSettings(userId: string): Promise<DeveloperSettings | undefined> {
    return Array.from(this.developerSettings.values()).find(settings => settings.userId === userId);
  }

  async updateDeveloperSettings(userId: string, settingsUpdate: Partial<InsertDeveloperSettings>): Promise<DeveloperSettings> {
    const existing = await this.getDeveloperSettings(userId);
    if (existing) {
      const updated = { ...existing, ...settingsUpdate };
      this.developerSettings.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const newSettings: DeveloperSettings = {
        id,
        userId,
        preferredLLM: settingsUpdate.preferredLLM ?? "gpt-4o",
        apiKeys: settingsUpdate.apiKeys ?? null,
        createdAt: new Date()
      };
      this.developerSettings.set(id, newSettings);
      return newSettings;
    }
  }
}

// Use database storage in production, memory storage in development
export const storage = process.env.NODE_ENV === "production" ? dbStorage : new MemStorage();
