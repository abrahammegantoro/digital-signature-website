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
    const errorMessage = error?.message || errors?.[name]?.message;
    return (
      <div id={id} key={key} className={className}>
        {!(typeof label === "boolean" && !label) && (
          <div className="mb-2 block">
            <Label htmlFor={name}>{label || name}</Label>
          </div>
        )}
        <Tooltip
          className={classNames(hideHelperText && (errorMessage || helperText) ? "block" : "hidden")}
          content={errorMessage || helperText}
        >
          <TextInput
            type={type}
            id={name}
            name={name}
            placeholder={placeholder || `Enter ${label || name}`}
            color={Boolean(error || errors?.[name]) ? "failure" : ""}
            // helperText={!hideHelperText && (
            //   <div>
            //     <small className="font-medium">{helperText}</small>
            //     {errorMessage && <small className="font-medium">{errorMessage}</small>}
            //   </div>
            // )}
            ref={ref}
            className={`${inputClass} text-black`}
            {...rest}
          />
        </Tooltip>
      </div>
    );
  }
);
DSTextField.displayName = "DSTextField";

export default DSTextField;