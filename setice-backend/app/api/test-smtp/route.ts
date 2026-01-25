/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/test-smtp/route.ts
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET() {
  console.log('🔍 Test de connexion SMTP...')
  console.log('Config:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
  })

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  try {
    // Tester la connexion
    await transporter.verify()
    console.log('✅ Connexion SMTP OK')
    
    // Essayer d'envoyer un email de test
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // À vous-même
      subject: 'Test SMTP depuis Render',
      text: 'Si vous recevez ceci, SMTP fonctionne !',
    })
    
    console.log('✅ Email envoyé:', info.messageId)
    return NextResponse.json({ success: true, messageId: info.messageId })
  } catch (error: any) {
    console.error('❌ Erreur SMTP:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}