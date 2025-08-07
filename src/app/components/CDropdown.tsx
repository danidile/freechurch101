"use client";
import React, { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import Link from "next/link";

export type CDropdownOption = {
  label: React.ReactNode; // ✅ corretto
  value: string;
  href?: string;
  color?: string;
};

type DropdownProps = {
  options: CDropdownOption[];
  placeholder?: React.ReactNode;
  radius?: string;
  onSelect?: (option: CDropdownOption) => void;
  buttonPadding?: string;
  isIconOnly?: boolean; // ✅ corretto
  positionOnMobile?: "left" | "center" | "right"; // ✅ corretto
};

export default function CDropdown({
  options,
  placeholder = "Select...",
  radius,
  onSelect,
  buttonPadding,
  isIconOnly = true,
  positionOnMobile = "center",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<CDropdownOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelect = (option: CDropdownOption) => {
    setSelected(option);
    setOpen(false);
    onSelect?.(option);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block font-sans">
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          {
            " !p-0": buttonPadding === "sm",

            "bg-[#eeeeef] gap-3 cursor-pointer select-none rounded-md text-left flex items-center justify-center transition-all duration-200": true,
          },
          isIconOnly ? "w-10 h-10 p-2" : " !px-4 !py-1"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        {placeholder}
      </button>

      <div
        role="listbox"
        tabIndex={-1}
        className={clsx(
          "absolute p-2 top-full mt-1 rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden z-50 transition-all duration-300 ease-out transform",
          open
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-4 scale-95 pointer-events-none",
          // Desktop positioning (always centered)
          "sm:left-1/2 sm:-translate-x-1/2",

          // Mobile positioning (based on positionOnMobile)
          {
            "max-sm:left-0 max-sm:right-auto": positionOnMobile === "left",
            "max-sm:left-1/2 max-sm:-translate-x-1/2":
              positionOnMobile === "center",
            "max-sm:right-0 max-sm:left-auto": positionOnMobile === "right",
          }
        )}
        style={{
          minWidth: 200,
          transformOrigin: "top center",
        }}
      >
        {options.map((option) =>
          option.href ? (
            <Link
              key={option.value}
              href={option.href}
              role="option"
              tabIndex={0}
              className={clsx(
                "transition-all duration-150 block px-3 py-1 my-1 rounded hover:bg-gray-50 hover:text-gray-500 cursor-pointer text-sm",
                selected?.value === option.value
                  ? "bg-blue-50 text-blue-900"
                  : "text-gray-700"
              )}
              onClick={() => handleSelect(option)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(option);
                }
              }}
            >
              {option.label}
            </Link>
          ) : (
            <div
              key={option.value}
              role="option"
              tabIndex={0}
              className={clsx(
                "transition-all duration-150 px-3 py-1 my-1 rounded text-sm ",
                option.color === "danger" &&
                  "bg-white hover:bg-red-50 text-red-600 cursor-pointer"
              )}
              onClick={() => handleSelect(option)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(option);
                }
              }}
            >
              {option.label}
            </div>
          )
        )}
      </div>
    </div>
  );
}
