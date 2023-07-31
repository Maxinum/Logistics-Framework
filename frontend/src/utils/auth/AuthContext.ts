import { createContext } from "react";
import { User } from "../types";

export type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setSession: (user: User) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export default AuthContext;