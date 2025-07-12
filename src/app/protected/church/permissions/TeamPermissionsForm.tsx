// app/team-permissions/TeamPermissionsForm.tsx
"use client";
import { Checkbox } from "@heroui/react";

import { useState } from "react";
import { Button } from "@heroui/react";

const RESOURCES = [
  { label: "Eventi", value: "events" },
  { label: "Scaletta", value: "setlists" },
  { label: "Turnazioni", value: "scheduling" },
  { label: "Canzoni", value: "songs" },
];

const ACTIONS = [
  { label: "Vedere", value: "view" },
  { label: "Creare", value: "create" },
  { label: "Modificare", value: "edit" },
  { label: "Cancellare", value: "delete" },
];
const ROLES = ["leader", "editor", "member"];

type Permission = {
  team_id: string;
  role: string;
  resource: string;
  action: string;
  allowed: boolean;
};

type Team = {
  id: string;
  team_name: string;
  is_worship: boolean;
};

type Props = {
  teams: Team[];
  initialPermissions: Permission[];
};

export default function TeamPermissionsForm({
  teams,
  initialPermissions,
}: Props) {
  const [permissions, setPermissions] =
    useState<Permission[]>(initialPermissions);
  const [loading, setLoading] = useState(false);

  const togglePermission = (
    teamId: string,
    role: string,
    resource: string,
    action: string
  ) => {
    setPermissions((prev) => {
      const existing = prev.find(
        (p) =>
          p.team_id === teamId &&
          p.role === role &&
          p.resource === resource &&
          p.action === action
      );

      if (existing) {
        return prev.map((p) =>
          p === existing ? { ...p, allowed: !p.allowed } : p
        );
      } else {
        return [
          ...prev,
          { team_id: teamId, role, resource, action, allowed: true },
        ];
      }
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log("permissions", permissions);
    // // Chiamata API per salvare permessi
    // const res = await fetch("/api/team-permissions", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ permissions }),
    // });

    // if (res.ok) {
    //   alert("Permessi aggiornati!");
    // } else {
    //   alert("Errore durante il salvataggio");
    // }

    setLoading(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-8"
    >
      {teams.map((team) => (
        <div key={team.id} className="border rounded p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-4">{team.team_name}</h2>
          {ROLES.map((role) => (
            <div key={role} className="mb-4">
              <h3 className="font-medium capitalize">{role}</h3>
              <table className="ntable">
                <thead>
                  <tr>
                    <th className="">Risorsa</th>
                    {ACTIONS.map(({ label }) => (
                      <th key={label} className="border p-2 capitalize">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RESOURCES.map(
                    ({ label: resourceLabel, value: resource }) => {
                      if (resource === "songs" && !team.is_worship) return;
                      return (
                        <tr key={resource}>
                          <td>{resourceLabel}</td>
                          {ACTIONS.map(
                            ({ label: actionLabel, value: action }) => {
                              const allowed = permissions.find(
                                (p) =>
                                  p.team_id === team.id &&
                                  p.role === role &&
                                  p.resource === resource &&
                                  p.action === action
                              )?.allowed;

                              return (
                                <td key={action} className="text-center">
                                  <Checkbox
                                    size="sm"
                                    isSelected={!!allowed}
                                    onChange={() =>
                                      togglePermission(
                                        team.id,
                                        role,
                                        resource,
                                        action
                                      )
                                    }
                                    disabled={loading}
                                  />
                                </td>
                              );
                            }
                          )}
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
      <Button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salva permessi"}
      </Button>
    </form>
  );
}
