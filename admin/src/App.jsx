import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import PublicNavbar from "./components/PublicNavbar";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Home from "./pages/Home";

import Dashboard from "./pages/admin/Dashboard";
import AddMember from "./pages/admin/AddMember";
import Members from "./pages/admin/Members";
import Announcement from "./pages/admin/Announcement";

import Announcements from "./pages/member/Announcements";
import ProtectedRoute from "./auth/ProtectedRoute";
import MemberDashboard from "./pages/member/Dashboard";
import MemberProfile from "./pages/admin/MemberProfile";
import ContactMessages from "./pages/admin/ContactMessages";


const Layout = () => {
  const location = useLocation();

  const isPublic =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      {isPublic ? <PublicNavbar /> : <Navbar />}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-member"
          element={
            <ProtectedRoute role="admin">
              <AddMember />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/members"
          element={
            <ProtectedRoute role="admin">
              <Members />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/announcement"
          element={
            <ProtectedRoute role="admin">
              <Announcement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/member/:id"
          element={
            <ProtectedRoute role="admin">
              <MemberProfile />
            </ProtectedRoute>
          }
        />

        {/* MEMBER ROUTES */}
        <Route
          path="/member/dashboard"
          element={
            <ProtectedRoute role="member">
              <MemberDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/member/announcements"
          element={
            <ProtectedRoute role="member">
              <Announcements />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/messages" element={<ContactMessages />} />

      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
