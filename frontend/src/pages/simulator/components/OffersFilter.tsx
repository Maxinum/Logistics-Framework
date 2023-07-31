import useSWR from "swr";
import { useSearchParams } from "react-router-dom";
import offersService from "../../../utils/services/offers";
import { FormControl, FormGroup, FormLabel, Stack } from "@mui/material";
import UrlParamsFilter from "../../../components/UrlParamsFilter";

export default function OffersFilter() {
  const [urlParams] = useSearchParams();
  const { data, isLoading, error } = useSWR(
    [offersService.QUERY_KEY, "filter-data"],
    () => offersService.getFilterValues()
  );
  const incoterm = urlParams.get("incoterm");

  if (error) {
    return null;
  }

  return (
    <UrlParamsFilter>
      <UrlParamsFilter.RadioChips
        paramKey="incoterm"
        values={data?.data.incoterm}
        label="Incoterm"
        disabled={isLoading}
      />

      <UrlParamsFilter.Select
        label="Final Destination"
        paramKey="final_destination"
        values={data?.data.final_destination}
        disabled={(incoterm !== "DAP" && !!incoterm) || isLoading}
      />

      <UrlParamsFilter.Select
        label="Country"
        paramKey="country"
        values={data?.data.country}
        disabled={isLoading}
      />

      <UrlParamsFilter.Select
        label="Port of Discharge"
        paramKey="discharge_port"
        values={data?.data.discharge_port}
        disabled={isLoading}
      />

      <UrlParamsFilter.Select
        label="Port of Loading"
        paramKey="loading_port"
        values={data?.data.loading_port}
        disabled={isLoading}
      />

      <UrlParamsFilter.Select
        label="Supplier"
        paramKey="details.supplier"
        values={data?.data["details.supplier"]}
        disabled={isLoading}
      />

      <UrlParamsFilter.RadioChips
        paramKey="activity_range"
        values={data?.data.activities}
        label="Activity"
        disabled={isLoading}
      />

      <FormControl component="fieldset">
        <FormLabel component="legend">Dates</FormLabel>

        <FormGroup sx={{ gap: "16px", mt: "10px" }}>
          <UrlParamsFilter.DatePicker
            label="Valid From"
            paramKey="valid_from[gte]"
            maxDateParamKey="valid_until[lte]"
            disabled={isLoading}
          />

          <UrlParamsFilter.DatePicker
            label="Valid Until"
            paramKey="valid_until[lte]"
            minDateParamKey="valid_from[gte]"
            disabled={isLoading}
          />
        </FormGroup>
      </FormControl>

      <Stack alignItems="center">
        <UrlParamsFilter.Checkbox
          paramKey="activity"
          value="Archived"
          label="Deleted offers only"
          disabled={isLoading}
        />
      </Stack>
    </UrlParamsFilter>
  );
} 