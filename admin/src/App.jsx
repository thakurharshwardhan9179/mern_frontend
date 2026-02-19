import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import Dashboard from "./pages/admin/Dashboard";
import AddMember from "./pages/admin/AddMember";
import Members from "./pages/admin/Members";
import Announcement from "./pages/admin/Announcement";

import Announcements from "./pages/member/Announcements";
import ProtectedRoute from "./auth/ProtectedRoute";
import MemberDashboard from "./pages/member/Dashboard";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ADMIN */}
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
              <Members/>
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

        {/* MEMBER */}
        <Route
          path="/member/announcements"
          element={
            <ProtectedRoute>
              <Announcements />
            </ProtectedRoute>
          }
        />
        <Route
  path="/member/dashboard"
  element={
    <ProtectedRoute role="member">
      <MemberDashboard />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
