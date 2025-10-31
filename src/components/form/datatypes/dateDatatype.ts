import { z } from "zod";
import { Calendar, CalendarClock, Clock } from "lucide-react";

export const DATE_FORMATS = {
  date: "date",
  datetime: "datetime",
  time: "time",
} as const;

export type DateFormat = keyof typeof DATE_FORMATS;

export const DATE_ICONS = {
  date: Calendar,
  datetime: CalendarClock,
  time: Clock,
} as const;

export function getDateSchema(format?: DateFormat, required?: boolean) {
  let schema = z.string();

  switch (format) {
    case "datetime":
      schema = schema.regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
        "Ungültiges Datum/Zeit-Format"
      );
      break;
    case "time":
      schema = schema.regex(/^\d{2}:\d{2}$/, "Ungültige Zeitangabe");
      break;
    default:
      schema = schema.regex(/^\d{4}-\d{2}-\d{2}$/, "Ungültiges Datumsformat");
  }

  if (required) {
    schema = schema.min(1, "Dieses Feld ist erforderlich");
  } else {
    schema = schema.optional();
  }

  return schema;
}

export function parseDateValue(value: any): string {
  return String(value || "");
}
