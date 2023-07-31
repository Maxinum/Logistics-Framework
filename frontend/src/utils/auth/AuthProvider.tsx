import { useState } from "react";
import { User } from "../types";
import authApi from "./authApi";
import AuthContext, { AuthContextValue } from "./AuthContext";

export default function AuthProvider({ children }: { children: React.ReactNode; }) {
  const [user, setUser] = useState(authApi.getUser());

  const setSession = (user: User) => {
    setUser(user);
    authApi.setUser(user);
  };

  const login = async (email: string, password: string) => {
    const { user } = await authApi.login(email, password);
    setSession(user);
  };

  const logout = () => {
    setUser(null);
    authApi.logout();
  };

  const contextValue: AuthContextValue = {
    user,
    setSession,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}