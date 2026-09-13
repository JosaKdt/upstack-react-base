import nodemailer from 'nodemailer'

console.log('📧 SMTP Config:', {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
})

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendActivationEmail(email: string, matricule: string, tempPassword: string, token: string) {
  const activationLink = `${process.env.FRONTEND_URL}/activate?token=${token}`

  const mailOptions = {
    from: '"SETICE" <no-reply@setice.edu>',
    to: email,
    subject: 'Activation de votre compte étudiant',
    html: `
      <p>Bonjour,</p>
      <p>Votre compte étudiant a été créé avec succès.</p>
      <p><strong>Matricule:</strong> ${matricule}</p>
      <p><strong>Mot de passe temporaire:</strong> ${tempPassword}</p>
      <p>Pour activer votre compte, cliquez sur ce lien:</p>
      <a href="${activationLink}">Activer mon compte</a>
      <p>Merci !</p>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('✅ Email envoyé à', email)
  } catch (error) {
    // ✅ Ne fait pas planter la création de l'étudiant si l'email échoue
    console.error('❌ Erreur envoi email (ignorée):', error)
  }
}