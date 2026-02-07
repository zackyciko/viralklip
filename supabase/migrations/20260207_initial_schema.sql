-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free', -- free, starter, pro, creator
  credits_remaining INTEGER DEFAULT 3,
  credits_reset_date TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT, -- untuk Midtrans/Stripe
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  video_url TEXT,
  video_title TEXT,
  video_duration INTEGER, -- seconds
  thumbnail_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, processing, transcribing, analyzing, generating, completed, failed
  error_message TEXT,
  transcript TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Clips table
CREATE TABLE IF NOT EXISTS clips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  clip_number INTEGER,
  start_time FLOAT, -- seconds with decimal
  end_time FLOAT,
  duration FLOAT,
  transcript_snippet TEXT,
  viral_score FLOAT, -- 0-10 AI prediction
  viral_reason TEXT, -- why AI thinks viral
  keywords TEXT[], -- array of keywords
  aspect_ratio TEXT DEFAULT '9:16', -- 9:16, 1:1, 4:5, 16:9
  video_url TEXT, -- R2 storage URL
  thumbnail_url TEXT,
  subtitle_file_url TEXT, -- SRT file
  caption_text TEXT, -- AI-generated social media caption
  view_prediction INTEGER, -- estimated views
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage logs
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  credits_used INTEGER DEFAULT 1,
  action_type TEXT, -- 'clip_generation', 'download', etc
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_name TEXT, -- starter, pro, creator
  status TEXT, -- active, cancelled, expired
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES users(id),
  referee_id UUID REFERENCES users(id),
  commission_rate FLOAT DEFAULT 0.10,
  total_earned INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payouts table
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  amount INTEGER,
  status TEXT, -- pending, paid
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  owner_id UUID REFERENCES users(id),
  plan TEXT DEFAULT 'creator',
  max_members INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT, -- owner, admin, member
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
);

-- Data deletion requests
CREATE TABLE IF NOT EXISTS data_deletion_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' -- pending, processing, completed
);

-- DMCA notices
CREATE TABLE IF NOT EXISTS dmca_notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  complainant_email TEXT,
  complaint_text TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  actioned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin', -- admin, superadmin
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_clips_project_id ON clips(project_id);
CREATE INDEX IF NOT EXISTS idx_clips_viral_score ON clips(viral_score DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(status) WHERE status IN ('pending', 'processing', 'transcribing', 'analyzing', 'generating');

-- Function for auto cleanup (to be called by cron or manually)
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
  -- Delete clips older than 7 days
  DELETE FROM clips WHERE created_at < NOW() - INTERVAL '7 days';
  -- Delete projects older than 14 days
  DELETE FROM projects WHERE completed_at < NOW() - INTERVAL '14 days';
END;
$$ LANGUAGE plpgsql;
