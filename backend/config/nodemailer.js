import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // ✅ IMPORTANT : false pour le port 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // ✅ Options supplémentaires pour éviter les erreurs
  tls: {
    rejectUnauthorized: false, // Pour éviter les erreurs de certificat en dev
  },
});

// ✅ Vérifier la connexion au démarrage (optionnel mais recommandé)
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Configuration Error:", error);
  } else {
    console.log("✅ SMTP Server ready to send emails");
  }
});

export default transporter;