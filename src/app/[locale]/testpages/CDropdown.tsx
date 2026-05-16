"use client";

import React, { useState, useRef, useEffect } from "react";
import { RiArrowDownWideFill } from "react-icons/ri";

type Option = {
  label: string;
  value: string;
};

type DropdownProps = {
  options: Option[];
  onSelect?: (option: Option) => void;
  placeholder?: string;
};

export default function Dropdown({
  options,
  onSelect,
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    setSelected(option);
    setOpen(false);
    if (onSelect) onSelect(option);
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        display: "inline-block",
        fontFamily: "sans-serif",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: "8px 12px",
          border: "1px solid #ccc",
          background: "white",
          cursor: "pointer",
          userSelect: "none",
          minWidth: "150px",
          borderRadius: "6px",
          textAlign: "left",
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected ? selected.label : placeholder}
        <span style={{ float: "right" }}>
          <RiArrowDownWideFill />
        </span>
      </button>

      <div
        role="listbox"
        tabIndex={-1}
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: open
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(-8px)",
          marginTop: "6px",
          border: "1px solid #ccc",
          background: "white",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          minWidth: "200px",
          borderRadius: "6px",
          zIndex: 1000,
          overflow: "hidden",
          opacity: open ? 1 : 0,
          transition: "opacity 200ms ease, transform 200ms ease",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {options.map((option) => (
          <div
            key={option.value}
            role="option"
            onClick={() => handleSelect(option)}
            tabIndex={0}
            style={{
              padding: "10px 14px",
              cursor: "pointer",
              backgroundColor:
                selected?.value === option.value ? "#f5f5f5" : "white",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f0f0f0")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                selected?.value === option.value ? "#f5f5f5" : "white")
            }
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}
