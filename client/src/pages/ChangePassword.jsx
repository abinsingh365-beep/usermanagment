
import { useReducer } from "react";

// ==========================================
// INITIAL STATE
// ==========================================
const initialState = {
  oldPassword: "",
  newPassword: "",
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

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "CLEAR_PASSWORDS":
      return {
        ...state,
        oldPassword: "",
        newPassword: "",
      };

    default:
      return state;
  }
}

// ==========================================
// CHANGE PASSWORD COMPONENT
// ==========================================
function ChangePassword() {
  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );

  const {
    oldPassword,
    newPassword,
    loading,
  } = state;

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================
  const handleChange = (event) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: {
        name: event.target.name,
        value: event.target.value,
      },
    });
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================
  const changePassword = async (event) => {
    event.preventDefault();

    try {
      dispatch({
        type: "SET_LOADING",
        payload: true,
      });

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const response = await fetch(
        "http://localhost:3000/api/user/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Failed to change password"
        );
        return;
      }

      alert(
        data.message || "Password changed successfully"
      );

      // Clear passwords
      dispatch({
        type: "CLEAR_PASSWORDS",
      });

    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      alert("Something went wrong");

    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-cyan-400 px-4">

      <form
        onSubmit={changePassword}
        className="
          w-full max-w-md
          rounded-2xl
          border border-white/20
          bg-white/15
          p-8 sm:p-10
          shadow-2xl
          backdrop-blur-xl
        "
      >
        <h2 className="mb-8 text-center text-3xl font-semibold text-white">
          Change Password
        </h2>

        {/* Old Password */}
        <div className="mb-5">
          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={oldPassword}
            onChange={handleChange}
            required
            className="
              w-full
              rounded-xl
              border-0
              bg-white/90
              px-4
              py-4
              text-gray-800
              outline-none
              placeholder:text-gray-500
              transition
              focus:scale-[1.03]
              focus:ring-4
              focus:ring-white/40
            "
          />
        </div>

        {/* New Password */}
        <div className="mb-6">
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={newPassword}
            onChange={handleChange}
            required
            className="
              w-full
              rounded-xl
              border-0
              bg-white/90
              px-4
              py-4
              text-gray-800
              outline-none
              placeholder:text-gray-500
              transition
              focus:scale-[1.03]
              focus:ring-4
              focus:ring-white/40
            "
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            rounded-xl
            bg-blue-700
            px-4
            py-4
            text-lg
            font-semibold
            text-white
            transition
            hover:-translate-y-0.5
            hover:bg-blue-800
            hover:shadow-xl
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading
            ? "Changing Password..."
            : "Change Password"}
        </button>

      </form>
    </div>
  );
}

export default ChangePassword;

