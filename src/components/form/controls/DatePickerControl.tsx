import { useState } from "react";
import { Button } from "@/components/base/button";
import { Calendar } from "@/components/base/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/base/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/utils";

interface DatePickerControlProps {
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePickerControl({
  value,
  onChange,
  placeholder,
  disabled,
}: DatePickerControlProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(new Date(value), "PPP", { locale: de })
          ) : (
            <span>{placeholder || "Datum wählen"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : "");
            setOpen(false);
          }}
          locale={de}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
