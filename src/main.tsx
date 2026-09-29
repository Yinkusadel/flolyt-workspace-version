import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "./components/error-boundary";
import App from "./app";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./utils/auth-context";
// import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";
// Flag emoji don't reliably render as flags on Windows (shows two-letter codes
// instead) — real SVG flag icons via this CSS avoid depending on the OS's font.
import "flag-icons/css/flag-icons.min.css";


const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 5, retryDelay: 1000 } },
});

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AuthProvider>
          {/* <ThemeProvider> */}
            <App />
          {/* </ThemeProvider> */}
        </AuthProvider>
        <Toaster position="top-right" richColors />
        <ReactQueryDevtools initialIsOpen={false} />
      </ErrorBoundary>
    </QueryClientProvider>
  </React.StrictMode>
);
