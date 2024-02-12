import Link from "next/link";
import classes from "./Footer.module.css";
import {
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
} from "@phosphor-icons/react/dist/ssr";

function Footer() {
  return (
    <footer className={classes.footer}>
      <div className={`${classes.grid} ${classes.gridTemplateFooter}`}>
        <div>
          <Link href="/">
            <img
              className={classes.footerLogo}
              alt="logo"
              src="/favicon.png"
            ></img>
          </Link>
          <div className={classes.socialMedia}>
            <Link href="/">
              <TwitterLogo
                className={classes.socialLogos}
                size={35}
                color="grey"
                weight="fill"
              />
            </Link>

            <Link href="/">
              <FacebookLogo
                className={classes.socialLogos}
                size={35}
                color="grey"
                weight="fill"
              />
            </Link>

            <Link href="/">
              <InstagramLogo
                className={classes.socialLogos}
                size={35}
                color="grey"
                weight="fill"
              />
            </Link>
          </div>
          <div>
            <p>Copyright 2023 by Video Game Hoard</p>
            <p>All rights reserved.</p>
          </div>
        </div>
        <div>
          <h1>Contact us</h1>
          <ul>
            <li>
              <a href="https://abnergonzalez.tech">help@videogamehoard.com</a>
            </li>
          </ul>
        </div>
        <nav>
          <h1>Account</h1>
          <ul>
            <li>
              <Link href="/login"> Log in</Link>
            </li>
          </ul>
        </nav>
        <nav>
          <h1>About us</h1>
          <ul>
            <li>About Video Game Hoard</li>
          </ul>
        </nav>
        <nav>
          <h1>Help Center</h1>
          <ul>
            <li>Privacy and terms</li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
