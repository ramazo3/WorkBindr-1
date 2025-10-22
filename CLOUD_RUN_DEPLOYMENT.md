# WorkBindr 2.0 - Google Cloud Run Deployment Guide

## ✅ What's Been Fixed

Your app is now **production-ready** for Cloud Run deployment:

1. ✅ **PostgreSQL Database Storage** - Now uses DbStorage instead of in-memory storage
2. ✅ **Production Dependencies** - All dependencies properly configured
3. ✅ **Multi-stage Dockerfile** - Optimized for Cloud Run with security best practices
4. ✅ **Port Configuration** - Listens on PORT environment variable (Cloud Run uses 8080)
5. ✅ **WebSocket Support** - Neon Database serverless with ws package included
6. ✅ **Health Checks** - Built-in health check endpoint
7. ✅ **Static Assets** - Properly bundled for production

## 📋 Prerequisites

Before deploying to Cloud Run, you need:

1. **Google Cloud Project** - Create one at https://console.cloud.google.com
2. **Cloud SQL PostgreSQL Database** or **Neon Database** (recommended for serverless)
3. **gcloud CLI** - Install from https://cloud.google.com/sdk/docs/install
4. **Docker** (optional) - Only if building locally

## 🗄️ Database Setup Options

### Option 1: Neon Database (Recommended - Serverless)

1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string (starts with `postgresql://`)
4. This is your `DATABASE_URL`

**Advantages:**
- Serverless, scales to zero
- No management needed
- Free tier available
- Works perfectly with Cloud Run's serverless model

### Option 2: Google Cloud SQL

1. Create Cloud SQL instance:
```bash
gcloud sql instances create workbindr-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1
```

2. Create database:
```bash
gcloud sql databases create workbindr --instance=workbindr-db
```

3. Set password:
```bash
gcloud sql users set-password postgres \
  --instance=workbindr-db \
  --password=YOUR_SECURE_PASSWORD
```

4. Get connection name:
```bash
gcloud sql instances describe workbindr-db --format="value(connectionName)"
```

## 📦 Step 1: Initialize Database Schema

Before deploying, initialize your database with the schema:

### Using Neon Database:
```bash
# Set your DATABASE_URL
export DATABASE_URL="postgresql://user:password@host/database"

# Run the schema creation script
psql $DATABASE_URL -f database_schema.sql
```

### Using Cloud SQL:
```bash
# Use Cloud SQL Proxy
./cloud-sql-proxy PROJECT:REGION:INSTANCE &

# Run schema
psql "host=127.0.0.1 user=postgres dbname=workbindr" -f database_schema.sql
```

## 🚀 Step 2: Deploy to Cloud Run

### Method 1: Direct Deployment (Easiest)

```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Deploy (Cloud Build handles everything)
gcloud run deploy workbindr \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="postgresql://user:password@host/database" \
  --set-env-vars OPENAI_API_KEY="sk-..." \
  --set-env-vars GOOGLE_CLIENT_ID="your-google-client-id" \
  --set-env-vars GOOGLE_CLIENT_SECRET="your-google-client-secret" \
  --set-env-vars CUSTOM_DOMAIN="itinerecloud.com" \
  --set-env-vars NODE_ENV="production" \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10
```

### Method 2: Build & Push to Artifact Registry

```bash
# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Create Artifact Registry repository
gcloud artifacts repositories create workbindr-repo \
  --repository-format=docker \
  --location=us-central1

# Build and push image
gcloud builds submit \
  --tag us-central1-docker.pkg.dev/YOUR_PROJECT_ID/workbindr-repo/workbindr:latest

# Deploy from registry
gcloud run deploy workbindr \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/workbindr-repo/workbindr:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="postgresql://..." \
  --set-env-vars OPENAI_API_KEY="sk-..." \
  --set-env-vars GOOGLE_CLIENT_ID="..." \
  --set-env-vars GOOGLE_CLIENT_SECRET="..." \
  --set-env-vars CUSTOM_DOMAIN="itinerecloud.com" \
  --set-env-vars NODE_ENV="production"
```

### Method 3: Local Docker Build (Mac M1/M2 users)

```bash
# Build for linux/amd64 platform
docker build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/YOUR_PROJECT_ID/workbindr-repo/workbindr:latest .

# Authenticate with Docker
gcloud auth configure-docker us-central1-docker.pkg.dev

# Push image
docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/workbindr-repo/workbindr:latest

# Deploy
gcloud run deploy workbindr \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/workbindr-repo/workbindr:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated
```

## 🔐 Step 3: Configure Environment Variables

You can also set environment variables via Cloud Console or using gcloud:

