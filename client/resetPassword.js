
const form = document.getElementById("resetForm");
const message = document.getElementById("message");

const params = new URLSearchParams(window.location.search);
const token = params.get("token");

form.addEventListener("submit", async (e) => {
e.preventDefault();


const newPassword =
    document.getElementById("newPassword").value;

const confirmPassword =
    document.getElementById("confirmPassword").value;

try {
    const response = await fetch(
        "http://localhost:3000/api/auth/reset-password",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token,
                newPassword,
                confirmPassword
            })
        }
    );

    const data = await response.json();

    message.innerText = data.message;

    if (data.status) {
        setTimeout(() => {
            window.location.href = "adminlogin.html";
        }, 2000);
    }

} catch (error) {
    message.innerText = "Something went wrong";
    console.log(error);
}


});
