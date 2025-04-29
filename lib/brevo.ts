// lib/brevo.ts
import nodemailer from 'nodemailer'; // Ou autre si tu utilises Brevo API

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com', // Pour Brevo SMTP
    port: 587,
    auth: {
      user: process.env.BREVO_SMTP_USER, // Définis ces variables dans ton .env
      pass: process.env.BREVO_SMTP_PASS,
    },
  });

  const mailOptions = {
    from: '"Ton Site" <noreply@tondomaine.com>', // expéditeur
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
}
