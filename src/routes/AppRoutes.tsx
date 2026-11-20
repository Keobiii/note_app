import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import NotFound from "../pages/NotFound";
import Admin from "../features/admin/pages/Admin";
import User from "../features/user/pages/User";
import Register from "../features/auth/pages/Register";
import { useAuth } from "../features/auth/context/AuthContext";
import Notes from "../features/user/pages/Notes";

function AppRoutes() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <p className="text-sm text-white">Loading...</p>
      </div>
    );
  }

  const homePage =
    currentUser?.access === "admin"
      ? "/admin"
      : currentUser
        ? "/user"
        : "/login";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={homePage} replace />} />

      <Route
        path="/login"
        element={currentUser ? <Navigate to={homePage} replace /> : <Login />}
      />

      <Route
        path="/register"
        element={
          currentUser ? <Navigate to={homePage} replace /> : <Register />
        }
      />

      <Route
        path="/admin"
        element={
          !currentUser ? (
            <Navigate to="/login" replace />
          ) : currentUser.access !== "admin" ? (
            <Navigate to="/user" replace />
          ) : (
            <Admin />
          )
        }
      />

      <Route
        path="/user"
        element={
          !currentUser ? (
            <Navigate to="/login" replace />
          ) : currentUser.access !== "user" ? (
            <Navigate to="/admin" replace />
          ) : (
            <User />
          )
        }
      />

      <Route
        path="/notes"
        element={
          !currentUser ? (
            <Navigate to="/login" replace />
          ) : currentUser.access !== "user" ? (
            <Navigate to="/admin" replace />
          ) : (
            <Notes />
          )
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
