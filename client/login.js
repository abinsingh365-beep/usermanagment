document.getElementById("loginForm").addEventListener("submit", login);

async function login(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const btn = document.getElementById("loginBtn");

    try {
        btn.innerText = "Logging in...";
        btn.disabled = true;

        const response = await fetch("/api/auth/sign-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log("LOGIN RESPONSE:", data);

        if (data.status === true) {

            const user = data.user;

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(user));

            alert("Login Success");

            // ROLE BASED REDIRECT
            if (user.user_type === "ADMIN") {
                window.location.href = "mainpage.html";
            }

            else if (user.user_type === "EMPLOYEE") {

                if (user.is_password_reset === false) {
                    alert("Reset password to continue");
                    window.location.href = "ResetPassword.html";
                } else {
                    // FIX: backend sends "id", not "_id"
                    window.location.href = `userHomePage.html?id=${user.id}`;
                }

            }

            else {
                window.location.href = "mainpage.html";
            }

        } else {
            alert(data.message || "Login failed");
        }

    } catch (error) {
        console.log("Login Error:", error);
        alert("Something went wrong");
    }

    finally {
        btn.innerText = "Login";
        btn.disabled = false;
    }
}