import nodemailer from "nodemailer";

/**
 * Transporteur SMTP Mailtrap
 */
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // "sandbox.smtp.mailtrap.io"
  port: Number(process.env.SMTP_PORT), // 2525
  secure: false, // Mailtrap = false
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Envoi d'email d'activation de compte
 */
export async function sendActivationEmail(
  email: string,
  tempPassword: string,
  token: string
) {
  const activationLink = `${process.env.FRONTEND_URL}/activate?token=${token}`;

  return transporter.sendMail({
    from: '"SETICE" <no-reply@setice.edu>',
    to: email,
    subject: "Activation de votre compte",
    html: `
      <p>Bonjour,</p>
      <p>Votre compte a été créé avec succès.</p>

      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Mot de passe temporaire :</strong> ${tempPassword}</p>

      <p>Pour activer votre compte, cliquez sur le lien ci-dessous :</p>
      <a href="${activationLink}" style="color: blue;">Activer mon compte</a>

      <br/><br/>
      <p>Merci,<br>L'équipe SETICE</p>
    `,
  });
}
