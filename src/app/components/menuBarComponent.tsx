"use client"

import { basicUserData } from "@/utils/types/userData";

import {
    Image,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
  } from "@heroui/react";
  import { useState } from "react";
  import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
  } from "@heroui/react";
  import UserDataMenu from "./userDataMenu";
import MenuApp from "./MenuApp";
import { TransitionLink } from "./TransitionLink";

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
            <TransitionLink href="/" >
          <Image
                className="max-h-8 overflow-visible"
                src="/images/brand/LOGO_.png"
                alt=""
              />
              </TransitionLink>
          </NavbarBrand>
        </NavbarContent>
  
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
            <TransitionLink href="/esplora">
              Esplora
            </TransitionLink>
          </NavbarItem>
          {userData.loggedIn && (
            <NavbarItem>
            <TransitionLink  href="/songs">
              La mia Lista
            </TransitionLink>
          </NavbarItem>
          )}
          
          <NavbarItem>
            <TransitionLink  aria-current="page" href="/setlist">
              Setlist
            </TransitionLink>
          </NavbarItem>

        </NavbarContent>


        <UserDataMenu userData={userData}/>


      
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
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