"use client";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import classes from "./StartedPlaying.module.css";
import ReactDOM from "react-dom";
import { Calendar } from "@phosphor-icons/react";
import DatePicker from "react-datepicker";

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
    setModalOpen(false);
  }

  function cancelHandler() {
    setModalOpen(false);
  }

  useEffect(() => {
    if (typeof document !== "undefined") {
      //placeholder
      const element = document.getElementById("datePicker") as HTMLInputElement;
      if (element) {
        element.placeholder = "Select date";
      }
    }
  }, []);

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
          <label htmlFor="datePicker">
            Started Playing
            <div className={classes.calendarIcon}>
              <Calendar size={32} weight="duotone" color="#2b8a3e" />
            </div>
          </label>
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

/* ///////////////////////////////
  useEffect(() => {
    if (typeof document !== "undefined") {
      //placeholder
      const element = document.getElementById("datePicker") as HTMLInputElement;
      if (element) {
        element.placeholder = "Select date";
      }

      //input
      //selector
      const inputElement = document.getElementById("datePicker");
      if (inputElement) {
        //create DIV
        const divCalendarIcon = document.createElement("div");

        //insert div
        inputElement.parentNode?.insertBefore(
          divCalendarIcon,
          inputElement.nextSibling
        );

        //determine content inside the div
        ReactDOM.render(<Calendar size={32} />, divCalendarIcon);
      }
    }
  }, []);
  //////////////////////////////*/
