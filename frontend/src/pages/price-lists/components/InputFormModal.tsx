import { useEffect, useMemo, useState } from "react";
import { useForm, Controller, UseFormReturn, useWatch } from "react-hook-form";
import { useAuth } from "../../../utils/auth";
import { useToast } from "../../../utils/toast";
import { useAsync, useDebounce } from "../../../utils/hooks";
import { eachDayOfInterval } from "date-fns";
import { formatDate } from "../../../utils/helpers";
import { PriceList, ItemLine, FreeInterval } from "../../../utils/types";
import priceListsService from "../../../utils/services/priceLists";
import { TextField, Stack } from "@mui/material";
import ItemLinesExpando, { ItemLinesExpandoProps } from "../../../components/ItemLinesExpando";
import { CCDestionation, InlandCarrier, InlandSupplier, Forwarder, LocalCharges } from "./categoryInputs";
import { DateRangePopover, InputFormModalLayout, PrimaryButton, SecondaryButton } from "../../../components";
import { ITEM_LINE_KEY_LABELS, PRICE_LIST_KEY_LABELS_BY_CATEGORY } from "../../../utils/constants";

type InputFormModalProps = {
  title: string;
  isOpen: boolean;
  handleToggle: () => void;
  defaultValues?: PriceList;
  category: PriceList["category"],
  exportExcel?: boolean;
  onSubmit: (formData: PriceList, rhf: UseFormReturn<PriceList>) => Promise<void>;
};

const getIntervalDates = (validIntervals: FreeInterval["validIntervals"] = []) => {
  return validIntervals.flatMap(({ valid_from, valid_until }) =>
    eachDayOfInterval({ start: new Date(valid_from), end: new Date(valid_until) })
  );
};

const handleExcellExport = (priceList: PriceList) => {
  const keyLabels = [...PRICE_LIST_KEY_LABELS_BY_CATEGORY[priceList.category]];

  keyLabels.push(
    { valueKey: "valid_from", label: "Valid From" },
    { valueKey: "valid_until", label: "Valid Until" }
  );

  const generalInfo = [keyLabels.map(({ valueKey }) => {
    if (valueKey.includes(".")) {
      const [object, nestedKey] = valueKey.split("."); // GET PARENT AND CHILD KEYS OF A NESTED VALUE
      return priceList?.[object as keyof PriceList]?.[nestedKey as keyof PriceList[keyof PriceList]];
    } else if (valueKey === "valid_from" || valueKey === "valid_until") {
      return formatDate(priceList[valueKey]);
    }

    return priceList[valueKey];
  })];

  const itemLines = priceList.details.map(itemLine =>
    ITEM_LINE_KEY_LABELS.map(({ valueKey }) => itemLine[valueKey])
  );

  generalInfo.unshift(keyLabels.map(({ label }) => label));
  itemLines.unshift(ITEM_LINE_KEY_LABELS.map(({ label }) => label));

  import("excellentexport").then(xlsx => {
    xlsx.default.convert({
      format: "xlsx",
      openAsDownload: true,
      filename: priceList._id,
    }, [
      {
        name: "General",
        from: { array: generalInfo },
      },
      {
        name: "Item Lines",
        from: { array: itemLines },
      },
    ]);
  });
};

const defaultPriceList = {
  category: "cc-destination",
  valid_from: new Date().toISOString(),
  valid_until: "",
  details: [{
    item_line: "",
    supplier: "",
    price_20: "",
    price_40: "",
    currency_code: "USD",
  }] as unknown as ItemLine[],
} as unknown as PriceList;

