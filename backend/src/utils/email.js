const nodemailer = require("nodemailer");
const logger = require("../config/logger");

const hasSMTP =
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS;

const transporter = hasSMTP
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

const sendEmail = async ({ to, subject, html, text }) => {
  if (!transporter) {
    logger.warn("SMTP not configured. Email not sent.");
    return false;
  }
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "no-reply@codesunny.com",
    to,
    subject,
    text,
    html,
  });
  return true;
};

module.exports = { sendEmail, hasSMTP };
