"use client";
import { Fragment, useState } from "react";
import classes from "./DeleteCollection.module.css";
import DeleteModal from "./DeleteModal";

type Delete = {
  deleteCollectionHandler: (collectionid: string) => void;
  collectionid: string;
};

function DeleteCollection({ deleteCollectionHandler, collectionid }: Delete) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  function modalOpenHandler() {
    setModalOpen(true);
  }

  function answeredYesHandler() {
    deleteCollectionHandler(decodeURIComponent(collectionid));
  }

  return (
    <Fragment>
      <div className={classes.button}>
        <button onClick={modalOpenHandler}>Delete Collection</button>
      </div>
      {modalOpen && (
        <DeleteModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          answeredYesHandler={answeredYesHandler}
        />
      )}
    </Fragment>
  );
}

export default DeleteCollection;
