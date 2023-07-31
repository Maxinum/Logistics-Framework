import { Controller, Control } from "react-hook-form";
import { Offer } from "../../../utils/types";
import { Box, TextField } from "@mui/material";
import InputGroup from "./InputGroup";

type InputNumericsProps = {
  control: Control<Offer>;
};

export default function InputNumerics({ control }: InputNumericsProps) {
  return (
    <InputGroup title="Numeric Specs">
      <Box display="grid" gridTemplateColumns="1fr 1fr 1fr 1fr" gap="14px">
        <Controller
          control={control}
          name="free_days"
          render={({ field }) =>
            <TextField
              {...field}
              type="number"
              size="small"
              label="Free Days"
              inputProps={{ min: 0 }}
              onChange={({ target }) => {
                if (target.value.length <= 3) {
                  field.onChange(target.value);
                }
              }}
            />
          }
        />

        <Controller
          control={control}
          name="duration"
          render={({ field }) =>
            <TextField
              {...field}
              required
              size="small"
              label="Duration"
              inputProps={{
                pattern: /^[+\d]+$/.source,
                maxLength: 7,
              }}
            />
          }
        />

        <Controller
          control={control}
          name="weight_limit.w_20"
          render={({ field }) =>
            <TextField
              {...field}
              type="number"
              size="small"
              label="20ft Weight Limit"
              inputProps={{ min: 0, step: 0.01 }}
              onChange={({ target }) => {
                if (target.value.length <= 10) {
                  field.onChange(target.value);
                }
              }}
            />
          }
        />

        <Controller
          control={control}
          name="weight_limit.w_40"
          render={({ field }) =>
            <TextField
              {...field}
              type="number"
              size="small"
              label="40ft Weight Limit"
              inputProps={{ min: 0, step: 0.01 }}
              onChange={({ target }) => {
                if (target.value.length <= 10) {
                  field.onChange(target.value);
                }
              }}
            />
          }
        />
      </Box>
    </InputGroup>
  );
}