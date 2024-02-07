"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import classes from "./StartedPlaying.module.css";
import ReactDOM from "react-dom";

type startedPlayingModal = {
  setModalOpen: (modalOpen: boolean) => void;
  changeStartedPlaying: (startedPlayingDate: string) => void;
  modalOpen: boolean;
};

function StartedPlayingModal({
  setModalOpen,
  changeStartedPlaying,
  modalOpen,
}: startedPlayingModal) {
  const [date, setDate] = useState<Date | null>(null);

  function startedPlayingHandler(date: Date | null) {
    if (!date) {
      return;
    }
    changeStartedPlaying(date.toDateString());
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
      <div className={classes.startedPlayingContainer}>
        <form
          className={classes.formContainer}
          onSubmit={() => startedPlayingHandler(date)}
        >
          <label htmlFor="datePicker">Started Playing</label>
          <div className={classes.input}>
            <DatePicker
              id="datePicker"
              selected={date}
              onChange={(date: Date | null) => setDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div className={classes.submitBtn}>
            <button type="submit">Submit</button>
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
export default StartedPlayingModal;
