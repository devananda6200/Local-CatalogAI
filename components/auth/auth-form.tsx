"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const [loading, setLoading] = useState(false);
  const isSignUp = mode === "sign-up";
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const supabase = createClient();
    if (!supabase) {
      toast.success("Demo workspace opened", {
        description: "Connect Supabase to enable real accounts.",
      });
      window.location.assign("/dashboard");
      return;
    }
    const result = isSignUp
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: String(form.get("name") || "") },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
      : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (result.error) return toast.error(result.error.message);
    if (!isSignUp && !result.data.session)
      return toast.error(
        "Sign in completed without a session. Confirm your email and try again.",
      );
    toast.success(
      isSignUp ? "Check your email to confirm your account" : "Welcome back",
    );
    if (!isSignUp || result.data.session) window.location.assign("/dashboard");
  }
  return (
    <form className="mt-8 grid gap-4" onSubmit={submit}>
      {isSignUp ? (
        <Field
          label="Your name"
          name="name"
          autoComplete="name"
          required
          placeholder="Asha Menon"
        />
      ) : null}
      <Field
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@business.com"
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete={isSignUp ? "new-password" : "current-password"}
        required
        minLength={8}
        placeholder="At least 8 characters"
      />
      <Button className="mt-2 w-full" disabled={loading}>
        {loading ? (
          <LoaderCircle className="animate-spin" size={17} />
        ) : (
          <>
            {isSignUp ? "Create free account" : "Sign in"}
            <ArrowRight size={17} />
          </>
        )}
      </Button>
      {!process.env.NEXT_PUBLIC_SUPABASE_URL ? (
        <p className="rounded-2xl bg-[#eef4ef] p-3 text-center text-xs leading-5 text-[#4d6255]">
          Demo mode is active. Any credentials will open the sample owner
          workspace.
        </p>
      ) : null}
    </form>
  );
}
