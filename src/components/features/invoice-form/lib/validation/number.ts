import { z } from "zod";
import { Hash, Euro, Percent } from "lucide-react";

export const NUMBER_FORMATS = {
  number: "number",
  currency: "currency",
  percentage: "percentage",
} as const;

export type NumberFormat = keyof typeof NUMBER_FORMATS;

export const NUMBER_ICONS = {
  number: Hash,
  currency: Euro,
  percentage: Percent,
} as const;

export function getNumberSchema(
  format?: NumberFormat,
  required?: boolean,
  min?: number,
  max?: number
) {
  let schema = z.number();

  if (min !== undefined) {
    schema = schema.min(min, `Minimum ist ${min}`);
  }

  if (max !== undefined) {
    schema = schema.max(max, `Maximum ist ${max}`);
  }

  if (format === "percentage") {
    schema = schema.min(0).max(100, "Prozentsatz muss zwischen 0 und 100 liegen");
  }

  if (format === "currency" && min === undefined) {
    schema = schema.min(0, "Betrag muss positiv sein");
  }

  if (!required) {
    schema = schema.optional();
  }

  return schema;
}

export function parseNumberValue(value: any): number {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

export function getNumberSuffix(format?: NumberFormat): string | undefined {
  switch (format) {
    case "currency":
      return "€";
    case "percentage":
      return "%";
    default:
      return undefined;
  }
}
