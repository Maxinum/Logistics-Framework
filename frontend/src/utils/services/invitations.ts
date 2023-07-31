import { axios } from "../axios";
import { Invitation } from "../types";
const QUERY_KEY = "invitations";

/**
 * Sends an invitation email to new user
 */
const create = async (email: string, confirmEmail: string) => {
  await axios.post("/user/invite", { email, confirmEmail });
};

/**
 * Deletes a registration invitation of a user
 */
const remove = async (id: string) => {
  await axios.delete(`/user/invite/${id}`);
};

/**
 * Returns the list of all invitations
 */
const getAll = async (): Promise<{ code: number, data: Invitation[], results: number, status: string; }> => {
  const res = await axios.get("/user/invite");
  return res.data;
};

const invitations = {
  create,
  remove,
  getAll,
  QUERY_KEY
};

export default invitations;