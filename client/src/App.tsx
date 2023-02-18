import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import { GrantsList } from "./pages/GrantsList";
import { GrantDetails } from "./pages/GrantDetails";
import { Assistant } from "./pages/Assistant/Assistant";
import { ResponseQueue } from "./pages/ResponseQueue";
import { SupportQueue } from "./pages/SupportQueue";
import { FAQ } from "./pages/FAQ";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route path="/grants" element={<GrantsList />} />,
      <Route path="/grants/:grantId" element={<GrantDetails />} />,
      <Route path="/grants/:grantId/fill" element={<Assistant />} />,
      <Route path="/grants/faq" element={<FAQ />} />,
      <Route path="/grants/support" element={<SupportQueue />} />,
      <Route path="/grants/response" element={<ResponseQueue />} />,
      // <Route path="*" element={<Navigate to="/grants" replace />} />,
    ])
  );
  return <RouterProvider router={router} />;
};
export default App;
