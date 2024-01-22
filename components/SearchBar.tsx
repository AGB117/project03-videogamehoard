"use client";
import { redirect } from "next/navigation";
import { Fragment, useRef } from "react";
import classes from "./SeachBar.module.css";

function SearchBar() {
  const ref = useRef<HTMLFormElement>(null);

  function redirectHandler(userInput: FormData) {
    const searchTerm = userInput.get("search");
    redirect(`/search/${searchTerm}`);
  }
  return (
    <Fragment>
      <div className={classes.searchBar}>
        <form
          action={(searchTerm) => {
            redirectHandler(searchTerm);
            ref.current?.reset();
          }}
          ref={ref}
        >
          <label htmlFor="search"></label>
          <input
            placeholder="Search..."
            name="search"
            type="text"
            id="search"
          ></input>
          <button type="submit">Search</button>
        </form>
      </div>
    </Fragment>
  );
}

export default SearchBar;
