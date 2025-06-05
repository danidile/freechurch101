import React from "react";
//https://freesvgicons.com/search?q=calendar
const UserIcon = ({ size, color }: { size: string; color: string }) => (
  <svg
    width={Number(size)*1.2}
    height={Number(size)*1.2}
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      stroke={color}
      stroke-linecap="round"
      stroke-linejoin="round"
      strokeWidth="1.6"
      d="M19.618 21.25c0-3.602-4.016-6.53-7.618-6.53c-3.602 0-7.618 2.928-7.618 6.53M12 11.456a4.353 4.353 0 1 0 0-8.706a4.353 4.353 0 0 0 0 8.706"
    />
  </svg>
);

export default UserIcon;
