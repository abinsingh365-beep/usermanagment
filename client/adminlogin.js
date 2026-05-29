async function signin(event) {

    // Stop page refresh
    event.preventDefault();

    // Get values
    const email = document.getElementById("email").value;
    const password = document.getElementById("pass").value;

    console.log(email);
    console.log(password);

    // Convert to JSON
    const json_data = JSON.stringify({
        email,
        password
    });

    try {

        // Send request
        let response = await fetch("/api/auth/sign-in", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: json_data

        });

        console.log("status:", response.status);

        // Convert response to JSON
        const data = await response.json();

        console.log(data);

        // Save token
        if (data.token) {

            localStorage.setItem("token", data.token);

            alert("Signin successful");

            // Redirect
            window.location.href = "mainpage.html";
        }

    } catch (err) {

        console.log("signin error:", err);

    }

}