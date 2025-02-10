"use client";
import { Link } from "@nextui-org/react";
import { IconContext } from "react-icons";
import { FaMusic } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";
import { FaHouse } from "react-icons/fa6";
import { TransitionLink } from "./TransitionLink";
import { IoSettings } from "react-icons/io5";
import { RiTeamFill } from "react-icons/ri";


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
          <TransitionLink href="/setlist" className="pwaiconsmenu">
            <MdEventNote />
          </TransitionLink>
          <TransitionLink href="/people" className="pwaiconsmenu">
            <RiTeamFill />
          </TransitionLink>
          <TransitionLink href="/protected/dashboard" className="pwaiconsmenu">
            <IoSettings />
          </TransitionLink>
          
        </div>
      </IconContext.Provider>
    </div>
  );
}




