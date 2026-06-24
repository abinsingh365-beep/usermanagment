document
    .getElementById("changePasswordForm")
    .addEventListener("submit", changePassword);

async function changePassword(e) {
    e.preventDefault();

    const oldPassword =
        document.getElementById("oldPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://localhost:3000/api/user/change-password",
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                oldPassword,
                newPassword
            })
        }
    );

    const data = await response.json();

    alert(data.message);
}