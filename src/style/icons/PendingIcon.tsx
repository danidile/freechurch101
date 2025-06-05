import React from "react";
import Svg, { Circle, G, Path } from "react-native-svg";
//https://freesvgicons.com/search?q=calendar
const PendingIcon = ({ size, color }: { size: string; color: string }) => (
  <Svg width={Number(size) * 0.9} height={Number(size)} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M15.098 12.634L13 11.423V7a1 1 0 0 0-2 0v5a1 1 0 0 0 .5.866l2.598 1.5a1 1 0 1 0 1-1.732ZM12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8a8.01 8.01 0 0 1-8 8Z"
    />
  </Svg>
);

export default PendingIcon;
