import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true si port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendActivationEmail(email: string, tempPassword: string, token: string) {
  const activationLink = `${process.env.FRONTEND_URL}/activate?token=${token}`

  const mailOptions = {
    from: '"SETICE" <no-reply@setice.edu>',
    to: email,
    subject: 'Activation de votre compte formateur',
    html: `
      <p>Bonjour,</p>
      <p>Votre compte formateur a ete cree avec succes.</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mot de passe temporaire:</strong> ${tempPassword}</p>
      <p>Pour activer votre compte, cliquez sur ce lien:</p>
      <a href="${activationLink}">Activer mon compte</a>
      <p>Merci !</p>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Email formateur envoye a', email)
  } catch (error) {
    console.error('Erreur envoi email formateur (ignoree):', error)
  }
}
