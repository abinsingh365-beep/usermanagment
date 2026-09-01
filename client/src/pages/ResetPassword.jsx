
import { useReducer } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import api from "../services/api";

// ==========================================
// INITIAL STATE
// ==========================================
const initialState = {
  newPassword: "",
  confirmPassword: "",
  message: "",
  loading: false,
};

// ==========================================
// REDUCER FUNCTION
// ==========================================
function reducer(state, action) {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
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

    case "CLEAR_FORM":
      return {
        ...state,
        newPassword: "",
        confirmPassword: "",
      };

    default:
      return state;
  }
}

// ==========================================
// RESET PASSWORD COMPONENT
// ==========================================
function ResetPassword() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  // ==========================================
  // USE REDUCER
  // ==========================================
  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );

  const {
    newPassword,
    confirmPassword,
    message,
    loading,
  } = state;

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================
  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: {
        name: e.target.name,
        value: e.target.value,
      },
    });
  };

  // ==========================================
  // HANDLE SUBMIT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!newPassword || !confirmPassword) {
      dispatch({
        type: "SET_MESSAGE",
        payload: "Please fill all fields",
      });
      return;
    }

    // Password length validation
    if (newPassword.length < 6) {
      dispatch({
        type: "SET_MESSAGE",
        payload: "Password must be at least 6 characters",
      });
      return;
    }

    // Password matching validation
    if (newPassword !== confirmPassword) {
      dispatch({
        type: "SET_MESSAGE",
        payload: "Passwords do not match",
      });
      return;
    }

    // Token validation
    if (!token) {
      dispatch({
        type: "SET_MESSAGE",
        payload: "Invalid or missing reset token",
      });
      return;
    }

    try {
      // Start loading
      dispatch({
        type: "SET_LOADING",
        payload: true,
      });

      // Clear old message
      dispatch({
        type: "SET_MESSAGE",
        payload: "",
      });

      const response = await api.post(
        "/auth/reset-password",
        {
          token,
          newPassword,
          confirmPassword,
        }
      );

      const data = response.data;

      // Success message
      dispatch({
        type: "SET_MESSAGE",
        payload:
          data.message ||
          "Password reset successfully",
      });

      if (data.status) {
        // Clear password fields
        dispatch({
          type: "CLEAR_FORM",
        });

        // Navigate to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }

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

      {/* Background circles */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/20 animate-pulse"></div>

      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-white/20 animate-bounce"></div>

      <div className="relative z-10 w-full max-w-md bg-white/95 p-8 rounded-3xl shadow-2xl">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-7">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit}>

          {/* New Password */}
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={newPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 mb-4 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-400 transition"
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 mb-5 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-400 transition"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg hover:-translate-y-1 hover:shadow-xl transition disabled:opacity-50"
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>

        </form>

        {/* Message */}
        {message && (
          <p className="text-center mt-5 text-gray-600 font-semibold">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default ResetPassword;

