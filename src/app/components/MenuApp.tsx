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
          <TransitionLink href="/" className="pwaiconsmenu">
            <FaHouse />
          </TransitionLink>
          <TransitionLink href="/songs" className="pwaiconsmenu">
            <FaMusic />
          </TransitionLink>
          <TransitionLink href="/esplora" className="pwaiconsmenu">
            <MdOutlineLibraryMusic />
          </TransitionLink>
          <TransitionLink href="/setlist" className="pwaiconsmenu">
            <MdEventNote />
          </TransitionLink>
          <TransitionLink href="/protected/dashboard" className="pwaiconsmenu">
            <HiUser />
          </TransitionLink>
          
        </div>
      </IconContext.Provider>
    </div>
  );
}




