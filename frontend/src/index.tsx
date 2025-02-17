import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./tailwind.css";
import "./global.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./contexts/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CommonDataProvider } from "./contexts/CommonDataContext";
import { UIProvider } from "./contexts/UIContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents refetching when window regains focus
      select: (data: any) => {
        return data?.data?.pagination
          ? {
              data: data?.data?.data || [],
              pageCount: data?.data?.pagination?.last || 1,
            }
          : data?.data?.data || null;
      },
    },
  },
});

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CommonDataProvider>
        <UIProvider>
          <UserProvider>
            <GoogleOAuthProvider clientId="1077906388464-s95grrp7bnu0rvpf82vsc51v1avcc1gh.apps.googleusercontent.com">
              <App />
            </GoogleOAuthProvider>
          </UserProvider>
        </UIProvider>
      </CommonDataProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
