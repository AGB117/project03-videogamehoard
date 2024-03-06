"use client";
import { ChangeEvent, ReactNode } from "react";

type changeStatus = {
  changeStatusHandler: (e: string) => void;
  children: ReactNode;
};

function StatusSelector({ changeStatusHandler, children }: changeStatus) {
  function statusChangeHandler(e: ChangeEvent<HTMLSelectElement>) {
    changeStatusHandler(e.target.value);
  }

  return (
    <select id="statusDropdown" onChange={statusChangeHandler}>
      {children}
      <option value="all">All</option>
      <option value="want to play">Want to play</option>
      <option value="currently playing">Currently Playing</option>
      <option value="completed">Completed</option>
      <option value="uncompleted">Uncompleted</option>
    </select>
  );
}
export default StatusSelector;
