// utils/supabase/checkPermission.ts
import { createClient } from "@/utils/supabase/client";
import { DEFAULT_ROLE_PERMISSIONS } from "@/constants";
import { Permission } from "@/utils/types/types";
import { roles } from "@/constants";
import { profilesTeams } from "@/utils/types/userData";

export async function checkPermissionClient(
  teams: profilesTeams[],
  resource: string,
  action: string,
  userId: string,
  userRole: string,
  setlistId?: string
) {
  const supabase = await createClient();
  if (userRole && roles.find((role) => role.slug === userRole)?.key <= 2) {
    return true;
  }

  if (!teams || teams.length === 0) return false;
  if (setlistId) {
    const { data: lead, error: leadError } = await supabase
      .from("event-team")
      .select("team")
      .eq("member", userId)
      .eq("setlist", setlistId)
      .eq("lead", true);
    if (leadError) {
      console.log(leadError);
    } else {

      const result = lead.map((team) => {
        return {
          team_id: team.team,
          role: "editor",
        };
      });
      teams.push(...result);
      console.log("JOINED memberships", teams);
    }
  }
  const teamIds = teams?.map((team: profilesTeams) => team.team_id);
  // 2. Prendi tutti i permessi custom per questi team
  const { data: customPermissions, error } = await supabase
    .from("permissions_by_role")
    .select("*")
    .in("team_id", teamIds);

  if (error) {
    console.error("Errore nel fetch dei permessi:", error);
    return false;
  }

  // 3. Combina default + custom (override)
  const mergedPermissions: Permission[] = teams.flatMap(({ team_id, role }) => {
    const defaults = DEFAULT_ROLE_PERMISSIONS.filter(
      (perm) => perm.role === role
    ).map((perm) => ({ ...perm, team_id }));

    const overrides = (customPermissions || []).filter(
      (p) => p.team_id === team_id && p.role === role
    );

    return defaults.map((def) => {
      const override = overrides.find(
        (p) => p.resource === def.resource && p.action === def.action
      );
      return override ? { ...def, allowed: override.allowed } : def;
    });
  });

  // 4. Verifica se almeno un ruolo ha quel permesso
  const hasPermission = mergedPermissions.some(
    (p) => p.resource === resource && p.action === action && p.allowed
  );

  return hasPermission;
}
