import { useState, useRef, useEffect } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import Link from "next/link";
import clsx from "clsx";

export default function AccountSettingsDropdown() {
  const [open, setOpen] = useState(false);
  const [flip, setFlip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Flip dropdown if overflowing viewport
  useEffect(() => {
    if (open && dropdownRef.current && buttonRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      // Check if dropdown right edge goes beyond viewport
      if (dropdownRect.right > viewportWidth) {
        setFlip(true);
      } else {
        setFlip(false);
      }
    }
  }, [open]);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-md hover:bg-gray-200 focus:outline-none transition-all duration-200 ease-out"
        aria-label="Settings"
      >
        <IoSettingsOutline size={20} />
      </button>

      <div
        ref={dropdownRef}
        className={clsx(
          "absolute mt-1 z-10 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-2 transition-all duration-200 ease-out",
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none",
          flip
            ? "right-0 left-auto transform translate-x-0"
            : "left-1/2 -translate-x-1/2"
        )}
      >
        <ul>
          <li>
            <Link
              href="/protected/dashboard/account/completeAccount"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-all duration-100 ease-out"
            >
              Aggiorna Account
            </Link>
          </li>
          <li>
            <Link
              href="/protected/reset-password"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              Reimposta Password
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
