import { createClient } from "@supabase/supabase-js";

export async function onRequestPost(context) {

  const supabase = createClient(
    context.env.PUBLIC_SUPABASE_URL,
    context.env.SUPABASE_ANON_KEY
  );

  try {

    const body = await context.request.json();

    const {
      email,
      password,
      full_name,
      subjects,
      class_levels
    } = body;

    if (!email || !password || !full_name) {
      return new Response(
        JSON.stringify({ error: "Missing fields" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400 }
      );
    }

    const user = data.user;

    const { error: insertError } = await supabase
      .from("teachers")
      .insert({
        user_id: user.id,
        email,
        full_name,
        subjects,
        class_levels
      });

    if (insertError) {
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (e) {

    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
