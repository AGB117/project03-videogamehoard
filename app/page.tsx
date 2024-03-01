import AuthButton from "@/components/AuthButton";
import SupabaseLogo from "@/components/SupabaseLogo";
// import { createClient } from "@/utils/supabase/server";
// import { cookies } from "next/headers";
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
  return (
    <Fragment>
      <div className={classes.imageContainer}></div>
      <div className={classes.homeContainer}>
        <div className={classes.features}>
          <p>Search over 350,000 games.</p>

          <div className={classes.featuresImgContainer}>
            <div className={classes.home1}>
              <img alt="website features" src="/home1.webp" />
            </div>
            <div className={classes.home2}>
              <img alt="website features" src="/home2.webp" />
            </div>
          </div>
          <p>Save games to your custom collections and track your progress.</p>
        </div>
        <div className={classes.logInContainer}>
          <div className={classes.logIn}>
            <p>Powered by</p>
            <SupabaseLogo />
            <div className={classes.logInButton}>
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
