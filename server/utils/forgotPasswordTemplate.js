export default function forgotPasswordTemplate(data) {
  const { USER_NAME, FORGOT_PASSWORD_URL } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Password</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">

<div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 0 10px rgba(0,0,0,0.1);">

    <div style="background:#ff9800; color:white; padding:20px; text-align:center;">
        <h1>Forgot Password</h1>
        <p>Reset your password securely.</p>
    </div>

    <div style="padding:30px;">

        <h2>Hello ${USER_NAME},</h2>

        <p>We received a request to reset your password.</p>

        <p>Click the button below to create a new password:</p>

        <div style="text-align:center; margin:30px 0;">
            <a href="${FORGOT_PASSWORD_URL}"
               style="background:#ff9800;
                      color:white;
                      padding:12px 25px;
                      text-decoration:none;
                      border-radius:5px;
                      display:inline-block;">
                Reset Password
            </a>
        </div>

        <p>If the button does not work, copy and paste this link into your browser:</p>

        <p style="word-break: break-all;">
            ${FORGOT_PASSWORD_URL}
        </p>

        <p>If you did not request a password reset, please ignore this email.</p>

    </div>

    <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#666;">
        © 2026 Your Company. All Rights Reserved.
    </div>

</div>

</body>
</html>
`;
}