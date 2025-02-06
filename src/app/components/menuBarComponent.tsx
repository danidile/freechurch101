"use client"

import { basicUserData } from "@/utils/types/userData";

import {
    Image,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
  } from "@nextui-org/react";
  import { useState } from "react";
  import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
  } from "@nextui-org/react";
  import UserDataMenu from "./userDataMenu";
import MenuApp from "./MenuApp";

export const AcmeLogo = () => {
    return (
      <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
        <path
          clipRule="evenodd"
          d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    );
  };

export default function MenuBarComponent( {userData}:{userData: basicUserData} ) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuItems = [
      "songs",
      "setlist",      
    ];
    console.log(userData);
    return (
      <>
      <Navbar onMenuOpenChange={setIsMenuOpen} className="menu-desktop standalone:hidden">
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Link href="/">
          <Image
                className="max-h-8 overflow-visible"
                src="/images/brand/LOGO_.png"
                alt=""
              />
              </Link>
          </NavbarBrand>
        </NavbarContent>
  
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
            <Link color="foreground" href="/esplora">
              Esplora
            </Link>
          </NavbarItem>
          {userData.loggedIn && (
            <NavbarItem>
            <Link color="foreground" href="/songs">
              La mia Lista
            </Link>
          </NavbarItem>
          )}
          
          <NavbarItem>
            <Link color="foreground" aria-current="page" href="/setlist">
              Setlist
            </Link>
          </NavbarItem>

        </NavbarContent>


        <UserDataMenu userData={userData}/>


      
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full"
                color="foreground"
                href={`/${item}`}
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
          
        </NavbarMenu>
      </Navbar>
      <MenuApp />
      </>
    );
  }