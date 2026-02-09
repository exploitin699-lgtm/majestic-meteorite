import { supabase } from "../../lib/supabaseClient";

export async function POST({ request }) {
  const form = await request.formData();
  const id = form.get("id");

  await supabase.from("resources").delete().eq("id", id);

  return Response.redirect("/teacher-dashboard", 302);
}
