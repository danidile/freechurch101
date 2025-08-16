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
        //SUBSXRIPTION

    "manage:subscription",
    // GLOBALSONGS
    "view:globalsongs",
    "create:globalsongs",
    "update:globalsongs",
    "delete:globalsongs",
    "create:team",
    "update:italiansongs",
    "create:italiansongs",
    // SETLISTS
    "view:setlists",
    "create:setlists",
    "update:setlists",
    "delete:setlists",
    "personalize:church",
    // TEAMS
    "create:team",
    "view:teams",
    "update:teams",
    "delete:teams",
    // CHURCHMEMBERSHIPS /Requests
    "read:churchmembers",
    "insert:churchmembers",
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
    //
    "create:italiansongs",
    "update:italiansongs",
    "delete:italiansongs",
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
    // CHURCH DETAILS

    "update:churchdetails",

    // CHURCHMEMBERS
    "read:churchmembers",
    "insert:churchmembers",
    "personalize:church",

    // ARTISTS
    "read:artists",

    // ALBUMS
    "read:albums",
    //ROLES
    "update:role",
        //SUBSXRIPTION

        "manage:subscription",

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
    // CHURCH DETAILS

    "update:churchdetails",
    // CHURCHMEMBERSHIPS
    "confirm:churchMembership",

    // CHURCHMEMBERS
    "read:churchmembers",
    "insert:churchmembers",
    "personalize:church",

    // ARTISTS
    "read:artists",

    // ALBUMS
    "read:albums",
    //ROLES
    "update:role",
    //SUBSXRIPTION

        "manage:subscription",

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
