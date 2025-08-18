import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import NavbarAdmin from "./components/NavbarAdmin";
import Footer from "./components/Footer";
import { AuthProvider } from "./Context/AuthProvider";
import { PrivateRoute } from "./components/PrivateRoute";
import OrderProvider from "./Context/OrderProvider";

import LandingPage from "./pages/LandingPage";
import Movies from "./pages/Movies";
import Detail from "./pages/Detail";
import Order from "./pages/Order";
import Payment from "./pages/Payment";
import Ticket from "./pages/Ticket";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AdminMovie from "./pages/AdminMovie";

function RouterPages() {
  return (
    <OrderProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="movies" element={<Movies />} />
              <Route path="movies/:id" element={<Detail />} />

              {/* Private routes pakai PrivateRoute */}
              <Route
                path="order/:id"
                element={
                  <PrivateRoute redirectTo="/signin">
                    <Order />
                  </PrivateRoute>
                }
              />
              <Route
                path="payment"
                element={
                  <PrivateRoute redirectTo="/signin">
                    <Payment />
                  </PrivateRoute>
                }
              />
              <Route
                path="ticket"
                element={
                  <PrivateRoute redirectTo="/signin">
                    <Ticket />
                  </PrivateRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <PrivateRoute redirectTo="/signin">
                    <Profile />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="adminmovie" element={<AdminMovie />} />
            </Route>
            {/* Auth pages */}
            <Route path="signin" element={<Login />} />
            <Route path="signup" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Catch-all route for 404 */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </OrderProvider>
  );
}

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function AdminLayout() {
  return (
    <>
      <NavbarAdmin />
      <Outlet />
      <Footer />
    </>
  );
}

export default RouterPages;
