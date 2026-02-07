# ViralKlip - Quick Start Guide

## 🚀 Deployment Checklist

### 1. Setup Supabase (5 minutes)

```bash
# Run the migration
cd viralklip
supabase db push

# Generate TypeScript types (IMPORTANT - fixes build errors!)
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
```

### 2. Get API Keys (10 minutes)

- **Groq** (FREE unlimited): https://console.groq.com
- **Gemini** (FREE 1500/day): https://ai.google.dev
- **Midtrans** (Sandbox): https://dashboard.sandbox.midtrans.com
- **Resend** (FREE 100/day): https://resend.com
- **Cloudflare R2** (FREE 10GB): https://dash.cloudflare.com/r2

### 3. Deploy Worker to Render.com (10 minutes)

```bash
# Push to GitHub
git add worker/
git commit -m "Add worker"
git push

# On Render.com:
# 1. New Web Service
# 2. Connect repo
# 3. Root: worker/
# 4. Environment: Docker
# 5. Add all env vars from worker/.env.example
# 6. Deploy
```

### 4. Deploy Frontend to Vercel (5 minutes)

```bash
# Add env vars to .env.local
WORKER_API_URL=https://your-worker.onrender.com
WORKER_API_KEY=your-key
MIDTRANS_SERVER_KEY=...
MIDTRANS_CLIENT_KEY=...
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=...
RESEND_API_KEY=...

# Deploy
vercel --prod
```

## 🧪 Testing

### Test Worker

```bash
curl -X POST https://your-worker.onrender.com/process \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-key" \
  -d '{
    "video_url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
    "project_id": "test",
    "user_id": "test",
    "target_count": 3,
    "aspect_ratios": ["9:16"]
  }'
```

### Test Payment

1. Visit `/pricing`
2. Click Subscribe
3. Use test card: `4811 1111 1111 1114`
4. Check webhook logs
5. Verify email received

## ⚠️ Known Issues

**TypeScript Build Errors:**
- Caused by placeholder database types
- Fix by generating real types (step 1 above)
- Safe to ignore for now - doesn't affect runtime

## 📊 Cost (Free Tier)

- Worker: $0 (Render free tier)
- APIs: $0 (all free tiers)
- Storage: $0 (R2 10GB free)
- **Total: $0/month** 🎉

## 🆘 Troubleshooting

**Worker fails to start:**
- Check FFmpeg is installed in Docker
- Verify all env vars are set

**Payment webhook not working:**
- Check Midtrans webhook URL
- Verify signature validation

**Emails not sending:**
- Check Resend API key
- Verify sender domain

## 📚 Documentation

- Worker API: `https://your-worker.onrender.com/docs`
- Implementation Plan: `implementation_plan.md`
- Full Walkthrough: `walkthrough.md`
