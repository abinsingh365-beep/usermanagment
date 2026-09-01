
import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// ==========================================
// INITIAL STATE
// ==========================================
const initialState = {
  users: [],
  formData: {
    name: "",
    email: "",
  },
  selectedId: "",
  loading: false,
};

// ==========================================
// REDUCER FUNCTION
// ==========================================
function reducer(state, action) {
  switch (action.type) {
    case "SET_USERS":
      return {
        ...state,
        users: action.payload,
      };

    case "HANDLE_CHANGE":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.name]: action.payload.value,
        },
      };

    case "SET_SELECTED_USER":
      return {
        ...state,
        selectedId: action.payload._id,
        formData: {
          name: action.payload.name || "",
          email: action.payload.email || "",
        },
      };

    case "CLEAR_FORM":
      return {
        ...state,
        formData: {
          name: "",
          email: "",
        },
        selectedId: "",
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
// ADMIN DASHBOARD
// ==========================================
function AdminDashboard() {
  const navigate = useNavigate();

  // useReducer
  const [state, dispatch] = useReducer(reducer, initialState);

  const { users, formData, selectedId, loading } = state;

  // ==========================================
  // FETCH USERS
  // ==========================================
  const fetchUsers = async () => {
    try {
      const response = await api.get("/user/all-users");

      console.log("USERS:", response.data);

      dispatch({
        type: "SET_USERS",
        payload: response.data.data || [],
      });
    } catch (error) {
      console.log("Get users error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load users"
      );
    }
  };

  // ==========================================
  // CHECK LOGIN
  // ==========================================
  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.user_type !== "ADMIN") {
      navigate(`/user/${user.id}`);
      return;
    }

    fetchUsers();
  }, []);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================
  const handleChange = (e) => {
    dispatch({
      type: "HANDLE_CHANGE",
      payload: {
        name: e.target.name,
        value: e.target.value,
      },
    });
  };

  // ==========================================
  // CLEAR FORM
  // ==========================================
  const clearForm = () => {
    dispatch({
      type: "CLEAR_FORM",
    });
  };

  // ==========================================
  // ADD USER
  // ==========================================
  const addUser = async () => {
    if (!formData.name || !formData.email) {
      alert("Please fill all fields");
      return;
    }

    try {
      dispatch({
        type: "SET_LOADING",
        payload: true,
      });

      const response = await api.post(
        "/user/add-user",
        formData
      );

      alert(
        response.data.message ||
          "User added successfully"
      );

      clearForm();
      fetchUsers();
    } catch (error) {
      console.log("Add user error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add user"
      );
    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
  };

  // ==========================================
  // SELECT USER FOR EDIT
  // ==========================================
  const selectUser = (user) => {
    dispatch({
      type: "SET_SELECTED_USER",
      payload: user,
    });
  };

  // ==========================================
  // UPDATE USER
  // ==========================================
  const updateUser = async () => {
    if (!selectedId) {
      alert("Please select a user first");
      return;
    }

    try {
      dispatch({
        type: "SET_LOADING",
        payload: true,
      });

      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      const response = await api.put(
        `/user/update-user/${selectedId}`,
        updateData
      );

      alert(
        response.data.message ||
          "User updated successfully"
      );

      clearForm();
      fetchUsers();
    } catch (error) {
      console.log("Update error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update user"
      );
    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
  };

  // ==========================================
  // DELETE USER
  // ==========================================
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await api.delete(
        `/user/delete-user/${id}`
      );

      alert(
        response.data.message ||
          "User deleted successfully"
      );

      fetchUsers();
    } catch (error) {
      console.log("Delete error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete user"
      );
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

    sessionStorage.clear();

    navigate("/login");
  };

  // ==========================================
  // JSX
  // ==========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              User Management System
            </h1>

            <p className="text-blue-200 mt-1">
              Admin Dashboard
            </p>
          </div>

          <button
            onClick={logout}
            className="px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 hover:-translate-y-1 transition shadow-lg"
          >
            Logout
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-8 shadow-2xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {selectedId ? "Update User" : "Add New User"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Name"
              className="w-full px-4 py-3 rounded-xl bg-white text-gray-800 outline-none focus:ring-4 focus:ring-blue-400/40"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="w-full px-4 py-3 rounded-xl bg-white text-gray-800 outline-none focus:ring-4 focus:ring-blue-400/40"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={addUser}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Add User"}
            </button>

            <button
              onClick={updateUser}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition disabled:opacity-50"
            >
              Update User
            </button>

            <button
              onClick={clearForm}
              className="flex-1 py-3 rounded-xl bg-gray-500 text-white font-bold hover:bg-gray-600 transition"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden">
          <h2 className="text-2xl font-bold text-white mb-5">
            All Users
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-blue-600">
                  <th className="px-4 py-4 text-white text-left">
                    Name
                  </th>

                  <th className="px-4 py-4 text-white text-left">
                    Email
                  </th>

                  <th className="px-4 py-4 text-white">
                    User Type
                  </th>

                  <th className="px-4 py-4 text-white">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center text-white py-8"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-white/10 hover:bg-white/10 transition"
                    >
                      <td className="px-4 py-4 text-white">
                        {user.name}
                      </td>

                      <td className="px-4 py-4 text-blue-100">
                        {user.email}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="px-3 py-1 rounded-full bg-purple-500 text-white text-sm font-semibold">
                          {user.user_type}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => selectUser(user)}
                            className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteUser(user._id)}
                            className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;

