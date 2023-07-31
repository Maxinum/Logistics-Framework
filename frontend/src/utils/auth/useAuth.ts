import { useContext } from "react";
import AuthContext from "./AuthContext";

const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error(
      "useAuth has to be used within <AuthProvider>"
    );
  }

  return authContext;
};

export default useAuth;