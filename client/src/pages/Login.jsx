
import { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

// ==========================================
// INITIAL STATE
// ==========================================
const initialState = {
  formData: {
    email: "",
    password: "",
  },

  errors: {
    email: "",
    password: "",
  },

  loading: false,
};

// ==========================================
// REDUCER
// ==========================================
function reducer(state, action) {
  switch (action.type) {
    case "HANDLE_CHANGE":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.name]: action.payload.value,
        },
      };

    case "SET_ERRORS":
      return {
        ...state,
        errors: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload]: "",
        },
      };

    default:
      return state;
  }
}

// ==========================================
// LOGIN COMPONENT
// ==========================================
function Login() {
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );

  const { formData, errors, loading } = state;

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch({
      type: "HANDLE_CHANGE",
      payload: {
        name,
        value,
      },
    });

    // Clear error while typing
    dispatch({
      type: "CLEAR_ERROR",
      payload: name,
    });
  };

  // ==========================================
  // VALIDATE FORM
  // ==========================================
  const validate = () => {
    let valid = true;

    const newErrors = {
      email: "",
      password: "",
    };

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.email) {
      newErrors.email = "Email is required!";
      valid = false;

    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email!";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required!";
      valid = false;

    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be 6 characters!";
      valid = false;
    }

    // Update errors using reducer
    dispatch({
      type: "SET_ERRORS",
      payload: newErrors,
    });

    return valid;
  };

  // ==========================================
  // HANDLE LOGIN
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      dispatch({
        type: "SET_LOADING",
        payload: true,
      });

      const response = await api.post(
        "/auth/sign-in",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log(
        "LOGIN RESPONSE:",
        response.data
      );

      const data = response.data;

      if (data.status === true) {
        const user = data.data;

        console.log("Logged user:", user);

        // Save token
        localStorage.setItem(
          "token",
          user.token
        );

        // Save complete user
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        alert("Login Success");

        // ======================================
        // ADMIN
        // ======================================
        if (user.user_type === "ADMIN") {
          navigate("/admin");
        }

        // ======================================
        // EMPLOYEE
        // ======================================
        else if (user.user_type === "EMPLOYEE") {

          if (user.is_password_reset === false) {
            navigate("/change-password");

          } else {
            navigate(`/user/${user.id}`);
          }
        }

        // ======================================
        // OTHER USERS
        // ======================================
        else {
          navigate(`/user/${user.id}`);
        }

      } else {
        alert(
          data.message || "Login failed"
        );
      }

    } catch (error) {
      console.log(
        "Login Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );

    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
  };

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-600 p-5">

      {/* Background circles */}
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/10 blur-sm animate-pulse"></div>

      <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-white/10 blur-sm animate-bounce"></div>

      <div className="relative z-10 w-full max-w-md">

        <form
          onSubmit={handleSubmit}
          className="bg-white/20 backdrop-blur-xl border border-white/30 p-8 sm:p-10 rounded-3xl shadow-2xl"
        >

          <h2 className="text-4xl font-bold text-white text-center mb-8">
            Login
          </h2>

          {/* Email */}
          <div className="mb-5">

            <label className="block text-white font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl bg-white text-gray-800 outline-none border-2 border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-300/30 transition"
            />

            {errors.email && (
              <p className="text-yellow-300 text-sm mt-2 font-semibold">
                {errors.email}
              </p>
            )}

          </div>

          {/* Password */}
          <div className="mb-5">

            <label className="block text-white font-semibold mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl bg-white text-gray-800 outline-none border-2 border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-300/30 transition"
            />

            {errors.password && (
              <p className="text-yellow-300 text-sm mt-2 font-semibold">
                {errors.password}
              </p>
            )}

          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-700 text-white font-bold text-lg hover:bg-blue-800 hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

          {/* Forgot Password */}
          <div className="text-center mt-6">

            <Link
              to="/forgot-password"
              className="text-white font-semibold hover:text-yellow-200 hover:underline"
            >
              Forgot Password?
            </Link>

          </div>

          {/* Back */}
          <div className="text-center mt-4">

            <Link
              to="/"
              className="text-white/80 hover:text-white"
            >
              ← Back to Welcome
            </Link>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Login;

