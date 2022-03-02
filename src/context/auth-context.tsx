import React, { ReactNode, useState } from "react";
import * as auth from "auth-provider";
import { User } from "../screens/project-list/search-panel";

interface AuthForm {
  username: string;
  password: string;
}

const AuthContext = React.createContext<
  | {
      user: User | null;
      register: (form: AuthForm) => Promise<void>;
      login: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (form: AuthForm) =>
    auth.login(form).then((user) => setUser(user));

  // 当箭头函数只是传递参数时 （user => setUser(user)）
  // 我们可以简写成只保留函数名，取消参数
  // 这在Java语言中也有体现，method reference
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const logout = () => auth.logout().then((user) => setUser(null));

  return (
    <AuthContext.Provider
      children={children}
      value={{ user, login, register, logout }}
    />
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在AuthProvider中使用");
  }
  return context;
};