export default function InputFormModal({
  title,
  isOpen,
  onSubmit,
  category,
  handleToggle,
  exportExcel = false,
  defaultValues = defaultPriceList
}: InputFormModalProps) {
  const toast = useToast();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const { execute, value } = useAsync(priceListsService.getFreeIntervals);
  const disabledDates = useMemo(() => getIntervalDates(value?.data[0]?.validIntervals), [value]);
  const [errorFields, setErrorFields] = useState<ItemLinesExpandoProps<PriceList>["errorFields"] | undefined>(undefined);

  const inputKeys = useMemo(
    () => PRICE_LIST_KEY_LABELS_BY_CATEGORY[category].map(({ valueKey }) => valueKey), [category]
  );

  const rhf = useForm<PriceList>({ defaultValues });
  const watchFields = useWatch({ control: rhf.control, name: inputKeys });
  const categoryValues = useDebounce(watchFields, 1000);

  const validFrom = rhf.watch("valid_from");
  const validUntil = rhf.watch("valid_until");
  const columns = category === "cc-destination" || category === "forwarder" ? 4 : 3;
  const shouldFetchIntervals = categoryValues?.every(key => key && key !== "");

  useEffect(() => {
    rhf.reset();
  }, [rhf, category]);

  useEffect(() => {
    if (shouldFetchIntervals) {
      const priceList: Partial<PriceList> = { category };

      inputKeys.forEach((key, index) => {
        //eslint-disable-next-line
        //@ts-ignore
        priceList[key] = categoryValues[index];
      });

      execute(priceList);
    }
  }, [categoryValues, inputKeys, execute, category, shouldFetchIntervals]);

  const submitForm = rhf.handleSubmit(async (data) => {
    if (user) {
      data.senderInformation = user._id;
      data.company = user.company._id;
    }
    data.category = category;

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

  return (
    <InputFormModalLayout
      title={title}
      isOpen={isOpen}
      handleSubmit={submitForm}
      handleToggle={handleToggle}
    >
      <InputFormModalLayout.Section
        gap={2}
        display="grid"
        gridTemplateColumns={`repeat(${columns}, 1fr)`}
      >
        {category === "cc-destination" ? <CCDestionation control={rhf.control} /> : null}
        {category === "inland-carrier" ? <InlandCarrier control={rhf.control} /> : null}
        {category === "forwarder" ? <Forwarder control={rhf.control} /> : null}
        {category === "inland-supplier" ? <InlandSupplier control={rhf.control} /> : null}
        {category === "local-charges" ? <LocalCharges control={rhf.control} /> : null}

        <Controller
          control={rhf.control}
          name="valid_from"
          render={({ field }) =>
            <TextField
              {...field}
              required
              size="small"
              label="Valid From"
              disabled={!shouldFetchIntervals}
              value={field.value ? formatDate(field.value) : ""}
              onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
            />
          }
        />

        <Controller
          control={rhf.control}
          name="valid_until"
          render={({ field }) =>
            <TextField
              {...field}
              required
              size="small"
              label="Valid Until"
              disabled={!shouldFetchIntervals}
              value={field.value ? formatDate(field.value) : ""}
              onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
            />
          }
        />

        <DateRangePopover
          anchorEl={anchorEl}
          disabledDates={disabledDates}
          onClose={() => setAnchorEl(null)}
          ranges={[{
            key: "selection",
            startDate: validFrom ? new Date(validFrom) : undefined,
            endDate: validUntil ? new Date(validUntil) : undefined,
          }]}
          onChange={({ selection: { startDate, endDate } }) => {
            if (startDate) rhf.setValue("valid_from", startDate.toISOString());
            if (endDate) rhf.setValue("valid_until", endDate.toISOString());
          }}
        />
      </InputFormModalLayout.Section>

      <InputFormModalLayout.Section>
        <ItemLinesExpando
          name="details"
          headerTitle="Item Lines"
          control={rhf.control}
          errorFields={errorFields}
          setErrorFields={setErrorFields}
        />
      </InputFormModalLayout.Section>

      <Stack direction="row" alignSelf="flex-end" width="100%" spacing={1}>
        {exportExcel
          ? <SecondaryButton
            sx={{ width: "125px", border: "none", mr: "auto", textDecoration: "underline" }}
            onClick={() => handleExcellExport(rhf.getValues())}
          >
            Export Excel
          </SecondaryButton>
          : null
        }
        <SecondaryButton onClick={handleToggle} sx={{ width: "175px", ml: "auto" }}>
          Cancel
        </SecondaryButton>
        <PrimaryButton type="submit" sx={{ width: "175px" }}>
          Save
        </PrimaryButton>
      </Stack>
    </InputFormModalLayout>
  );
}