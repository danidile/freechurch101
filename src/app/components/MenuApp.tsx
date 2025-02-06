"use client";
import { Link } from "@nextui-org/react";
import { IconContext } from "react-icons";
import { HiUser } from "react-icons/hi2";
import { FaMusic } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";
import { FaHouse } from "react-icons/fa6";
import { MdOutlineLibraryMusic } from "react-icons/md";
import { TransitionLink } from "./TransitionLink";

export default function MenuApp() {

  return (
    <div className="appmenucontainer standalone:block">
      <IconContext.Provider
        value={{ size: "1.2rem", className: "app-menu-icons" }}
      >
        <div className="app-menu">
          <TransitionLink href="/" >
            <FaHouse />
          </TransitionLink>
          <TransitionLink href="/songs">
            <FaMusic />
          </TransitionLink>
          <TransitionLink href="/esplora">
            <MdOutlineLibraryMusic />
          </TransitionLink>
          <TransitionLink href="/setlist">
            <MdEventNote />
          </TransitionLink>
          <TransitionLink href="/protected/dashboard">
            <HiUser />
          </TransitionLink>
          
        </div>
      </IconContext.Provider>
    </div>
  );
}




