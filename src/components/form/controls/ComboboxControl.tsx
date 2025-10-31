import { useState } from "react";
import { Button } from "@/components/base/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/base/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/base/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/utils";

interface ComboboxControlProps {
  value: any;
  onChange: (value: any) => void;
  options: string[] | { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}

export function ComboboxControl({
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: ComboboxControlProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value
            ? (() => {
                const selected = options.find(
                  (opt) => (typeof opt === "string" ? opt : opt.value) === value
                );
                return typeof selected === "string" ? selected : selected?.label;
              })()
            : placeholder || "Auswählen..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Suchen..." />
          <CommandList>
            <CommandEmpty>Keine Ergebnisse.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const val = typeof option === "string" ? option : option.value;
                const lbl = typeof option === "string" ? option : option.label;
                return (
                  <CommandItem
                    key={val}
                    value={val}
                    onSelect={() => {
                      onChange(val);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === val ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {lbl}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
