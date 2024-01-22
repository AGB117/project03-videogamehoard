"use client";
import { FormEvent, useState } from "react";

type FormDropDown = {
  status: string;
  collection: string;
};
type AddGame = {
  filteredArrayCollection: string[];
  addGameHandler: (status: string, collection: string) => void;
};

function AddGameForm({ filteredArrayCollection, addGameHandler }: AddGame) {
  const [statusCollection, setStatusCollection] = useState<FormDropDown>({
    status: "",
    collection: "",
  });

  const [validStatus, setValidStatus] = useState<boolean>(false);

  const valid = validStatus ? true : false;

  console.log("valid", valid);

  function selectionHandler(
    e: React.ChangeEvent<HTMLSelectElement>,
    field: keyof FormDropDown
  ) {
    // spread current statusCollection object and match the field and replace the value
    setStatusCollection({ ...statusCollection, [field]: e.target.value });

    if (field === "status") {
      setValidStatus(true);
    }
  }

  function submitHanlder(e: FormEvent) {
    e.preventDefault();
    console.log("status: ", statusCollection.status);
    console.log("collection: ", statusCollection.collection);
    addGameHandler(statusCollection.status, statusCollection.collection);
  }

  return (
    <form onSubmit={submitHanlder}>
      {/* Select Status */}

      <label htmlFor="addStatus">Status</label>
      <select
        id="addStatus"
        value={statusCollection.status}
        onChange={(e) => selectionHandler(e, "status")}
      >
        <option value="" disabled>
          Select Status
        </option>
        <option value="all">All Games</option>
        <option value="want to play">Want to play</option>

        <option value="currently playing">Currently playing</option>
        <option value="completed">Completed</option>
      </select>

      {/* Select Collection */}

      <label htmlFor="addCollection">Collection</label>
      <select
        id="addCollection"
        value={statusCollection.collection}
        onChange={(e) => selectionHandler(e, "collection")}
      >
        <option value="">Select Collection</option>
        {filteredArrayCollection.map((collection) => (
          <option value={collection} key={Math.random()}>
            {collection}
          </option>
        ))}
      </select>

      <button disabled={!valid} type="submit">
        Add game to collection
      </button>
    </form>
  );
}

export default AddGameForm;
