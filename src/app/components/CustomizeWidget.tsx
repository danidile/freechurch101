"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
  Select,
  SelectSection,
  SelectItem,
} from "@heroui/react";
import { FaCircle } from "react-icons/fa6";
import { BiColor } from "react-icons/bi";
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

  const updateFontSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = e.target.value;
    const lyricsElements = document.querySelectorAll(".lyrics");
    const chordsElements = document.querySelectorAll(".chord");
    const commentElements = document.querySelectorAll(".comment");
    const biggersize = Number(newSize) * 1.2;

    lyricsElements.forEach((el) => {
      (el as HTMLElement).style.fontSize = `${newSize}px`;
      (el as HTMLElement).style.lineHeight = `${newSize}px`;
    });
    chordsElements.forEach((el) => {
      (el as HTMLElement).style.fontSize = `${newSize}px`;
      (el as HTMLElement).style.lineHeight = `${Number(newSize) * 1.2}px`;
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
    <div className="custom-widget">
      <Button
        onPress={onOpen}
        size="sm"
        variant="shadow"
        color="primary"
        isIconOnly
      >
        <BiColor size={"20px"} className="text-2xl" />
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
              <DrawerHeader className="flex flex-col gap-1">
                Personalizza
              </DrawerHeader>
              <DrawerBody>
                <div className="container-style-list">
                  <p>Dimensione Carattere:</p>{" "}
                  <input
                    onChange={updateFontSize}
                    className="number-input"
                    defaultValue={14}
                    type="number"
                    min="14"
                    max="18"
                  ></input>
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
              </DrawerBody>
              <DrawerFooter className="p-1 bg-blue-200">
                <Button color="primary" variant="light" onPress={onClose}>
                  Salva
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
