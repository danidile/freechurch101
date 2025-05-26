"use client";

import { addSong } from "@/app/artists/addSong/addSongAction";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { profileT, songSchema } from "@/utils/types/types";
import { basicUserData } from "@/utils/types/userData";
import { IoReturnDownForwardSharp } from "react-icons/io5";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";
import { updateProfileRole } from "./updateProfileRoleAction";

const roles = [
  { key: 2, label: "Admin Chiesa", slug: "churchadmin" },
  { key: 3, label: "Team Leader", slug: "teamleader" },
  { key: 4, label: "", slug: "" },
  { key: 55, label: "", slug: "" },
  { key: 6, label: "", slug: "" },
  { key: 7, label: "", slug: "" },
  { key: 8, label: "Membro Chiesa", slug: "churchmember" },
  { key: 9, label: "Utente senza Chiesa", slug: "user" },
];
export default function ModalRoleUpdate({
  peopleId,
  profile,
  userData,
}: {
  peopleId: string;
  profile: profileT;
  userData: basicUserData;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [showSelect, setShowSelect] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ role: string }>({
    defaultValues: {
      role: String(profile.role), // converti il numero in stringa
    },
  });

  const convertData = async (data: { role: string }) => {

    updateProfileRole(profile, data.role);
  };

  return (
    <>
      {showSelect && (
        <form onSubmit={handleSubmit(convertData)}>
          <div className="w-72 flex   gap-4 my-4">
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select
                  {...field}
                  label="Seleziona nuovo ruolo"
                  size="sm"
                  selectedKeys={[String(field.value)]}
                  onSelectionChange={(keys) =>
                    field.onChange(Number(Array.from(keys)[0]))
                  }
                >
                  {roles.map((role) => {
                    if (role.label.length < 1 || role.key === 9) return null;
                    return (
                      <SelectItem key={role.key.toString()}>
                        {role.label}
                      </SelectItem>
                    );
                  })}
                </Select>
              )}
            />

            <Button
              color="primary"
              variant="shadow"
              isIconOnly
              type="submit"
              size="lg"
              disabled={isSubmitting}
              radius="sm"
            >
              <IoReturnDownForwardSharp />
            </Button>
          </div>
        </form>
      )}
      {!showSelect && (
        <Chip
          radius="sm"
          color="primary"
          variant="flat"
          className="mx-auto my-4"
          endContent={
            <>
              {userData &&
                hasPermission(userData.role as Role, "update:role") && (
                  <div className="ml-3" onClick={() => setShowSelect(true)}>
                    <IoSettingsSharp size={14} />
                  </div>
                )}
            </>
          }
        >
          {roles.find((r) => r.key === profile.role)?.label}
        </Chip>
      )}
    </>
  );
}
