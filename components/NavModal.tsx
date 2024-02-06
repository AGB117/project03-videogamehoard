import ReactDOM from "react-dom";
import Link from "next/link";
import classes from "./NavModal.module.css";
import { X } from "@phosphor-icons/react";

type ModalType = { modalHandler: () => void; modalAnimation: boolean };

function NavModal({ modalHandler, modalAnimation }: ModalType) {
  return ReactDOM.createPortal(
    <div
      className={`${classes.overlay} ${
        modalAnimation ? classes.modalDown : classes.modalUp
      }
           `}
    >
      <div className={classes.menu}>
        <div className={classes.button}>
          <button onClick={modalHandler}>
            <X size={32} />
          </button>
        </div>

        <ul>
          <li>
            <Link href="/" onClick={modalHandler}>
              Home
            </Link>
          </li>

          <li>
            <Link href="/collections/all" onClick={modalHandler}>
              Collections
            </Link>
          </li>

          <li>
            <Link href="/search" onClick={modalHandler}>
              Search
            </Link>
          </li>
        </ul>
      </div>
    </div>,
    document.body
  );
}

export default NavModal;
