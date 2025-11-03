import { RadioGroup, RadioGroupItem } from "@/components/base/radio-group";
import { Label } from "@/components/base/label";

interface RadioControlProps {
  value: any;
  onChange: (value: any) => void;
  options: string[] | { value: string; label: string }[];
  disabled?: boolean;
  name: string;
}

export function RadioControl({
  value,
  onChange,
  options,
  disabled,
  name,
}: RadioControlProps) {
  return (
    <RadioGroup onValueChange={onChange} value={value} disabled={disabled} className="flex flex-row gap-4">
      {options.map((option) => {
        const val = typeof option === "string" ? option : option.value;
        const lbl = typeof option === "string" ? option : option.label;
        return (
          <div key={val} className="flex items-center space-x-2">
            <RadioGroupItem value={val} id={`${name}-${val}`} />
            <Label htmlFor={`${name}-${val}`}>{lbl}</Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
