import React from "react";
//https://freesvgicons.com/search?q=calendar
const CalendarIcon = ({ size, color }: { size: string; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M17 4.625H7a4 4 0 0 0-4 4v8.75a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-8.75a4 4 0 0 0-4-4m-14 6h18m-4-8v4m-10-4v4"
    />
  </svg>
);

export default CalendarIcon;
