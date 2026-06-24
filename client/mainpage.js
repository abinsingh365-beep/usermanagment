// Base URL for your backend API
const API = "http://localhost:3000/api/user";


// ==============================
// FUNCTION TO GET ALL USERS
// ==============================
async function getUsers() {

  try {

    // Send GET request to fetch all users
    const response = await fetch(
      `${API}/all-users`
    );

    // Convert response into JSON format
    const data = await response.json();

    // Get table body element from HTML
    const table =
      document.getElementById("userTable");

    // Clear old table data before adding new rows
    table.innerHTML = "";

    // Loop through each user from API response
    data.data.forEach((user) => {

      // Add a new row inside table
      table.innerHTML += `

        <tr>

          <!-- Display user name -->
          <td>${user.name}</td>

          <!-- Display user email -->
          <td>${user.email}</td>

          <!-- Display user type -->
          <td>${user.user_type}</td>

          
          



          <td>

            <!-- Edit button -->
            <button 
              class="action-btn edit"

              onclick="editUser(
                '${user._id}',
                '${user.name}',
                '${user.email}',
                '${user.password}',
                '${user.user_type}'
              )">

              Edit
            </button>

            <!-- Delete button -->
            <button 
              class="action-btn delete"

              onclick="deleteUser('${user._id}')">

              Delete
            </button>

          </td>

        </tr>

      `;
    });

  } catch (err) {

    // Show error in console if request fails
    console.log(err);

  }
}



// ==============================
// FUNCTION TO ADD NEW USER
// ==============================
async function addUser() {

  // Get values from input fields
  const name =
    document.getElementById("name").value;

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  const user_type =
    document.getElementById("userType").value;

  try {

    // Send POST request to backend
    const response = await fetch(
      `${API}/add-user`,
      {
        method: "POST",

        // Tell server that data is JSON
        headers: {
          "Content-Type": "application/json"
        },

        // Convert JS object into JSON string
        body: JSON.stringify({
          name,
          email,
          password,
          user_type
        })
      }
    );

    // Convert response into JSON
    const data = await response.json();

    // Show success message
    alert(data.message);

    // Clear input fields
    clearInputs();

    // Reload users table
    getUsers();

  } catch (err) {

    // Print error in console
    console.log(err);

  }
}



// ==============================
// FUNCTION TO FILL FORM FOR EDIT
// ==============================
function editUser(
  id,
  name,
  email,
  password,
  user_type
) {

  // Store user id in hidden input
  document.getElementById("userId").value = id;

  // Fill form inputs with existing user data
  document.getElementById("name").value = name;

  document.getElementById("email").value = email;

  document.getElementById("password").value = password;

  document.getElementById("userType").value = user_type;
}



// ==============================
// FUNCTION TO UPDATE USER
// ==============================
async function updateUser() {

  // Get updated values from form
  const id =
    document.getElementById("userId").value;

  const name =
    document.getElementById("name").value;

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  const user_type =
    document.getElementById("userType").value;

  try {

    // Send PUT request to update user
    const response = await fetch(
      `${API}/update-user/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        // Send updated user data
        body: JSON.stringify({
          name,
          email,
          password,
          user_type
        })
      }
    );

    // Convert response to JSON
    const data = await response.json();

    // Show success message
    alert(data.message);

    // Clear form fields
    clearInputs();

    // Reload updated user list
    getUsers();

  } catch (err) {

    // Print error if update fails
    console.log(err);

  }
}



// ==============================
// FUNCTION TO DELETE USER
// ==============================
async function deleteUser(id) {

  try {

    // Send DELETE request using user id
    const response = await fetch(
      `${API}/delete-user/${id}`,
      {
        method: "DELETE"
      }
    );

    // Convert response into JSON
    const data = await response.json();

    // Show delete success message
    alert(data.message);

    // Reload users table
    getUsers();

  } catch (err) {

    // Print error if delete fails
    console.log(err);

  }
}



// ==============================
// FUNCTION TO LOGOUT USER
// ==============================
function logout() {

  // Show logout message
  alert("Logout Successfully");

  // Clear browser local storage
  localStorage.removeItem("token");
  localStorage.removeItem("user");


  // Clear browser session storage
  sessionStorage.clear();


  // Redirect to login page
  window.location.replace("adminlogin.html");

}



// ==============================
// FUNCTION TO CLEAR INPUT FIELDS
// ==============================
function clearInputs() {

  // Clear name input
  document.getElementById("name").value = "";

  // Clear email input
  document.getElementById("email").value = "";

  // Clear password input
  document.getElementById("password").value = "";

  // Clear user type input
  document.getElementById("userType").value = "";
}



// ==============================
// CALL FUNCTION WHEN PAGE LOADS
// ==============================

// Automatically fetch and display users
getUsers();