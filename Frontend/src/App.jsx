import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/LoginPage";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import AddCategory from "./pages/Admin/AddCtegory";
import AllUser from "./pages/Admin/AllUser"
import UserDetail from "./pages/Admin/UserDetails";
import AllCategory from "./pages/Admin/AllCategory";
import UpdateCategory from "./pages/Admin/UpdateCategory";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="p-4">
        <Routes>
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <h1>Profile Page</h1>
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <h1>Skills Page</h1>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <h1>Messages Page</h1>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/add-category"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AddCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/all-users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AllUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/update-category/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UpdateCategory />
              </ProtectedRoute>
            }
          />

          <Route path="/categories" element={<AllCategory />} />
          {/* Public routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile/me" element={<Profile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />

          {/* Admin Routes */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
