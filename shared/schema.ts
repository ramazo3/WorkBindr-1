import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  walletAddress: text("wallet_address").notNull(),
  reputationScore: real("reputation_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const microApps = pgTable("micro_apps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  version: text("version").notNull(),
  apiSchema: text("api_schema").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  isActive: boolean("is_active").default(true),
  transactionCount: integer("transaction_count").default(0),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  pricePerCall: text("price_per_call").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").references(() => users.id).notNull(),
  microAppId: text("micro_app_id").references(() => microApps.id),
  description: text("description").notNull(),
  amount: text("amount").notNull(),
  status: text("status").notNull(),
  transactionHash: text("transaction_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiMessages = pgTable("ai_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const platformStats = pgTable("platform_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  activeMicroApps: integer("active_micro_apps").default(0),
  transactionsToday: integer("transactions_today").default(0),
  dataNodes: integer("data_nodes").default(0),
  contributors: integer("contributors").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(),
  priority: text("priority").notNull(),
  progress: integer("progress").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: text("project_id").references(() => projects.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull(),
  assignee: text("assignee"),
  priority: text("priority").notNull(),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const donors = pgTable("donors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  totalDonated: text("total_donated").notNull(),
  lastDonation: timestamp("last_donation"),
  donationCount: integer("donation_count").default(0),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const governanceProposals = pgTable("governance_proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  proposer: text("proposer").notNull(),
  status: text("status").notNull(),
  votesFor: integer("votes_for").default(0),
  votesAgainst: integer("votes_against").default(0),
  totalVotes: integer("total_votes").default(0),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const developerSettings = pgTable("developer_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").references(() => users.id).notNull(),
  preferredLLM: text("preferred_llm").notNull().default("gpt-4o"),
  apiKeys: jsonb("api_keys"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMicroAppSchema = createInsertSchema(microApps).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertAiMessageSchema = createInsertSchema(aiMessages).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

export const insertDonorSchema = createInsertSchema(donors).omit({
  id: true,
  createdAt: true,
});

export const insertGovernanceProposalSchema = createInsertSchema(governanceProposals).omit({
  id: true,
  createdAt: true,
});

export const insertDeveloperSettingsSchema = createInsertSchema(developerSettings).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMicroApp = z.infer<typeof insertMicroAppSchema>;
export type MicroApp = typeof microApps.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertAiMessage = z.infer<typeof insertAiMessageSchema>;
export type AiMessage = typeof aiMessages.$inferSelect;
export type PlatformStats = typeof platformStats.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertDonor = z.infer<typeof insertDonorSchema>;
export type Donor = typeof donors.$inferSelect;
export type InsertGovernanceProposal = z.infer<typeof insertGovernanceProposalSchema>;
export type GovernanceProposal = typeof governanceProposals.$inferSelect;
export type InsertDeveloperSettings = z.infer<typeof insertDeveloperSettingsSchema>;
export type DeveloperSettings = typeof developerSettings.$inferSelect;
