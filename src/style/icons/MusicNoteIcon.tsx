import React from "react";
import Svg, { Path } from "react-native-svg";
//https://freesvgicons.com/search?q=calendar
const MusicNoteIcon = ({ size, color }: { size: string; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">

      <Path
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 16v3a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h3Zm0 0V8m0 0V4l5-1v4l-5 1Z"
      />
  </Svg>
);

export default MusicNoteIcon;
