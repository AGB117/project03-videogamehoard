import { Fragment } from "react";
import classes from "./page.module.css";
import SearchBar from "@/components/SearchBar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Video Game Hoard | Search",
  description: "",
};
async function Search() {
  return (
    <Fragment>
      <div className={classes.searchContainer}>
        <SearchBar />
      </div>
    </Fragment>
  );
}
export default Search;
