"use client";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import CollectionForm from "./CollectionForm";
import FolderIcon from "./FolderIcon";
import classes from "./CollectionBar.module.css";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
type FilteredArray = {
  filteredArray: string[];
  createCollectionHandler: (formData: FormData) => void;
};

type WidthObject = {
  width: number;
};

function CollectionBar({
  filteredArray,
  createCollectionHandler,
}: FilteredArray) {
  const [collectionBarOpen, SetCollectionBarOpen] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<WidthObject>({ width: 0 });
  const [mobileNav, setMobileNav] = useState<boolean>();
  const [animation, setAnimation] = useState<boolean>();

  function collectionBarHandler() {
    setAnimation(!animation);
    setTimeout(() => {
      SetCollectionBarOpen(!collectionBarOpen);
    }, 150);
  }

  useEffect(() => {
    const widthHandler = () => {
      setWindowWidth({ width: window.innerWidth });
    };

    window.addEventListener("resize", widthHandler);
    widthHandler();
  }, []);

  useEffect(() => {
    windowWidth.width <= 1100 ? setMobileNav(true) : setMobileNav(false);
  }, [windowWidth.width]);

  return (
    <Fragment>
      <div className={classes.collectionBar}>
        {mobileNav && (
          <div className={classes.top}>
            <div className={classes.collections}>
              <p>My games</p>
            </div>
            <div className={classes.buttons}>
              {collectionBarOpen && (
                <button onClick={collectionBarHandler}>
                  <CaretUp size={32} />
                </button>
              )}
              {!collectionBarOpen && (
                <button onClick={collectionBarHandler}>
                  <CaretDown size={32} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* for mobile nav only (collectionBarOpen || !mobileNav)*/}
        {mobileNav
          ? collectionBarOpen && (
              <ul
                className={`${animation ? classes.modalDown : classes.modalUp}`}
              >
                <li>
                  <CollectionForm
                    createCollectionHandler={createCollectionHandler}
                  />
                </li>
                <li className={classes.status}>
                  <FolderIcon />
                  <Link
                    href="/collections/[collectionid]"
                    as={`/collections/all`}
                    onClick={collectionBarHandler}
                  >
                    All games
                  </Link>
                </li>
                <li className={classes.status}>
                  <FolderIcon />
                  <Link
                    href="/collections/[collectionid]"
                    as={`/collections/want%20to%20play`}
                    onClick={collectionBarHandler}
                  >
                    Want to play
                  </Link>
                </li>
                <li className={classes.status}>
                  <FolderIcon />
                  <Link
                    href="/collections/[collectionid]"
                    as={`/collections/currently%20playing`}
                    onClick={collectionBarHandler}
                  >
                    Currently playing
                  </Link>
                </li>
                <li className={classes.status}>
                  <FolderIcon />
                  <Link
                    href="/collections/[collectionid]"
                    as={`/collections/completed`}
                    onClick={collectionBarHandler}
                  >
                    Completed
                  </Link>
                </li>

                {filteredArray.map((collections) => (
                  <li className={classes.userCollection} key={Math.random()}>
                    <FolderIcon />
                    <Link
                      href="/collections/[collectionid]"
                      as={`/collections/${encodeURIComponent(collections)}`}
                      onClick={collectionBarHandler}
                    >
                      {collections}
                    </Link>
                  </li>
                ))}
              </ul>
            )
          : ""}

        {/* for desktop navigation */}
        {!mobileNav && (
          <ul>
            <li>
              <CollectionForm
                createCollectionHandler={createCollectionHandler}
              />
            </li>
            <li className={classes.status}>
              <FolderIcon />
              <Link href="/collections/[collectionid]" as={`/collections/all`}>
                All games
              </Link>
            </li>
            <li className={classes.status}>
              <FolderIcon />
              <Link
                href="/collections/[collectionid]"
                as={`/collections/want%20to%20play`}
                onClick={collectionBarHandler}
              >
                Want to play
              </Link>
            </li>
            <li className={classes.status}>
              <FolderIcon />
              <Link
                href="/collections/[collectionid]"
                as={`/collections/currently%20playing`}
              >
                Currently playing
              </Link>
            </li>
            <li className={classes.status}>
              <FolderIcon />
              <Link
                href="/collections/[collectionid]"
                as={`/collections/completed`}
              >
                Completed
              </Link>
            </li>

            {filteredArray.map((collections) => (
              <li className={classes.userCollection} key={Math.random()}>
                <FolderIcon />
                <Link
                  href="/collections/[collectionid]"
                  as={`/collections/${encodeURIComponent(collections)}`}
                >
                  {collections}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Fragment>
  );
}

export default CollectionBar;
