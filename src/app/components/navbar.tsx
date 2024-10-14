import {Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";

export default function MenuBar() {
  const menuItems = [
    "songs",
    "events",
    "churches",
    "Dashboard"
  ];

  return (
    <Navbar disableAnimation isBordered>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
        <img className="max-h-8" src="/images/brand/LOGO_.png" alt="" />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
        <Link color="foreground" href="/">
        <img className="max-h-8" src="/images/brand/LOGO_.png" alt="" />
        </Link>
        
        </NavbarBrand>
        <NavbarItem>
          <Link color="foreground" href="/songs">
            Songs
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="/events" aria-current="page" >
            Events
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/churches">
            Churches
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="/sign-in">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="warning" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              href={"/"+ item}
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}