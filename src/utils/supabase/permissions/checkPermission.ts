// utils/supabase/checkPermission.ts
import { createClient } from "@/utils/supabase/server";
import { DEFAULT_ROLE_PERMISSIONS } from "@/constants";
import { Permission } from "@/utils/types/types";
import { roles } from "@/constants";

export async function checkPermission(
  teamIds: string[],
  resource: string,
  action: string,
  userId: string,
  userRole?: string
) {
  const supabase = await createClient();

  if (userRole && roles.find((role) => role.slug === userRole).key <= 1) {
    return true;
  }
  // 1. Prendi i ruoli dell’utente in tutti i team richiesti
  const { data: memberships, error: membershipError } = await supabase
    .from("team-members")
    .select("team_id, role")
    .eq("profile", userId)
    .in("team_id", teamIds);
  if (membershipError) console.log("membershipError", membershipError);
  console.log("memberships", memberships);
  if (!memberships || memberships.length === 0) return false;

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
  const mergedPermissions: Permission[] = memberships.flatMap(
    ({ team_id, role }) => {
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
    }
  );

  // 4. Verifica se almeno un ruolo ha quel permesso
  const hasPermission = mergedPermissions.some(
    (p) => p.resource === resource && p.action === action && p.allowed
  );

  return hasPermission;
}
