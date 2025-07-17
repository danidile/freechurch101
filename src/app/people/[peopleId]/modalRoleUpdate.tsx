"use client";

import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { profileT } from "@/utils/types/types";
import { basicUserData } from "@/utils/types/userData";
import { IoReturnDownForwardSharp } from "react-icons/io5";
import { Button, Chip, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoSettingsSharp } from "react-icons/io5";
import { updateProfileRole } from "./updateProfileRoleAction";

const roles = [
  { key: 1, label: "Fondatore Chiesa", slug: "churchfounder" },
  { key: 2, label: "Admin Chiesa", slug: "churchadmin" },
  // { key: 3, label: "Team Leader", slug: "teamleader" },
  { key: 8, label: "Membro Chiesa", slug: "churchmember" },
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
    console.log("Sent!");
    updateProfileRole(profile, data.role.toString());
  };

  return (
    <>
      {showSelect && hasPermission(userData.role as Role, "update:role") && (
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
                  onSelectionChange={(keys) =>
                    field.onChange(Number(Array.from(keys)[0]))
                  }
                >
                  {roles.map((role) => {
                    if (
                      role.label.length < 1 ||
                      role.key === 9 ||
                      role.key <= 1 ||
                      role.key ===
                        roles.find((r) => r.key === profile.role)?.key ||
                      role.key <=
                        roles.find((r) => r.slug === userData.role)?.key
                    )
                      return null;
                    return <SelectItem key={role.key}>{role.label}</SelectItem>;
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
            <div>
              {userData &&
                userData.id !== peopleId &&
                hasPermission(userData.role as Role, "update:role") && (
                  <div className="ml-3" onClick={() => setShowSelect(true)}>
                    <IoSettingsSharp size={14} />
                  </div>
                )}
            </div>
          }
        >
          {roles.find((r) => r.key === profile.role)?.label}
        </Chip>
      )}
    </>
  );
}
