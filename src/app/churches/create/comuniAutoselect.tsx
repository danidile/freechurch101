import { Comune } from "@/utils/types/types";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";

export default function ComuneAutocompleteRHF() {
  const { control } = useFormContext();

  const {
    field: { value, onChange, ref },
  } = useController({
    name: "comune",
    control,
    defaultValue: null,
    rules: { required: "Seleziona un comune" },
  });

  const [comuni, setComuni] = useState<Comune[]>([]);
  const [filteredComuni, setFilteredComuni] = useState<Comune[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetch("/data/comuni.json")
      .then((res) => res.json())
      .then((data) => setComuni(data));
  }, []);

  useEffect(() => {
    if (inputValue.length > 1) {
      setFilteredComuni(
        comuni
          .filter((c) =>
            c.nome.toLowerCase().startsWith(inputValue.toLowerCase())
          )
          .slice(0, 10)
      );
    } else {
      setFilteredComuni([]);
    }
  }, [inputValue, comuni]);

  // Keep inputValue synced with value (comune selected)
  useEffect(() => {
    if (value?.nome && value.nome !== inputValue) {
      setInputValue(value.nome);
    }
  }, [value]);

  return (
    <Autocomplete
      label="Comune"
      placeholder="Cerca un comune"
      selectedKey={value?.codice ?? undefined}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onSelectionChange={(key) => {
        const selectedComune = comuni.find((c) => c.codice === key);
        onChange(selectedComune ?? null);
        if (selectedComune) setInputValue(selectedComune.nome);
      }}
      isClearable
      className="max-w-[300px]"
      aria-invalid={!!value ? undefined : "true"}
      aria-describedby="comune-error"
      ref={ref}
    >
      {filteredComuni.map((comune) => (
        <AutocompleteItem key={comune.codice} textValue={comune.nome}>
          {comune.nome} ({comune.sigla})
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
