import { axios } from "../axios";
import { FreeInterval, GenericObject, PriceList } from "../types";

const QUERY_KEY = "price-lists";
const PAGE_SIZE = 15;

type FilteredPage = {
  data: PriceList[];
  results: number;
  limit: number;
};

const getOneById = async (id: string): Promise<FilteredPage> => {
  const res = await axios.get(`/price-lists?_id=${id}`);
  return res.data;
};

const getFilteredPage = async (filterUrlParams: URLSearchParams): Promise<FilteredPage> => {
  const paramsCopy = new URLSearchParams(filterUrlParams);

  if (!filterUrlParams.has("category")) paramsCopy.set("category", "cc-destination");
  if (!filterUrlParams.has("page")) paramsCopy.set("page", `${1}`);
  if (!filterUrlParams.has("limit")) paramsCopy.set("limit", `${PAGE_SIZE}`);

  const res = await axios.get("/price-lists", { params: paramsCopy });
  res.data.limit = PAGE_SIZE;
  return res.data;
};

const create = async (priceListObj: PriceList) => {
  const res = await axios.post("/price-lists", priceListObj);
  return res.data;
};

const remove = async (id: string): Promise<PriceList> => {
  const res = await axios.delete(`/price-lists/${id}`);
  return res.data;
};

const restore = async (id: string) => {
  const res = await axios.post(`/price-lists/${id}`);
  return res.data;
};

const edit = async (id: string, updatedFields: GenericObject) => {
  const res = await axios.patch(`/price-lists/${id}`, updatedFields);
  return res.data;
};

const getFreeIntervals = async (priceList: Partial<PriceList>): Promise<{ data: FreeInterval[]; }> => {
  const params = new URLSearchParams();
  Object.keys(priceList).forEach(key =>
    params.set(key, String(priceList[key as keyof PriceList]))
  );

  const res = await axios.get("/price-lists/free-intervals", { params });
  return res.data;
};

const priceLists = {
  getOneById,
  getFilteredPage,
  create,
  remove,
  restore,
  edit,
  getFreeIntervals,
  QUERY_KEY,
};

export default priceLists;