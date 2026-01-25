/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Création du transporter SMTP pour Gmail
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp.gmail.com
  port: Number(process.env.SMTP_PORT), // 587 pour TLS
  secure: false, // true si port 465, false pour 587
  auth: {
    user: process.env.SMTP_USER, // ton Gmail
    pass: process.env.SMTP_PASSWORD, // mot de passe d’application Gmail
  },
});

export async function GET() {
  console.log("📨 TEST GMAIL: /api/test-mail");

  try {
    console.log("🔧 Vérification du transporteur SMTP...");
    await transporter.verify();
    console.log("✅ Transporteur valide !");

    console.log("📤 Envoi de l’email de test…");

    // Remplace cet email par l'email réel de l'étudiant
    const recipientEmail = "etudiant@gmail.com";

    const info = await transporter.sendMail({
      from: `"SETICE Test" <${process.env.SMTP_USER}>`, // ton Gmail
      to: recipientEmail, // l’étudiant
      subject: "Test Email SETICE",
      text: "Si vous recevez ceci, l’envoi Gmail fonctionne parfaitement !",
    });

    console.log("✅ Email envoyé:", info.messageId);

    return NextResponse.json({
      success: true,
      message: `Email de test envoyé à ${recipientEmail} avec succès !`,
      messageId: info.messageId,
    });

  } catch (error: any) {
    console.error("❌ Erreur d’envoi Gmail:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
