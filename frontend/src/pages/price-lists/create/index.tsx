import { useNavigate } from "react-router-dom";
import { useToast } from "../../../utils/toast";
import { useAsync } from "../../../utils/hooks";
import { UseFormReturn } from "react-hook-form";
import { revalidateCache, getCategoryTitle } from "../../../utils/helpers";
import priceListsService from "../../../utils/services/priceLists";
import { PriceList } from "../../../utils/types";
import { PageLoader } from "../../../components";
import InputFormModal from "../components/InputFormModal";

export default function CratePriceList() {
  const toast = useToast();
  const navigate = useNavigate();
  const { execute, status } = useAsync(priceListsService.create);
  const urlParams = new URLSearchParams(location.search);
  const category = urlParams.get("category") as PriceList["category"] || "cc-destination";

  const handleSubmit = async (data: PriceList, rhf: UseFormReturn<PriceList>) => {
    const { status } = await execute(data);
    if (status === "success") {
      rhf.reset();
      toast.open("Price list created successfully!", "success", 2 * 1000);
      await revalidateCache(priceListsService.QUERY_KEY);
    }
  };

  return <>
    {status === "loading" ? <PageLoader /> : null}
    <InputFormModal
      isOpen={true}
      category={category}
      onSubmit={handleSubmit}
      title={`New ${getCategoryTitle(category)}`}
      handleToggle={() => navigate(`/price-lists${location.search}`)}
    />
  </>;
}