import { useParams } from "react-router-dom";
import { useToast } from "../../../../utils/toast";
import { useGetSingleData, useAsync } from "../../../../utils/hooks";
import { revalidateCache } from "../../../../utils/helpers";
import offersService from "../../../../utils/services/offers";
import { Offer } from "../../../../utils/types";
import InputForm from "../../components/InputForm";
import PageLoader from "../../../../components/PageLoader";

export default function EditOffer() {
  const toast = useToast();
  const { offerId } = useParams();
  const { execute, status } = useAsync(offersService.edit);
  const { data, isLoading, error } = useGetSingleData(
    offersService.QUERY_KEY, offerId || "", offersService.getOneById
  );

  const handleSubmit = async (data: Offer) => {
    const { status } = await execute(offerId || "", data);
    if (status === "success") {
      toast.open("Offer edited successfully!", "success", 2 * 1000);
      await revalidateCache(offersService.QUERY_KEY);
    }
  };

  if (error) return null;

  if (isLoading || !data) return <PageLoader />;

  return (
    <>
      {status === "loading" ? <PageLoader /> : null}
      <InputForm
        title={`Edit Offer ID ${offerId}`}
        defaultValues={data}
        onSubmit={handleSubmit}
      />
    </>
  );
}