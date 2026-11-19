import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";

function Admin() {
  const { currentUser, logout } = useAuth()

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="mt-8">
          <p className="text-gray-500">Welcome, Admin!</p>

          <div className="mt-5 space-y-3 rounded-lg bg-gray-50 p-5">
            <p>
              <span className="font-semibold">Name:</span> {currentUser?.name}
            </p>

            <p>
              <span className="font-semibold">Email:</span> {currentUser?.email}
            </p>

            <p>
              <span className="font-semibold">Access:</span> {currentUser?.access}
            </p>

            <p>
              <span className="font-semibold">User ID:</span> {currentUser?.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin
