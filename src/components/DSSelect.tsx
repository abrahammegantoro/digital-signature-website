import { Label, Select, SelectProps } from "flowbite-react";
import { forwardRef } from "react";
import { SelectInputProps } from "@/interface/interface";

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
          {Array.isArray(options)
            ? options.map((option, idx) => (
                <option key={idx} value={option} className="text-black">
                  {option}
                </option>
              ))
            : Object.entries(options).map(([key, value], idx) => (
                <option key={idx} value={key} className="text-black">
                  {key} - {value}
                </option>
              ))}
        </Select>
      </div>
    );
  }
);

DSSelect.displayName = "DSSelect";

export default DSSelect;
