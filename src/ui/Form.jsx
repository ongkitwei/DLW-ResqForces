"use client";

import React, { useState, useEffect } from "react";
import { Roboto } from "next/font/google";
import names from "../../data/troopersNames.json";
import comdnames from "../../data/comdsNames.json";
import allnames from "../../data/names.json";
import { useAtom } from "jotai";
import axios from "axios";
import { getDayName } from "@/util/index";
import {
  campAtoms,
  shiftAtoms,
  dateAtoms,
  troopersMainAtoms,
  commandersAtoms,
  reserveAtoms,
} from "@/jotai/DutyFormAtoms";
import toast from "react-hot-toast";
import SearchableSelect from "./SearchableSelect";

const robotoFont = Roboto({ subsets: ["latin"], weight: "700" });

function Form({ title, buttonName }) {
  const [camp, setCamp] = useAtom(campAtoms);
  const [date, setDate] = useAtom(dateAtoms);
  const [shift, setShift] = useAtom(shiftAtoms);
  const [troopersName, setTroopersName] = useAtom(troopersMainAtoms);
  const [comdsName, setComdsName] = useAtom(commandersAtoms);
  const [reserveName, setReserveName] = useAtom(reserveAtoms);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setComdsName([]);
    setTroopersName([""]);
    setDate("");
    setCamp("");
    setShift("");
    setReserveName([""]);
  }, []);

  async function handleOnSubmit(event) {
    event.preventDefault();
    const dayName = getDayName(date);
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await axios.post("/api/users", {
        camp,
        date,
        dayName,
        shift,
        troopersName,
        comdsName,
        reserveName,
      });

      toast.success("Duty Added");
      console.log(response);
      setComdsName([]);
      setTroopersName([""]);
      setDate("");
      setCamp("");
      setShift("");
      setReserveName([""]);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add duty");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h2
        className={`font-extrabold pb-8 text-center text-gray-800 text-3xl ${robotoFont.className}`}
      >
        {title}
      </h2>

      <form className="w-full" onSubmit={handleOnSubmit}>
        <select
          className="select select-bordered w-full"
          onChange={(x) => setCamp(x.target.value)}
          value={camp || ""}
          required
        >
          <option value="" disabled>
            Select camp
          </option>
          <option value="DIEPPE">DIEPPE</option>
          <option value="BEDOK">BEDOK</option>
        </select>

        <div className="flex flex-row items-end justify-center mt-8 gap-3 mb-12">
          <div>
            <label htmlFor="datee" className="pl-2 text-slate-500 text-xs">
              Guard Duty date
            </label>
            <input
              type="date"
              id="datee"
              className="input input-bordered w-full"
              onChange={(x) => setDate(x.target.value)}
              value={date}
              required
            />
          </div>

          <select
            className="select select-bordered w-full"
            onChange={(x) => setShift(x.target.value)}
            value={shift || ""}
            required
          >
            <option value="" disabled>
              Shift hours
            </option>
            <option value="12 HR">12 HR</option>
            <option value="24 HR">24 HR</option>
          </select>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center">
            <span className="text-base pl-1">TROOPERS</span>
            <button
              type="button"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 hover:cursor-pointer"
              onClick={() => setTroopersName([...troopersName, ""])}
            >
              + Trooper
            </button>
          </div>

          <div className="pt-4">
            {troopersName.map((name, index) => (
              <SearchableSelect
                key={index}
                value={name}
                options={names}
                onChange={(val) => {
                  const updated = [...troopersName];
                  updated[index] = val;
                  setTroopersName(updated);
                }}
              />
            ))}
          </div>
        </div>

        <div className="pt-10">
          <h2 className="pl-1 text-base">COMMANDERS</h2>

          <SearchableSelect
            value={comdsName[0] || ""}
            options={comdnames}
            onChange={(val) => {
              const updated = [...comdsName];
              updated[0] = val;
              setComdsName(updated);
            }}
          />

          <SearchableSelect
            value={comdsName[1] || ""}
            options={comdnames}
            onChange={(val) => {
              const updated = [...comdsName];
              updated[1] = val;
              setComdsName(updated);
            }}
          />
        </div>

        <div className="mt-10">
          <div className="flex justify-between items-center">
            <span className="pl-1">RESERVES</span>
            <button
              type="button"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 hover:cursor-pointer"
              onClick={() => setReserveName([...reserveName, ""])}
            >
              + Reserve
            </button>
          </div>

          <div className="pt-4">
            {reserveName.map((name, index) => (
              <SearchableSelect
                key={index}
                value={name}
                options={allnames}
                onChange={(val) => {
                  const updated = [...reserveName];
                  updated[index] = val;
                  setReserveName(updated);
                }}
              />
            ))}
          </div>
        </div>

        <button className="btn btn-info mt-12 w-full" type="submit">
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            buttonName
          )}
        </button>
      </form>
    </>
  );
}

export default Form;
