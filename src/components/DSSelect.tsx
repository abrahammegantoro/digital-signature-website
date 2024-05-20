import { Label, Select, SelectProps, Tooltip } from "flowbite-react";
import { useState, forwardRef, ChangeEvent } from "react";
import {
  SelectInputProps,
  SelectOption,
  SelectOptionEnum,
} from "@/interface/interface";

import classNames from "classnames";

const DSSelect = forwardRef<HTMLSelectElement, SelectProps & SelectInputProps>(
  (
    {
      id,
      key,
      error,
      errors = {},
      label,
      helperText,
      className = "",
      inputClass,
      placeholder = "",
      name = "",
      options,
      autoCase,
      enablePlaceholder = false,
      ...rest
    },
    ref
  ) => {
    const errorMessage = error?.message || errors?.[name]?.message;
    return (
      <div id={id} key={key} className={className}>
        <div className="mb-2 block">
          <Label htmlFor={name}>{label || name}</Label>
        </div>
        <Select
          id={name}
          name={name}
          color={Boolean(error || errors?.[name]) ? "failure" : ""}
          ref={ref}
          className={`text-black`}
          {...rest}
          defaultValue={""}
        >
          <option
            value={""}
            disabled={!enablePlaceholder}
            className="text-gray-400"
          >
            {placeholder || `Select ${label || name}`}
          </option>
          {Object.entries(options).map((option, idx) => (
            <option key={idx} value={option[0]} className="text-black">
              {option[0] + " - " + option[1]}
            </option>
          ))}
        </Select>
      </div>
    );
  }
);

export default DSSelect;
