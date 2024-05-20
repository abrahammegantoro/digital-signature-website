"use client"
import classNames from "classnames";
import { Label, TextInput, TextInputProps, Tooltip } from "flowbite-react";
import React from "react";
import { InputProps } from "@/interface/interface";
// import { get } from "lodash";

const DSTextField = React.forwardRef<
  HTMLInputElement,
  TextInputProps & InputProps
>(
  (
    {
      id,
      key,
      type,
      error,
      errors = {},
      label,
      helperText,
      className = "",
      inputClass,
      placeholder = "",
      name = "",
      hideHelperText = false,
      ...rest
    },
    ref
  ) => {
    return (
      <div id={id} key={key} className={className}>
        {!(typeof label === "boolean" && !label) && (
          <div className="mb-2 block">
            <Label htmlFor={name}>{label || name}</Label>
          </div>
        )}
        <TextInput
          type={type}
          id={name}
          name={name}
          placeholder={placeholder || `Enter ${label || name}`}
          color={Boolean(error || errors?.[name]) ? "failure" : ""}
          helperText={!hideHelperText && (
              <small className="font-medium text-gray-400">{helperText}</small>
          )}
          ref={ref}
          className={classNames(inputClass, "text-black w-full")}
          {...rest}
        />
      </div>
    );
  }
);
DSTextField.displayName = "DSTextField";

export default DSTextField;