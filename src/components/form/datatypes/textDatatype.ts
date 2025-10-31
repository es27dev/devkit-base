import { z } from "zod";
import { Type, AlignLeft, Lock, Mail, Link, Phone } from "lucide-react";

export const TEXT_FORMATS = {
  text: "text",
  multiline: "multiline",
  password: "password",
  email: "email",
  url: "url",
  tel: "tel",
} as const;

export type TextFormat = keyof typeof TEXT_FORMATS;

export const TEXT_ICONS = {
  text: Type,
  multiline: AlignLeft,
  password: Lock,
  email: Mail,
  url: Link,
  tel: Phone,
} as const;

export function getTextSchema(format?: TextFormat, required?: boolean) {
  let schema = z.string();

  switch (format) {
    case "email":
      schema = schema.email("Ungültige E-Mail-Adresse");
      break;
    case "url":
      schema = schema.url("Ungültige URL");
      break;
    case "tel":
      schema = schema.min(10, "Telefonnummer muss mindestens 10 Zeichen haben");
      break;
    case "password":
      schema = schema.min(8, "Passwort muss mindestens 8 Zeichen haben");
      break;
    case "multiline":
      schema = schema.min(10, "Text muss mindestens 10 Zeichen haben");
      break;
    default:
      schema = schema.min(1, "Dieses Feld ist erforderlich");
  }

  if (!required) {
    schema = schema.optional();
  }

  return schema;
}

export function parseTextValue(value: any): string {
  return String(value || "");
}
