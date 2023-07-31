import { Controller, Control, UseFormWatch } from "react-hook-form";
import { OfferInput, Offer } from "../../../utils/types";
import { Box, TextField } from "@mui/material";
import InputGroup from "./InputGroup";
import { Autocomplete } from "../../../components";

type InputOtherProps = {
  formOptions?: OfferInput;
  control: Control<Offer>;
  watch: UseFormWatch<Offer>;
};

export default function InputOther({ formOptions, control, watch }: InputOtherProps) {
  return (
    <InputGroup title="Other">
      <Box display="grid" gridTemplateColumns="1fr 1fr 1fr 1fr" gap="14px">
        <Controller
          control={control}
          name="valid_from"
          render={({ field }) =>
            <TextField
              {...field}
              required
              type="date"
              size="small"
              label="Valid From"
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: watch("valid_until") }}
              value={field.value.substring(0, 10)}
            />
          }
        />

        <Controller
          control={control}
          name="valid_until"
          render={({ field }) =>
            <TextField
              {...field}
              required
              type="date"
              size="small"
              label="Valid Until"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: watch("valid_from") }}
              value={field.value.substring(0, 10)}
            />
          }
        />

        <Controller
          control={control}
          name="certificate"
          render={({ field }) =>
            <Autocomplete
              freeSolo
              label="Certificate of Origin"
              value={field.value}
              onChange={field.onChange}
              options={formOptions?.certificate}
            />
          }
        />

        <Controller
          control={control}
          name="customs.discharge_port"
          render={({ field }) =>
            <Autocomplete
              freeSolo
              label="Customs Clearance"
              value={field.value}
              onChange={field.onChange}
              options={formOptions?.customs}
            />
          }
        />
      </Box>
    </InputGroup>
  );
}