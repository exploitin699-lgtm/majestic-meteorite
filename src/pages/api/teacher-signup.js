import { supabase } from "../../lib/supabaseClient";

export async function POST({ request }) {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/teacher-login",
    },
  });
}
