import { ItemLine, PriceList } from "./types";

type KeyLabels<T> = {
  valueKey: keyof T;
  label: string;
}[];

export const ITEM_LINE_KEY_LABELS: KeyLabels<ItemLine> = [
  { valueKey: "supplier", label: "Supplier" },
  { valueKey: "item_line", label: "Item Line" },
  { valueKey: "price_20", label: "Price 20" },
  { valueKey: "price_40", label: "Price 40" },
  { valueKey: "currency_code", label: "Currency" },
];

export const CC_DESTINATION_KEY_LABELS: KeyLabels<PriceList> = [
  { valueKey: "customs.discharge_port" as keyof PriceList, label: "Customs" },
  { valueKey: "discharge_port", label: "Discharge Port" },
];

export const FORWARDER_KEY_LABELS: KeyLabels<PriceList> = [
  { valueKey: "incoterm", label: "Incoterm" },
  { valueKey: "forwarder", label: "Forwarder" },
];

export const INLAND_CARRIER_KEY_LABELS: KeyLabels<PriceList> = [
  { valueKey: "train_station", label: "Train Station" },
  { valueKey: "discharge_port", label: "Discharge Port" },
  { valueKey: "final_destination", label: "Final Destination" },
  { valueKey: "inland_carrier.discharge_port" as keyof PriceList, label: "Customs" },
];

export const INLAND_SUPPLIER_KEY_LABELS: KeyLabels<PriceList> = [
  { valueKey: "inland-carrier.loading-port" as keyof PriceList, label: "Customs" },
];

export const LOCAL_CHARGES_KEY_LABELS: KeyLabels<PriceList> = [
  { valueKey: "sealine", label: "Sealine" },
];

export const PRICE_LIST_KEY_LABELS_BY_CATEGORY = {
  "cc-destination": CC_DESTINATION_KEY_LABELS,
  "forwarder": FORWARDER_KEY_LABELS,
  "inland-carrier": INLAND_CARRIER_KEY_LABELS,
  "inland-supplier": INLAND_SUPPLIER_KEY_LABELS,
  "local-charges": LOCAL_CHARGES_KEY_LABELS,
};

export const ROUTES = [
  { path: "/simulator", label: "Freight Simulator" },
  { path: "/tracking", label: "Tracking" },
  { path: "/shipments", label: "Shipments" },
  { path: "/orders", label: "Orders" },
  { path: "/performance-analysis", label: "Performance analysis" },
  { path: "/price-lists", label: "Price Lists" },
];