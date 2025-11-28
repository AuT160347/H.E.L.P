import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/home";
import Appointment from "./pages/Appointment";
import History from "./pages/history";

import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Profile from "./pages/ProfilePage";
import ForwardToHOME from "./pages/ForwardToHome";
import SearchPage from "./pages/SearchPage";

import Dashboard from "./pages/dashboard/Dashboard";
import UserManagement from "./pages/dashboard/UserManagement";
import ManageAppointmentPage from "./pages/dashboard/ManageAppointmentPage";
import AddHospitalPage from "./pages/dashboard/AddHospitalPage";
import HospitalList from "./pages/dashboard/HospitalList";
import EditHospitalPage from "./pages/dashboard/EditHospitalPage";
import HospitalDoctors from "./pages/dashboard/HospitalDoctors";
import EditDoctorPage from "./pages/dashboard/EditDoctorPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import AddDoctorAdmin from "./pages/dashboard/AddDoctorAdmin";

import Layout from "./Layouts/layout";
import AdminLayout from "./Layouts/AdminLayout";
import { LanguageProvider } from "./components/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter basename="/H.E.L.P/">
        <Routes>
          {/* AUTH */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* ADMIN */}
          <Route path="dashboard" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="users" element={<UserManagement />} />
            <Route path="manage-appointment" element={<ManageAppointmentPage />} />

            <Route path="hospitals" element={<HospitalList />} />
            <Route path="hospitals/add" element={<AddHospitalPage />} />
            <Route path="hospitals/:id/edit" element={<EditHospitalPage />} />

            <Route path="hospitals/:id/doctors" element={<HospitalDoctors />} />
            <Route path="doctors/:id/edit" element={<EditDoctorPage />} />
            <Route path="add-doctor" element={<AddDoctorAdmin />} />

            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* PUBLIC */}
          <Route element={<Layout />}>
            <Route path="home" element={<Home />} />
            <Route path="search" element={<SearchPage />} />

            <Route
              path="appointment"
              element={
                <ProtectedRoute>
                  <Appointment />
                </ProtectedRoute>
              }
            />

            <Route
              path="history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />

            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<ForwardToHOME />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
