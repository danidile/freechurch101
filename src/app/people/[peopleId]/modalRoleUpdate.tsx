"use client";

import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { profileT } from "@/utils/types/types";
import { basicUserData } from "@/utils/types/userData";
import { IoReturnDownForwardSharp, IoSettingsSharp } from "react-icons/io5";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { updateProfileRole } from "./updateProfileRoleAction";
import { roles } from "@/constants";


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
      role: String(profile.role), // ensure current role is default selected
    },
  });

  const convertData = async (data: { role: string }) => {
    await updateProfileRole(profile, data.role);
    setShowSelect(false); // close select after submit
  };

  return (
    <>
      {showSelect && hasPermission(userData.role as Role, "update:role") && (
        <form onSubmit={handleSubmit(convertData)}>
          <div className="w-72 flex gap-4 my-4 items-center">
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm disabled:bg-gray-100"
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={isSubmitting}
                >
                  {roles.map((role) => {
                    return (
                      <option key={role.key} value={String(role.key)}>
                        {role.label}
                      </option>
                    );
                  })}
                </select>
              )}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              title="Aggiorna ruolo"
            >
              <IoReturnDownForwardSharp />
            </button>
          </div>
          {isSubmitting && (
            <p className="text-sm text-gray-600 italic">
              Sto aggiornando il ruolo...
            </p>
          )}
        </form>
      )}

      {!showSelect && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-100 text-blue-800 text-sm font-medium mx-auto my-4">
          {roles.find((r) => r.key === profile.role)?.label}
          {userData &&
            userData.id !== peopleId &&
            hasPermission(userData.role as Role, "update:role") && (
              <button
                type="button"
                onClick={() => setShowSelect(true)}
                className="ml-2 text-blue-600 hover:text-blue-800"
                aria-label="Modifica ruolo"
              >
                <IoSettingsSharp size={14} />
              </button>
            )}
        </div>
      )}
    </>
  );
}
