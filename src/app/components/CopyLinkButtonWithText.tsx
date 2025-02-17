"use client";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";

import { useState } from "react";
import { RiLinkM } from "react-icons/ri";

export default function CopyLinkButtonWithText() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };


  return (
    <>
      <Popover placement="top">
        <PopoverTrigger>
          <Button  size='md' onPress={handleCopy} color="primary"  variant={copied ? "ghost" : "light"}>
            <RiLinkM />Condividi
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <div className="text-tiny">Link Copiato</div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
