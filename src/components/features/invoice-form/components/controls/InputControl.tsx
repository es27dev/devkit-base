import { Input } from "@/components/base/input";

interface InputControlProps {
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

export function InputControl({
  value,
  onChange,
  placeholder,
  disabled,
  type = "text",
  min,
  max,
  step,
  suffix,
}: InputControlProps) {
  if (suffix) {
    return (
      <div className="relative">
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className="pr-8"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {suffix}
        </span>
      </div>
    );
  }

  return (
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
    />
  );
}
