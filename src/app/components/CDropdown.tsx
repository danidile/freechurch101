"use client";
import React, { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import Link from "next/link";

type Option = {
  label: string;
  value: string;
  href?: string;
};

type DropdownProps = {
  options: Option[];
  placeholder?: React.ReactNode;
};

export default function CDropdown({
  options,
  placeholder = "Select...",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
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

  const handleSelect = (option: Option) => {
    setSelected(option);
    setOpen(false);
  };

  const isIconOnly = typeof placeholder !== "string";

  return (
    <div ref={dropdownRef} className="relative inline-block font-sans">
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          "bg-white cursor-pointer select-none rounded-md text-left flex items-center justify-center transition-all duration-200 hover:bg-gray-100  border-gray-300",
          isIconOnly ? "w-10 h-10 p-2" : "min-w-[150px] px-3 py-2"
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
          "absolute p-2 top-full left-1/2 mt-1 rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden z-50 transition-all duration-300 ease-out transform -translate-x-1/2",
          open
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
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
                "transition-colors block px-3 py-2 rounded hover:bg-gray-100 cursor-pointer text-sm",
                selected?.value === option.value
                  ? "bg-blue-50 text-blue-700"
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
                "px-3 py-2 rounded hover:bg-gray-100 cursor-pointer text-sm transition-colors",
                selected?.value === option.value
                  ? "bg-blue-50 text-blue-700"
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
            </div>
          )
        )}
      </div>
    </div>
  );
}
