import React from "react";
import Svg, { Path } from "react-native-svg";
//https://freesvgicons.com/search?q=calendar
const DeleteIcon = ({ size, color }: { size: string; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">

      <Path
        fill="none"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
        strokeWidth="1.5"
        d="M4.687 6.213L6.8 18.976a2.5 2.5 0 0 0 2.466 2.092h3.348m6.698-14.855L17.2 18.976a2.5 2.5 0 0 1-2.466 2.092h-3.348m-1.364-9.952v5.049m3.956-5.049v5.049M2.75 6.213h18.5m-6.473 0v-1.78a1.5 1.5 0 0 0-1.5-1.5h-2.554a1.5 1.5 0 0 0-1.5 1.5v1.78z"
      />
  </Svg>
);

export default DeleteIcon;
