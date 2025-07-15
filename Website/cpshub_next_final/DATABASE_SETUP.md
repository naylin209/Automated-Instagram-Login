# Database Setup Guide

## ❌ Current Issue
The chat creation is failing because the database tables don't exist in your Supabase database.

## 🔧 How to Fix

### Step 1: Go to Supabase Dashboard
1. Open [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: `https://xyonqqcxdnlnwrazkqlq.supabase.co`

### Step 2: Open SQL Editor
1. In the left sidebar, click **SQL Editor**
2. Click **New Query**

### Step 3: Run This SQL Code
Copy and paste this entire SQL code and click **Run**:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  profile_picture_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  excerpt TEXT,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_instructions table
CREATE TABLE IF NOT EXISTS ai_instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default AI instructions
INSERT INTO ai_instructions (instructions) VALUES (
  'You are a construction industry expert AI assistant. Always prioritize safety, reference relevant building codes when applicable, and provide practical, actionable advice. Use clear, professional language and structure responses with headings and bullet points.'
) ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at);
CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_instructions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Chats policies
CREATE POLICY "Users can manage own chats" ON chats
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all chats" ON chats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- AI Instructions policies
CREATE POLICY "Admins can manage AI instructions" ON ai_instructions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "All users can read current AI instructions" ON ai_instructions
  FOR SELECT USING (true);
```

### Step 4: Create Your Profile
After running the SQL, you need to create your profile:

1. **Sign up** in your app at `http://localhost:3001/auth/signup`
2. **Sign in** at `http://localhost:3001/auth/login`
3. Go to **Settings** and update your profile information

### Step 5: Make Yourself Admin (Optional)
To access the admin dashboard:

1. In Supabase, go to **Table Editor**
2. Select the **profiles** table
3. Find your user record
4. Change the `role` from `'user'` to `'admin'`
5. Save the changes

## ✅ Testing
After completing these steps:

1. Try creating a new chat in the app
2. Check that it appears in the sidebar
3. Try updating your profile in Settings
4. If you're admin, check the Admin Dashboard

## 🔍 Troubleshooting

### If you see authentication errors:
- Make sure you're signed in to the app
- Check that your Supabase URL and key are correct in `.env.local`

### If tables still don't exist:
- Make sure you selected the correct project in Supabase
- Try running each CREATE TABLE command separately
- Check the SQL Editor for any error messages

### If RLS policies fail:
- You can skip the policy creation for now and add them later
- The app will work without RLS, but it won't be secure for production

## 🎯 Success Indicators
You'll know everything is working when:
- ✅ Chat messages save and appear in the sidebar
- ✅ Profile information saves in Settings
- ✅ No console errors about missing tables
- ✅ Admin dashboard shows analytics (if you're admin)