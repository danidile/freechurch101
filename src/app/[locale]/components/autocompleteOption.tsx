// components/Autocomplete.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, X } from "lucide-react";

export interface AutocompleteOption {
  key: string | number;
  label: string;
  value?: any;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "bordered" | "filled" | "outline";
  defaultSelectedKey?: string | number;
  className?: string;
  onSelectionChange?: (
    key: string | number | null,
    option: AutocompleteOption | null
  ) => void;
  onInputChange?: (value: string) => void;
  allowCustomValue?: boolean;
  clearable?: boolean;
  loading?: boolean;
  noResultsText?: string;
  name?: string;
  error?: string;
}

const AutocompleteCL: React.FC<AutocompleteProps> = ({
  options = [],
  placeholder = "Search...",
  label,
  disabled = false,
  required = false,
  size = "md",
  variant = "bordered",
  defaultSelectedKey,
  className = "",
  onSelectionChange,
  onInputChange,
  allowCustomValue = false,
  clearable = true,
  loading = false,
  noResultsText = "Nessun risultato",
  name,
  error,
}) => {
  const [hasBeenCleared, setHasBeenCleared] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] =
    useState<AutocompleteOption | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [filteredOptions, setFilteredOptions] =
    useState<AutocompleteOption[]>(options);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Set default selected option
  useEffect(() => {
    if (defaultSelectedKey !== undefined && !hasBeenCleared) {
      const defaultOption = options.find(
        (opt) => opt.key === defaultSelectedKey
      );
      if (defaultOption) {
        setSelectedOption(defaultOption);
        setInputValue(defaultOption.label);
      }
    }
  }, [defaultSelectedKey, options]);

  // Filter options based on input
  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
    setHighlightedIndex(-1);
  }, [inputValue, options]);

  // Handle input change
  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      setIsOpen(true);
      onInputChange?.(value);

      // If not allowing custom values, clear selection when input doesn't match
      if (
        !allowCustomValue &&
        selectedOption &&
        selectedOption.label !== value
      ) {
        setSelectedOption(null);
        onSelectionChange?.(null, null);
      }
    },
    [allowCustomValue, selectedOption, onInputChange, onSelectionChange]
  );

  // Handle option selection
  const handleOptionSelect = useCallback(
    (option: AutocompleteOption) => {
      setSelectedOption(option);
      setInputValue(option.label);
      setIsOpen(false);
      setHighlightedIndex(-1);
      onSelectionChange?.(option.key, option);
      inputRef.current?.blur();
    },
    [onSelectionChange]
  );

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedOption(null);
    setInputValue("");
    setIsOpen(false);
    onSelectionChange?.(null, null);
    setHasBeenCleared(true);

    inputRef.current?.focus();
  };
  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            const nextIndex =
              highlightedIndex < filteredOptions.length - 1
                ? highlightedIndex + 1
                : 0;
            setHighlightedIndex(nextIndex);

            // Scroll into view
            optionsRef.current[nextIndex]?.scrollIntoView({
              block: "nearest",
              behavior: "smooth",
            });
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (isOpen) {
            const prevIndex =
              highlightedIndex > 0
                ? highlightedIndex - 1
                : filteredOptions.length - 1;
            setHighlightedIndex(prevIndex);

            // Scroll into view
            optionsRef.current[prevIndex]?.scrollIntoView({
              block: "nearest",
              behavior: "smooth",
            });
          }
          break;

        case "Enter":
          e.preventDefault();
          if (
            isOpen &&
            highlightedIndex >= 0 &&
            filteredOptions[highlightedIndex]
          ) {
            handleOptionSelect(filteredOptions[highlightedIndex]);
          } else if (allowCustomValue && inputValue.trim()) {
            const customOption: AutocompleteOption = {
              key: inputValue,
              label: inputValue,
              value: inputValue,
            };
            handleOptionSelect(customOption);
          }
          break;

        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          inputRef.current?.blur();
          break;

        case "Tab":
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    },
    [
      disabled,
      isOpen,
      highlightedIndex,
      filteredOptions,
      handleOptionSelect,
      allowCustomValue,
      inputValue,
    ]
  );

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-5 py-4 text-lg",
  };

  // Variant classes
  const variantClasses = {
    bordered: "border-2 border-gray-300 bg-white focus-within:border-black",
    filled:
      "border-0 bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500",
    outline:
      "border border-gray-400 bg-transparent focus-within:border-blue-500",
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div
        className={`
        relative rounded-lg transition-colors duration-200
        ${variantClasses[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}
        ${error ? "border-red-500" : ""}
      `}
      >
        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full bg-transparent border-none outline-none
            ${sizeClasses[size]}
            ${clearable && (inputValue || selectedOption) ? "pr-16" : "pr-10"}
            ${disabled ? "cursor-not-allowed" : ""}
          `}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => !disabled && setIsOpen(true)}
          autoComplete="off"
        />

        {/* Clear Button */}
        {clearable && (inputValue || selectedOption) && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            onMouseDown={(e) => e.preventDefault()}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 z-10"
          >
            <X size={16} />
          </button>
        )}

        {/* Dropdown Arrow */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1
            ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 p-1 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {loading ? (
            <div className="px-4 py-3 text-gray-500 text-center">
              Loading...
            </div>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={option.key}
                ref={(el) => {
                  optionsRef.current[index] = el;
                }}
                className={`
                  px-2 py-2 cursor-pointer transition-colors duration-250 rounded-sm
                  ${
                    index === highlightedIndex
                      ? "bg-gray-50 text-gray-900"
                      : "text-gray-900 hover:bg-gray-100 "
                  }
                  ${index === filteredOptions.length - 1 ? "" : ""}
                `}
                onClick={() => handleOptionSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <p>{option.label}</p>
              </div>
            ))
          ) : (
            <div className="px-2 py-1  text-center italic">
              <p className="text-gray-400"> {noResultsText}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutocompleteCL;
