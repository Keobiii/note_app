import { useEffect, useState } from "react";

type EditProfileModalProps = {
  currentName: string;
  currentEmail: string;
  loading: boolean;
  error: string;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
};

function EditProfileModal({
  currentName,
  currentEmail,
  loading,
  error,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) return;

    await onSave(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-2xl text-gray-400 hover:text-gray-700 disabled:opacity-50"
          >
            &times;
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <p className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              placeholder="Enter your name"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={currentEmail}
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-gray-500"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
