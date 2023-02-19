import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "regenerator-runtime/runtime";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const theme = extendTheme({
  colors: {
    brand: {
      "50": "#f1f8ff",
      "100": "#c6e4ff",
      "200": "#92cbff",
      300: "#00C0FF",
      400: "#0086FF",
      500: "#0086FF",
      "600": "#1665FF",
      "700": "#0054a1",
      "800": "#004788",
      "900": "#003463",
    },
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ChakraProvider theme={theme}>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>loading...</div>}>
          <App />
        </Suspense>
      </QueryClientProvider>
    </RecoilRoot>
  </ChakraProvider>
);
