-- WorkBindr 2.0 Data Export Script
-- This script exports all data from your existing database
-- Run this against your SOURCE database to generate INSERT statements

-- Export sessions (authentication data)
\COPY (SELECT * FROM sessions) TO 'sessions_data.csv' WITH CSV HEADER;

-- Export users
\COPY (SELECT * FROM users) TO 'users_data.csv' WITH CSV HEADER;

-- Export micro_apps
\COPY (SELECT * FROM micro_apps) TO 'micro_apps_data.csv' WITH CSV HEADER;

-- Export transactions
\COPY (SELECT * FROM transactions) TO 'transactions_data.csv' WITH CSV HEADER;

-- Export ai_messages
\COPY (SELECT * FROM ai_messages) TO 'ai_messages_data.csv' WITH CSV HEADER;

-- Export platform_stats
\COPY (SELECT * FROM platform_stats) TO 'platform_stats_data.csv' WITH CSV HEADER;

-- Export projects
\COPY (SELECT * FROM projects) TO 'projects_data.csv' WITH CSV HEADER;

-- Export tasks
\COPY (SELECT * FROM tasks) TO 'tasks_data.csv' WITH CSV HEADER;

-- Export donors
\COPY (SELECT * FROM donors) TO 'donors_data.csv' WITH CSV HEADER;

-- Export governance_proposals
\COPY (SELECT * FROM governance_proposals) TO 'governance_proposals_data.csv' WITH CSV HEADER;

-- Export developer_settings
\COPY (SELECT * FROM developer_settings) TO 'developer_settings_data.csv' WITH CSV HEADER;
