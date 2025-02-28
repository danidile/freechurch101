export type Role = keyof typeof ROLES;
type Permission = (typeof ROLES)[Role][number];

const ROLES = {
  admin: [
    "view:songs",
    "create:songs",
    "update:songs",
    "delete:songs",
    "view:setlists",
    "create:setlists",
    "update:setlists",
    "delete:setlists",
    "create:team",
  ],
  church: ["view:songs", "create:songs", "update:songs", "delete:songs"],
  jel: ["view:songs", "create:songs", "update:songs", "delete:songs"],
  user: ["view:songs", "create:songs", "delete:songs"],
  gverf: ["view:songs", "create:songs", "update:songs", "delete:songs"],
} as const;

export function hasPermission(userRole: Role, permission: Permission) {
  return (ROLES[userRole] as readonly Permission[]).includes(permission);
}
