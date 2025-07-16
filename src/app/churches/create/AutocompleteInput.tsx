import React, { useState, useRef, useEffect } from "react";

interface Comune {
  codice: string;
  nome: string;
  sigla: string;
}

interface AutocompleteInputProps {
  label: string;
  options: Comune[];
  error?: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (selected: Comune) => void;
}

export function AutocompleteInput({
  label,
  options,
  error,
  value,
  onChange,
  onSelect,
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Keyboard navigation
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => (i < options.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => (i > 0 ? i - 1 : options.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < options.length) {
        const selected = options[highlightedIndex];
        onSelect(selected);
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  }

  // Filter options based on value (case-insensitive)
  const filteredOptions = value.length > 1
    ? options.filter((o) =>
        o.nome.toLowerCase().startsWith(value.toLowerCase())
      ).slice(0, 10)
    : [];

  return (
    <div className="relative w-full max-w-sm" ref={containerRef}>
      <label
        htmlFor="autocomplete-input"
        className="block mb-1 font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id="autocomplete-input"
        type="text"
        className={`cinput w-full ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
          setHighlightedIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={onKeyDown}
        aria-autocomplete="list"
        aria-controls="autocomplete-listbox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-activedescendant={
          highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined
        }
        autoComplete="off"
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

      {isOpen && filteredOptions.length > 0 && (
        <ul
          id="autocomplete-listbox"
          role="listbox"
          className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg"
        >
          {filteredOptions.map((option, index) => (
            <li
              key={option.codice}
              id={`option-${index}`}
              role="option"
              aria-selected={highlightedIndex === index}
              className={`cursor-pointer px-3 py-2 ${
                highlightedIndex === index
                  ? "bg-blue-600 text-white"
                  : "text-gray-900"
              }`}
              onMouseDown={(e) => {
                e.preventDefault(); // prevent blur before click
                onSelect(option);
                setIsOpen(false);
                setHighlightedIndex(-1);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.nome} ({option.sigla})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
