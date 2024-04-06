import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
// css
import "foundation-sites/dist/css/foundation.min.css";
import "./index.css";
// pages
import AuthPage from "./pages/AuthPage";
import EventsPage from "./pages/EventsPage";
import BookingsPage from "./pages/BookingsPage";
import Header from "./ui/Header";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/bookings" element={<BookingsPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Header />
    <RouterProvider router={router} />
  </React.StrictMode>
);
