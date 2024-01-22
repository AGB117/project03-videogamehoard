"use client";
import { ChangeEvent } from "react";

type changeCollection = {
  changeCollectionHandler: (e: string) => void;
  filteredArrayCollection: string[];
  children: React.ReactNode;
};

function CollectionSelector({
  children,
  changeCollectionHandler,
  filteredArrayCollection,
}: changeCollection) {
  function selectionHandler(e: ChangeEvent<HTMLSelectElement>) {
    console.log(e.target.value);
    changeCollectionHandler(e.target.value);
  }

  return (
    <select id="collectionDropdown" onChange={selectionHandler}>
      {children}
      {filteredArrayCollection.map((collection) => (
        <option value={collection} key={Math.random()}>
          {collection}
        </option>
      ))}
    </select>
  );
}
export default CollectionSelector;
