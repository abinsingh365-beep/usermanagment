async function signin(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("pass").value;

    try {

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

        console.log(data);

        if (data.success) {

            localStorage.setItem("token", data.token);

            alert("Signin successful");

            if (data.role === "ADMIN") {
                window.location.href = "mainpage.html";
            } else {
                window.location.href = "userHomePage.html";
            }

        } else {
            alert(data.message);
        }

    } catch (err) {
        console.error("Signin Error:", err);
        alert("Something went wrong");
    }
}