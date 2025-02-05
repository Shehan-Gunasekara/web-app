import React, { useState, useEffect, useRef } from "react";
import style from "@/styles/components/page-header";
import { useSettingsContext } from "../providers/SettingsProvider";
import { useQuery } from "@apollo/client";
import { GET_RESTAURANT } from "@/lib/queries/restaurants";
import SkeletonHeaderTime from "./skeletons/header-time-skeleton";

function FormattedDateTime() {
  const [formattedDate, setFormattedDate] = useState("");

  const [formattedTime, setFormattedTime] = useState("");

  const { currentGMTValue, setGMT } = useSettingsContext();
  const timeIntervalID = useRef<any>(null);

  let restaurant_id: number | null = null;
  if (typeof window !== "undefined") {
    const storedId = localStorage.getItem("lono_restaurant_id");
    if (storedId) {
      restaurant_id = parseInt(storedId, 10);
    }
  }

  function getDateForGMT(gmtOffset: any) {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthsOfYear = [
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

    const now = new Date();

    const localTime = new Date(now.getTime() + gmtOffset * 60 * 60 * 1000);

    const dayOfWeek = daysOfWeek[localTime.getUTCDay()];
    const month = monthsOfYear[localTime.getUTCMonth()];

    const date = localTime.getUTCDate();
    const year = localTime.getUTCFullYear();

    return `${dayOfWeek}, ${date} ${month} ${year}`;
  }

  function getTimeForGMT(gmtOffset: any): string {
    if (!gmtOffset) return "";

    // Match the GMT offset pattern including the sign
    const match = gmtOffset.match(/([-+])(\d{2}):(\d{2})/);

    if (!match) {
      // Invalid format
      return "Invalid GMT Offset format";
    }

    const [, sign, hoursStr, minutesStr] = match;
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    // Determine the sign (+/-) for the calculation
    const signMultiplier = sign === "-" ? -1 : 1;

    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const newDate = new Date(
      utc + (3600000 * hours + 60000 * minutes) * signMultiplier
    );

    let nH = newDate.getHours();
    let nM = newDate.getMinutes();
    const meridiem = nH < 12 ? "AM" : "PM";
    nH = nH < 12 ? nH : nH % 12;
    const newHours = String(nH).padStart(2, "0");
    const newMinutes = String(nM).padStart(2, "0");

    return `${newHours}:${newMinutes} ${meridiem}`;
  }
  useEffect(() => {
    const dateForGMT = getDateForGMT(parseInt(currentGMTValue));

    setFormattedDate(dateForGMT);
  }, [currentGMTValue]);

  useEffect(() => {
    clearInterval(timeIntervalID.current);
    timeIntervalID.current = setInterval(() => {
      setFormattedTime(getTimeForGMT(currentGMTValue));
    }, 1000);

    return () => clearInterval(timeIntervalID.current);
  }, [currentGMTValue]);

  const {} = useQuery<any>(GET_RESTAURANT, {
    variables: {
      id: restaurant_id,
    },
    onCompleted: (data: any) => {
      function getTimezoneOffset() {
        const offsetMinutes = new Date().getTimezoneOffset();
        const hours = Math.floor(Math.abs(offsetMinutes) / 60);
        const minutes = Math.abs(offsetMinutes) % 60;

        const sign = offsetMinutes < 0 ? "+" : "-";

        const formattedOffset = `${sign}${hours
          .toString()
          .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

        return formattedOffset;
      }
      const timezoneOffset = getTimezoneOffset();
      setGMT(data.getRestaurant.time_zone ?? timezoneOffset);
    },
  });

  return (
    <>
      {formattedDate && formattedTime ? (
        <>
          {" "}
          {formattedDate}{" "}
          <span style={{ ...style.dateSpan }}>{formattedTime}</span>{" "}
        </>
      ) : (
        <>
          <SkeletonHeaderTime />
        </>
      )}
    </>
  );
}

export default FormattedDateTime;
