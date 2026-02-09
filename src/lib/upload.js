import { supabase } from "./supabase";

export async function uploadFile(file, path) {
  const { data, error } = await supabase.storage
    .from("materials")
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("materials")
    .getPublicUrl(path);

  return urlData.publicUrl;
}
