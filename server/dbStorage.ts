import { eq, desc, sql } from "drizzle-orm";
import { db } from "./db";
import * as schema from "@shared/schema";
import type {
  User,
  InsertUser,
  UpsertUser,
  MicroApp,
  InsertMicroApp,
  Transaction,
  InsertTransaction,
  AiMessage,
  InsertAiMessage,
  PlatformStats,
  Project,
  InsertProject,
  Task,
  InsertTask,
  Donor,
  InsertDonor,
  GovernanceProposal,
  InsertGovernanceProposal,
  DeveloperSettings,
  InsertDeveloperSettings,
} from "@shared/schema";
import type { IStorage } from "./storage";

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(schema.users).values(user).returning();
    return result[0];
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const result = await db
      .insert(schema.users)
      .values(user)
      .onConflictDoUpdate({
        target: schema.users.id,
        set: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  }

  async updateUserReputation(id: string, score: number): Promise<User | undefined> {
    const result = await db
      .update(schema.users)
      .set({ reputationScore: score, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return result[0];
  }

  // Micro-app methods
  async getMicroApps(): Promise<MicroApp[]> {
    return await db.select().from(schema.microApps);
  }

  async getMicroApp(id: string): Promise<MicroApp | undefined> {
    const result = await db.select().from(schema.microApps).where(eq(schema.microApps.id, id)).limit(1);
    return result[0];
  }

  async createMicroApp(microApp: InsertMicroApp): Promise<MicroApp> {
    const result = await db.insert(schema.microApps).values(microApp).returning();
    return result[0];
  }

  async incrementTransactionCount(id: string): Promise<void> {
    await db
      .update(schema.microApps)
      .set({ transactionCount: sql`${schema.microApps.transactionCount} + 1` })
      .where(eq(schema.microApps.id, id));
  }

  // Transaction methods
  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(schema.transactions)
      .where(eq(schema.transactions.userId, userId))
      .orderBy(desc(schema.transactions.createdAt));
  }

  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    return await db
      .select()
      .from(schema.transactions)
      .orderBy(desc(schema.transactions.createdAt))
      .limit(limit);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(schema.transactions).values(transaction).returning();
    return result[0];
  }

  // AI message methods
  async createAiMessage(message: InsertAiMessage): Promise<AiMessage> {
    const result = await db.insert(schema.aiMessages).values(message).returning();
    return result[0];
  }

  async getAiMessagesByUserId(userId: string): Promise<AiMessage[]> {
    return await db
      .select()
      .from(schema.aiMessages)
      .where(eq(schema.aiMessages.userId, userId))
      .orderBy(desc(schema.aiMessages.createdAt));
  }

  // Platform stats
  async getPlatformStats(): Promise<PlatformStats> {
    const result = await db.select().from(schema.platformStats).limit(1);
    if (result.length === 0) {
      // Create default stats if none exist
      const newStats = await db
        .insert(schema.platformStats)
        .values({
          activeMicroApps: 0,
          transactionsToday: 0,
          dataNodes: 0,
          contributors: 0,
        })
        .returning();
      return newStats[0];
    }
    return result[0];
  }

  async updatePlatformStats(stats: Partial<PlatformStats>): Promise<PlatformStats> {
    const existing = await this.getPlatformStats();
    const result = await db
      .update(schema.platformStats)
      .set({ ...stats, updatedAt: new Date() })
      .where(eq(schema.platformStats.id, existing.id))
      .returning();
    return result[0];
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return await db.select().from(schema.projects).orderBy(desc(schema.projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const result = await db.select().from(schema.projects).where(eq(schema.projects.id, id)).limit(1);
    return result[0];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(schema.projects).values(project).returning();
    return result[0];
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    const result = await db
      .update(schema.projects)
      .set(updates)
      .where(eq(schema.projects.id, id))
      .returning();
    return result[0];
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return await db.select().from(schema.tasks).orderBy(desc(schema.tasks.createdAt));
  }

  async getTasksByProject(projectId: string): Promise<Task[]> {
    return await db
      .select()
      .from(schema.tasks)
      .where(eq(schema.tasks.projectId, projectId))
      .orderBy(desc(schema.tasks.createdAt));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const result = await db.insert(schema.tasks).values(task).returning();
    return result[0];
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const result = await db
      .update(schema.tasks)
      .set(updates)
      .where(eq(schema.tasks.id, id))
      .returning();
    return result[0];
  }

  // Donor methods
  async getDonors(): Promise<Donor[]> {
    return await db.select().from(schema.donors).orderBy(desc(schema.donors.createdAt));
  }

  async getDonor(id: string): Promise<Donor | undefined> {
    const result = await db.select().from(schema.donors).where(eq(schema.donors.id, id)).limit(1);
    return result[0];
  }

  async createDonor(donor: InsertDonor): Promise<Donor> {
    const result = await db.insert(schema.donors).values(donor).returning();
    return result[0];
  }

  async updateDonor(id: string, updates: Partial<Donor>): Promise<Donor | undefined> {
    const result = await db
      .update(schema.donors)
      .set(updates)
      .where(eq(schema.donors.id, id))
      .returning();
    return result[0];
  }

  // Governance methods
  async getGovernanceProposals(): Promise<GovernanceProposal[]> {
    return await db.select().from(schema.governanceProposals).orderBy(desc(schema.governanceProposals.createdAt));
  }

  async getGovernanceProposal(id: string): Promise<GovernanceProposal | undefined> {
    const result = await db.select().from(schema.governanceProposals).where(eq(schema.governanceProposals.id, id)).limit(1);
    return result[0];
  }

  async createGovernanceProposal(proposal: InsertGovernanceProposal): Promise<GovernanceProposal> {
    const result = await db.insert(schema.governanceProposals).values(proposal).returning();
    return result[0];
  }

  async voteOnProposal(id: string, vote: "for" | "against", voterReputationScore: number): Promise<GovernanceProposal | undefined> {
    const proposal = await this.getGovernanceProposal(id);
    if (!proposal) return undefined;

    const votesFor = vote === "for" ? (proposal.votesFor || 0) + voterReputationScore : (proposal.votesFor || 0);
    const votesAgainst = vote === "against" ? (proposal.votesAgainst || 0) + voterReputationScore : (proposal.votesAgainst || 0);
    const totalVotes = (proposal.totalVotes || 0) + 1;

    const result = await db
      .update(schema.governanceProposals)
      .set({ votesFor, votesAgainst, totalVotes })
      .where(eq(schema.governanceProposals.id, id))
      .returning();
    return result[0];
  }

  // Developer settings
  async getDeveloperSettings(userId: string): Promise<DeveloperSettings | undefined> {
    const result = await db.select().from(schema.developerSettings).where(eq(schema.developerSettings.userId, userId)).limit(1);
    return result[0];
  }

  async updateDeveloperSettings(userId: string, settings: Partial<InsertDeveloperSettings>): Promise<DeveloperSettings> {
    const existing = await this.getDeveloperSettings(userId);
    
    if (existing) {
      const result = await db
        .update(schema.developerSettings)
        .set(settings)
        .where(eq(schema.developerSettings.userId, userId))
        .returning();
      return result[0];
    } else {
      const result = await db
        .insert(schema.developerSettings)
        .values({ userId, ...settings })
        .returning();
      return result[0];
    }
  }
}

export const dbStorage = new DbStorage();
