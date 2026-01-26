// lib/mail.ts
import sgMail from "@sendgrid/mail"

// ✅ IMPORTANT : Configurer SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendActivationEmail(
  email: string,
  tempPassword: string,
  activationToken: string  // ← Le JWT
) {
  console.log('')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📧 [MAIL] sendActivationEmail appelé')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📧 [MAIL] Paramètres reçus:')
  console.log('   - email:', email)
  console.log('   - tempPassword:', tempPassword)
  console.log('   - activationToken:', activationToken)
  console.log('   - activationToken length:', activationToken.length)
  console.log('   - activationToken commence par eyJ?:', activationToken.startsWith('eyJ'))
  
  const frontendUrl = process.env.FRONTEND_URL || 'https://resonant-wisp-67c4aa.netlify.app'
  
  // ✅ IMPORTANT : Utiliser activationToken (JWT), PAS tempPassword !
  const activationLink = `${frontendUrl}/activate?token=${activationToken}`
  
  console.log('🔗 [MAIL] Lien d\'activation généré:', activationLink)
  console.log('🔍 [MAIL] URL contient bien le token JWT?:', activationLink.includes('eyJ'))

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: 'Activez votre compte',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Bienvenue !</h2>
        <p>Votre compte a été créé avec succès.</p>
        
        <p><strong>Votre mot de passe temporaire :</strong> <code>${tempPassword}</code></p>
        
        <p>Pour activer votre compte, cliquez sur le bouton ci-dessous :</p>
        
        <a href="${activationLink}" 
           style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; 
                  color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Activer mon compte
        </a>
        
        <p style="color: #666; font-size: 12px;">
          Ce lien est valable pendant 24 heures.
        </p>
        
        <p style="color: #666; font-size: 12px;">
          Si le bouton ne fonctionne pas, copiez ce lien :<br>
          <code style="background: #f4f4f4; padding: 4px 8px; border-radius: 3px; font-size: 11px; word-break: break-all;">
            ${activationLink}
          </code>
        </p>
      </div>
    `,
  }

  console.log('📤 [MAIL] Envoi de l\'email via SendGrid...')
  const response = await sgMail.send(msg)
  console.log('✅ [MAIL] Email envoyé avec succès ! Status:', response[0].statusCode)
}