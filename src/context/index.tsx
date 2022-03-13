import React, { ReactNode } from "react";
import { AuthProvider } from "./auth-context";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { store } from "../store";

/**
 * 关于React props.children
 * 一个组件opening bracket和closing bracket之间的子组件可以被传递并且可以使用children来引用
 * 这样做的好处是父组件可以render children组件
 * 我们可以每次传递给父组件不同的children，而完全不用改变父组件的内容
 * @param children
 * @constructor
 */
export const AppProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>;
      </QueryClientProvider>
    </Provider>
  );
};
