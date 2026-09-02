
import { useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

// ==========================================
// INITIAL STATE
// ==========================================
const initialState = {
  profileOpen: false,
  editing: false,
  loading: false,
  selectedFile: null,
  imagePreview: "/uploads/default.png",

  user: {
    name: "",
    email: "",
    password: "",
  },
};

// ==========================================
// REDUCER
// ==========================================
function reducer(state, action) {
  switch (action.type) {
    case "SET_PROFILE_OPEN":
      return {
        ...state,
        profileOpen: action.payload,
      };

    case "TOGGLE_PROFILE":
      return {
        ...state,
        profileOpen: !state.profileOpen,
      };

    case "SET_EDITING":
      return {
        ...state,
        editing: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };

    case "UPDATE_USER_FIELD":
      return {
        ...state,
        user: {
          ...state.user,
          [action.payload.name]: action.payload.value,
        },
      };

    case "CLEAR_PASSWORD":
      return {
        ...state,
        user: {
          ...state.user,
          password: "",
        },
      };

    case "SET_SELECTED_FILE":
      return {
        ...state,
        selectedFile: action.payload,
      };

    case "SET_IMAGE_PREVIEW":
      return {
        ...state,
        imagePreview: action.payload,
      };

    case "CLEAR_SELECTED_FILE":
      return {
        ...state,
        selectedFile: null,
      };

    default:
      return state;
  }
}

// ==========================================
// USER DASHBOARD
// ==========================================
function UserDashboard() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );

  const {
    profileOpen,
    editing,
    loading,
    selectedFile,
    imagePreview,
    user,
  } = state;

  // ==========================================
  // LOAD USER
  // ==========================================
  const loadUser = async () => {
    try {
      const response = await api.get(
        `/user/user/${id}`
      );

      const result = response.data;

      console.log("USER:", result);

      if (result.status) {
        const userData = result.data;

        dispatch({
          type: "SET_USER",
          payload: {
            name: userData.name || "",
            email: userData.email || "",
            password: "",
          },
        });

        if (userData.profile_image) {
          dispatch({
            type: "SET_IMAGE_PREVIEW",
            payload: `http://localhost:3000/uploads/${userData.profile_image}`,
          });
        }
      }

    } catch (error) {
      console.log("Load user error:", error);

      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  // ==========================================
  // CHECK LOGIN
  // ==========================================
  useEffect(() => {
    const token = localStorage.getItem("token");

    const savedUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (!token || !savedUser) {
      navigate("/login");
      return;
    }

    loadUser();
  }, [id]);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================
  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_USER_FIELD",
      payload: {
        name: e.target.name,
        value: e.target.value,
      },
    });
  };

  // ==========================================
  // ENABLE EDIT
  // ==========================================
  const enableEdit = () => {
    dispatch({
      type: "SET_EDITING",
      payload: true,
    });
  };

  // ==========================================
  // UPDATE PROFILE
  // ==========================================
  const updateProfile = async () => {
    try {
      dispatch({
        type: "SET_LOADING",
        payload: true,
      });

      const updateData = {
        name: user.name,
        email: user.email,
      };

      if (user.password) {
        updateData.password = user.password;
      }

      const response = await api.put(
        `/user/update-profile/${id}`,
        updateData
      );

      const result = response.data;

      alert(
        result.message ||
        "Profile updated successfully"
      );

      if (result.status) {
        dispatch({
          type: "SET_EDITING",
          payload: false,
        });

        dispatch({
          type: "CLEAR_PASSWORD",
        });

        // Update localStorage user
        const savedUser = JSON.parse(
          localStorage.getItem("user")
        );

        if (savedUser) {
          savedUser.name = user.name;
          savedUser.email = user.email;

          localStorage.setItem(
            "user",
            JSON.stringify(savedUser)
          );
        }

        loadUser();
      }

    } catch (error) {
      console.log(
        "Profile update error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Profile update failed"
      );

    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
  };

  // ==========================================
  // HANDLE FILE CHANGE
  // ==========================================
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    dispatch({
      type: "SET_SELECTED_FILE",
      payload: file,
    });

    const preview = URL.createObjectURL(file);

    dispatch({
      type: "SET_IMAGE_PREVIEW",
      payload: preview,
    });
  };

  // ==========================================
  // UPLOAD PROFILE IMAGE
  // ==========================================
  const uploadProfileImage = async () => {
    if (!selectedFile) {
      alert("Please select image");
      return;
    }

    try {
      dispatch({
        type: "SET_LOADING",
        payload: true,
      });

      const formData = new FormData();

      formData.append(
        "photo",
        selectedFile
      );

      const response = await api.put(
        `/user/update-profile-image/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response.data;

      alert(
        result.message ||
        "Profile image updated successfully"
      );

      if (result.status) {
        dispatch({
          type: "CLEAR_SELECTED_FILE",
        });

        if (result.data?.profile_image) {
          dispatch({
            type: "SET_IMAGE_PREVIEW",
            payload: `http://localhost:3000/uploads/${result.data.profile_image}`,
          });
        }
      }

    } catch (error) {
      console.log(
        "Image upload error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Image upload failed"
      );

    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const logout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="h-20 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 sm:px-8 flex items-center justify-between shadow-lg">

        <h2 className="text-xl sm:text-2xl font-bold">
          Welcome,{" "}
          <span>
            {user.name || "User"}
          </span>
        </h2>

        {/* Profile Icon */}
        <button
          onClick={() =>
            dispatch({
              type: "TOGGLE_PROFILE",
            })
          }
          className="w-12 h-12 rounded-full bg-white p-1 shadow-lg hover:scale-110 transition"
        >
          <img
            src={imagePreview}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "/uploads/default.png";
            }}
          />
        </button>

      </header>

      {/* Main */}
      <main className="p-5 sm:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              User Dashboard
            </h1>

            <p className="text-gray-500">
              Welcome to your dashboard.
            </p>

          </div>
        </div>
      </main>

      {/* Profile Popup */}
      {profileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40">

          <div className="absolute top-24 right-5 w-[calc(100%-40px)] sm:w-[400px] max-h-[80vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6">

            {/* Title */}
            <div className="flex items-center justify-between mb-6">

              <h3 className="text-2xl font-bold text-gray-800">
                My Profile
              </h3>

              <button
                onClick={() =>
                  dispatch({
                    type: "SET_PROFILE_OPEN",
                    payload: false,
                  })
                }
                className="text-gray-500 hover:text-red-500 text-2xl"
              >
                ×
              </button>

            </div>

            {/* Profile Image */}
            <div className="text-center mb-6">

              <img
                src={imagePreview}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mx-auto shadow-lg"
              />

              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-5 w-full text-sm"
              />

              <button
                onClick={uploadProfileImage}
                disabled={loading}
                className="w-full mt-3 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition disabled:opacity-50"
              >
                {loading
                  ? "Uploading..."
                  : "Update Profile Image"}
              </button>

            </div>

            {/* Name */}
            <div className="mb-4">

              <label className="block font-semibold text-gray-700 mb-2">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border rounded-xl outline-none disabled:bg-gray-100 focus:ring-4 focus:ring-blue-200"
              />

            </div>

            {/* Email */}
            <div className="mb-4">

              <label className="block font-semibold text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border rounded-xl outline-none disabled:bg-gray-100 focus:ring-4 focus:ring-blue-200"
              />

            </div>

            {/* Password */}
            <div className="mb-5">

              <label className="block font-semibold text-gray-700 mb-2">
                New Password
              </label>

              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Enter new password"
                className="w-full px-4 py-3 border rounded-xl outline-none disabled:bg-gray-100 focus:ring-4 focus:ring-blue-200"
              />

            </div>

            {/* Edit Button */}
            {!editing && (
              <button
                onClick={enableEdit}
                className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
              >
                Edit Profile
              </button>
            )}

            {/* Save Button */}
            {editing && (
              <button
                onClick={updateProfile}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : "Save Profile"}
              </button>
            )}

            {/* Close */}
            <button
              onClick={() =>
                dispatch({
                  type: "SET_PROFILE_OPEN",
                  payload: false,
                })
              }
              className="w-full py-3 mt-3 rounded-xl bg-gray-500 text-white font-bold hover:bg-gray-600 transition"
            >
              Close
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="w-full py-3 mt-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition"
            >
              Logout
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default UserDashboard;

