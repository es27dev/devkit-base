import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/base/select";

interface SelectControlProps {
  value: any;
  onChange: (value: any) => void;
  options: string[] | { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}

export function SelectControl({
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: SelectControlProps) {
  return (
    <Select onValueChange={onChange} value={value} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder || "Auswählen..."} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => {
          const val = typeof option === "string" ? option : option.value;
          const lbl = typeof option === "string" ? option : option.label;
          return (
            <SelectItem key={val} value={val}>
              {lbl}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
