import { useSearchParams } from "react-router-dom";
import { useUrlParamFilter } from "../utils/hooks";
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormGroup,
  FormLabel,
  TextField,
  Paper
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";
import { RadioChip } from ".";

const muiStyles = {
  form: {
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    padding: "16px",
  },
  radioChips: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "10px",
  },
  checkbox: {
    marginBottom: "1px",
  },
};

/**
 * A compound component that takes input values from its sub-components 
 * and sets them as URL parameters. It provides several sub-components 
 * for filtering that are: Select, DatePicker, RadioChips, and Checkbox.
 * 
 * @example
 * <UrlParamsFilter>
 *   <UrlParamsFilter.Select
 *     label="Port of loading"
 *     paramKey="loading_port"
 *     values={["New York, USA", "Boston, USA"]}
 *   />
 *   <UrlParamsFilter.DatePicker
 *     label="Valid from"
 *     paramKey="valid_from"
 *     maxDateParamKey="valid_until"
 *   />
 *   <UrlParamsFilter.DatePicker
 *     label="Valid until"
 *     paramKey="valid_until"
 *     minDateParamKey="valid_from"
 *   />
 *   <UrlParamsFilter.RadioChips
 *     label="Incoterm"
 *     paramKey="incoterm"
 *     values={["CIF", "DAP", "EXW"]}
 *   />
 *   <UrlParamsFilter.Checkbox
 *     label="Show active items"
 *     paramKey="status"
 *     value="active"
 *   />
 * </UrlParamsFilter>
 */
export default function UrlParamsFilter({ children }: { children: React.ReactNode; }) {
  const [urlParams, setUrlParams] = useSearchParams();

  const handleReset: React.FormEventHandler<HTMLFormElement> = (event) => {
    if (!urlParams.toString().length) return;
    event.preventDefault();
    setUrlParams({});
  };

  return (
    <Paper component="form" sx={muiStyles.form} onReset={handleReset}>
      {children}
      <Button type="reset">Reset Filters</Button>
    </Paper>
  );
}

type InputProps = {
  label: string;
  paramKey: string;
  disabled?: boolean;
};

type ValuesProps = {
  values?: string[];
};

type DateProps = {
  minDateParamKey?: string;
  maxDateParamKey?: string;
};

UrlParamsFilter.Select = function SelectFilter({
  label,
  paramKey,
  values = [],
  disabled = false
}: InputProps & ValuesProps) {
  const [value, handleChange] = useUrlParamFilter(paramKey);

  return (
    <Autocomplete
      value={value}
      options={values}
      disabled={disabled}
      onChange={(_, newValue) => handleChange(newValue || "")}
      isOptionEqualToValue={(option, value) => value === option || value === ""}
      renderInput={params => <TextField {...params} label={label} />}
    />
  );
};

UrlParamsFilter.DatePicker = function DatePickerFilter({
  label,
  paramKey,
  minDateParamKey = "",
  maxDateParamKey = "",
  disabled = false
}: InputProps & DateProps) {
  const [dateString, handleChange, urlParams] = useUrlParamFilter(paramKey);
  const minDate = urlParams.get(minDateParamKey);
  const maxDate = urlParams.get(maxDateParamKey);

  const handleDateChange = (newDate: Date | null) => {
    handleChange(newDate ? newDate.toISOString() : "");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={dateString ? new Date(dateString) : null}
        onAccept={handleDateChange}
        minDate={minDate ? new Date(minDate) : undefined}
        maxDate={maxDate ? new Date(maxDate) : undefined}
        slotProps={{ actionBar: { actions: ["clear", "cancel"] } }}
        disabled={disabled}
      />
    </LocalizationProvider>
  );
};

UrlParamsFilter.RadioChips = function RadioChipsFilter({
  label,
  paramKey,
  values = [],
  disabled = false
}: InputProps & ValuesProps) {
  const [selectedChip, handleChange] = useUrlParamFilter(paramKey);

  const handleChipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event.currentTarget.value);
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup sx={muiStyles.radioChips}>
        <RadioChip
          label="All"
          labelId={`All-${label}`}
          value=""
          isChecked={selectedChip === ""}
          onChange={handleChipChange}
          disabled={disabled}
        />
        {values.map(value =>
          <RadioChip
            key={`${value}-${label}`}
            label={value}
            labelId={`${value}-${label}`}
            value={value}
            isChecked={selectedChip === value}
            onChange={handleChipChange}
            disabled={disabled}
          />
        )}
      </FormGroup>
    </FormControl>
  );
};

UrlParamsFilter.Checkbox = function CheckboxFilter({
  label,
  paramKey,
  value,
  disabled = false
}: InputProps & { value: string; }) {
  const [checkedValue, handleChange] = useUrlParamFilter(paramKey);

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event.currentTarget.value ? "" : value);
  };

  return (
    <FormControlLabel
      label={<span style={{ fontSize: "0.9375rem" }}>{label}</span>}
      control={
        <Checkbox
          size="small"
          sx={muiStyles.checkbox}
          value={checkedValue}
          checked={Boolean(checkedValue)}
          onChange={handleCheck}
          disabled={disabled}
        />
      }
    />
  );
};