import { Controller, Control } from "react-hook-form";
import { PriceList } from "../../../utils/types";
import { Autocomplete } from "../../../components";

type CategoryInputProps = {
  control: Control<PriceList>;
};

export function CCDestionation({ control }: CategoryInputProps) {
  return <>
    <Controller
      control={control}
      name="discharge_port"
      render={({ field }) =>
        <Autocomplete
          freeSolo
          value={field.value || ""}
          onChange={field.onChange}
          label="Discharge Port"
        />
      }
    />

    <Controller
      control={control}
      name="customs.discharge_port"
      render={({ field }) =>
        <Autocomplete
          freeSolo
          value={field.value || ""}
          onChange={field.onChange}
          label="Customs Clearance"
        />
      }
    />
  </>;
}

export function InlandCarrier({ control }: CategoryInputProps) {
  return <>
    <Controller
      control={control}
      name="train_station"
      render={({ field }) =>
        <Autocomplete
          freeSolo
          value={field.value || ""}
          onChange={field.onChange}
          label="Train Station"
        />
      }
    />

    <Controller
      control={control}
      name="discharge_port"
      render={({ field }) =>
        <Autocomplete
          freeSolo
          value={field.value || ""}
          onChange={field.onChange}
          label="Discharge Port"
        />
      }
    />

    <Controller
      control={control}
      name="final_destination"
      render={({ field }) =>
        <Autocomplete
          freeSolo
          value={field.value || ""}
          onChange={field.onChange}
          label="Final Destination"
        />
      }
    />

    <Controller
      control={control}
      name="inland_carrier.discharge_port"
      render={({ field }) =>
        <Autocomplete
          freeSolo
          value={field.value || ""}
          onChange={field.onChange}
          label="Inland Carrier"
        />
      }
    />
  </>;
}

export function Forwarder({ control }: CategoryInputProps) {
  return <>
    <Controller
      control={control}
      name="inland_carrier.discharge_port"
      render={({ field }) =>
        <Autocomplete
          freeSolo
          value={field.value || ""}
          onChange={field.onChange}
          label="Inland Carrier"
        />
      }
    />

    <Controller
      control={control}
      name="incoterm"
      render={({ field }) =>
        <Autocomplete
          freeSolo
          value={field.value || ""}
          onChange={field.onChange}
          label="Incoterm"
        />
      }
    />
  </>;
}

export function InlandSupplier({ control }: CategoryInputProps) {
  return (
    <Controller
      control={control}
      name="inland_carrier.loading_port"
      render={({ field }) =>
        <Autocomplete
          freeSolo
          value={field.value || ""}
          onChange={field.onChange}
          label="Inland Carrier"
        />
      }
    />
  );
}

export function LocalCharges({ control }: CategoryInputProps) {
  return (
    <Controller
      control={control}
      name="sealine"
      render={({ field }) =>
        <Autocomplete
          freeSolo
          value={field.value || ""}
          onChange={field.onChange}
          label="Shipping Line"
        />
      }
    />
  );
}