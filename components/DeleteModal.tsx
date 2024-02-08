"use client";
import ReactDOM from "react-dom";
import classes from "@/components/NavModal.module.css";

type DeleteModalType = {
  setModalOpen: (modalOpen: boolean) => void;
  answeredYesHandler: () => void;
  modalOpen: boolean;
};

function DeleteModal({
  answeredYesHandler,
  setModalOpen,
  modalOpen,
}: DeleteModalType) {
  function deleteHandler() {
    answeredYesHandler();
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
      <div className={classes.deleteCollectionContainer}>
        <p>Are you sure you want to delete this collection?</p>
        <div className={classes.deletebuttonContainer}>
          <div className={classes.buttonDelete}>
            <button onClick={deleteHandler}>Delete</button>
          </div>

          <div className={classes.buttonDelete}>
            <button onClick={cancelHandler}>Cancel</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default DeleteModal;
