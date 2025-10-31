import { z } from "zod";
import { CheckSquare } from "lucide-react";

export const BOOLEAN_ICONS = {
  boolean: CheckSquare,
} as const;

export function getBooleanSchema(required?: boolean) {
  let schema = z.boolean();

  if (required) {
    schema = schema.refine((val) => val === true, {
      message: "Dieses Feld muss aktiviert sein",
    });
  } else {
    schema = schema.optional();
  }

  return schema;
}

export function parseBooleanValue(value: any): boolean {
  return Boolean(value);
}
