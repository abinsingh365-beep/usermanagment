function passwordTemplate(data) {
  const { USER_NAME, EMAIL, PASSWORD, LOGIN_URL } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Account Created</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">

<div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 0 10px rgba(0,0,0,0.1);">

    <div style="background:#4CAF50; color:white; padding:20px; text-align:center;">
        <h1>Welcome!</h1>
        <p>Your account has been created successfully.</p>
    </div>

    <div style="padding:30px;">

        <h2>Hello ${USER_NAME},</h2>

        <p>Your login details are given below:</p>

        <table width="100%" cellspacing="0" cellpadding="10" style="border-collapse:collapse;">
            <tr>
                <td style="border:1px solid #ddd;"><strong>Username</strong></td>
                <td style="border:1px solid #ddd;">${USER_NAME}</td>
            </tr>
            <tr>
                <td style="border:1px solid #ddd;"><strong>Email</strong></td>
                <td style="border:1px solid #ddd;">${EMAIL}</td>
            </tr>
            <tr>
                <td style="border:1px solid #ddd;"><strong>Password</strong></td>
                <td style="border:1px solid #ddd;">${PASSWORD}</td>
            </tr>
            <tr>
                <td style="border:1px solid #ddd;"><strong>Login URL</strong></td>
                <td style="border:1px solid #ddd;">
                    <a href="${LOGIN_URL}">${LOGIN_URL}</a>
                </td>
            </tr>
        </table>

        <div style="text-align:center; margin-top:30px;">
            <a href="${LOGIN_URL}"
               style="background:#4CAF50; color:white; text-decoration:none; padding:12px 25px; border-radius:5px;">
                Login Now
            </a>
        </div>

    </div>

    <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#666;">
        © 2026 Your Company. All Rights Reserved.
    </div>

</div>

</body>
</html>
`;
}

export default passwordTemplate;