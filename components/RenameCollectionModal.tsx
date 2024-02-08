"use client";
import React, { ChangeEvent, useRef, useState } from "react";
import ReactDOM from "react-dom";
import classes from "@/components/RenameCollection.module.css";

type RenameModalType = {
  setModalOpen: (modalOpen: boolean) => void;
  renameCollection: (collectionRename: FormData) => void;
  modalOpen: boolean;
};

function RenameModal({
  renameCollection,
  setModalOpen,
  modalOpen,
}: RenameModalType) {
  //form
  const ref = useRef<HTMLFormElement>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const [pending, setPending] = useState<boolean>(false);

  function wordCountHandler(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setWordCount(e.target.value.trim().length);
  }

  const disButton = wordCount >= 1 && wordCount <= 20 ? false : true;

  ///handlers

  function submit(collectionRename: FormData) {
    renameCollection(collectionRename);
    console.log("rename to", collectionRename.get("collectionRename"));
    setModalOpen(false);
  }

  function cancelHandler() {
    setModalOpen(false);
  }

  return ReactDOM.createPortal(
    <div
      className={`${classes.overlay} ${
        modalOpen ? classes.modalDown : classes.modalUp
      }
           `}
    >
      <div className={classes.renameCollectionContainer}>
        <form
          className={classes.formContainer}
          action={(collectionRename) => {
            setPending(true);
            submit(collectionRename);
            ref.current?.reset();
            setWordCount(0);
            setPending(false);
          }}
          ref={ref}
        >
          <label htmlFor="name">Rename collection:</label>

          <div className={classes.input}>
            <input
              onChange={wordCountHandler}
              placeholder="name..."
              name="collectionRename"
              type="text"
              id="collectionRename"
            ></input>
          </div>

          <div className={classes.submitBtn}>
            <button disabled={disButton && !pending} type="submit">
              {pending ? "Submitting" : "Submit"}
            </button>
          </div>

          <div className={classes.cancelBtn}>
            <button onClick={cancelHandler}>Cancel</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
export default RenameModal;
