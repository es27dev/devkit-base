import { z } from "zod";
import { ChevronDown } from "lucide-react";

export const CHOICE_ICONS = {
  choice: ChevronDown,
} as const;

export function getChoiceSchema(
  options: string[] | { value: string; label: string }[],
  required?: boolean,
  multiple?: boolean
) {
  const values = options.map((opt) =>
    typeof opt === "string" ? opt : opt.value
  );

  if (multiple) {
    let schema = z.array(z.string());
    if (required) {
      schema = schema.min(1, "Mindestens eine Option muss ausgewählt werden");
    } else {
      schema = schema.optional();
    }
    return schema;
  }

  let schema = z.enum(values as [string, ...string[]]);

  if (!required) {
    return schema.optional();
  }

  return schema;
}

export function parseChoiceValue(value: any, multiple?: boolean): any {
  if (multiple) {
    return Array.isArray(value) ? value : [];
  }
  return value || "";
}
