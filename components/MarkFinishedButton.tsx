"use client";
import React from "react";
import classes from "./Card.module.css";

type Card = {
  collectionid: string;
  gameName: string;
  finishedHandler: (gameName: string) => void;
};

function MarkFinishedButton({ collectionid, gameName, finishedHandler }: Card) {
  function markFinishedHandler(gameName: string) {
    finishedHandler(gameName);
  }

  return (
    <div className={classes.check}>
      {collectionid === "currently%20playing" ? (
        <button
          onClick={() => markFinishedHandler(gameName)}
          className={classes.finished}
        >
          Mark as completed!
        </button>
      ) : (
        ""
      )}
    </div>
  );
}

export default MarkFinishedButton;
