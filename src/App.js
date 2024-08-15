import React from "react";
import { Box } from "@mui/material";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster } from "react-toast";

// component
import LoginPage from "./views/pages/login";
import TopNav from "./views/pages/topNav";
import QuoteList from "./views/pages/quoteList";

const AppLayout = () => {
  return (
    <>
      <TopNav />
      <Box>
        <Outlet />
      </Box>
    </>
  );
};

const ProtectedRoute = ({ children }) => {
  const activeUserId = localStorage.getItem("auth_token");
  return activeUserId ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/quote-list" element={<QuoteList />} />
        </Route>
      </Routes>

      {/* React Toast Wrapper */}
      <Toaster />
    </React.Fragment>
  );
}

export default App;
