import React from "react";
import Svg, { Circle, G, Path } from "react-native-svg";
//https://freesvgicons.com/search?q=calendar
const CheckIcon = ({ size, color }: { size: string; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20">
    <Path fill={color} d="M7 14.2L2.8 10l-1.4 1.4L7 17L19 5l-1.4-1.4z" />
  </Svg>
);

export default CheckIcon;
