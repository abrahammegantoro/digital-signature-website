import { HTMLProps } from "react";

export interface InputProps extends HTMLProps {
  error?: any;
  errors?: { [key: string]: any };
  inputClass?: string;
  label?: string | boolean;
  hideHelperText?: boolean;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
}

export interface SelectOptionEnum {
  [key: string | number]: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectInputProps<>extends InputProps {
  autoCase?: "capital" | "camel" | "snake" | "kebab" | "constant";
  options: { [key: string]: string };
  enablePlaceholder?: boolean;
}
