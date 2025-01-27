"use client";

import { Link } from "@nextui-org/react";

import { IconContext } from "react-icons";

import { HiUser } from "react-icons/hi2";
import { FaMusic } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";
import { FaHouse } from "react-icons/fa6";

export default function MenuApp() {
  return (
    <div className="appmenucontainer">
      <IconContext.Provider
        value={{ size: "1.6rem", className: "app-menu-icons" }}
      >
        <div className="app-menu">
          <Link href="/">
            <FaHouse />
          </Link>
          <Link href="/songs">
            <FaMusic />
          </Link>
          <Link href="/setlist">
            <MdEventNote />
          </Link>
          <Link href="/protected/dashboard">
            <HiUser />
          </Link>
        </div>
      </IconContext.Provider>
    </div>
  );
}
