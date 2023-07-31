import useSWR from "swr";
import adminService from "../../../../utils/services/admin";
import UrlParamsFilter from "../../../../components/UrlParamsFilter";

export default function UsersFilter() {
  const { data, isLoading, error } = useSWR(
    [adminService.QUERY_KEY, "filter-users"],
    adminService.getFilterValues,
  );

  if (error) return null;

  return (
    <UrlParamsFilter>
      <UrlParamsFilter.Select
        label="First Name"
        paramKey="name"
        values={data?.data.name}
        disabled={isLoading}
      />
      <UrlParamsFilter.Select
        label="Last Name"
        paramKey="surname"
        values={data?.data.surname}
        disabled={isLoading}
      />
      <UrlParamsFilter.RadioChips
        label="Status"
        paramKey="status"
        values={["Active", "Inactive"]}
        disabled={isLoading}
      />
    </UrlParamsFilter>
  );
}