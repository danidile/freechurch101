"use client";

import { setListSongT } from "@/utils/types/types";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Reorder } from "framer-motion";
import { MdMoreVert } from "react-icons/md";

export function TitleFormComponent({
  section,
  index,
  removeItemFromSchedule,
  updateTitleSection,
}: {
  section: setListSongT;
  index: number;
  removeItemFromSchedule: (id: string) => void;
  updateTitleSection: (text: string, section: number) => void;
}) {
  return (
    <div className="flex flex-row my-2px items-center w-full">
      <Input
        className="max-w-[91%]"
        defaultValue={section.title || ""}
        placeholder="Inizio Incontro"
        radius="none"
        type="text"
        onChange={(e) => updateTitleSection(e.target.value, index)}
        variant="flat"
        // eslint-disable-next-line no-console
      />
      <Popover placement="bottom" showArrow={true}>
        <PopoverTrigger>
          <Button
            isIconOnly
            radius="full"
            variant="light"
            size="sm"
            className="mr-0"
          >
            <MdMoreVert className="text-2xl" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Button
            size="sm"
            className="mx-0"
            fullWidth
            color="danger"
            type="button"
            variant="light"
            id={section.id}
            onPress={() => removeItemFromSchedule(section.id)}
            accessKey={String(index)}
          >
            Elimina
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
