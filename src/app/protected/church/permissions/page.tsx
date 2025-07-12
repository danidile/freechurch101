// app/team-permissions/page.tsx (o dove vuoi)
import { createClient } from "@/utils/supabase/server";
import TeamPermissionsForm from "./TeamPermissionsForm";
import userDataServer from "@/utils/supabase/getUserDataServer";
import { DEFAULT_ROLE_PERMISSIONS } from "@/constants";
import { Permission } from "@/utils/types/types";

export default async function TeamPermissionsPage() {
  const supabase = createClient();
  const userData = await userDataServer();

  // Carica i team
  const { data: teams, error } = await supabase
    .from("church-teams")
    .select("id, team_name,is_worship")
    .eq("church", userData.church_id);
  if (error) {
    console.log("error", error);
  }
  function getDefaultPermissionsForTeam(teamId: string): Permission[] {
    return DEFAULT_ROLE_PERMISSIONS.map((perm) => ({
      ...perm,
      team_id: teamId,
    }));
  }

  // Carica i permessi
  const { data: customPermissions } = await supabase
    .from("permissions_by_role")
    .select("*");
  console.log("teams", teams);

  const fullPermissions = (teams || []).flatMap((team) => {
    const defaults = getDefaultPermissionsForTeam(team.id);
    const overrides = (customPermissions || []).filter(
      (p) => p.team_id === team.id
    );

    // Applica override se esiste
    return defaults.map((def) => {
      const override = overrides.find(
        (p) =>
          p.role === def.role &&
          p.resource === def.resource &&
          p.action === def.action
      );
      return override ? { ...def, allowed: override.allowed } : def;
    });
  });
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Gestione permessi team</h1>
      <TeamPermissionsForm
        teams={teams || []}
        initialPermissions={fullPermissions || []}
      />
    </div>
  );
}
