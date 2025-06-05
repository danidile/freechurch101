import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

//create on https://www.blobmaker.app/
// Your Blob SVG background
const BlobBackground = ({
  style,
  color,
}: {
  style: StyleProp<ViewStyle>;
  color: string;
}) => (
  <Svg
    width="30"
    height="30"
    style={style}
    viewBox="0 0 200 200"
    preserveAspectRatio="xMidYMid meet"
  >
    <Path
      fill={color+"88"}
      d="M47.8,-28C58.9,-8.2,62.9,15.2,53.8,35.4C44.6,55.6,22.3,72.5,-1.5,73.4C-25.4,74.3,-50.8,59.1,-64,36.7C-77.1,14.2,-78,-15.7,-65.3,-36.3C-52.6,-56.9,-26.3,-68.3,-4,-66C18.3,-63.7,36.6,-47.7,47.8,-28Z"
      transform="translate(100 100)"
    />
  </Svg>
);

export default BlobBackground;
