export const activationSuccessTemplate = (email) => {
  return `
  <!doctype html>
  <html>
    <head>
      <title>Account Activated</title>
    </head>

    <body style="font-family: Arial; text-align:center; padding:40px;">
      <h2>✅ Account activated</h2>
      <p>Your account for <b>${email}</b> has been activated successfully.</p>
      <p>You can now login.</p>
    </body>
  </html>
  `;
};

export const activationFailedTemplate = () => {
  return `
  <!doctype html>
  <html>
    <head>
      <title>Activation failed</title>
    </head>

    <body style="font-family: Arial; text-align:center; padding:40px;">
      <h2>❌ Activation link is invalid or expired.</h2>
      <p>Please request a new activation email.</p>
    </body>
  </html>
  `;
};

export const activationUserNotFoundTemplate = () => {
  return `
  <!doctype html>
  <html>
    <head>
      <title>Activation failed</title>
    </head>

    <body style="font-family: Arial; text-align:center; padding:40px;">
      <h2>❌ No account found for this activation link.</h2>
    </body>
  </html>
  `;
};