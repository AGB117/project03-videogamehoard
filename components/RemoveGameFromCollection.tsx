"use client";
import classes from "./DeleteCollection.module.css";

type Delete = {
  removeCollectionHandler: () => void;
};

function RemoveGameFromCollection({ removeCollectionHandler }: Delete) {
  function removeFromCollectionHandler() {
    removeCollectionHandler();
  }

  return (
    <div className={classes.button}>
      <button onClick={removeFromCollectionHandler}>
        Remove game from collection
      </button>
    </div>
  );
}

export default RemoveGameFromCollection;
