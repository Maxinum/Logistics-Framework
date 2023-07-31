import axios from "../axios/axios";

const reset = async (token: string, password: string, confirmPassword: string) => {
  const res = await axios.post(`/user/reset-password/${token}`, { password, confirmPassword });
  return res.data;
};

const resetPassword = {
  reset,
};

export default resetPassword;