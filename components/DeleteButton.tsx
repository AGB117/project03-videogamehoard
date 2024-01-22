"use client";

type deleteGame = { deleteGameHandler: () => void };

function AddButton({ deleteGameHandler }: deleteGame) {
  function deleteGameButton() {
    deleteGameHandler();
  }

  return (
    <div>
      <button onClick={deleteGameButton}>Delete Game from library</button>
    </div>
  );
}
export default AddButton;
