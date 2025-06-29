import { supabase } from '../lib/supabase';

export async function fetchChats(userId) {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  return { data, error };
}

export async function fetchChatById(userId, chatId) {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .eq('id', chatId)
    .single();
  return { data, error };
}

export async function createChat(userId, messages, title, excerpt) {
  const { data, error } = await supabase
    .from('chats')
    .insert([
      {
        user_id: userId,
        messages,
        title,
        excerpt,
      },
    ])
    .select()
    .single();
  return { data, error };
}

export async function updateChat(userId, chatId, updates) {
  const { data, error } = await supabase
    .from('chats')
    .update(updates)
    .eq('user_id', userId)
    .eq('id', chatId)
    .select()
    .single();
  return { data, error };
}

export async function deleteChat(userId, chatId) {
  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('user_id', userId)
    .eq('id', chatId);
  return { error };
} 