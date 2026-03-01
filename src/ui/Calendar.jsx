"use client";
import React, { useState, useEffect } from "react";
import { Lobster } from "next/font/google";
import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { useAtom } from "jotai";
import { homePageStatsAtoms } from "@/jotai/HomePageAtoms";
import { getDayAndMonthFromDateInput } from "@/util";
import { useRouter } from "next/navigation";

const lobsterFont = Lobster({ subsets: ["latin"], weight: "400" });
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const dayList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function Calendar() {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  // Set timezone to sg
  const now = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Singapore",
  });
  const sgDate = new Date(now);

  const [data, setData] = useAtom(homePageStatsAtoms);
  const [currentMonthNumberReflected, setCurrentMonthNumberReflected] =
    useState(sgDate.getMonth());
  const [isLoading, setIsLoading] = useState(true);

  const currentMonthName = months[currentMonthNumberReflected];

  const currentDateInNumber = sgDate.getDate();

  const currentMonthDays = new Date(
    sgDate.getFullYear(),
    currentMonthNumberReflected + 1,
    0
  ).getDate();

  const highlightedDates = new Set(
    data.map((item) => {
      const { day, month } = getDayAndMonthFromDateInput(item.date);
      return `${day}-${month}`;
    })
  );

  return (
    <div className="w-full max-w-[95%] lg:max-w-[80%] mx-auto shadow-lg rounded-2xl p-1 py-5 md:p-8 bg-base-100">
      <h1
        className={`text-secondary text-3xl font-bold flex justify-center items-center gap-3 ${lobsterFont.className}`}
      >
        <IoMdArrowDropleft
          className="hover:cursor-pointer hover:text-secondary-focus text-secondary transition-colors"
          onClick={() => {
            setCurrentMonthNumberReflected((prev) =>
              Math.max(0, Math.min(11, currentMonthNumberReflected - 1))
            );
          }}
        />
        <span className="w-[120px] text-center"> {currentMonthName}</span>

        <IoMdArrowDropright
          className="hover:cursor-pointer hover:text-secondary-focus text-secondary transition-colors"
          onClick={() => {
            setCurrentMonthNumberReflected((prev) =>
              Math.max(0, Math.min(11, currentMonthNumberReflected + 1))
            );
          }}
        />
      </h1>

      <div className="grid grid-cols-7 gap-2 p-8">
        <span></span>
        <span></span>
        {Array.from({ length: currentMonthDays }, (_, i) => (
          <span
            key={i}
            className={`text-secondary-content border border-base-300 px-1.5 py-2.5 rounded-xl ${
              i + 1 === currentDateInNumber &&
              currentMonthNumberReflected === sgDate.getMonth()
                ? "bg-secondary text-secondary-content"
                : null
            } ${
              highlightedDates.has(
                `${i + 1}-${currentMonthNumberReflected + 1}`
              )
                ? "bg-green-300"
                : ""
            }`}
          >
            {i + 1}
          </span>
        ))}
      </div>
      <legend className="flex flex-col items-end pr-10">
        <div className="flex items-center gap-2">
          <p className="h-3 w-3 bg-secondary rounded-md"></p>
          <span>Current Date</span>
        </div>
        <div className="flex items-center gap-2 pr-6">
          <p className="h-3 w-3 bg-green-400 rounded-md"></p>
          <span>All Duties</span>
        </div>
      </legend>
    </div>
  );
}

export default Calendar;
