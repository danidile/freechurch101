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
  const [selectedComune, setSelectedComune] = useState<Comune | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sync selectedComune with value prop in case of external resets
    if (value === "") {
      setSelectedComune(null);
    } else if (selectedComune?.nome !== value) {
      // Try to find Comune matching current value
      const match = options.find((c) => c.nome === value);
      setSelectedComune(match || null);
    }
  }, [value, options, selectedComune]);

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

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => (i < filteredOptions.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => (i > 0 ? i - 1 : filteredOptions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        const selected = filteredOptions[highlightedIndex];
        onSelect(selected);
        setSelectedComune(selected);
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  }

  const filteredOptions =
    value.length > 1
      ? options
          .filter((o) => o.nome.toLowerCase().startsWith(value.toLowerCase()))
          .slice(0, 10)
      : [];

  const noResults = value.length > 1 && filteredOptions.length === 0;

  // Clear selected comune handler
  const clearSelection = () => {
    setSelectedComune(null);
    onChange("");
    setIsOpen(false);
  };

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
        className={`cinput w-full ${error ? "border-red-500" : "border-gray-300"}`}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
          setHighlightedIndex(-1);
          setSelectedComune(null); // clear selection if user types
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
                e.preventDefault();
                onSelect(option);
                setSelectedComune(option);
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
      {selectedComune && (
        <div className="mt-2 inline-flex items-center gap-3  px-4 py-1.5 text-sm font-semibold select-none">
          <span>
            Selezionato:{" "}
            <span className="font-medium">{selectedComune.nome}</span> (
            {selectedComune.sigla})
          </span>
        </div>
      )}

      {noResults && (
        <p className="mt-2 rounded-md bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-800 shadow-inner select-none">
          Nessun comune trovato.
        </p>
      )}
    </div>
  );
}
