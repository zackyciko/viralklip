# ViralKlip Worker

Backend video processing worker for ViralKlip. Handles YouTube downloads, AI transcription, viral moment detection, and multi-aspect ratio clip generation.

## 🚀 Features

- **YouTube Download** - yt-dlp integration for video downloads
- **AI Transcription** - Groq Whisper API for accurate transcription
- **Viral Analysis** - Gemini AI for detecting viral moments
- **Video Processing** - FFmpeg for multi-aspect ratio clips (9:16, 16:9, 1:1, 4:5)
- **Cloud Storage** - Cloudflare R2 for CDN-backed video hosting
- **Auto Subtitles** - SRT subtitle generation
- **Caption Generation** - AI-powered social media captions

## 📋 Prerequisites

- Python 3.11+
- FFmpeg installed
- Groq API key (free, unlimited)
- Google Gemini API key (free tier)
- Cloudflare R2 account (free 10GB)
- Supabase project

## 🛠️ Local Setup

### 1. Install Dependencies

```bash
cd worker
pip install -r requirements.txt
```

### 2. Install FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html)

### 3. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your API keys:

```env
WORKER_API_KEY=your-secret-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
GROQ_API_KEY=your-groq-key
GEMINI_API_KEY=your-gemini-key
R2_ACCOUNT_ID=your-r2-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_PUBLIC_URL=https://your-bucket.r2.dev
```

### 4. Run Locally

```bash
uvicorn app.main:app --reload --port 8000
```

Visit http://localhost:8000/docs for API documentation.

## 📡 API Endpoints

### POST /process

Start video processing job.

**Request:**
```json
{
  "video_url": "https://youtube.com/watch?v=...",
  "project_id": "uuid",
  "user_id": "uuid",
  "target_count": 10,
  "aspect_ratios": ["9:16", "16:9", "1:1"]
}
```

**Headers:**
```
X-API-Key: your-worker-api-key
```

**Response:**
```json
{
  "job_id": "uuid",
  "status": "pending",
  "message": "Job created successfully"
}
```

### GET /status/{job_id}

Check job status and progress.

**Headers:**
```
X-API-Key: your-worker-api-key
```

**Response:**
```json
{
  "id": "uuid",
  "status": "completed",
  "progress": 100,
  "result": {
    "transcript": "...",
    "clips": [...],
    "total_clips": 30
  }
}
```

**Status values:**
- `pending` - Job queued
- `downloading` - Downloading video
- `transcribing` - Transcribing audio
- `analyzing` - Detecting viral moments
- `clipping` - Generating clips
- `uploading` - Uploading to R2
- `completed` - Job finished
- `failed` - Job failed (check `error` field)

### GET /health

Health check endpoint.

## 🚢 Deployment to Render.com

### 1. Connect GitHub

1. Push worker code to GitHub
2. Go to [render.com](https://render.com)
3. Create new account (free)
4. Click "New +" → "Web Service"
5. Connect your GitHub repository

### 2. Configure Service

- **Name:** viralklip-worker
- **Region:** Singapore (or closest to users)
- **Branch:** main
- **Root Directory:** worker
- **Environment:** Docker
- **Plan:** Free

### 3. Add Environment Variables

Add all variables from `.env.example` in Render dashboard:

- WORKER_API_KEY
- SUPABASE_URL
- SUPABASE_SERVICE_KEY
- GROQ_API_KEY
- GEMINI_API_KEY
- R2_ACCOUNT_ID
- R2_ACCESS_KEY_ID
- R2_SECRET_ACCESS_KEY
- R2_BUCKET_NAME
- R2_PUBLIC_URL
- ALLOWED_ORIGINS

### 4. Deploy

Click "Create Web Service" - Render will automatically:
- Build Docker image
- Install dependencies
- Deploy to production
- Provide public URL

### 5. Update Frontend

Add worker URL to Next.js `.env`:

```env
WORKER_API_URL=https://viralklip-worker.onrender.com
WORKER_API_KEY=your-worker-api-key
```

## 🔧 Configuration

### Aspect Ratios

Supported aspect ratios:
- `9:16` - TikTok, Instagram Reels, YouTube Shorts (1080x1920)
- `16:9` - YouTube, Landscape (1920x1080)
- `1:1` - Instagram Feed, Square (1080x1080)
- `4:5` - Instagram Portrait (1080x1350)

### Processing Limits

Adjust in `.env`:

```env
MAX_VIDEO_DURATION=3600  # 1 hour
MAX_CLIP_DURATION=60     # 1 minute per clip
DEFAULT_CLIP_COUNT=10    # Number of clips
```

## 🧪 Testing

### Test with cURL

```bash
curl -X POST http://localhost:8000/process \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "video_url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
    "project_id": "test-project-id",
    "user_id": "test-user-id",
    "target_count": 5,
    "aspect_ratios": ["9:16"]
  }'
```

### Check Status

```bash
curl http://localhost:8000/status/{job_id} \
  -H "X-API-Key: your-api-key"
```

## 📊 Monitoring

### Logs

View logs in Render dashboard or locally:

```bash
tail -f logs/worker.log
```

### Health Check

```bash
curl http://localhost:8000/health
```

## 🐛 Troubleshooting

### FFmpeg not found

Install FFmpeg:
```bash
# macOS
brew install ffmpeg

# Ubuntu
sudo apt-get install ffmpeg
```

### yt-dlp download fails

Update yt-dlp:
```bash
pip install --upgrade yt-dlp
```

### R2 upload fails

Check R2 credentials and bucket permissions in Cloudflare dashboard.

### Groq API rate limit

Groq is unlimited and free. If you hit limits, check your API key.

### Gemini API quota

Free tier: 15 requests/minute, 1500/day. Upgrade if needed.

## 💰 Cost Estimate

**Free Tier (Monthly):**
- Render.com: 750 hours free (enough for 24/7)
- Groq API: Unlimited free
- Gemini API: 1500 requests/day free
- R2 Storage: 10GB free
- Supabase: 500MB database free

**Estimated cost for 1000 videos/month:**
- Worker: $0 (free tier)
- Storage: $0 (under 10GB)
- APIs: $0 (free tier)
- **Total: $0** 🎉

## 📝 License

MIT

## 🤝 Support

For issues, contact: support@viralklip.com
