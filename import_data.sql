-- WorkBindr 2.0 Data Import Script
-- This script imports all data into your NEW database
-- Run this against your TARGET database after creating tables

-- Import sessions (authentication data)
\COPY sessions FROM 'sessions_data.csv' WITH CSV HEADER;

-- Import users
\COPY users FROM 'users_data.csv' WITH CSV HEADER;

-- Import micro_apps
\COPY micro_apps FROM 'micro_apps_data.csv' WITH CSV HEADER;

-- Import transactions
\COPY transactions FROM 'transactions_data.csv' WITH CSV HEADER;

-- Import ai_messages
\COPY ai_messages FROM 'ai_messages_data.csv' WITH CSV HEADER;

-- Import platform_stats
\COPY platform_stats FROM 'platform_stats_data.csv' WITH CSV HEADER;

-- Import projects
\COPY projects FROM 'projects_data.csv' WITH CSV HEADER;

-- Import tasks
\COPY tasks FROM 'tasks_data.csv' WITH CSV HEADER;

-- Import donors
\COPY donors FROM 'donors_data.csv' WITH CSV HEADER;

-- Import governance_proposals
\COPY governance_proposals FROM 'governance_proposals_data.csv' WITH CSV HEADER;

-- Import developer_settings
\COPY developer_settings FROM 'developer_settings_data.csv' WITH CSV HEADER;

-- Reset sequences if needed (for auto-increment IDs)
-- Note: Your schema uses UUIDs, so this is usually not necessary
