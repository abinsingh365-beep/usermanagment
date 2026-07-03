document.getElementById("loginForm").addEventListener("submit", login);

async function login(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const btn = document.getElementById("loginBtn");

     let emailerr = document.getElementById("email-err");
    let passerr = document.getElementById("pass-err");

    let emailreg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let passreg = /^.{6,}$/;

    emailerr.innerHTML = "";
    passerr.innerHTML = "";

    // Validation
    if (!email && !password) {
        emailerr.innerHTML = "email is required!";
        passerr.innerHTML = "password is required!";

        return;
    }

    if (!email) {
        emailerr.innerHTML = "email is required!";
        return;
    } else if (!emailreg.test(email)) {
        emailerr.innerHTML = "invalid email!";
        return;
    }

    if (!password) {
        passerr.innerHTML = "password is required!";
        return;
    } else if (!passreg.test(password)) {
        passerr.innerHTML = "password must be 6 character!";
        return;
    }

    


    let datas = {
        email,
        password
    };

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

            const user = data.data;
            console.log("token:", user.token);
            
            const authToken = user.token;
            localStorage.setItem("token", authToken);
            console.log("token:",authToken);
            localStorage.setItem("user", JSON.stringify(user));
           


            alert("Login Success");
            console.log("userrrr", user);

            // ROLE BASED REDIRECT
            if (user.user_type === "ADMIN") {
                window.location.href = "mainpage.html";
            }

            else if (user.user_type === "EMPLOYEE") {

                if (user.is_password_reset === false) {
                    window.location.href = "changePassword.html";
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
        btn.innerText = "Loginn........";
        btn.disabled = false;
    }
}