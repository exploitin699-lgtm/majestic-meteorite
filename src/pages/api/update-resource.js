import { supabase } from "../../lib/supabaseClient.js";

export async function POST({ request, url }) {
  const id = url.searchParams.get("id");
  const form = await request.formData();
  const title = form.get("title");
  const file = form.get("file");

  let updateData = {};
  if (title) updateData.title = title;

  if (file && file.name) {
    const fileName = `${Date.now()}-${file.name}`;
    await supabase.storage.from("teacher-resources").upload(fileName, file);
    updateData.file_url = `https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/teacher-resources/${fileName}`;
    updateData.file_type = file.type;
  }

  await supabase.from("resources").update(updateData).eq("id", id);

  return new Response(null, {
    status: 302,
    headers: { Location: "/teacher-dashboard" }
  });
}
