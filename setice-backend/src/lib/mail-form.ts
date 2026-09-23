import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")

export async function sendActivationEmail(email: string, tempPassword: string, token: string) {
  const activationLink = process.env.FRONTEND_URL + "/activate?token=" + token

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || "no-reply@setice.edu",
    subject: "Activation de votre compte formateur",
    html:
      "<p>Bonjour,</p>" +
      "<p>Votre compte formateur a ete cree avec succes.</p>" +
      "<p><strong>Email:</strong> " + email + "</p>" +
      "<p><strong>Mot de passe temporaire:</strong> " + tempPassword + "</p>" +
      "<p>Pour activer votre compte, cliquez sur ce lien:</p>" +
      "<a href=\"" + activationLink + "\">Activer mon compte</a>" +
      "<p>Merci !</p>",
  }

  try {
    await sgMail.send(msg)
    console.log("Email formateur envoye a", email)
  } catch (error: any) {
    console.error("Erreur envoi email formateur (ignoree):", error?.response?.body || error)
  }
}
