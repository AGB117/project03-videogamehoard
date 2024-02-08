"use client";
import React, { Fragment, useState } from "react";
import FinishedPlayingModal from "./FinishedPlayingModal";
import classes from "./StartedPlaying.module.css";

type ChangeFinishedType = { ChangeFinishedPlayingDate: (date: string) => void };

function FinishedPlaying({ ChangeFinishedPlayingDate }: ChangeFinishedType) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  function changeFinishedPlaying(date: string) {
    ChangeFinishedPlayingDate(date);
  }

  function modalOpenHandler() {
    setModalOpen(true);
  }
  return (
    <Fragment>
      <div className={classes.editBtn}>
        <button onClick={modalOpenHandler}>Edit</button>
      </div>
      {modalOpen && (
        <FinishedPlayingModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          changeFinishedPlaying={changeFinishedPlaying}
        />
      )}
    </Fragment>
  );
}

export default FinishedPlaying;
