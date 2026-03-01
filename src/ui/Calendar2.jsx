"use client";
import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Calendar } from "primereact/calendar";
import {
  homePageStatsAtoms,
  homePageLoadingAtoms,
} from "@/jotai/HomePageAtoms";
import InfoPopover from "./InfoPopover";
import SkeletonCalendar from "./SkeletonCalendar";

function Calendar2() {
  const [data, setData] = useAtom(homePageStatsAtoms);
  const [loading, setLoading] = useAtom(homePageLoadingAtoms);
  const [selectedInfo, setSelectedInfo] = useState([]);
  const [date, setDate] = useState(null);
  console.log(data);

  const redDatesArray = data.map((entry) => entry.date); // array of "YYYY-MM-DD" strings
  const redDatesSet = new Set(redDatesArray);

  const pad = (n) => n.toString().padStart(2, "0");

  const dateTemplate = (dateObj) => {
    const formatted = `${dateObj.year}-${pad(dateObj.month + 1)}-${pad(
      dateObj.day
    )}`;
    const isRedDate = redDatesSet.has(formatted);
    const dutyEntry = data.filter((entry) => entry.date === formatted);

    return (
      <div
        onClick={() => {
          if (isRedDate && dutyEntry.length > 0) {
            setSelectedInfo(dutyEntry); // pass full object
            document.getElementById("my_modal_4")?.showModal();
          }
        }}
        className={`w-full h-full flex items-center justify-center rounded-full cursor-pointer ${
          isRedDate ? "bg-orange-300 font-semibold" : ""
        }`}
      >
        {dateObj.day}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[95%] lg:max-w-[80%] pt-4">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-1">
        Guard Duty Dates
        <InfoPopover />
      </h2>
      {loading ? (
        <SkeletonCalendar />
      ) : (
        <Calendar
          value={date}
          onChange={(e) => setDate(e.value)}
          inline
          dateTemplate={dateTemplate}
          className="w-full shadow-md"
        />
      )}

      {/* Modal */}
      {selectedInfo.length > 0 && (
        <dialog id="my_modal_4" className="modal" open>
          <div className="modal-box max-w-xl max-h-[75%]">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg mb-4">Guard Duty Details</h3>

            {selectedInfo.map((entry, i) => (
              <div key={`entry-${i}`} className="mb-4 border-b pb-3">
                <p>
                  <strong>Date:</strong> {entry.date} ({entry.dayName})
                </p>
                <p>
                  <strong>Camp:</strong> {entry.camp}
                </p>
                <p>
                  <strong>Shift:</strong> {entry.shift}
                </p>

                <div className="mt-2">
                  <p>
                    <strong>Comds:</strong>
                  </p>
                  <ul className="list-disc list-inside">
                    {entry.comdsName?.map((name, idx) => (
                      <li key={`comd-${i}-${idx}`}>{name}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-2">
                  <p>
                    <strong>Troopers:</strong>
                  </p>
                  <ul className="list-disc list-inside">
                    {entry.troopersName?.map((name, idx) => (
                      <li key={`trooper-${i}-${idx}`}>{name}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-2">
                  <p>
                    <strong>Reserves:</strong>
                  </p>
                  <ul className="list-disc list-inside">
                    {entry.reserveName?.map((name, idx) => (
                      <li key={`reserve-${i}-${idx}`}>{name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </dialog>
      )}
    </div>
  );
}

export default Calendar2;
