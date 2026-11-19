import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-blue-500">404</h1>

        <h2 className="mt-4 text-2xl font-bold text-white">Page Not Found</h2>

        <p className="mt-2 text-gray-400">
          Sorry, the page you are looking for doesn't exist.
        </p>

        <Link
          to="/login"
          className="mt-7 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
