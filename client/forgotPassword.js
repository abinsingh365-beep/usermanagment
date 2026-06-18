const form = document.getElementById("forgotForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
e.preventDefault();


const email = document.getElementById("email").value;

try {
    const response = await fetch(
        "http://localhost:3000/api/auth/forgot-password",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        }
    );

    const data = await response.json();

    message.innerText = data.message;

} catch (error) {
    message.innerText = "Something went wrong";
    console.log(error);
}


});
