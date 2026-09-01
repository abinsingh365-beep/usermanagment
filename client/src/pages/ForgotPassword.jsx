
import { useReducer } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

// ==========================================
// INITIAL STATE
// ==========================================
const initialState = {
  email: "",
  message: "",
  loading: false,
};

// ==========================================
// REDUCER FUNCTION
// ==========================================
function reducer(state, action) {
  switch (action.type) {
    case "CHANGE_EMAIL":
      return {
        ...state,
        email: action.payload,
      };

    case "SET_MESSAGE":
      return {
        ...state,
        message: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
}

// ==========================================
// FORGOT PASSWORD COMPONENT
// ==========================================
function ForgotPassword() {
  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );

  const { email, message, loading } = state;

  // ==========================================
  // HANDLE SUBMIT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      dispatch({
        type: "SET_MESSAGE",
        payload: "Please enter your email",
      });
      return;
    }

    try {
      // Start loading
      dispatch({
        type: "SET_LOADING",
        payload: true,
      });

      // Clear previous message
      dispatch({
        type: "SET_MESSAGE",
        payload: "",
      });

      const response = await api.post(
        "/auth/forgot-password",
        {
          email,
        }
      );

      // Success message
      dispatch({
        type: "SET_MESSAGE",
        payload:
          response.data.message ||
          "Reset link sent successfully",
      });

    } catch (error) {
      console.log(error);

      // Error message
      dispatch({
        type: "SET_MESSAGE",
        payload:
          error.response?.data?.message ||
          "Something went wrong",
      });

    } finally {
      // Stop loading
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-400 via-cyan-400 to-green-400 p-5">

      {/* Floating circles */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/20 animate-bounce"></div>

      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-white/20 animate-pulse"></div>

      <div className="relative z-10 w-full max-w-md bg-white/95 p-8 rounded-3xl shadow-2xl">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-7">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              dispatch({
                type: "CHANGE_EMAIL",
                payload: e.target.value,
              })
            }
            className="w-full px-4 py-3 mb-5 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200/40 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg hover:-translate-y-1 hover:shadow-xl transition disabled:opacity-50"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>

        </form>

        {message && (
          <p className="text-center mt-5 text-gray-600 font-semibold">
            {message}
          </p>
        )}

        <div className="text-center mt-5">
          <Link
            to="/login"
            className="text-blue-500 font-semibold hover:underline"
          >
            ← Back to Login
          </Link>
        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;

