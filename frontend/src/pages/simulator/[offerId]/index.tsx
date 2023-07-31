import { useMemo } from "react";
import { useNavigate, useOutletContext, useParams, Link } from "react-router-dom";
import { formatPrice, getCategoryTitle } from "../../../utils/helpers";
import { useToast } from "../../../utils/toast";
import { useGetSingleData } from "../../../utils/hooks";
import offersService from "../../../utils/services/offers";
import { getOfferPath, getOfferSuppliers, multiplyOfferPrices } from "../helpers";
import { Button, Tooltip, Stack } from "@mui/material";
import SortableTable, { HeadCell } from "../../../components/SortableTable/SortableTable";
import { PageLoader, PrimaryButton, SecondaryButton, ModalWrapper } from "../../../components";
import { Waves, Dashes } from "../../../components/icons";
import { ItemLine, Offer, PriceList } from "../../../utils/types";
import styles from "./index.module.css";

type OutletContext = {
  num20: number;
  num40: number;
};

type PriceCardProps = {
  offer: Offer;
};

type FreightPathProps = {
  offer: Offer;
};

type Supplier = {
  supplier: string;
  price_usd: number;
};

const generalHeadCells = [
  { valueKey: "_id", label: "ID" },
  { valueKey: "discharge_port", label: "Discharge Port" },
  { valueKey: "mode", label: "Shipping Mode" },
  { valueKey: "incoterm", label: "Incoterm" },
  { valueKey: "sealine", label: "Shipping Line" },
  { valueKey: "loading_port", label: "Loading Port" },
  { valueKey: "transit_port", label: "Transit Port" },
  { valueKey: "duration", label: "Duration" },
];

const itemLinesHeadCells: HeadCell<ItemLine>[] = [
  { valueKey: "supplier", label: "Supplier" },
  { valueKey: "item_line", label: "Item Line" },
  { valueKey: "price_20", label: "Price 20" },
  { valueKey: "price_40", label: "Price 40" },
  { valueKey: "currency_code", label: "Currency" },
];

const suppliersHeadCells: HeadCell<Supplier>[] = [
  { valueKey: "supplier", label: "Supplier" },
  { valueKey: "price_usd", label: "Total Price USD" },
];

const muiStyles = {
  modal: {
    maxWidth: "720px",
    minHeight: "610px",
    width: "95%",
  },
  circularProgress: {
    alignSelf: "center",
    marginTop: "200px",
  },
  offerId: {
    alignSelf: "flex-start",
    color: "#909090",
    fontSize: "0.875rem",
    padding: 0,
    borderRadius: 0,
    textTransform: "none",
  },
  secondaryButton: {
    width: "50%",
  },
};

const handleExcellExport = (offer: Offer, suppliers: Supplier[]) => {
  const generalInfo = [generalHeadCells.map(({ valueKey }) => {
    if (valueKey === "mode") return offer.mode.join(" & ");
    return offer[valueKey as keyof Offer];
  })];
  const suppliersList = suppliers.map(supplier => Object.values(supplier));
  const itemLines = offer.details.map(itemLine =>
    itemLinesHeadCells.map(({ valueKey }) => itemLine[valueKey as keyof ItemLine])
  );

  generalInfo.unshift(generalHeadCells.map(({ label }) => label));
  itemLines.unshift(itemLinesHeadCells.map(({ label }) => label));
  suppliersList.unshift(suppliersHeadCells.map(({ label }) => label));

  import("excellentexport").then(xlsx => {
    xlsx.default.convert(
      {
        filename: offer._id,
        format: "xlsx",
        openAsDownload: true,
      },
      [
        {
          name: "General",
          from: { array: generalInfo },
        },
        {
          name: "Item Lines",
          from: { array: itemLines },
        },
        {
          name: "Suppliers",
          from: { array: suppliersList },
        },
      ]
    );
  });
};

function PriceCard({ offer }: PriceCardProps) {
  const { w_20, w_40 } = offer.weight_limit;
  const { total_price_20_usd, total_price_40_usd } = offer;
  const totalPrice = total_price_20_usd + total_price_40_usd;
  const averagePrice = w_20 || w_40
    ? (totalPrice / (w_20 + w_40)).toFixed(2)
    : null;

  return (
    <div className={styles.priceCard}>
      <p className={styles.priceHeader}>Total Price</p>
      <p className={styles.price}>${formatPrice(totalPrice)}</p>
      {averagePrice
        ? <p className={styles.average}>
          Average per KG: ${averagePrice}
        </p>
        : null
      }
    </div>
  );
}

