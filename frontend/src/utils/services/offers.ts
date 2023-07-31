import { axios } from "../axios";
import { GenericObject, Offer, OfferInput, OffersFilter } from "../types";
import { deleteKeysIncludingString } from "../helpers";

type Activity = "Active" | "Current" | "Expired" | "Future" | null | undefined;

type DefaultResponse = {
  status: string;
  code: number;
};

type FilteredPage = {
  data: Offer[];
  results: number;
  limit: number;
};

type CreateResponse = {
  data: {
    newOffer: Offer;
  };
};

type FilterValues = {
  code: number;
  data: OffersFilter;
  results: number;
  status: string;
};

type FormValues = {
  code: number;
  data: OfferInput;
  results: number;
  status: string;
};

const TODAY = new Date().toISOString();
const QUERY_KEY = "/offers";
const PAGE_SIZE = 15;

const ACTIVITIES = ["Active", "Current", "Expired", "Future"];

const ACTIVITY_RANGES = {
  Active: `valid_from[lte]=${TODAY}&valid_until[gte]=${TODAY}`,
  Current: `valid_until[gte]=${TODAY}`,
  Expired: `valid_until[lt]=${TODAY}`,
  Future: `valid_from[gt]=${TODAY}`,
};

const FILTER_KEYS = [
  "incoterm",
  "final_destination",
  "country",
  "discharge_port",
  "details.supplier",
  "loading_port",
].join(",");

const INPUT_FORM_KEYS = [
  "importer",
  "client",
  "sealine",
  "forwarder",
  "loading_port",
  "discharge_port",
  "train_station",
  "transit_port",
  "certificate",
  "final_destination",
  "country",
  "details.item_line",
  "inland_carrier.discharge_port",
  "inland_carrier.loading_port",
  "customs.discharge_port",
  "details.currency_code",
].join(",");

/**
 * Gets a single offer by id
 */
const getOneById = async (id: string): Promise<FilteredPage & DefaultResponse> => {
  const res = await axios.get(`/offer?_id=${id}`);
  return res.data;
};

/**
 * Fetcher returns filtered, sorted and paginated offers with currency rates applied
 */
const getFilteredPage = async (filterUrlParams: URLSearchParams): Promise<FilteredPage & DefaultResponse> => {
  let paramsCopy = new URLSearchParams(filterUrlParams);
  const activityRange = filterUrlParams.get("activity_range") as Activity;

  if (!filterUrlParams.has("sort")) paramsCopy.set("sort", "discharge_port");
  if (!filterUrlParams.has("page")) paramsCopy.set("page", `${1}`);
  if (!filterUrlParams.has("limit")) paramsCopy.set("limit", `${PAGE_SIZE}`);
  if (!filterUrlParams.has("activity")) paramsCopy.set("activity", "Active");

  let clearedParams = paramsCopy.toString();

  if (activityRange) {
    paramsCopy.delete("activity_range");
    paramsCopy = deleteKeysIncludingString(paramsCopy, "valid");
    clearedParams = `${paramsCopy.toString()}&${ACTIVITY_RANGES[activityRange]}`;
  }

  const res = await axios.get(`/offer?${clearedParams}`);
  res.data.limit = PAGE_SIZE;
  return res.data;
};

/**
 * Gets filter values that need to be present inside of
 * the inputs of the main filter next to the offers table
*/
const getFilterValues = async (): Promise<FilterValues & DefaultResponse> => {
  const res = await axios.get(`offer/utils/distinct?distinct=${FILTER_KEYS}`);
  if (res.data?.data) res.data.data.activities = ACTIVITIES;
  return res.data;
};

/**
 * Gets values that need to be present inside
 * of the autocomplete inputs of the input form
*/
const getFormValues = async (): Promise<FormValues & DefaultResponse> => {
  const { data } = await axios.get(`offer/utils/distinct?distinct=${INPUT_FORM_KEYS}`);

  if (data.data) {
    data.data.currencies = data.data["details.currency_code"];
    data.data.customs = data.data["customs.discharge_port"];
    data.data.item_lines = data.data["details.item_line"];
    data.data.suppliers = [
      ...data.data.sealine,
      ...data.data["inland_carrier.discharge_port"],
      ...data.data["inland_carrier.loading_port"],
      ...data.data.customs,
    ];
  }

  return data;
};

/**
 * Creates a new offer from provided object
 */
const create = async (offerObj: Offer): Promise<CreateResponse & DefaultResponse> => {
  const res = await axios.post("/offer", offerObj);
  return res.data;
};

/**
 * Deletes an offer with provided id
 */
const remove = async (id: string): Promise<{ status: string; }> => {
  const res = await axios.delete(`/offer/${id}`);
  return res.data;
};

/**
 * Restores a deleted offer with provided id
 */
const restore = async (id: string): Promise<{ status: string; }> => {
  const res = await axios.post(`/offer/${id}`);
  return res.data;
};

/**
 * Updates an offer with provided values
 */
const edit = async (id: string, updatedFields: GenericObject): Promise<DefaultResponse> => {
  const res = await axios.patch(`/offer/${id}`, updatedFields);
  return res.data;
};

const offers = {
  getOneById,
  getFilteredPage,
  getFilterValues,
  getFormValues,
  create,
  remove,
  edit,
  restore,
  QUERY_KEY,
};

export default offers; 