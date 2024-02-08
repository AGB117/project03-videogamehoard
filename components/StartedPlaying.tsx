"use client";
import React, { Fragment, useState } from "react";
import StartedPlayingModal from "./StartedPlayingModal";
import classes from "./StartedPlaying.module.css";

type ChangeStartedType = { ChangeStartedPlayingDate: (date: string) => void };

function StartedPlaying({ ChangeStartedPlayingDate }: ChangeStartedType) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  function changeStartedPlaying(date: string) {
    ChangeStartedPlayingDate(date);
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
        <StartedPlayingModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          changeStartedPlaying={changeStartedPlaying}
        />
      )}
    </Fragment>
  );
}

export default StartedPlaying;
