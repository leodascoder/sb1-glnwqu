import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1>Welcome to InsureAI</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `
  });
};

export const sendAppointmentConfirmation = async (email, appointment) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Appointment Confirmation',
    html: `
      <h1>Appointment Confirmed</h1>
      <p>Your appointment has been scheduled for:</p>
      <p>Date: ${appointment.date}</p>
      <p>Time: ${appointment.startTime} - ${appointment.endTime}</p>
    `
  });
};