import { useFieldArray, Controller, Control, ArrayPath, FieldArray, Path } from "react-hook-form";
import { OfferInput, ItemLine } from "../utils/types";
import {
  Stack,
  TextField,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  IconButton,
  Typography
} from "@mui/material";
import { Autocomplete, SecondaryButton } from ".";
import { Delete } from "./icons";

const muiStyles = {
  btnAddItemLine: {
    width: "120px",
  },
  table: {
    borderRadius: "5px",
    overflow: "hidden",
  },
  headRow: {
    backgroundColor: "#f3f3f3",
  },
  bodyRow: {
    backgroundColor: "#fff",
  },
  cell: {
    borderColor: "#f9f9f9",
    borderWidth: "2px",
    color: "var(--blue)",
    paddingRight: "0",
    paddingLeft: "10px",
  },
  subHeading: {
    color: "var(--blue)",
    fontSize: "1.125rem",
    fontWeight: 500,
  },
};

type ItemLines = {
  details: ItemLine[];
};

type ErrorFields = {
  [key in keyof ItemLine]?: number[];
};

export type ItemLinesExpandoProps<T extends ItemLines> = {
  name: string;
  headerTitle: string;
  control: Control<T>;
  disabled?: boolean;
  formOptions?: OfferInput;
  errorFields?: ErrorFields;
  setErrorFields?: (errorFields: ErrorFields) => void;
};

export default function ItemLinesExpando<T extends ItemLines>({
  headerTitle,
  name,
  control,
  formOptions,
  errorFields,
  setErrorFields,
  disabled = false
}: ItemLinesExpandoProps<T>) {
  const { fields, append, remove } = useFieldArray({ control, name: name as ArrayPath<T> });

  const handleAppend = () => {
    append({
      item_line: "",
      supplier: "",
      price_20: "",
      price_40: "",
      currency_code: "USD",
    } as FieldArray<T, ArrayPath<T>>);
  };

  return <>
    <Stack direction="row" alignItems="center" justifyContent="space-between" marginBottom="16px">
      <Typography component="legend" sx={muiStyles.subHeading}>
        {headerTitle}
      </Typography>
      {disabled
        ? null
        : <SecondaryButton onClick={handleAppend} sx={muiStyles.btnAddItemLine}>
          Add Item Line
        </SecondaryButton>
      }
    </Stack>

    <Table sx={muiStyles.table} size="small">
      <TableHead>
        <TableRow sx={muiStyles.headRow}>
          <TableCell sx={muiStyles.cell}>Item Line</TableCell>
          <TableCell sx={muiStyles.cell}>Supplier</TableCell>
          <TableCell sx={muiStyles.cell}>20'Price</TableCell>
          <TableCell sx={muiStyles.cell}>40'Price</TableCell>
          <TableCell sx={muiStyles.cell}>Currency</TableCell>
          <TableCell sx={muiStyles.cell}>Action</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {fields.map((field, index) =>
          <TableRow key={field.id} sx={muiStyles.bodyRow}>
            <TableCell sx={muiStyles.cell}>
              <Controller
                control={control}
                name={`${name}.${index}.item_line` as Path<T>}
                render={({ field }) =>
                  <Autocomplete
                    freeSolo
                    label="Item Line *"
                    value={String(field.value)}
                    onChange={field.onChange}
                    options={formOptions?.item_lines}
                    error={errorFields?.item_line?.includes(index)}
                    disabled={disabled}
                    required
                  />
                }
              />
            </TableCell>

            <TableCell sx={muiStyles.cell}>
              <Controller
                control={control}
                name={`details.${index}.supplier` as Path<T>}
                render={({ field }) =>
                  <Autocomplete
                    freeSolo
                    label="Supplier *"
                    value={String(field.value)}
                    onChange={field.onChange}
                    options={formOptions?.suppliers}
                    error={errorFields?.supplier?.includes(index)}
                    disabled={disabled}
                    required
                  />
                }
              />
            </TableCell>

            <TableCell sx={muiStyles.cell} width={130}>
              <Controller
                control={control}
                name={`details.${index}.price_20` as Path<T>}
                render={({ field }) =>
                  <TextField
                    {...field}
                    type="number"
                    size="small"
                    label="Price 20"
                    inputProps={{ min: 0, step: 0.01 }}
                    error={errorFields?.price_20?.includes(index)}
                    onChange={({ target }) => {
                      if (target.value.length <= 30) {
                        field.onChange(target.value);
                      }
                    }}
                    disabled={disabled}
                    required
                  />
                }
              />
            </TableCell>

            <TableCell sx={muiStyles.cell} width={130}>
              <Controller
                control={control}
                name={`details.${index}.price_40` as Path<T>}
                render={({ field }) =>
                  <TextField
                    {...field}
                    type="number"
                    size="small"
                    label="Price 40"
                    inputProps={{ min: 0, step: 0.01 }}
                    error={errorFields?.price_40?.includes(index)}
                    onChange={({ target }) => {
                      if (target.value.length <= 30) {
                        field.onChange(target.value);
                      }
                    }}
                    disabled={disabled}
                    required
                  />
                }
              />
            </TableCell>

            <TableCell sx={muiStyles.cell} width={100}>
              <Controller
                control={control}
                name={`details.${index}.currency_code` as Path<T>}
                render={({ field }) =>
                  <Autocomplete
                    freeSolo
                    maxLength={5}
                    label="Currency *"
                    value={String(field.value)}
                    onChange={field.onChange}
                    options={formOptions?.currencies}
                    error={errorFields?.currency_code?.includes(index)}
                    disabled={disabled}
                    isUpperCase
                    required
                  />
                }
              />
            </TableCell>

            <TableCell sx={muiStyles.cell} width={65}>
              <IconButton
                aria-label="Remove item line"
                onClick={() => {
                  remove(index);
                  if (setErrorFields) setErrorFields({});
                }}
                disabled={fields.length === 1 || disabled}
              >
                <Delete title="Remove item line" />
              </IconButton>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </>;
}