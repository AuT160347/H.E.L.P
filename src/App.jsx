import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/home';
import Appointment from './pages/Appointment';
import History from './pages/history';
import Chat from './pages/chat';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Profile from './pages/ProfilePage';
import ForwardToHOME from './pages/ForwardToHome';

import Layout from './Layouts/layout';

import AdminDoctor from './pages/adminDoctor';
import DoctorAdmin from './pages/doctorAdmin';

import SearchPage from './pages/SearchPage';  // ✅ เพิ่ม SearchPage

import { LanguageProvider } from './components/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <LanguageProvider>
        <BrowserRouter basename='/H.E.L.P/'>
          <Routes>

            {/* Layout Wrapper */}
            <Route element={<Layout />}>

              {/* ---------- PUBLIC ROUTES ---------- */}

              <Route path='home' element={<Home />} />

              {/* ✔ หน้า Search */}
              <Route path='search' element={<SearchPage />} />

              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* ---------- PROTECTED ROUTES ---------- */}

              <Route
                path='appointment'
                element={
                  <ProtectedRoute>
                    <Appointment />
                  </ProtectedRoute>
                }
              />

              <Route
                path='history'
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />

              <Route
                path='chat'
                element={
                  <ProtectedRoute>
                    <Chat />
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

              <Route
                path='admin-doctor'
                element={
                  <ProtectedRoute>
                    <AdminDoctor />
                  </ProtectedRoute>
                }
              />

              <Route
                path='doctor-admin'
                element={
                  <ProtectedRoute>
                    <DoctorAdmin />
                  </ProtectedRoute>
                }
              />

              {/* ---------- FALLBACK ---------- */}
              <Route path='*' element={<ForwardToHOME />} />

            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </>
  );
}

export default App;
