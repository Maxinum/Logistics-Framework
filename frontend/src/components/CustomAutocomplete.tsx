import { useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";

type CustomAutocompleteProps = {
  /**
   * The current value of the autocomplete.
   */
  value: string;
  /**
   * The label for the autocomplete input.
   */
  label: string;
  /**
   * Callback function called when the value changes.
   */
  onChange: (value: string | null) => void;
  /**
   * An array of options for the autocomplete.
   */
  options?: string[];
  /**
   * If true, turns the input into its error state
   */
  error?: boolean;
  /**
   * The maximum length of the input value.
   */
  maxLength?: number;
  /**
   * Determines whether free text entry is allowed.
   */
  freeSolo?: boolean;
  /**
   * Is input disabled?
   */
  disabled?: boolean;
  /**
   * Determines whether the input field is required.
   */
  required?: boolean;
  /**
   * Determines whether the input value 
   * should be converted to uppercase.
   */
  isUpperCase?: boolean;
};

/**
 * A custom Autocomplete component built on 
 * top of the MUI's Autocomplete component.
 */
export default function CustomAutocomplete({
  value,
  label,
  onChange,
  options = [],
  error = false,
  maxLength = 50,
  freeSolo = true,
  disabled = false,
  required = false,
  isUpperCase = false,
}: CustomAutocompleteProps) {
  const filteredOptions = useMemo(
    () => options?.filter(option => option && option !== "-") || [],
    [options]
  );

  return (
    <Autocomplete
      size="small"
      freeSolo={freeSolo}
      disabled={disabled}
      options={filteredOptions}
      value={value?.toString() || ""}
      onChange={(_, newValue, reason) =>
        onChange(reason === "clear" ? "" : newValue)
      }
      onInputChange={(_, newValue) =>
        onChange(isUpperCase ? newValue.toUpperCase() : newValue)
      }
      renderInput={params =>
        <TextField
          {...params}
          label={label}
          error={error}
          inputProps={{
            ...params.inputProps,
            maxLength,
            required,
          }}
        />
      }
    />
  );
}