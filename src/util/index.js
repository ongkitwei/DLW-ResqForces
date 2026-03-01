import { func } from "joi";

export function getDayAndMonthFromDateInput(dateInput) {
  const date = new Date(dateInput);

  // Set timezone to sg
  const now = date.toLocaleString("en-US", {
    timeZone: "Asia/Singapore",
  });
  const sgDate = new Date(now);

  const month = sgDate.getMonth() + 1; // add 1 because getMonth() is 0-based
  const day = sgDate.getDate(); // getDate() is 1-based
  return { month, day };
}

export function getDayName(selectedDate) {
  const dateObj = new Date(selectedDate);
  const dayName = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "Asia/Singapore", // Add this to get day in SG timezone
  }); // "Thursday"
  return dayName;
}

export function isDatePassed(dateString) {
  const inputDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate < today;
}

export function isDutyToday(dateString) {
  // Convert the current time to Singapore time
  const now = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Singapore",
  });

  // Create a new Date object based on the Singapore-local time string
  const sgNow = new Date(now);
  sgNow.setHours(0, 0, 0, 0); // Normalize to midnight
  const inputDate = new Date(dateString);
  inputDate.setHours(0, 0, 0, 0); // Normalize to midnight

  return inputDate.getTime() === sgNow.getTime();
}

export function filterMonth(monthToFilter, dateString) {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return month === monthToFilter;
}

export function formatTextForWhatsapp(data) {
  let formattedText = "";

  // Sort data: BEDOK first, then DIEPPE (or others alphabetically if needed)
  const sortedData = [...data].sort((a, b) => {
    if (a.camp === "BEDOK" && b.camp !== "BEDOK") return -1;
    if (a.camp !== "BEDOK" && b.camp === "BEDOK") return 1;
    return 0; // keep existing order for same camp
  });

  sortedData.forEach((entry) => {
    const { camp, date, dayName, shift, comdsName, troopersName, reserveName } =
      entry;

    const dateObj = new Date(date);
    const formattedDate = `${dateObj.getDate()}/${
      dateObj.getMonth() + 1
    }/${dateObj.getFullYear().toString().slice(-2)}`;

    formattedText += `*${camp}*\n`;
    formattedText += `*${formattedDate} (${dayName})*\n\n`;

    if (comdsName && comdsName.length) {
      formattedText += `*GC* ${comdsName[0]}\n`;
      if (comdsName[1]) formattedText += `*G2* ${comdsName[1]}\n`;
    }

    if (troopersName && troopersName.length) {
      troopersName.forEach((trooper) => {
        formattedText += `${trooper}\n`;
      });
    }

    if (reserveName && reserveName.length) {
      formattedText += `\n*RESERVE:*\n`;
      reserveName.forEach((reserve) => {
        formattedText += `${reserve}\n`;
      });
    }

    formattedText += `\n\n---------------------------------\n\n`;
  });

  return formattedText.trim();
}
