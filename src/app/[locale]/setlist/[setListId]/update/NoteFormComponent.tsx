"use client";

import { setListSongT } from "@/utils/types/types";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { MdMoreVert } from "react-icons/md";

export function NoteFormComponent({
  section,
  index,
  removeItemFromSchedule,
  updateNotesSection,
}: {
  section: setListSongT;
  index: number;
  removeItemFromSchedule: (id: string) => void;
  updateNotesSection: (text: string, section: number) => void;
}) {
  return (
    <div className="flex flex-row my-2px items-center p-2">
      <Textarea
        className="max-w-[87%]"
        placeholder="Dettagli aggiuntivi...."
        radius="none"
        type="text"
        variant="flat"
        defaultValue={section.note || ""}
        onChange={(e) => updateNotesSection(e.target.value, index)}

        // eslint-disable-next-line no-console
      />
      <Popover placement="bottom" showArrow={true}>
        <PopoverTrigger>
          <Button
            isIconOnly
            radius="full"
            variant="flat"
            size="sm"
            className="mr-0"
          >
            <MdMoreVert className="text-2xl" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2 flex-col gap-2">
            <div className="my-1"></div>
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
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
