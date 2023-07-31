import { axios } from "../axios";
import { User } from "../types";
const QUERY_KEY = "admin";
const PAGE_SIZE = 10;

/**
 * Activates an inactive user
 */
const activate = async (id: string): Promise<{ status: string, data: User; }> => {
  const res = await axios.post(`/user/utils/activate/${id}`);
  return res.data;
};

/**
 * Deactivates an activate user
 */
const deactivate = async (id: string): Promise<{ status: string, data: User; }> => {
  const res = await axios.post(`/user/utils/deactivate/${id}`);
  return res.data;
};

/**
 * Edits user details
 */
const edit = async (id: string, body: User): Promise<{ status: string, data: User; }> => {
  const res = await axios.post(`/user/utils/edit-user/${id}`, body);
  return res.data;
};

/**
 * Get filtered, sorted and paginated list of users
 */
const getFilteredUsers = async (filterUrlParams: URLSearchParams): Promise<{ data: User[], results: number, limit: number, status: string; }> => {
  const paramsCopy = new URLSearchParams(filterUrlParams);

  if (!paramsCopy.has("sort")) paramsCopy.set("sort", "email");
  if (!paramsCopy.has("limit")) paramsCopy.set("limit", `${PAGE_SIZE}`);
  if (!paramsCopy.has("page")) paramsCopy.set("page", `${1}`);

  const res = await axios.get("/user/utils/get-users", {
    params: paramsCopy,
  });

  res.data.limit = PAGE_SIZE;
  return res.data;
};

/**
 * Gets filter values that need to be present inside of the inputs of the main filter next to the users table
*/
const getFilterValues = async (): Promise<{ code: number, data: { name: string[], surname: string[]; }, results: number, status: string; }> => {
  const res = await axios.get(`/user/utils/get-distinct-users?distinct=name,surname`);
  return res.data;
};

const admin = {
  activate,
  deactivate,
  edit,
  getFilteredUsers,
  getFilterValues,
  QUERY_KEY,
};

export default admin;