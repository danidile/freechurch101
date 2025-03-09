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
    "view:teams",
    "confirm:churchMembership",
    "read:churchmembers",
  ],
  churchfounder: [
    "view:songs",
    "create:songs",
    "update:songs",
    "delete:songs",
    "view:setlists",
    "create:setlists",
    "update:setlists",
    "delete:setlists",
    "create:team",
    "view:teams",
    "confirm:churchMembership",
    "read:churchmembers",
  ],
  jel: ["view:songs", "create:songs", "update:songs", "delete:songs"],
  user: ["view:songs", "view:songs", "view:songs"],
  gverf: ["view:songs", "create:songs", "update:songs", "delete:songs"],
} as const;

export function hasPermission(userRole: Role, permission: Permission) {
  if (userRole) {
    return (ROLES[userRole] as readonly Permission[]).includes(permission);
  } else {
    return false;
  }
}
