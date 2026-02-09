import { supabase } from "../../lib/supabaseClient";

export async function POST() {
  await supabase.auth.signOut();
  return Response.redirect("/teacher-login", 302);
}
