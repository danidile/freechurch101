"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { FaPlus, FaMinus } from "react-icons/fa";

import { FaCircle } from "react-icons/fa6";
import { BiColor } from "react-icons/bi";
import { useMemo, useState } from "react";
import { LuTextQuote } from "react-icons/lu";
import { RiFontSize } from "react-icons/ri";
import CDropdown from "./CDropdown";
export const fontSizes = [
  { key: "14", label: "14" },
  { key: "15", label: "15" },
  { key: "16", label: "16" },
  { key: "17", label: "17" },
  { key: "18", label: "18" },
  { key: "19", label: "19" },
  { key: "20", label: "20" },
  { key: "21", label: "21" },
  { key: "22", label: "22" },
  { key: "23", label: "23" },
];
export default function CustomizeTextWidget() {
  const [fontSize, setFontSize] = useState(14);

  const updateFontSize = (element: string) => {
    if (element === "plus") {
      if (fontSize < 20) {
        const newSize = fontSize + 1;
        setFontSize(newSize);
      }
    } else if (element === "minus") {
      if (fontSize > 13) {
        const newSize = fontSize - 1;
        setFontSize(newSize);
      }
    }
    const lyricsElements = document.querySelectorAll(".lyrics");
    const chordsElements = document.querySelectorAll(".chord");
    const commentElements = document.querySelectorAll(".comment");
    const biggersize = Number(fontSize) * 1.2;

    lyricsElements.forEach((el) => {
      (el as HTMLElement).style.fontSize = `${fontSize}px`;
      (el as HTMLElement).style.lineHeight = `${fontSize}px`;
    });
    chordsElements.forEach((el) => {
      (el as HTMLElement).style.fontSize = `${fontSize}px`;
      (el as HTMLElement).style.lineHeight = `${Number(fontSize) * 1.2}px`;
    });
    commentElements.forEach((el) => {
      (el as HTMLElement).style.fontSize = `${biggersize}px`;
      (el as HTMLElement).style.lineHeight = `${biggersize}px`;
    });
  };

  const changeBodyColor = (color: string) => {
    const newColor = color;
    const lyricsElements = document.querySelectorAll(".lyrics");
    const commentElements = document.querySelectorAll(".comment");

    lyricsElements.forEach((el) => {
      (el as HTMLElement).style.color = `${newColor}`;
    });

    commentElements.forEach((el) => {
      (el as HTMLElement).style.color = `${newColor}`;
    });
  };

  const changeChordsColor = (color: string) => {
    const newColor = color;
    const chordsElements = document.querySelectorAll(".chord");

    chordsElements.forEach((el) => {
      (el as HTMLElement).style.color = `${newColor}`;
    });
  };
  const options = useMemo(() => {
    const allOptions = [
      {
        label: (
          <div
            className="transopose-section"
            onMouseDown={(e) => e.stopPropagation()} // ✅ Prevent dropdown from closing
          >
            <p className="font-medium">Dimensione Carattere:</p>
            <button
              onMouseDown={(e) => e.stopPropagation()} // ✅ Prevent dropdown from closing
              type="button"
              className="icon-button"
              onClick={(e) => {
                e.stopPropagation(); // ✅ Stop bubbling
                updateFontSize("minus");
              }}
            >
              <FaMinus />
            </button>
            <button
              onMouseDown={(e) => e.stopPropagation()} // ✅ Prevent dropdown from closing
              type="button"
              className="icon-button"
              onClick={(e) => {
                e.stopPropagation(); // ✅ Stop bubbling
                updateFontSize("plus");
              }}
            >
              <FaPlus />
            </button>
          </div>
        ),
        value: "transpose",
      },

      {
        label: (
          <p className="hover:text-blue-500 transition duration-200">
            <span className="font-medium">Con Accordi</span>
          </p>
        ),
        value: "chords",
      },
      {
        label: (
          <p className="hover:text-blue-500 transition duration-200">
            <span className="font-medium">Converti # in b</span>
          </p>
        ),
        value: "sharp-flat",
      },
    ];
    return allOptions;
  }, []);
  return (
    <>
      <CDropdown
        options={options}
        buttonPadding="sm"
        positionOnMobile="right"
        placeholder={<RiFontSize size={22} />}
      />
    </>
  );
}
