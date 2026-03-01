import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AppRoutes from "./AppRoutes";
import { queryClient } from "./queryClient";

const initApp = () => {
  const root = document.getElementById("root");

  if (!root) {
    throw new Error("#root not found");
  }

  createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </StrictMode>,
  );
};

initApp();
