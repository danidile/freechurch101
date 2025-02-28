"use client"
import { profileT } from "@/utils/types/types";
import { Select, SelectSection, SelectItem } from "@heroui/select";

export default function UpdatePeopleForm({ profile }: { profile: profileT }) {
  console.log(profile);
  const allRoles = [
    { key: "1", label: "Amministratore" },
    { key: "2", label: "Team Leader" },
    { key: "3", label: "Volontario" },
    { key: "3", label: "Membro" },

  ];
  return (
    <div className="container-sub">
      <form>
        <h5 className="text-center">
          <b>{profile.name + " " + profile.lastname} </b>
        </h5>
        <small className="text-center">{profile.email}</small>
        <p className="text-center"></p>
        <Select
          className="max-w-xs"
          items={allRoles}
          label="Modifica Ruolo"
          placeholder="Seleziona Ruolo"
        >
          {(role) => <SelectItem>{role.label}</SelectItem>}
        </Select>
      </form>
    </div>
  );
}
