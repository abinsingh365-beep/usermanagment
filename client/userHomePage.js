const user = JSON.parse(localStorage.getItem("user"));

if (user) {
    document.getElementById("welcomeText").innerText = 
        `Welcome ${user.name}`;
} else {
    document.getElementById("welcomeText").innerText = 
        "Welcome Guest";
}