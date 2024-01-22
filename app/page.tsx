import AuthButton from "@/components/AuthButton";
import SupabaseLogo from "@/components/SupabaseLogo";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import classes from "./page.module.css";
import { Fragment } from "react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Video Game Hoard | Home",
  description: "",
};

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: games, error } = await supabase.from("games").select();

  console.log(user);

  // const noGames = games?.length ? true : false;

  return (
    <Fragment>
      <div className={classes.imageContainer}></div>
      <div className={classes.logInContainer}>
        <p>Powered by</p>
        <SupabaseLogo />
        <div className={classes.logInButton}>
          <AuthButton />
        </div>
      </div>
    </Fragment>
  );
}
