"use client";
import Link from "next/link";
import React from "react";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { homePageStatsAtoms } from "@/jotai/HomePageAtoms";
import { editAtoms } from "@/jotai/DutyFormAtoms";
import { useAtom } from "jotai";
import axios from "axios";
import Modal from "@/ui/Modal";

function DutiesCard({
  shift,
  camp,
  noOfPeople,
  date,
  day,
  guardcomd,
  guardtwo,
  id,
}) {
  async function handleDeleteButton(id) {
    try {
      const newData = data.filter((prev) => prev._id !== id);
      setData(newData);
      const response = await axios.delete(`/api/users/${id}`);
      if (response.status === 404) {
        throw new Error("Duty not found");
      }
    } catch (err) {
      console.error("Error Deleting data", err);
      alert("FAILED TO DELETE DUTY, PLEASE TRY AGAIN");
    }
  }

  const [data, setData] = useAtom(homePageStatsAtoms);
  const [editData, setEditData] = useAtom(editAtoms);

  return (
    <div className="w-full max-w-[95%] mx-auto lg:max-w-[60%] h-fit bg-base-100 shadow-lg rounded-2xl p-5 mb-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl lg:text-3xl font-bold">{camp} Guard Duty</h1>
        <div className="flex items-center gap-3">
          <Link href="/view-duty/duty-content">
            <MdOutlineEdit
              size={25}
              onClick={() => {
                const dataToEdit = data.find((x) => x._id == id);
                setEditData(dataToEdit);
              }}
            />
          </Link>
          <MdDeleteOutline
            size={25}
            onClick={() => document.getElementById(id).showModal()}
            className="hover:cursor-pointer"
          />

          <Modal
            modalId={id}
            modalTitle="Hello Pls check before deleting 😠!"
            modalDescription="Delete Duty ⁉️"
            modalButton="DELETE"
            onClickFunction={() => handleDeleteButton(id)}
          />
        </div>
      </div>
      <h2 className="text-slate-500 text-sm">
        {date} {day}
      </h2>
      <div className="grid grid-cols-6 gap-3 pt-3">
        {/* First row: 3 items (each takes 2 cols out of 6) */}
        <span className="badge badge-soft badge-secondary col-span-2 w-full">
          {shift}
        </span>
        <span className="badge badge-soft badge-primary col-span-2 w-full">
          {camp}
        </span>
        <span className="badge badge-soft badge-neutral col-span-2 w-full">
          {noOfPeople} PEOPLE
        </span>

        {/* Second row: each takes 3 cols out of 6 (i.e. half row) */}
        <span
          className={`badge badge-soft badge-info w-full h-fit ${
            guardtwo ? "col-span-3" : "col-span-6"
          } `}
        >
          {guardcomd}
        </span>
        {guardtwo && (
          <span className="badge badge-soft badge-info col-span-3 w-full h-fit">
            {guardtwo}
          </span>
        )}
      </div>
    </div>
  );
}

export default DutiesCard;
