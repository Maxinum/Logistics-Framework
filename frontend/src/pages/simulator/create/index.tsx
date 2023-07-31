import { UseFormReturn } from "react-hook-form";
import { useToast } from "../../../utils/toast";
import { useAsync } from "../../../utils/hooks";
import { revalidateCache } from "../../../utils/helpers";
import offersService from "../../../utils/services/offers";
import { Offer } from "../../../utils/types";
import InputForm from "../components/InputForm";
import { UnderlinedLink, PageLoader } from "../../../components";

export default function CreateOffer() {
  const toast = useToast();
  const { execute, status } = useAsync(offersService.create);

  const handleSubmit = async (data: Offer, rhk: UseFormReturn<Offer>) => {
    const { status, value } = await execute(data);
    if (status === "success") {
      toast.open(
        <p>
          Offer created successfully!{" "}
          <UnderlinedLink to={`simulator/${value?.data.newOffer._id}`}>
            Click here
          </UnderlinedLink>
          {" "}to view it.
        </p>,
        "success",
        7 * 1000
      );
      await revalidateCache(offersService.QUERY_KEY);
      rhk.reset();
    }
  };

  return (
    <>
      {status === "loading" ? <PageLoader /> : null}
      <InputForm title="New Shipping lines Offer" onSubmit={handleSubmit} />
    </>
  );
}