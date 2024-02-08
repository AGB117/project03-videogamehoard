"use client";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import classes from "./FinishedPlaying.module.css";
import ReactDOM from "react-dom";
import DatePicker from "react-datepicker";

type finishedPlayingModal = {
  setModalOpen: (modalOpen: boolean) => void;
  changeFinishedPlaying: (finishedPlayingDate: string) => void;
  modalOpen: boolean;
};

function FinishedPlayingModal({
  setModalOpen,
  changeFinishedPlaying,
  modalOpen,
}: finishedPlayingModal) {
  const [date, setDate] = useState<Date | null>(null);

  function finishedPlayingHandler(date: Date | null) {
    if (!date) {
      return;
    }
    changeFinishedPlaying(date.toDateString());
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
      <div className={classes.finishedPlayingContainer}>
        <form
          className={classes.formContainer}
          onSubmit={() => finishedPlayingHandler(date)}
        >
          <label htmlFor="datePicker">Finished Playing</label>
          <div className={classes.input}>
            <DatePicker
              id="datePicker"
              selected={date}
              onChange={(date: Date | null) => setDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div className={classes.submitBtn}>
            <button type="submit" onClick={() => finishedPlayingHandler(date)}>
              Submit
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
export default FinishedPlayingModal;
