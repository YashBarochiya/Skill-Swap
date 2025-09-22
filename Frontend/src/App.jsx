import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

//auth
import Login from "./pages/Auth/LoginPage";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
//profile
import Profile from "./pages/Profile/Profile";
import UpdateProfile from "./pages//Profile/UpdateProfile";
import UserProfile from "./pages/Profile/UserProfile";

//admin
import AddCategory from "./pages/Admin/AddCtegory";
import AllUser from "./pages/Admin/AllUser"
import UserDetail from "./pages/Admin/UserDetails";
import AllCategory from "./pages/Admin/AllCategory";
import UpdateCategory from "./pages/Admin/UpdateCategory";

//skill
import Skill from "./pages/Skill/Skill";
import UpdateSkill from "./pages/Skill/UpdateSkill";
import AddSkill from "./pages/Skill/AddSkill";

//swap requests
import SwapRequest from "./pages/SwapRequest/SwapRequest";
import SendRequest from "./pages/SwapRequest/SendRequest";

//swap 
import Swap from "./pages/Swap/Swap";

//Review
import AddReview from "./pages/Review/AddReview";
import UserReviews from "./pages/Review/UserReviews"
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="p-4">
        <Routes>
          {/* Protected routes */}
          
          
          
          
            {/* Admin Routes */}
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

          {/* //authroute */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* profile route */}
          <Route path="/profile/me" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
          <Route path="/profile/:id" element={<UserProfile />} />

          {/* skill routes  */}
          <Route path="/skills" element={<Skill />} />
          <Route path="/update-skill/:id" element={<UpdateSkill />} />
          <Route path="/add-skill" element={<AddSkill />} />

          {/* swap reqauest */}
          <Route path="/swap-requests" element={<SwapRequest />} />
          <Route path="/swap-requests/send/:id" element={<SendRequest />} />

          {/* Swap */}
          <Route path="/swaps" element={<Swap />} />

          {/* Review */}
          <Route path="/add-review/:swapId/:revieweeId" element={<AddReview />} />
          <Route path="/reviews/me" element={<UserReviews />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
