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
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        console.log("LOGIN RESPONSE:", data);

        if (data.status === true) {

            // store token
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Login Success");

            // 🔥 ROLE BASED REDIRECT
            if (data.user.user_type === "ADMIN") {
                window.location.href = "mainpage.html";
            }
            else if (data.user.user_type === "EMPLOYEE") {
                window.location.href = "userHomePage.html";
            }
            else {
                alert("Role not found");
            }

        } else {
            alert(data.message);
        }

    } catch (error) {
        console.log("Login Error:", error);
        alert("Something went wrong");
    } finally {
        btn.innerText = "Login";
        btn.disabled = false;
    }
}