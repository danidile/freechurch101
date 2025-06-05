import React from "react";
import Svg, { Path } from "react-native-svg";
//https://freesvgicons.com/search?q=calendar
const PlusIcon = ({ size, color }: { size: string; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path fill={color} d="M14 7H9V2H7v5H2v2h5v5h2V9h5V7z" />
  </Svg>
);

export default PlusIcon;
