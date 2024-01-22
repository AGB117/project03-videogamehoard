import classes from "./page.module.css";
import { headers, cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Fragment } from "react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Video Game Hoard | Log In",
  description: "",
};

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/collections/all");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  return (
    <Fragment>
      <div className={classes.imageContainer}></div>
      <div className={classes.logInContainer}>
        <form
          className={`${"animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"} `}
          action={signIn}
        >
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border border-black mb-6"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border border-black mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
            Sign In
          </button>
          <button
            formAction={signUp}
            className="border bg-slate-300 border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
          >
            Sign Up
          </button>
          {searchParams?.message && (
            <p className="mt-4 p-4 text-center bg-foreground/10 rounded-md text-slate-800">
              {searchParams.message}
            </p>
          )}
        </form>
      </div>
    </Fragment>
  );
}
