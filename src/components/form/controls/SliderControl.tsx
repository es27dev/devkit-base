import { Slider } from "@/components/base/slider";

interface SliderControlProps {
  value: any;
  onChange: (value: any) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
}

export function SliderControl({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  showValue = true,
}: SliderControlProps) {
  return (
    <div className="flex items-center gap-4">
      <Slider
        value={[value || min]}
        onValueChange={(vals) => onChange(vals[0])}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="flex-1"
      />
      {showValue && (
        <span className="text-sm font-medium min-w-[3ch] text-right">
          {value || min}
        </span>
      )}
    </div>
  );
}
