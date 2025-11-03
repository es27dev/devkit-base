"use client";

import { Control } from "react-hook-form";
import { AlertCircle } from "lucide-react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/base/form";

import {
  InputControl,
  TextareaControl,
  SelectControl,
  RadioControl,
  CheckboxControl,
  SliderControl,
  DatePickerControl,
  ComboboxControl,
} from "./controls";

import {
  TEXT_ICONS,
  NUMBER_ICONS,
  DATE_ICONS,
  BOOLEAN_ICONS,
  CHOICE_ICONS,
  getNumberSuffix,
} from "../lib/validation";

type Datatype = "text" | "number" | "date" | "boolean" | "choice";
type ControlType =
  | "input"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "slider"
  | "datepicker"
  | "combobox";

interface UnifiedFormFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  datatype: Datatype;
  controlType: ControlType;

  // Format options
  format?: string;

  // Number options
  min?: number;
  max?: number;
  step?: number;

  // Choice/Select options
  options?: string[] | { value: string; label: string }[];

  // General options
  placeholder?: string;
  description?: string;
  required?: boolean;
  status?: "error";
  disabled?: boolean;
  rows?: number;
}

export function UnifiedFormField({
  control,
  name,
  label,
  datatype,
  controlType,
  format,
  min,
  max,
  step,
  options,
  placeholder,
  description,
  required = false,
  status,
  disabled,
  rows,
}: UnifiedFormFieldProps) {
  const getDataTypeIcon = () => {
    const iconMap = {
      text: TEXT_ICONS[format as keyof typeof TEXT_ICONS] || TEXT_ICONS.text,
      number:
        NUMBER_ICONS[format as keyof typeof NUMBER_ICONS] ||
        NUMBER_ICONS.number,
      date: DATE_ICONS[format as keyof typeof DATE_ICONS] || DATE_ICONS.date,
      boolean: BOOLEAN_ICONS.boolean,
      choice: CHOICE_ICONS.choice,
    };

    const Icon = iconMap[datatype];
    return Icon ? <Icon className="h-4 w-4" /> : null;
  };

  const getStatusColor = () => {
    return status === "error" ? "text-error border-error" : undefined;
  };

  const getStatusIcon = () => {
    if (status === "error") {
      return <AlertCircle className="h-4 w-4 text-error" />;
    }
    return null;
  };

  const renderControl = (field: any) => {
    const baseProps = {
      value: field.value,
      onChange: field.onChange,
      placeholder,
      disabled,
    };

    switch (controlType) {
      case "textarea":
        return <TextareaControl {...baseProps} rows={rows} />;

      case "select":
        return <SelectControl {...baseProps} options={options || []} />;

      case "radio":
        return (
          <RadioControl
            value={String(field.value)}
            onChange={(val) => {
              // Convert to number if datatype is number
              field.onChange(datatype === "number" ? parseFloat(val) : val);
            }}
            options={options || []}
            name={name}
            disabled={disabled}
          />
        );

      case "checkbox":
        return (
          <CheckboxControl {...baseProps} options={options} label={label} />
        );

      case "slider":
        return <SliderControl {...baseProps} min={min} max={max} step={step} />;

      case "datepicker":
        return <DatePickerControl {...baseProps} />;

      case "combobox":
        return <ComboboxControl {...baseProps} options={options || []} />;

      case "input":
      default:
        const inputType =
          datatype === "number"
            ? "number"
            : format === "password"
            ? "password"
            : format === "email"
            ? "email"
            : format === "url"
            ? "url"
            : format === "tel"
            ? "tel"
            : "text";

        const suffix =
          datatype === "number" ? getNumberSuffix(format as any) : undefined;

        return (
          <InputControl
            {...baseProps}
            type={inputType}
            min={min}
            max={max}
            step={step}
            suffix={suffix}
          />
        );
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const statusColor = getStatusColor();

        return (
          <FormItem>
            <div className="flex flex-row justify-between items-center mb-2">
              <div
                className={`inline-flex justify-start items-center gap-1 border-b-2 ${statusColor} rounded-md px-2`}
              >
                {getDataTypeIcon()}
                <span>{label}</span>
              </div>
              {getStatusIcon()}
            </div>
            <FormControl>{renderControl(field)}</FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
