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
import { useState } from "react";
import { LuTextQuote } from "react-icons/lu";
import { RiFontSize } from "react-icons/ri";
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
export default function CustomizeWidget() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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

  return (
    <>
      <Button
        onPress={onOpen}
        size="sm"
        variant="flat"
        color="default"
        isIconOnly
      >
        <RiFontSize size={"20px"} className="text-2xl" />
      </Button>
      <Drawer
        placement="bottom"
        size="md"
        className="z-50"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 items-center">
                Personalizza
              </DrawerHeader>
              <DrawerBody className="flex flex-col gap-4 justify-center items-center">
                <div className="flex flex-col gap-4">
                  <div className="container-style-list">
                    <p>Dimensione Carattere:</p>{" "}
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        onPress={() => updateFontSize("minus")}
                      >
                        <FaMinus />
                      </Button>
                      <Button isIconOnly onPress={() => updateFontSize("plus")}>
                        <FaPlus />
                      </Button>
                    </div>
                  </div>

                  <div className="container-style-list">
                    <p>Colore accordi:</p>{" "}
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        className="bg-black"
                        onPress={() => changeChordsColor("black")}
                      >
                        <FaCircle color="#aaaaaa" />
                      </Button>
                      <Button
                        isIconOnly
                        color="primary"
                        onPress={() => changeChordsColor("#006FEE")}
                      >
                        <FaCircle color="#b3d6ff" />
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        onPress={() => changeChordsColor("rgb(130, 29, 29)")}
                      >
                        <FaCircle color="#ff9d9d" />
                      </Button>
                    </div>
                  </div>
                  <div className="container-style-list">
                    <p>Colore testo:</p>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        className="bg-black"
                        onPress={() => changeBodyColor("black")}
                      >
                        <FaCircle color="#aaaaaa" />
                      </Button>
                      <Button
                        isIconOnly
                        color="primary"
                        onPress={() => changeBodyColor("#006FEE")}
                      >
                        <FaCircle color="#b3d6ff" />
                      </Button>
                    </div>
                  </div>
                </div>
              </DrawerBody>
              <DrawerFooter className="p-4">
                <Button
                  color="primary"
                  variant="flat"
                  className="w-full text-center"
                  onPress={onClose}
                >
                  Salva
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
