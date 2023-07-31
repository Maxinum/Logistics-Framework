import { useParams } from "react-router-dom";
import { useToast } from "../../../../utils/toast";
import { useGetSingleData, useAsync } from "../../../../utils/hooks";
import { revalidateCache } from "../../../../utils/helpers";
import offersService from "../../../../utils/services/offers";
import { Offer } from "../../../../utils/types";
import InputForm from "../../components/InputForm";
import { UnderlinedLink, PageLoader } from "../../../../components";

export default function CopyOffer() {
  const toast = useToast();
  const { offerId } = useParams();
  const { execute, status } = useAsync(offersService.create);
  const { data, isLoading, error } = useGetSingleData(
    offersService.QUERY_KEY, offerId || "", offersService.getOneById
  );

  const handleSubmit = async (data: Offer) => {
    const { _id, ...filteredData } = data; // eslint-disable-line
    const { status, value } = await execute(filteredData as Offer);
    if (status === "success") {
      toast.open(
        <p>
          Copy of an offer created successfully!{" "}
          <UnderlinedLink to={`simulator/${value?.data.newOffer._id}`}>
            Click here
          </UnderlinedLink>
          {" "}to view it.
        </p>,
        "success",
        7 * 1000
      );
      await revalidateCache(offersService.QUERY_KEY);
    }
  };

  if (error) return null;

  if (isLoading || !data) return <PageLoader />;

  return (
    <>
      {status === "loading" ? <PageLoader /> : null}
      <InputForm
        title="New Shipping lines Offer"
        defaultValues={data}
        onSubmit={handleSubmit}
      />
    </>
  );
}