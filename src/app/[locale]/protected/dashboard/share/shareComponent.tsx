"use client";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { saveShareCodeAction } from "./shareCodeAction";

export default function ShareComponent({ shareCode }: { shareCode: string }) {
  const [hexCode, setHexCode] = useState(shareCode);
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
        setCopied(true);
        console.log("Copied to clipboard:", hexCode);
        // Optional: show a toast or feedback here
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };
  const saveShareCode = async () => {
    saveShareCodeAction(hexCode);
  };
  return (
    <div className="my-5">
      {!hexCode && <Button onPress={generateHexColor}>Genera</Button>}
      {hexCode && (
        <div className="">
          <div className="flex flex-row items-center gap-5">
            <p className="font-bold my-5">Codice Condivisione:</p>
            <Popover placement="top">
              <PopoverTrigger>
                <Button
                  onPress={handleCopy}
                  color="primary"
                  variant={copied ? "ghost" : "light"}
                >
                  {hexCode}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-1 py-2">
                  <div className="text-tiny">Link Copiato</div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
      {hexCode && !shareCode && <Button onPress={saveShareCode}>Salva</Button>}
    </div>
  );
}
