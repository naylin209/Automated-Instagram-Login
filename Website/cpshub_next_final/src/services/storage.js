import { supabase } from '../lib/supabase';

export async function uploadProfilePicture(userId, file) {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/${Date.now()}.${fileExt}`;

  // Upload the file
  const { error: uploadError } = await supabase.storage
    .from('profile-pictures')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw uploadError;
  }

  // Get the public URL
  const { data } = supabase.storage
    .from('profile-pictures')
    .getPublicUrl(filePath);

  return data.publicUrl;
} 