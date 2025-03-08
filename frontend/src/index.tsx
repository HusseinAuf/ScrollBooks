import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./tailwind.css";
import "./global.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./contexts/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CommonDataProvider } from "./contexts/CommonDataContext";
import { BookProvider } from "./contexts/BookContext";
import { UIProvider } from "./contexts/UIContext";
import { keepPreviousData } from "@tanstack/react-query";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents refetching when window regains focus
      select: (data: any) => data,
      placeholderData: keepPreviousData,
    },
  },
});

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CommonDataProvider>
        <UIProvider>
          <UserProvider>
            <BookProvider>
              <GoogleOAuthProvider
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}
              >
                <App />
              </GoogleOAuthProvider>
            </BookProvider>
          </UserProvider>
        </UIProvider>
      </CommonDataProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