```bash
gcloud run services update workbindr \
  --region us-central1 \
  --update-env-vars \
DATABASE_URL="postgresql://user:password@host/database",\
OPENAI_API_KEY="sk-...",\
GOOGLE_CLIENT_ID="...",\
GOOGLE_CLIENT_SECRET="...",\
CUSTOM_DOMAIN="itinerecloud.com",\
NODE_ENV="production"
```

### For Cloud SQL Connection:

If using Cloud SQL, add the Cloud SQL connection:

```bash
gcloud run services update workbindr \
  --region us-central1 \
  --add-cloudsql-instances PROJECT:REGION:INSTANCE
```

And use Unix socket connection:
```
DATABASE_URL="postgresql://USER:PASSWORD@/DATABASE?host=/cloudsql/PROJECT:REGION:INSTANCE"
```

## 🌐 Step 4: Configure Custom Domain

### Add Custom Domain to Cloud Run:

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service workbindr \
  --domain itinerecloud.com \
  --region us-central1
```

### Update DNS Records:

Cloud Run will provide DNS records. Add these to your domain registrar:

1. Go to your domain provider (e.g., GoDaddy, Namecheap)
2. Add the DNS records provided by Cloud Run
3. Wait for DNS propagation (can take up to 48 hours)

### Update Google OAuth Redirect URI:

After domain is configured, update Google Console:

1. Go to https://console.cloud.google.com/apis/credentials
2. Edit your OAuth 2.0 Client
3. Add authorized redirect URI:
   ```
   https://itinerecloud.com/api/auth/google/callback
   ```

## ✅ Step 5: Verify Deployment

### Check Service Status:
```bash
gcloud run services describe workbindr --region us-central1
```

### Get Service URL:
```bash
gcloud run services describe workbindr \
  --region us-central1 \
  --format="value(status.url)"
```

### View Logs:
```bash
gcloud run services logs read workbindr --region us-central1
```

### Test the Application:
```bash
# Test health endpoint
curl https://YOUR-SERVICE-URL.run.app/api/auth/user

# Open in browser
gcloud run services browse workbindr --region us-central1
```

## 🔍 Troubleshooting

### Error: "Container failed to start"

Check logs:
```bash
gcloud run services logs read workbindr --region us-central1 --limit=50
```

Common causes:
- DATABASE_URL not set or incorrect
- Database tables not created (run database_schema.sql)
- Port not configured (should be 8080, set by Cloud Run)

### Error: "Could not connect to database"

1. Verify DATABASE_URL is correct
2. Ensure database is accessible from Cloud Run
3. For Cloud SQL, verify Cloud SQL connection is added

### Error: "Module not found"

Rebuild the container:
```bash
gcloud run deploy workbindr --source . --region us-central1
```

### Application crashes or restarts

1. Check memory limits (increase if needed):
```bash
gcloud run services update workbindr \
  --region us-central1 \
  --memory 1Gi
```

2. Check timeout settings:
```bash
gcloud run services update workbindr \
  --region us-central1 \
  --timeout 300
```

## 💰 Cost Optimization

### Free Tier:
- Cloud Run: 2 million requests/month free
- 360,000 GB-seconds of memory free
- 180,000 vCPU-seconds of compute free

### Tips:
1. Use Neon Database (serverless, scales to zero)
2. Set minimum instances to 0 (default)
3. Set appropriate memory limits (512Mi is enough for most cases)
4. Use caching where possible

## 📊 Monitoring

### Enable Cloud Monitoring:
```bash
# View metrics
gcloud run services describe workbindr \
  --region us-central1 \
  --format="value(status.traffic)"
```

### Set up Alerts:
1. Go to Cloud Console → Monitoring → Alerting
2. Create alert for error rate, latency, or resource usage

## 🔄 CI/CD Setup (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - id: auth
      uses: google-github-actions/auth@v0
      with:
        credentials_json: ${{ secrets.GCP_SA_KEY }}
    
    - name: Deploy to Cloud Run
      uses: google-github-actions/deploy-cloudrun@v0
      with:
        service: workbindr
        region: us-central1
        source: .
        env_vars: |
          NODE_ENV=production
          CUSTOM_DOMAIN=itinerecloud.com
        secrets: |
          DATABASE_URL=DATABASE_URL:latest
          OPENAI_API_KEY=OPENAI_API_KEY:latest
          GOOGLE_CLIENT_ID=GOOGLE_CLIENT_ID:latest
          GOOGLE_CLIENT_SECRET=GOOGLE_CLIENT_SECRET:latest
```

## 📝 Summary

Your WorkBindr 2.0 app is ready for Cloud Run! The key changes made:

1. ✅ Created `DbStorage` class for PostgreSQL persistence
2. ✅ Updated storage to use database in production
3. ✅ Optimized Dockerfile for Cloud Run
4. ✅ Added health checks
5. ✅ Configured proper dependency management

Deploy now with:
```bash
gcloud run deploy workbindr --source . --region us-central1
```

Good luck with your deployment! 🚀
