"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  Image,
  Button,
  Badge,
} from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import UserDataMenu from "./userDataMenu";
import MenuApp from "./MenuApp";
import { useUserStore } from "@/store/useUserStore";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";

import { FaInbox } from "react-icons/fa";
export default function MenuBarComponentSecondary() {
  const { userData, notifications } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (userData.loggedIn) {
    return (
      <MenuApp
        userdata={userData || null}
        notifications={notifications.pending?.notifications?.length}
      />
    );
  }
  return (
    <>
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        className="standalone:!hidden  h-[75px] bg-[#ffffff0] relative z-30"
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Link href={"/"}>
              <Image
                className="max-h-8 overflow-visible"
                src="/images/brand/LOGO_.png"
                alt=""
              />
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {!userData ||
            (!userData.loggedIn && (
              <>
                <NavbarItem>
                  <Link color="foreground" href="/">
                    Home
                  </Link>
                </NavbarItem>
                <NavbarItem>
                  <Link color="foreground" href="/app">
                    App
                  </Link>
                </NavbarItem>
                <NavbarItem>
                  <Link color="foreground" href="/artists">
                    Artisti
                  </Link>
                </NavbarItem>

                <NavbarItem>
                  <Link color="foreground" href="/italiansongs">
                    Canzoni
                  </Link>
                </NavbarItem>
                <NavbarItem>
                  <Link color="primary" href="/login">
                    Accedi
                  </Link>
                </NavbarItem>
              </>
            ))}

          {userData && userData.loggedIn && userData.church_id && (
            <>
              <NavbarItem>
                <Link color="foreground" href="/songs">
                  Canzoni
                </Link>
              </NavbarItem>
              <NavbarItem isActive>
                <Badge
                  size="md"
                  color="danger"
                  content={notifications?.pending?.notifications?.length}
                >
                  <Button
                    isIconOnly
                    variant="flat"
                    radius="full"
                    color="default"
                    as={Link}
                    href="/protected/notifications"
                  >
                    <FaInbox size={21} />
                  </Button>
                </Badge>
              </NavbarItem>
            </>
          )}
        </NavbarContent>

        {/* // Mobile Menu */}
        <NavbarMenu>
          <NavbarItem>
            <Link color="foreground" href="/">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/app">
              App
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/artists">
              Artisti
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link color="foreground" href="/italiansongs">
              Canzoni
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="primary" href="/login">
              Accedi
            </Link>
          </NavbarItem>
        </NavbarMenu>
      </Navbar>

      <MenuApp
        userdata={userData || null}
        notifications={notifications.pending?.notifications?.length}
      />
    </>
  );
}
