"use client";
import React, { ChangeEvent, useRef, useState } from "react";

type FormFn = { createCollectionHandler: (formData: FormData) => void };

function CollectionForm({ createCollectionHandler }: FormFn) {
  const ref = useRef<HTMLFormElement>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const [pending, setPending] = useState<boolean>(false);

  function wordCountHandler(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setWordCount(e.target.value.trim().length);
  }

  const disButton = wordCount >= 1 && wordCount <= 20 ? false : true;

  return (
    <form
      action={(formData) => {
        setPending(true);
        createCollectionHandler(formData);
        ref.current?.reset();
        setWordCount(0);
        setPending(false);
      }}
      ref={ref}
    >
      <label htmlFor="name">Create a new collection:</label>
      <input
        onChange={wordCountHandler}
        placeholder="New Collection"
        name="name"
        type="text"
        id="name"
      ></input>
      <button disabled={disButton && !pending} type="submit">
        {pending ? "Submitting" : "Submit"}
      </button>
    </form>
  );
}

export default CollectionForm;
