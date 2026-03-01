import React, { useEffect, useState } from "react";
import "flowbite";
import { IoMdInformationCircleOutline } from "react-icons/io";

function InfoPopover() {
  return (
    <div className="tooltip">
      <div className="tooltip-content p-5">
        <div>
          <ul className="flex flex-col items-start">
            <li>
              <span className="bg-orange-300 w-3 h-3 rounded-full inline-block"></span>
              <span className="pl-2">Duty Dates</span>
            </li>
            <li>
              <span className="bg-gray-300 w-3 h-3 rounded-full inline-block"></span>
              <span className="pl-2">Current Date</span>
            </li>
          </ul>
        </div>
      </div>
      <IoMdInformationCircleOutline size={23} />
    </div>
  );
}

export default InfoPopover;
