"use client";
import React, { useEffect, useState } from "react";
import { Roboto, Poppins } from "next/font/google";
import {
  homePageStatsAtoms,
  homePageLoadingAtoms,
} from "@/jotai/HomePageAtoms";
import { useAtom } from "jotai";
import axios from "axios";
import { isDatePassed, isDutyToday } from "@/util/index";
import Loading from "@/ui/Loading";

const robotoFont = Roboto({ subsets: ["latin"], weight: "400" });
const poppinsFont = Poppins({ subsets: ["latin"], weight: "400" });

function HomepageStats() {
  const [data, setData] = useAtom(homePageStatsAtoms);
  const [loading, setLoading] = useAtom(homePageLoadingAtoms);
  const [todayFormatted, setTodayFormatted] = useState(null);
  const [dateHasPassed, setDateHasPassed] = useState(0);
  const [todaysGd, setTodaysGd] = useState(0);
  // const [loading, setLoading] = useState([true, true, true]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const formattedDate = new Date().toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        // Get req & store in state
        const response = await axios.get("/api/users");
        setData(response.data);
        setLoading(loading[0] == false);

        // Get current date
        setTodayFormatted(formattedDate);

        // Count no of days passed
        response.data.map((x) => {
          if (isDatePassed(x.date)) {
            setDateHasPassed((prev) => prev + 1);
          }
          setLoading(loading[1] == false);
        });

        // Check if there is duty today
        response.data.map((x) => {
          if (isDutyToday(x.date)) {
            setTodaysGd((prev) => prev + 1);
          }
          setLoading(loading[2] == false);
        });
      } catch (err) {
        console.error(err);
      }
    };

    getUsers();
  }, []);

  return (
    <div className="w-full max-w-[95%] lg:max-w-[80%] h-fit bg-base-100 shadow-md rounded-2xl mt-36 p-4">
      <h2 className={`text-2xl ${poppinsFont.className}`}>
        <span>Alpha</span> GD Duty Schedule
      </h2>
      <p className="text-slate-400">{todayFormatted}</p>
      <div className="flex flex-row items-center justify-between text-slate-500 pt-8">
        <div className="flex items-center gap-1 text-sm md:text-base">
          <p className="h-3 w-3 bg-orange-300 rounded-md"></p>
          <span className="font-bold">
            {loading[0] ? <Loading size="xs" /> : data?.length}
          </span>
          <span>Duties</span>
        </div>
        <div className="flex items-center gap-1 text-sm md:text-base">
          <p className="h-3 w-3 bg-indigo-400 rounded-md"></p>
          {/* <span className="font-bold">X</span> */}
          <span className="font-bold">
            {loading[1] ? <Loading size="xs" /> : dateHasPassed}
          </span>
          <span>Completed</span>
        </div>

        <div className="flex items-center gap-1 text-sm md:text-base">
          <p className="h-3 w-3 bg-green-300 rounded-md"></p>

          {/* <span className="font-bold">X</span> */}
          <span className="font-bold">
            {loading[2] ? <Loading size="xs" /> : todaysGd}
          </span>
          <span>Duty Today</span>
        </div>
      </div>
    </div>
  );
}

export default HomepageStats;
