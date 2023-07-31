import { axios } from "../axios";
import { User, SignupInfo } from "../types";

/**
 * Check the validity of an invitation hash
 */
const checkInvite = async (invite: string): Promise<{ status: string, message: string, email: string; }> => {
  const res = await axios.post(`/user/utils/hash-check/${invite}`);
  return res.data;
};

/**
 * Sign up user with a unique invitation hash and sign up info
 */
const create = async (invite: string, signupInfo: SignupInfo): Promise<{ status: string, user: User; }> => {
  const res = await axios.post(`/user/sign-up/${invite}`, signupInfo);
  return res.data;
};

const signup = {
  checkInvite,
  create,
};

export default signup;