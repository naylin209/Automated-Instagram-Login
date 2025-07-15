import { supabase } from './supabase';

// Function to check if tables exist and create them if needed
export async function initializeDatabase() {
  try {
    // Check if profiles table exists by trying to select from it
    const { data: profilesCheck, error: profilesError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });

    if (profilesError) {
      console.error('Profiles table may not exist:', profilesError);
    }

    // Check if chats table exists by trying to select from it
    const { data: chatsCheck, error: chatsError } = await supabase
      .from('chats')
      .select('count', { count: 'exact', head: true });

    if (chatsError) {
      console.error('Chats table may not exist:', chatsError);
    }

    // Check if ai_instructions table exists
    const { data: aiInstructionsCheck, error: aiInstructionsError } = await supabase
      .from('ai_instructions')
      .select('count', { count: 'exact', head: true });

    if (aiInstructionsError) {
      console.error('AI Instructions table may not exist:', aiInstructionsError);
    }

    return {
      profiles: !profilesError,
      chats: !chatsError,
      ai_instructions: !aiInstructionsError
    };
  } catch (error) {
    console.error('Error checking database:', error);
    return null;
  }
}

// Function to create tables if they don't exist
export async function createTables() {
  try {
    // Create profiles table
    const profilesSQL = `
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID REFERENCES auth.users(id) PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        profile_picture_url TEXT,
        role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        bio TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create chats table
    const chatsSQL = `
      CREATE TABLE IF NOT EXISTS chats (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        title TEXT,
        excerpt TEXT,
        messages JSONB DEFAULT '[]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create ai_instructions table
    const aiInstructionsSQL = `
      CREATE TABLE IF NOT EXISTS ai_instructions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        instructions TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Execute the SQL commands
    const { error: profilesError } = await supabase.rpc('exec_sql', { sql: profilesSQL });
    const { error: chatsError } = await supabase.rpc('exec_sql', { sql: chatsSQL });
    const { error: aiInstructionsError } = await supabase.rpc('exec_sql', { sql: aiInstructionsSQL });

    if (profilesError) console.error('Error creating profiles table:', profilesError);
    if (chatsError) console.error('Error creating chats table:', chatsError);
    if (aiInstructionsError) console.error('Error creating ai_instructions table:', aiInstructionsError);

    return {
      profiles: !profilesError,
      chats: !chatsError,
      ai_instructions: !aiInstructionsError
    };
  } catch (error) {
    console.error('Error creating tables:', error);
    return null;
  }
}