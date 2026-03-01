"use client";
import DutiesCard from "@/components/DutiesCard";
import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { homePageStatsAtoms } from "@/jotai/HomePageAtoms";
import { isCopiedAtoms } from "@/jotai/ViewDutyAtoms";
import axios from "axios";
import Filter from "@/ui/Filter";
import { filterMonth, formatTextForWhatsapp } from "@/util";

function page() {
  const [data, setData] = useAtom(homePageStatsAtoms);
  const [copied, setCopied] = useAtom(isCopiedAtoms);
  const [filter, setFilter] = useState("ALL");
  const [selectedMonth, setSelectedMonth] = useState("");

  const filteredData = data.filter((x) => {
    const campFilter = x.camp == filter || filter == "ALL";
    const monthFilter =
      selectedMonth == "" || filterMonth(selectedMonth, x.date);
    return campFilter && monthFilter;
  });

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        console.log(response.data);
        setData(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    getUsers();
  }, []);

  function handleBedokFilter() {
    console.log("bedok camp filter");
    setFilter("BEDOK");
  }
  function handleDieppeFilter() {
    console.log("dieppe camp filter");
    setFilter("DIEPPE");
  }
  function handleAllData() {
    console.log("show all data");
    setFilter("ALL");
  }
  function handleMonthData(selectedMonth) {
    console.log("show data with specific month", selectedMonth);
    setSelectedMonth(selectedMonth);
  }
  return (
    <div className="mt-24 flex flex-col items-center">
      <Filter
        handleBedokFilter={handleBedokFilter}
        handleDieppeFilter={handleDieppeFilter}
        handleAllData={handleAllData}
        handleMonthData={handleMonthData}
        selectedMonth={selectedMonth}
        filteredData={filteredData}
      />

      {filteredData.map((x, index) => (
        <DutiesCard
          key={index}
          date={x.date}
          day={x.dayName}
          shift={x.shift}
          noOfPeople={
            (x.comdsName?.length ?? 0) +
            (x.troopersName?.length ?? 0) +
            (x.reserveName?.length ?? 0)
          }
          camp={x.camp}
          guardcomd={x.comdsName?.[0]}
          guardtwo={x.comdsName?.[1]}
          id={x._id}
        />
      ))}
    </div>
  );
}

export default page;
