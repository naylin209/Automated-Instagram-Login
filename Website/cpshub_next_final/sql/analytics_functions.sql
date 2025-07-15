-- SQL functions to add to your Supabase database for analytics

-- Function to get user chat counts
CREATE OR REPLACE FUNCTION get_user_chat_counts()
RETURNS TABLE(user_id uuid, chat_count bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.user_id,
    COUNT(*) as chat_count
  FROM chats c
  GROUP BY c.user_id
  ORDER BY chat_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at);
CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- RLS (Row Level Security) policies
-- Enable RLS on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_instructions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

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