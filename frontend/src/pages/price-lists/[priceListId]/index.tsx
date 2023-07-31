import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../utils/toast";
import { useAsync, useGetSingleData } from "../../../utils/hooks";
import priceListsService from "../../../utils/services/priceLists";
import { revalidateCache } from "../../../utils/helpers";
import { PriceList } from "../../../utils/types";
import InputFormModal from "../components/InputFormModal";
import { PageLoader } from "../../../components";

export default function EditPriceList() {
  const toast = useToast();
  const navigate = useNavigate();
  const { priceListId } = useParams();
  const { edit, getOneById, QUERY_KEY } = priceListsService;
  const { execute, status } = useAsync(edit);
  const { data, isLoading, error } = useGetSingleData(QUERY_KEY, priceListId || "", getOneById);

  const handleEditSubmit = async (data: PriceList) => {
    const { status } = await execute(data._id, data);
    if (status === "success") {
      toast.open("Price list edited successfully!", "success", 2 * 1000);
      await revalidateCache(priceListsService.QUERY_KEY);
    }
  };

  if (error) return null;

  if (isLoading || !data) return <PageLoader />;

  return <>
    {status === "loading" ? <PageLoader /> : null}
    <InputFormModal
      isOpen={true}
      defaultValues={data}
      category={data.category}
      title={"Edit Price List"}
      onSubmit={handleEditSubmit}
      handleToggle={() => navigate(`/price-lists${location.search}`)}
      exportExcel
    />
  </>;
} 