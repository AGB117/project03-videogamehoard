"use client";

type addGame = { addGameHandler: () => void };

function AddButton({ addGameHandler }: addGame) {
  function addGameButton() {
    addGameHandler();
  }

  return (
    <div>
      <button onClick={addGameButton}>Add Game</button>
    </div>
  );
}
export default AddButton;
