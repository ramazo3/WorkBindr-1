# WorkBindr 2.0 Database Migration Guide

## Current Database Status
Your database tables exist but are mostly empty. You have 2 active user sessions.

## Migration Methods

### Method 1: Using pg_dump (Recommended - Complete Backup)

This is the easiest and most comprehensive method.

#### Step 1: Export from source database
```bash
# Export entire database structure and data
pg_dump $DATABASE_URL > workbindr_backup.sql

# Or export only data (if tables already exist in target)
pg_dump --data-only $DATABASE_URL > workbindr_data.sql

# Or export only specific tables
pg_dump --data-only -t users -t sessions -t transactions $DATABASE_URL > workbindr_selective.sql
```

#### Step 2: Import to new database
```bash
# Import complete backup (structure + data)
psql $NEW_DATABASE_URL < workbindr_backup.sql

# Or import only data
psql $NEW_DATABASE_URL < workbindr_data.sql
```

---

### Method 2: Using CSV Files (Good for Cloud Run Migration)

Use the provided SQL scripts.

#### Step 1: Export data from source database
```bash
# Connect to source database and run export script
psql $DATABASE_URL -f export_data.sql
```

This creates CSV files:
- `sessions_data.csv`
- `users_data.csv`
- `micro_apps_data.csv`
- `transactions_data.csv`
- `ai_messages_data.csv`
- `platform_stats_data.csv`
- `projects_data.csv`
- `tasks_data.csv`
- `donors_data.csv`
- `governance_proposals_data.csv`
- `developer_settings_data.csv`

#### Step 2: Create tables in new database
```bash
# Run the schema creation script first
psql $NEW_DATABASE_URL -f database_schema.sql
```

#### Step 3: Import data to new database
```bash
# Copy CSV files to server if needed, then import
psql $NEW_DATABASE_URL -f import_data.sql
```

---

### Method 3: Direct Database-to-Database Copy

Copy data directly from one database to another.

```bash
# Using pg_dump with pipe
pg_dump $SOURCE_DATABASE_URL | psql $TARGET_DATABASE_URL

# Or for specific tables
pg_dump --data-only -t users -t sessions $SOURCE_DATABASE_URL | psql $TARGET_DATABASE_URL
```

---

### Method 4: For Google Cloud SQL (Cloud Run)

#### Using Cloud SQL Proxy

1. **Install Cloud SQL Proxy**
```bash
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0/cloud-sql-proxy.linux.amd64
chmod +x cloud-sql-proxy
```

2. **Connect to Cloud SQL instance**
```bash
./cloud-sql-proxy --credentials-file=key.json PROJECT:REGION:INSTANCE
```

3. **Export from Replit database**
```bash
pg_dump $DATABASE_URL > workbindr_backup.sql
```

4. **Import to Cloud SQL**
```bash
psql "host=127.0.0.1 port=5432 user=postgres dbname=workbindr" < workbindr_backup.sql
```

#### Using Google Cloud Console

1. Go to Cloud SQL → Import
2. Upload `workbindr_backup.sql` to Cloud Storage bucket
3. Import from Cloud Storage

---

## Quick Migration Checklist

### For Your Current Situation (Mostly Empty Database):

Since your database is mostly empty, you can simply:

1. ✅ Create tables in new database: `psql $NEW_DB_URL -f database_schema.sql`
2. ✅ Done! (No data to migrate)

### For Future Migrations (When You Have Data):

1. ✅ Create backup: `pg_dump $DATABASE_URL > backup.sql`
2. ✅ Create tables in new database: `psql $NEW_DB_URL -f database_schema.sql`
3. ✅ Import data: `psql $NEW_DB_URL < backup.sql`
4. ✅ Verify data: Run sample queries
5. ✅ Update environment variables in Cloud Run
6. ✅ Test application

---

## Environment Variables for Cloud Run

After migration, set these in Cloud Run:

```bash
gcloud run services update workbindr \
  --set-env-vars DATABASE_URL="postgresql://user:pass@host:5432/dbname" \
  --set-env-vars OPENAI_API_KEY="your-key" \
  --set-env-vars GOOGLE_CLIENT_ID="your-id" \
  --set-env-vars GOOGLE_CLIENT_SECRET="your-secret" \
  --set-env-vars CUSTOM_DOMAIN="itinerecloud.com" \
  --set-env-vars NODE_ENV="production"
```

---

## Verification Queries

After migration, verify your data:

```sql
-- Check record counts
SELECT 'users' as table_name, COUNT(*) as records FROM users
UNION ALL
SELECT 'micro_apps', COUNT(*) FROM micro_apps
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'sessions', COUNT(*) FROM sessions;

-- Check recent data
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5;
```

---

## Troubleshooting

### Issue: Permission denied
```bash
# Make sure you have proper permissions
GRANT ALL PRIVILEGES ON DATABASE workbindr TO your_user;
```

### Issue: Table already exists
```sql
-- Drop and recreate if needed
DROP TABLE IF EXISTS table_name CASCADE;
```

### Issue: Foreign key violations
```bash
# Import in correct order (parent tables first)
# Or temporarily disable constraints:
SET session_replication_role = replica; -- Disable triggers
-- Import data
SET session_replication_role = DEFAULT; -- Re-enable triggers
```

---

## Best Practices

1. **Always backup before migration**: Keep a copy of your source database
2. **Test in staging first**: Don't migrate directly to production
3. **Verify data integrity**: Check row counts and sample data
4. **Update connection strings**: Change DATABASE_URL in Cloud Run
5. **Monitor after migration**: Watch logs for database errors
