async function forgotPassword() {

    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    try {

        const res = await fetch("/api/auth/forgot-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                newPassword,
                confirmPassword
            })
        });

        const data = await res.json();

        alert(data.message);

        if (data.status) {
            window.location.href = "adminlogin.html";
        }

    } catch (error) {
        console.log(error);
        alert("Something went wrong");
    }
}