function FreightPath({ offer }: FreightPathProps) {
  const offerPath = useMemo(() => getOfferPath(offer), [offer]);

  return (
    <div className={styles.freightPath}>
      <figure className={styles.location}>
        <Tooltip arrow title="Port of loading">
          <div className={`${styles.mainPoint} ${styles.startPoint}`} />
        </Tooltip>

        <figcaption className={styles.mainPointName}>
          {offer.loading_port}
        </figcaption>
      </figure>

      {offerPath.map((location, index) =>
        <figure
          key={`freight-path-${index}`}
          className={`${styles.location} ${location.isInLand ? styles.railLocation : ""}`}
        >
          <div>
            {location.isInLand ? <Dashes /> : <Waves />}
            <Tooltip arrow title={location.label}>
              <div className={styles.midPoint} />
            </Tooltip>
          </div>

          <figcaption className={styles.midPointName}>
            {location.name}
          </figcaption>
        </figure>
      )}

      {offer.final_destination
        ? <figure className={styles.location}>
          <div>
            <div className={styles.finalPath} />
            <Tooltip arrow title="Final destination">
              <div className={`${styles.mainPoint} ${styles.endPoint}`} />
            </Tooltip>
          </div>

          <figcaption className={styles.mainPointName}>
            {offer.final_destination}
          </figcaption>
        </figure>
        : null
      }
    </div>
  );
}

function PriceListTable({ priceList }: { priceList: PriceList; }) {
  return <>
    <p className={styles.locations}>{getCategoryTitle(priceList.category)}</p>
    <SortableTable rowData={priceList.details} headCells={itemLinesHeadCells} />
  </>;
}

export default function OfferModal() {
  const toast = useToast();
  const navigate = useNavigate();
  const { offerId } = useParams();
  const { num20, num40 } = useOutletContext<OutletContext>();
  const { data, isLoading, error } = useGetSingleData(
    offersService.QUERY_KEY, offerId || "", offersService.getOneById
  );

  const multipliedOffer = useMemo(
    () => data ? multiplyOfferPrices(data, num20, num40) : null,
    [data, num20, num40]
  );

  const suppliers = useMemo(
    () => multipliedOffer ? getOfferSuppliers(multipliedOffer) : null,
    [multipliedOffer]
  );

  const handleIdCopying = () => {
    navigator.clipboard.writeText(multipliedOffer?._id || "");
    toast.open("ID of this offer is copied", "success", 2500);
  };

  const handleSharing = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.open("Link to this offer is copied", "success", 2500);
  };

  const handleModalClose = () => {
    navigate(`/simulator${window.location.search}`);
  };

  if (error) return null;

  if (isLoading && (!multipliedOffer || !suppliers)) return <PageLoader />;

  return (
    <ModalWrapper
      isOpen={true}
      handleToggle={handleModalClose}
      labelBy="offer-locations"
      describeBy="offer-duration"
      style={muiStyles.modal}
    >
      {!multipliedOffer || !suppliers
        ? "This offer does not exist!"
        : <>
          <Tooltip arrow title="Click to copy">
            <Button
              sx={muiStyles.offerId}
              onClick={handleIdCopying}
            >
              ID: {multipliedOffer._id}
            </Button>
          </Tooltip>

          <p className={styles.locations} id="offer-locations">
            {`${multipliedOffer.loading_port} ${multipliedOffer.final_destination
              ? `- ${multipliedOffer.final_destination}` : ""}`
            }
          </p>

          {multipliedOffer.duration
            ? <p className={styles.duration} id="offer-duration">
              Duration {multipliedOffer.duration}
            </p>
            : null
          }

          <FreightPath offer={multipliedOffer} />

          <Stack direction="row" alignItems="flex-end" gap="10%">
            <SortableTable rowData={suppliers} headCells={suppliersHeadCells} />
            <PriceCard offer={multipliedOffer} />
          </Stack>

          <SortableTable rowData={multipliedOffer.details} headCells={itemLinesHeadCells} />

          {multipliedOffer.priceLists.map(priceList =>
            <PriceListTable key={priceList._id} priceList={priceList} />
          )}

          <Stack direction="row" spacing={1}>
            <SecondaryButton onClick={() => handleExcellExport(multipliedOffer, suppliers)} sx={muiStyles.secondaryButton}>
              Export to Excel
            </SecondaryButton>
            <SecondaryButton onClick={handleSharing} sx={muiStyles.secondaryButton}>
              Copy Link
            </SecondaryButton>
            <PrimaryButton component={Link} to={`/simulator/edit/${multipliedOffer._id}`} fullWidth>
              Edit Offer
            </PrimaryButton>
          </Stack>
        </>
      }
    </ModalWrapper>
  );
}