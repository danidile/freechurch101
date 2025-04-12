"use client";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { RiLinkM } from "react-icons/ri";

export default function ShareComponent() {
  const [hexCode, setHexCode] = useState("");
  const [copied, setCopied] = useState(false);

  const generateHexColor = () => {
    setHexCode(
      "#" +
        Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, "0")
    );
  };
  const handleCopy = () => {
    navigator.clipboard
      .writeText(hexCode)
      .then(() => {
        console.log("Copied to clipboard:", hexCode);
        // Optional: show a toast or feedback here
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };
  return (
    <>
      {!hexCode && <Button onPress={generateHexColor}>Genera</Button>}
      {hexCode && (
        <div className="flex flex-row items-center gap-5">
          <p className="font-bold">Codice Condivisione:</p>{" "}
          <Button onPress={handleCopy} color="primary">
            {hexCode}{" "}
          </Button>
          
          <FaRegTrashCan />
        </div>
      )}
    </>
  );
}
