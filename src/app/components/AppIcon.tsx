import { IconContext } from "react-icons";
import { HiUser } from "react-icons/hi2";
import { FaMusic } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";
import { FaHouse } from "react-icons/fa6";
import { MdOutlineLibraryMusic } from "react-icons/md";

export default function AppIcon({ index }: { index: number }) {
  if (index == 0) {
    return (
      <div className="appmenucontainer">
        <IconContext.Provider
          value={{ size: "1.2rem", className: "app-menu-icons" }}
        >
          <FaHouse />
        </IconContext.Provider>
      </div>
    );
  } else if (index == 1) {
    return (
      <div className="appmenucontainer">
        <IconContext.Provider
          value={{ size: "1.2rem", className: "app-menu-icons" }}
        >
          <FaMusic />
        </IconContext.Provider>
      </div>
    );
  } else if (index == 2) {
    return (
      <div className="appmenucontainer">
        <IconContext.Provider
          value={{ size: "1.2rem", className: "app-menu-icons" }}
        >
          <MdOutlineLibraryMusic />
        </IconContext.Provider>
      </div>
    );
  } else if (index == 3) {
    return (
      <div className="appmenucontainer">
        <IconContext.Provider
          value={{ size: "1.2rem", className: "app-menu-icons" }}
        >
          <MdEventNote />
        </IconContext.Provider>
      </div>
    );
  } else if (index == 4) {
    return (
      <div className="appmenucontainer">
        <IconContext.Provider
          value={{ size: "1.2rem", className: "app-menu-icons" }}
        >
          <HiUser />
        </IconContext.Provider>
      </div>
    );
  }
}
