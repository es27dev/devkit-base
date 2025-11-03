import { Textarea } from "@/components/base/textarea";

interface TextareaControlProps {
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

export function TextareaControl({
  value,
  onChange,
  placeholder,
  disabled,
  rows = 4,
}: TextareaControlProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className="min-h-[100px]"
    />
  );
}
