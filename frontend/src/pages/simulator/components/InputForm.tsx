import useSWR from "swr";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller, UseFormReturn, Control } from "react-hook-form";
import { useAuth } from "../../../utils/auth";
import { useToast } from "../../../utils/toast";
import offersService from "../../../utils/services/offers";
import { Offer } from "../../../utils/types";
import { Box, Checkbox, Divider, FormControlLabel, Stack } from "@mui/material";
import ItemLinesExpando, { ItemLinesExpandoProps } from "../../../components/ItemLinesExpando";
import { InputFormModalLayout, RadioChip, PrimaryButton, SecondaryButton } from "../../../components";
import InputGroup from "./InputGroup";
import InputLocations from "./InputLocations";
import InputSuppliers from "./InputSuppliers";
import InputNumerics from "./InputNumerics";
import InputOther from "./InputOther";

type InputFormProps = {
  title: string;
  defaultValues?: Offer;
  onSubmit: (formData: Offer, rfh: UseFormReturn<Offer>) => Promise<void>;
};

type OfferInputControl = {
  control: Control<Offer>;
};

function Incoterms({ control }: OfferInputControl) {
  return (
    <InputGroup title="Incoterm">
      <Stack direction="row" gap={1}>
        <Controller
          name="incoterm"
          control={control}
          render={({ field }) => <>
            {["DAP", "CIF", "EXW", "FOB"].map(incoterm =>
              <RadioChip
                key={incoterm}
                label={incoterm}
                labelId={incoterm}
                value={incoterm}
                isChecked={field.value === incoterm}
                onChange={field.onChange}
              />
            )}
          </>}
        />
      </Stack>
    </InputGroup>
  );
}

function ModesOfShipping({ control }: OfferInputControl) {
  const handleCheck = (checkedValue: string, checkedValues: string[]) => {
    const updatedValues = checkedValues.includes(checkedValue)
      ? checkedValues.filter(mode => mode !== checkedValue)
      : [...checkedValues, checkedValue];

    return updatedValues;
  };

  return (
    <InputGroup title="Mode of Shipping">
      <Stack direction="row" gap={1}>
        {["Rail", "Truck", "Barge", "Bulk"].map(mode =>
          <Controller
            key={mode}
            name="mode"
            control={control}
            render={({ field }) =>
              <FormControlLabel
                label={mode}
                control={
                  <Checkbox
                    size="small"
                    checked={field.value.includes(mode)}
                    onChange={() => field.onChange(handleCheck(mode, field.value))}
                  />
                }
              />
            }
          />
        )}
      </Stack>
    </InputGroup>
  );
}

const defaultOffer = {
  loading_port: "",
  final_destination: "",
  discharge_port: "",
  transit_port: "",
  train_station: "",
  country: "",
  forwarder: "",
  sealine: "",
  inland_carrier: {
    loading_port: "",
    discharge_port: "",
  },
  customs: {
    loading_port: "",
    discharge_port: "",
  },
  weight_limit: {
    w_20: "",
    w_40: "",
  },
  duration: "",
  free_days: "",
  mode: [],
  certificate: "",
  incoterm: "DAP",
  valid_from: new Date().toISOString().substring(0, 10),
  valid_until: "",
  importer: "",
  client: "",
  details: [{
    item_line: "",
    supplier: "",
    price_20: "",
    price_40: "",
    currency_code: "USD",
  }],
  senderInformation: "",
  company: "",
} as unknown as Offer;

export default function InputFormModal({ title, defaultValues = defaultOffer, onSubmit }: InputFormProps) {
  const toast = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const rhf = useForm<Offer>({ defaultValues });
  const { data, error } = useSWR([offersService.QUERY_KEY, "input-form"], offersService.getFormValues);
  const [errorFields, setErrorFields] = useState<ItemLinesExpandoProps<Offer>["errorFields"] | undefined>(undefined);

  const handleModalClose = () => navigate(`/simulator${window.location.search}`);

  const submitForm = rhf.handleSubmit(async (data) => {
    if (user) {
      data.senderInformation = user._id;
      data.company = user.company._id;
    }

    const errorRows = [];

    for (let i = 0; i < data.details.length; i++) {
      for (let j = i + 1; j < data.details.length; j++) {
        if (data.details[i].item_line === data.details[j].item_line) {
          errorRows.push(i, j);
        }
      }
    }

    if (errorRows.length > 0) {
      toast.open("Remove duplicate item lines.", "error", 2 * 3000);
      setErrorFields({ item_line: errorRows });
      return;
    } else {
      setErrorFields(undefined);
    }

    await onSubmit(data, rhf);
  });

  if (error) handleModalClose();

  return (
    <InputFormModalLayout
      title={title}
      isOpen={true}
      closeOnClickAway={false}
      handleSubmit={submitForm}
      handleToggle={handleModalClose}
    >
      <InputFormModalLayout.Section display="flex" flexDirection="column" gap="20px">
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap="14px">
          <Incoterms control={rhf.control} />
          <ModesOfShipping control={rhf.control} />
        </Box>

        <Divider />
        <InputLocations
          formOptions={data?.data}
          control={rhf.control}
        />

        <Divider />
        <InputSuppliers
          formOptions={data?.data}
          control={rhf.control}
        />

        <Divider />
        <InputNumerics control={rhf.control} />

        <Divider />
        <InputOther
          formOptions={data?.data}
          control={rhf.control}
          watch={rhf.watch}
        />
      </InputFormModalLayout.Section>

      <InputFormModalLayout.Section>
        <ItemLinesExpando
          name="details"
          headerTitle="Item Lines"
          control={rhf.control}
          formOptions={data?.data}
          errorFields={errorFields}
          setErrorFields={setErrorFields}
        />
      </InputFormModalLayout.Section>

      <Stack direction="row" alignSelf="flex-end" width={370} spacing={1}>
        <SecondaryButton onClick={handleModalClose} fullWidth>
          Cancel
        </SecondaryButton>
        <PrimaryButton type="submit" fullWidth>
          Save
        </PrimaryButton>
      </Stack>
    </InputFormModalLayout>
  );
}