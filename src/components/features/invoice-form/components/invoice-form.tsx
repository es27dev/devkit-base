"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/base/button";
import { Form } from "@/components/base/form";
import { UnifiedFormField } from "@/components/features/invoice-form/components/unified-form-field";

const formFields = [
  {
    name: "status",
    label: "Status",
    datatype: "number" as const,
    controlType: "slider" as const,
    min: 0,
    max: 10,
    x: 0,
    y: 0,
    colSpan: 2,
    schema: z.number().min(0),
  },
  {
    name: "rechnungsnummer",
    label: "Rechnungsnummer",
    datatype: "text" as const,
    controlType: "input" as const,
    placeholder: "RE-2024-001",
    required: true,
    x: 0,
    y: 1,
    schema: z.string().min(1, "Rechnungsnummer erforderlich"),
  },
  {
    name: "rechnungsdatum",
    label: "Rechnungsdatum",
    datatype: "date" as const,
    controlType: "datepicker" as const,
    required: true,
    x: 1,
    y: 1,
    schema: z.string().min(1, "Rechnungsdatum erforderlich"),
  },
  {
    name: "nettosumme",
    label: "Nettosumme",
    datatype: "number" as const,
    controlType: "input" as const,
    format: "currency",
    min: 0,
    required: true,
    x: 0,
    y: 2,
    schema: z.number().min(0, "Nettosumme muss positiv sein"),
  },
  {
    name: "steuersatz",
    label: "Steuersatz",
    datatype: "number" as const,
    controlType: "radio" as const,
    format: "percentage",
    options: [
      { value: "0", label: "0%" },
      { value: "7", label: "7%" },
      { value: "19", label: "19%" },
    ],
    required: true,
    x: 1,
    y: 2,
    schema: z.number().min(0).max(100, "Steuersatz zwischen 0 und 100"),
  },
  {
    name: "steuersumme",
    label: "Steuersumme",
    datatype: "number" as const,
    controlType: "input" as const,
    format: "currency",
    min: 0,
    x: 0,
    y: 3,
    schema: z.number().min(0),
  },
  {
    name: "bruttosumme",
    label: "Bruttosumme",
    datatype: "number" as const,
    controlType: "input" as const,
    format: "currency",
    min: 0,
    x: 1,
    y: 3,
    schema: z.number().min(0),
  },
  {
    name: "leistungsdatum",
    label: "Leistungsdatum",
    datatype: "date" as const,
    controlType: "datepicker" as const,
    required: true,
    x: 0,
    y: 4,
    schema: z.string().min(1, "Leistungsdatum erforderlich"),
  },
  {
    name: "faelligkeitsdatum",
    label: "Fälligkeitsdatum",
    datatype: "date" as const,
    controlType: "datepicker" as const,
    required: true,
    x: 1,
    y: 4,
    schema: z.string().min(1, "Fälligkeitsdatum erforderlich"),
  },
];

const formSchema = z.object(
  formFields.reduce((acc, field) => {
    acc[field.name] = field.schema;
    return acc;
  }, {} as Record<string, any>)
);

export function InvoiceForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 0,
      rechnungsnummer: "",
      rechnungsdatum: "",
      nettosumme: 0,
      steuersatz: 0,
      steuersumme: 0,
      bruttosumme: 0,
      leistungsdatum: "",
      faelligkeitsdatum: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  // Get max x and y for grid dimensions
  const maxX = Math.max(...formFields.map((f) => f.x)) + 1;
  const maxY = Math.max(...formFields.map((f) => f.y)) + 1;

  // Create grid array
  const grid: Array<Array<(typeof formFields)[0] | null>> = Array.from(
    { length: maxY },
    () => Array(maxX).fill(null)
  );

  // Place fields in grid
  formFields.forEach((field) => {
    grid[field.y][field.x] = field;
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full h-full overflow-auto space-y-6 border rounded-lg p-6"
      >
        <h2 className="text-2xl font-bold">Formular Rechnungsprüfung</h2>

        {grid.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4"
            style={{
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
            }}
          >
            {row.map((field, colIndex) => (
              <div
                key={colIndex}
                style={{
                  gridColumn: field?.colSpan
                    ? `span ${field.colSpan}`
                    : undefined,
                }}
              >
                {field && (
                  <UnifiedFormField
                    control={form.control}
                    name={field.name}
                    label={field.label}
                    datatype={field.datatype}
                    controlType={field.controlType}
                    format={field.format}
                    min={field.min}
                    max={field.max}
                    options={field.options}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>
        ))}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
