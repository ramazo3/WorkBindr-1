-- WorkBindr 2.0 PostgreSQL Database Schema
-- Generated from shared/schema.ts

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Session storage table for authentication
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    wallet_address TEXT,
    reputation_score REAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Micro applications table
CREATE TABLE IF NOT EXISTS micro_apps (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    version TEXT NOT NULL,
    api_schema TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    transaction_count INTEGER DEFAULT 0,
    rating REAL DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    price_per_call TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id),
    micro_app_id TEXT REFERENCES micro_apps(id),
    description TEXT NOT NULL,
    amount TEXT NOT NULL,
    status TEXT NOT NULL,
    transaction_hash TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- AI messages/conversation history
CREATE TABLE IF NOT EXISTS ai_messages (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Platform statistics
CREATE TABLE IF NOT EXISTS platform_stats (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    active_micro_apps INTEGER DEFAULT 0,
    transactions_today INTEGER DEFAULT 0,
    data_nodes INTEGER DEFAULT 0,
    contributors INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects for project management
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks for project management
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL REFERENCES projects(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    assignee TEXT,
    priority TEXT NOT NULL,
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Donors for donor management
CREATE TABLE IF NOT EXISTS donors (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    total_donated TEXT NOT NULL,
    last_donation TIMESTAMP,
    donation_count INTEGER DEFAULT 0,
    status TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Governance proposals for DAO voting
CREATE TABLE IF NOT EXISTS governance_proposals (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    proposer TEXT NOT NULL,
    status TEXT NOT NULL,
    votes_for INTEGER DEFAULT 0,
    votes_against INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    end_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Developer settings
CREATE TABLE IF NOT EXISTS developer_settings (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id),
    preferred_llm TEXT NOT NULL DEFAULT 'gpt-4o',
    api_keys JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_micro_app_id ON transactions(micro_app_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_user_id ON ai_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_developer_settings_user_id ON developer_settings(user_id);
