export type Role = keyof typeof ROLES;
type Permission = (typeof ROLES)[Role][number];

const ROLES = {
  admin: [
    // SONGS
    "view:songs",
    "create:songs",
    "update:songs",
    "delete:songs",
    "create:team",
    // SETLISTS
    "view:setlists",
    "create:setlists",
    "update:setlists",
    "delete:setlists",

    // TEAMS
    "create:team",
    "view:teams",

    // CHURCHMEMBERSHIPS
    "confirm:churchMembership",

    // CHURCHMEMBERS
    "read:churchmembers",

    // ARTISTS
    "read:artists",

    // ALBUMS
    "read:albums",
    //ROLES
    "update:role",
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
    "update:role",
  ],
  churchadmin: [
    "view:songs",
    "create:songs",
    "update:songs",
    "delete:songs",
    "update:role",
  ],
  teamleader: ["view:songs", "create:songs", "update:songs", "delete:songs"],
  churchmember: ["view:songs", "create:songs", "update:songs", "delete:songs"],
  user: ["view:songs", "view:songs", "view:songs"],
} as const;

export function hasPermission(userRole: Role, permission: Permission) {
  if (userRole) {
    return (ROLES[userRole] as readonly Permission[]).includes(permission);
  } else {
    return false;
  }
}
