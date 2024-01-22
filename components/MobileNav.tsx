"use client";
import Link from "next/link";
import classes from "./NavBar.module.css";
import { useEffect, useState } from "react";
import { List } from "@phosphor-icons/react";
import Modal from "./Modal";

function MobileNav() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalAnimation, setModalAnimation] = useState<boolean>(false);

  function modalHandler() {
    setModalAnimation(!modalAnimation);
    setTimeout(() => {
      setOpenModal(!openModal);
    }, 100);
  }

  useEffect(() => {
    if (openModal) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [openModal]);

  return (
    <div className={classes.mobileNav}>
      <Link href="/">
        <div className={classes.logo}>
          <img alt="company logo" src="/favicon.png" />
        </div>
      </Link>
      <div className={classes.menuButton}>
        {!openModal && (
          <button onClick={modalHandler}>
            <List size={32} />
          </button>
        )}
      </div>

      {openModal && (
        <Modal modalHandler={modalHandler} modalAnimation={modalAnimation} />
      )}
    </div>
  );
}

export default MobileNav;
