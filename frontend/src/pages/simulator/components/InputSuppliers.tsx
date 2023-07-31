import { Controller, Control } from "react-hook-form";
import { OfferInput, Offer } from "../../../utils/types";
import { Box } from "@mui/material";
import InputGroup from "./InputGroup";
import { Autocomplete } from "../../../components";

type InputSuppliersProps = {
  formOptions?: OfferInput;
  control: Control<Offer>;
};

export default function InputSuppliers({ formOptions, control }: InputSuppliersProps) {
  return (
    <InputGroup title="Suppliers">
      <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gridTemplateRows="1fr 1fr" gap="16px">
        <Controller
          control={control}
          name="importer"
          render={({ field }) =>
            <Autocomplete
              freeSolo
              label="Importer"
              value={field.value}
              onChange={field.onChange}
              options={formOptions?.importer}
            />
          }
        />

        <Controller
          control={control}
          name="client"
          render={({ field }) =>
            <Autocomplete
              freeSolo
              label="Final Customer"
              value={field.value}
              onChange={field.onChange}
              options={formOptions?.client}
            />
          }
        />

        <Controller
          control={control}
          name="sealine"
          render={({ field }) =>
            <Autocomplete
              freeSolo
              label="Shipping Line *"
              value={field.value}
              onChange={field.onChange}
              options={formOptions?.sealine}
              required
            />
          }
        />

        <Controller
          control={control}
          name="forwarder"
          render={({ field }) =>
            <Autocomplete
              freeSolo
              label="Forwarder"
              value={field.value}
              onChange={field.onChange}
              options={formOptions?.forwarder}
            />
          }
        />

        <Controller
          control={control}
          name="inland_carrier.discharge_port"
          render={({ field }) =>
            <Autocomplete
              freeSolo
              label="Inland Discharge"
              value={field.value}
              onChange={field.onChange}
            />
          }
        />

        <Controller
          control={control}
          name="inland_carrier.loading_port"
          render={({ field }) =>
            <Autocomplete
              freeSolo
              label="Inland Loading"
              value={field.value}
              onChange={field.onChange}
            />
          }
        />
      </Box>
    </InputGroup>
  );
}