import Link from "next/link";
import AuthButton from "./AuthButton";
import classes from "./NavBar.module.css";
import { Fragment } from "react";
import MobileNav from "./MobileNav";

async function NavBar() {
  return (
    <Fragment>
      <div className={classes.nav}>
        <Link href="/">
          <div className={classes.logo}>
            <img alt="company logo" src="/favicon.png" />
          </div>
        </Link>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>

          <li>
            <Link href="/collections/all">Collections</Link>
          </li>

          <li>
            <Link href="/search">Search</Link>
          </li>

          <li>
            <AuthButton />
          </li>
        </ul>
      </div>

      <MobileNav />
    </Fragment>
  );
}
export default NavBar;
