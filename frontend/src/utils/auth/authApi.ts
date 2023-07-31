import { axios } from "../axios";
import { User } from "../types";
const STORAGE_KEY = "authenticatedUser";

/**
 * Places the authenticated user in local storage
 */
const setUser = (user: User) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

/**
 * Gets the authenticated user from local storage
 */
const getUser = () => {
  const loggedUserJSON = window.localStorage.getItem(STORAGE_KEY);
  return loggedUserJSON ? JSON.parse(loggedUserJSON) as User : null;
};

/**
 * Login user with email and password
 */
const login = async (email: string, password: string): Promise<{ status: string, user: User; }> => {
  const { data } = await axios.post("/login", { email, password });
  data.user.token = data.token;
  return data;
};

/**
 * Logout user by terminating the session
 */
const logout = () => localStorage.clear();

const authApi = {
  login,
  logout,
  setUser,
  getUser,
  STORAGE_KEY,
};

export default authApi;