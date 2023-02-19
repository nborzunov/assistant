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

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route path="/grants" element={<GrantsList />} />,
      <Route path="/grants/:grantId" element={<GrantDetails />} />,
      <Route path="/grants/:grantId/fill" element={<Assistant />} />,
    ])
  );
  return <RouterProvider router={router} />;
};
export default App;
