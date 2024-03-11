"use client";
import React from "react";
import classes from "./CustomRating.module.css";
import ReactDOM from "react-dom";

type startedPlayingModal = {
  setModalOpen: (modalOpen: boolean) => void;
  changeCustomRating: (rating: number) => void;
  modalOpen: boolean;
};

function StartedPlayingModal({
  setModalOpen,
  changeCustomRating,
  modalOpen,
}: startedPlayingModal) {
  function changeCustomRatingHandler(rating: FormData) {
    if (!rating) {
      return;
    }

    changeCustomRating(Number(rating.get("rating")));
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
      <div className={classes.startedPlayingContainer}>
        <form
          className={classes.formContainer}
          //   onSubmit={() => changeCustomRatingHandler(rating)}
          action={(rating) => {
            changeCustomRatingHandler(rating);
          }}
        >
          <label htmlFor="custonRating">Your Rating</label>
          <div className={classes.inputRow}>
            <input
              placeholder="1-100"
              name="rating"
              id="rating"
              type="number"
              min={1}
              max={100}
            ></input>
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
