import { supabase, Chat, Message } from './supabase';

// Test database connection
export async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('❌ Auth error:', authError);
      return { success: false, error: authError };
    }
    
    console.log('✅ User authenticated:', user?.id);
    
    // Test chats table exists
    const { data, error } = await supabase
      .from('chats')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Database error:', error);
      return { success: false, error };
    }
    
    console.log('✅ Database connection successful');
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return { success: false, error };
  }
}

export interface CreateChatData {
  user_id: string;
  title: string;
  messages: Message[];
  excerpt?: string;
}

export interface UpdateChatData {
  title?: string;
  messages?: Message[];
  excerpt?: string;
}

// Create a new chat
export async function createChat(data: CreateChatData) {
  try {
    console.log('Creating chat with data:', {
      user_id: data.user_id,
      title: data.title,
      messages_count: data.messages.length,
      excerpt: data.excerpt || generateExcerpt(data.messages),
    });

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('❌ No authenticated user found');
      return { data: null, error: { message: 'User not authenticated' } };
    }
    
    if (user.id !== data.user_id) {
      console.error('❌ User ID mismatch:', { auth_user: user.id, provided_user: data.user_id });
      return { data: null, error: { message: 'User ID mismatch' } };
    }
    
    console.log('✅ User authenticated:', user.id);

    const { data: chat, error } = await supabase
      .from('chats')
      .insert([{
        user_id: data.user_id,
        title: data.title,
        messages: data.messages,
        excerpt: data.excerpt || generateExcerpt(data.messages),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating chat:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      
      // Check if it's a table not found error
      if (error.message && error.message.includes('relation "chats" does not exist')) {
        console.error('❌ The "chats" table does not exist in your Supabase database!');
        console.error('🔧 Please run the SQL setup commands from DATABASE_SETUP.md');
        return { data: null, error: { message: 'Database tables not set up. Please run the SQL setup commands.' } };
      }
      
      // Check for authentication errors
      if (error.message && error.message.includes('JWT')) {
        console.error('❌ Authentication error - user may not be properly authenticated');
        return { data: null, error: { message: 'Please sign in again.' } };
      }
      
      // Check for permission errors
      if (error.message && error.message.includes('permission')) {
        console.error('❌ Permission error - check Row Level Security policies');
        return { data: null, error: { message: 'Permission denied. Check database policies.' } };
      }
      
      throw error;
    }
    
    console.log('✅ Chat created successfully:', chat);
    return { data: chat, error: null };
  } catch (error) {
    console.error('Error creating chat:', error);
    return { data: null, error };
  }
}

// Get all chats for a user
export async function getUserChats(userId: string) {
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching chats:', error);
    return { data: [], error };
  }
}

// Get a specific chat by ID
export async function getChatById(chatId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching chat:', error);
    return { data: null, error };
  }
}

// Update an existing chat
export async function updateChat(chatId: string, userId: string, updates: UpdateChatData) {
  try {
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Generate excerpt if messages are updated
    if (updates.messages) {
      updateData.excerpt = updates.excerpt || generateExcerpt(updates.messages);
    }

    const { data, error } = await supabase
      .from('chats')
      .update(updateData)
      .eq('id', chatId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating chat:', error);
    return { data: null, error };
  }
}

// Delete a chat
export async function deleteChat(chatId: string, userId: string) {
  try {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId)
      .eq('user_id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting chat:', error);
    return { error };
  }
}

// Generate chat title from messages
export function generateChatTitle(messages: Message[]): string {
  const firstUserMessage = messages.find(m => m.sender === 'user');
  if (firstUserMessage?.text) {
    const title = firstUserMessage.text.trim();
    return title.length > 50 ? title.slice(0, 47) + '...' : title;
  }
  return 'New Chat';
}

// Generate chat excerpt from messages
export function generateExcerpt(messages: Message[]): string {
  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.text) {
    const excerpt = lastMessage.text.trim();
    return excerpt.length > 100 ? excerpt.slice(0, 97) + '...' : excerpt;
  }
  return '';
}

// Get chat analytics for admin
export async function getChatAnalytics() {
  try {
    // Total chats
    const { count: totalChats, error: chatsError } = await supabase
      .from('chats')
      .select('*', { count: 'exact', head: true });

    if (chatsError) throw chatsError;

    // Total users with chats
    const { data: usersData, error: usersError } = await supabase
      .from('chats')
      .select('user_id');

    if (usersError) throw usersError;

    // Get unique users
    const uniqueUsers = usersData ? [...new Set(usersData.map(u => u.user_id))] : [];

    // Recent chats (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: recentChats, error: recentError } = await supabase
      .from('chats')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    if (recentError) throw recentError;

    return {
      data: {
        totalChats: totalChats || 0,
        activeUsers: uniqueUsers.length,
        recentChats: recentChats || 0,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching chat analytics:', error);
    return { data: null, error };
  }
}