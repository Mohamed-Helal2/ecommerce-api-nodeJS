export const forgetPasswordTemplate = (code) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Password Reset</title>
    <style>
      body{
        font-family: Arial, sans-serif;
        background:#f4f4f4;
        padding:40px;
      }
      .container{
        background:#ffffff;
        padding:30px;
        border-radius:10px;
        text-align:center;
        max-width:500px;
        margin:auto;
      }
      .code{
        font-size:28px;
        font-weight:bold;
        letter-spacing:6px;
        margin:20px 0;
        color:#333;
      }
      .footer{
        font-size:14px;
        color:#777;
        margin-top:20px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h2>🔐 Password Reset Request</h2>

      <p>Use the verification code below to reset your password.</p>

      <div class="code">
        ${code}
      </div>

      <p>This code will expire in 10 minutes.</p>

      <div class="footer">
        If you didn’t request a password reset, please ignore this email.
      </div>
    </div>
  </body>
  </html>
  `;
};