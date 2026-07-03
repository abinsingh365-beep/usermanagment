async function loadUser() {

    const id = new URLSearchParams(window.location.search).get("id");
    const token = localStorage.getItem("token");

    try {

        const response = await fetch(`/api/user/user/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (result.status) {

            document.getElementById("userName").textContent = result.data.name;
            document.getElementById("name").value = result.data.name;
            document.getElementById("email").value = result.data.email;

            // Don't load password
            document.getElementById("password").value = "";

        } else {
            alert(result.message);
        }

    } catch (err) {
        console.error(err);
        alert("Failed to load user.");
    }
}

function toggleProfile() {

    const card = document.getElementById("profileCard");

    card.style.display =
        card.style.display === "block" ? "none" : "block";
}

// Update Name
async function updateName() {

    const id = new URLSearchParams(window.location.search).get("id");
    const token = localStorage.getItem("token");

    const name = document.getElementById("name").value;

    try {

        const response = await fetch(`/api/user/update-name/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        });

        const result = await response.json();

        alert(result.message);

        if (result.status) {
            loadUser();
        }

    } catch (err) {
        console.error(err);
    }
}

// Update Email
async function updateEmail() {

    const id = new URLSearchParams(window.location.search).get("id");
    const token = localStorage.getItem("token");

    const email = document.getElementById("email").value;

    try {

        const response = await fetch(`/api/user/update-email/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ email })
        });

        const result = await response.json();

        alert(result.message);

        if (result.status) {
            loadUser();
        }

    } catch (err) {
        console.error(err);
    }
}

// Update Password
async function updatePassword() {

    const id = new URLSearchParams(window.location.search).get("id");
    const token = localStorage.getItem("token");

    const password = document.getElementById("password").value;

    try {

        const response = await fetch(`/api/user/update-password/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ password })
        });

        const result = await response.json();

        alert(result.message);

        if (result.status) {
            document.getElementById("password").value = "";
        }

    } catch (err) {
        console.error(err);
    }
}

function logout() {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
}

loadUser();