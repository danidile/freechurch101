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
    "send:emails",
    // GLOBALSONGS
    "view:globalsongs",
    "create:globalsongs",
    "update:globalsongs",
    "delete:globalsongs",
    "create:team",
    // SETLISTS
    "view:setlists",
    "create:setlists",
    "update:setlists",
    "delete:setlists",

    // TEAMS
    "create:team",
    "view:teams",
    "update:teams",
    "delete:teams",
    // CHURCHMEMBERSHIPS /Requests
    "read:churchmembers",
    "update:churchmembers",
    "delete:churchmembers",
    "update:churchMembership",

    // CHURCHMEMBERS
    "view:churchmembers",

    // PROFILES
    "read:profiles",
    "update:profiles",
    "delete:profiles",

    // ALBUMS
    "read:albums",
    //ROLES
    "update:role",
  ],
  churchfounder: [
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
    "send:emails",

    // TEAMS
    "create:team",
    "view:teams",
    "update:teams",

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
  churchadmin: [
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
    "update:teams",
    "send:emails",

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
  teamleader: [
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
    "send:emails",

    // TEAMS
    "create:team",
    "view:teams",
    "update:teams",
    "delete:teams",

    // CHURCHMEMBERSHIPS /Requests
    "read:churchmembers",
    "update:churchmembers",
    "delete:churchmembers",

    // ARTISTS
    "read:artists",

    // ALBUMS
    "read:albums",
  ],
  churchmember: ["view:songs"],
  user: ["view:songs", "view:songs", "view:songs"],
} as const;

export function hasPermission(userRole: Role, permission: Permission) {
  if (userRole) {
    return (ROLES[userRole] as readonly Permission[]).includes(permission);
  } else {
    return false;
  }
}
