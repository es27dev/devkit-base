import { Checkbox } from "@/components/base/checkbox";
import { Label } from "@/components/base/label";

interface CheckboxControlProps {
  value: any;
  onChange: (value: any) => void;
  options?: string[] | { value: string; label: string }[];
  label?: string;
  disabled?: boolean;
}

export function CheckboxControl({
  value,
  onChange,
  options,
  label,
  disabled,
}: CheckboxControlProps) {
  // Single checkbox (boolean)
  if (!options) {
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={value}
          onCheckedChange={onChange}
          disabled={disabled}
        />
        {label && <Label>{label}</Label>}
      </div>
    );
  }

  // Multiple checkboxes (array)
  return (
    <div className="space-y-2">
      {options.map((option) => {
        const val = typeof option === "string" ? option : option.value;
        const lbl = typeof option === "string" ? option : option.label;
        return (
          <div key={val} className="flex items-center space-x-2">
            <Checkbox
              checked={value?.includes(val)}
              onCheckedChange={(checked) => {
                const current = value || [];
                onChange(
                  checked
                    ? [...current, val]
                    : current.filter((v: string) => v !== val)
                );
              }}
              disabled={disabled}
            />
            <Label>{lbl}</Label>
          </div>
        );
      })}
    </div>
  );
}
