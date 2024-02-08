"use client";
import React, { ChangeEvent, Fragment, useRef, useState } from "react";
import classes from "./DeleteCollection.module.css";
import RenameCollectionModal from "./RenameCollectionModal";

type Renemae = {
  renameCollectionHandler: (formData: FormData) => void;
};

function RenameCollection({ renameCollectionHandler }: Renemae) {
  //modals
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  function modalOpenHandler() {
    setModalOpen(true);
  }

  //handlers
  function renameCollection(collectionRename: FormData) {
    renameCollectionHandler(collectionRename);
    // console.log("rename to", collectionRename);
  }

  return (
    <Fragment>
      <div className={classes.button}>
        <button onClick={modalOpenHandler}>Rename collection</button>
      </div>
      {modalOpen && (
        <RenameCollectionModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          renameCollection={renameCollection}
        />
      )}
    </Fragment>
  );
}

export default RenameCollection;
