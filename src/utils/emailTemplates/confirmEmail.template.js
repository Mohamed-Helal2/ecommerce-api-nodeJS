export const confirmEmailTemplate = (token) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Email Confirmation</title>
      <style>
          body{
              font-family: Arial;
              background:#f4f4f4;
              padding:40px;
          }
          .container{
              background:white;
              padding:30px;
              border-radius:10px;
              text-align:center;
          }
          .btn{
              display:inline-block;
              padding:12px 25px;
              background:#4CAF50;
              color:white;
              text-decoration:none;
              border-radius:5px;
              margin-top:20px;
          }
      </style>
  </head>

  <body>

  <div class="container">
      <h2>Welcome to our platform 🎉</h2>
      <p>Please confirm your email to activate your account</p>

      <a class="btn" href="https://ecommerce-api-node-js.vercel.app/auth/confirmEmail/${token}">
          Confirm Email
      </a>

      <p>If you didn't create this account ignore this email.</p>
  </div>

  </body>
  </html>
  `;
};

    //   http://localhost:3000
