"use client";
import { isCopiedAtoms } from "@/jotai/ViewDutyAtoms";
import { formatTextForWhatsapp } from "@/util";
import { useAtom } from "jotai";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { TbCopyCheckFilled } from "react-icons/tb";
import { TbCopy } from "react-icons/tb";

function Filter({
  handleBedokFilter,
  handleDieppeFilter,
  handleAllData,
  handleMonthData,
  selectedMonth,
  filteredData,
}) {
  const [textToCopy, setTextCopy] = useState("");
  const [copied, setCopied] = useAtom(isCopiedAtoms);

  return (
    <div className="flex flex-row items-center justify-between w-full px-3 lg:max-w-[60%] max-w-[95%] pb-8">
      <div className="filter flex gap-1 items-center justify-center">
        <input
          className="btn filter-reset"
          type="radio"
          name="metaframeworks"
          aria-label="All"
        />
        <input
          className="btn bg-slate-100"
          type="radio"
          name="metaframeworks"
          aria-label="Bedok"
          onChange={handleBedokFilter}
        />
        <input
          className="btn bg-slate-100"
          type="radio"
          name="metaframeworks"
          aria-label="Dieppe"
          onChange={handleDieppeFilter}
        />
        <input
          className="btn bg-slate-100"
          type="radio"
          name="metaframeworks"
          aria-label="All"
          onChange={handleAllData}
        />
      </div>
      <div className="flex items-center gap-3">
        {!copied ? (
          <TbCopy
            size={18}
            onClick={() => {
              const textToCopy = formatTextForWhatsapp(filteredData);
              navigator.clipboard
                .writeText(textToCopy)
                .then(() => {
                  toast.success("Copied👍");
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                })
                .catch((err) => {
                  toast.error("Failed to copy👎");
                  console.error("Failed to copy: ", err);
                });
            }}
          />
        ) : (
          <TbCopyCheckFilled size={18} />
        )}

        <form className="flex items-center">
          <select
            value={"" || selectedMonth}
            className="rounded-xl focus:border text-center"
            onChange={(e) => handleMonthData(e.target.value)}
          >
            <option value="" disabled>
              📆
            </option>
            <option value="01">Jan</option>
            <option value="02">Feb</option>
            <option value="03">Mar</option>
            <option value="04">Apr</option>
            <option value="05">May</option>
            <option value="06">Jun</option>
            <option value="07">Jul</option>
            <option value="08">Aug</option>
            <option value="09">Sep</option>
            <option value="10">Oct</option>
            <option value="11">Nov</option>
            <option value="12">Dec</option>
          </select>
        </form>
      </div>
    </div>
  );
}

export default Filter;
