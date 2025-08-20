"use client";

// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { createClient } from "@/libs/supabase/supabaseClient";

export const useEmailAuth = () => {
  // const supabase = createClientComponentClient();
  const supabase = createClient();
  const loginWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log(data);
    if (error) {
      console.error("Login Error:", error.message);
      return { user: null, error };
    }

    return { user: data.user, error: null };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error("Signup Error:", error.message);
      return { user: null, error };
    }
    return { user: data.user, error: null };
  };

  return { loginWithEmail, signUpWithEmail };
};
