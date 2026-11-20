
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import EditProfileModal from "./components/EditProfileModal";

function User() {
  const { currentUser, logout, updateProfile, deactivateAccount } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Logout failed.");
    }
  };

  const handleEdit = () => {
    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleUpdate = async (name: string) => {
    setError("");

    try {
      setLoading(true);

      await updateProfile(name);

      setIsEditing(false);
      setSuccess("Name updated successfully!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update name.";

      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate your account? You will no longer be able to access your account."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await deactivateAccount();

      navigate("/login");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to deactivate account."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            User Dashboard
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() => navigate("/notes")}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Notes
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* PROFILE */}
        <div className="mt-8">
          <p className="text-gray-500">
            Welcome, {currentUser?.name}!
          </p>

          <div className="mt-5 rounded-lg bg-gray-50 p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Account Information
              </h2>

              <button
                onClick={handleEdit}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Edit Name
              </button>
            </div>

            {/* SUCCESS MESSAGE */}
            {success && (
              <p className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
                {success}
              </p>
            )}

            {/* ACCOUNT INFORMATION */}
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Name
                </label>

                <p className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700">
                  {currentUser?.name}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Email
                </label>

                <p className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-gray-500">
                  {currentUser?.email}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Access
                </label>

                <p className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-gray-500">
                  {currentUser?.access}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  User ID
                </label>

                <p className="break-all rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-gray-500">
                  {currentUser?.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DANGER ZONE */}
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-5">
          <h2 className="text-lg font-semibold text-red-700">
            Danger Zone
          </h2>

          <p className="mt-2 text-sm text-red-600">
            Deactivate your account and prevent further access.
          </p>

          <button
            onClick={handleDeactivateAccount}
            disabled={deleting}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deactivating..." : "Deactivate Account"}
          </button>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <EditProfileModal
          currentName={currentUser?.name || ""}
          currentEmail={currentUser?.email || ""}
          loading={loading}
          error={error}
          onClose={() => setIsEditing(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}

export default User;
