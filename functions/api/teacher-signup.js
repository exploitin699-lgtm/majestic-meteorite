import { createClient } from "@supabase/supabase-js";

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const body = await request.json();

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

    const supabase = createClient(
      env.PUBLIC_SUPABASE_URL,
      env.SUPABASE_ANON_KEY
    );

    // create auth user
    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email,
        password
      });

    if (authError) {
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400 }
      );
    }

    const user = authData.user;

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not created" }),
        { status: 400 }
      );
    }

    // insert teacher profile
    const { error: insertError } = await supabase
      .from("teachers")
      .insert({
        id: user.id,
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
      JSON.stringify({ error: e.message }),
      { status: 500 }
    );
  }
}