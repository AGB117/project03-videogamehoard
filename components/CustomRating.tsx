"use client";
import React, { Fragment, useState } from "react";
import CustomRatingModal from "./CustomRatingModal";
import classes from "./CustomRating.module.css";

type CustomRatingType = { ChangeCustomRating: (rating: number) => void };

function CustomRating({ ChangeCustomRating }: CustomRatingType) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  function changeCustomRating(rating: number) {
    ChangeCustomRating(rating);
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
        <CustomRatingModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          changeCustomRating={changeCustomRating}
        />
      )}
    </Fragment>
  );
}

export default CustomRating;
