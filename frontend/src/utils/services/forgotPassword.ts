import axios from "../axios/axios";

const getResetToken = async (email: string) => {
  const res = await axios.post("/user/forgot-password", { email });
  return res.data;
};

const forgotPassword = {
  getResetToken,
};

export default forgotPassword;