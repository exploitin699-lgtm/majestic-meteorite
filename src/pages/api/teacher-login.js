import { supabase } from "../../lib/supabaseClient";

export async function POST({ request }) {
  const form = await request.formData();

  const { error } = await supabase.auth.signInWithPassword({
    email: form.get("email"),
    password: form.get("password"),
  });

  if (error) {
    return new Response("Invalid login", { status: 401 });
  }

  return Response.redirect("/teacher-dashboard", 302);
}
