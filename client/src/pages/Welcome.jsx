import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-5">

      {/* Background circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-sm animate-bounce"></div>

      <div className="absolute bottom-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-sm animate-pulse"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl p-10 text-center rounded-3xl shadow-2xl">

        <h1 className="text-5xl font-bold text-gray-800 mb-3">
          Welcome
        </h1>

        <p className="text-gray-500 text-lg mb-8">
          User Management System
        </p>

        <button
          onClick={() => navigate("/login")}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-bold shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
        >
          Sign In
        </button>

      </div>

    </div>
  );
}

export default Welcome;