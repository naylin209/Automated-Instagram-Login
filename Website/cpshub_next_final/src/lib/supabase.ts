import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types based on your schema
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  profile_picture_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  bio: string | null;
}

export interface Chat {
  id: string;
  user_id: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
  excerpt: string | null;
  title: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface AIInstruction {
  id: string;
  instructions: string;
  created_at: string;
}