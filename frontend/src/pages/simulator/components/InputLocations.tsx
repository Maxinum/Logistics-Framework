import { Controller, Control } from "react-hook-form";
import { OfferInput, Offer } from "../../../utils/types";
import { Box } from "@mui/material";
import InputGroup from "./InputGroup";
import { Autocomplete } from "../../../components";

type InputLocationsProps = {
  formOptions?: OfferInput;
  control: Control<Offer>;
};

export default function InputLocations({ formOptions, control }: InputLocationsProps) {
  return (
    <InputGroup title="Locations">
      <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gridTemplateRows="1fr 1fr" gap="16px">
        <Controller
          control={control}
          name="loading_port"
          render={({ field }) =>
            <Autocomplete
              freeSolo
              label="Port of Loading *"
              value={field.value}
              onChange={field.onChange}
              options={formOptions?.loading_port}
              required
            />
          }
        />

        <Controller
          control={control}
          name="transit_port"
          render={({ field }) =>
            <Autocomplete
              freeSolo
              label="Transit Port"
              value={field.value}
              onChange={field.onChange}
              options={formOptions?.transit_port}
            />
          }
        />

        <Controller
          control={control}
          name="discharge_port"
          render={({ field }) =>
            <Autocomplete
              freeSolo
              label="Port of Discharge *"
              value={field.value}
              onChange={field.onChange}
              options={formOptions?.discharge_port}
              required
            />
          }
        />

        <Controller
          control={control}
          name="train_station"
          render={({ field }) =>
            <Autocomplete
              freeSolo
              label="Train Station"
              value={field.value}
              onChange={field.onChange}
              options={formOptions?.train_station}
            />
          }
        />

        <Controller
          control={control}
          name="final_destination"
          render={({ field }) =>
            <Autocomplete
              freeSolo
              label="Final Destination"
              value={field.value}
              onChange={field.onChange}
              options={formOptions?.final_destination}
            />
          }
        />

        <Controller
          control={control}
          name="country"
          render={({ field }) =>
            <Autocomplete
              freeSolo
              label="Country"
              value={field.value}
              onChange={field.onChange}
              options={formOptions?.country}
            />
          }
        />
      </Box>
    </InputGroup>
  );
}