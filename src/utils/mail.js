import Mailgen from "mailgen";
import nodemailer from 'nodemailer'

const sendEmail = async (options) => {
  const mailgenerator = new Mailgen({
    theme: "default",
    product: {
      name: "task Manager",
      link: "https://taskmanager.com"
    }
  })
  const emailTexual = mailgenerator.generatePlaintext(options.mailgenContent);
  const emailHTML = mailgenerator.generate(options.mailgenContent);

  const transport = nodemailer.createTransport({
    host: process.env.MAIL_SPTM_HOST,
    port: process.env.MAIL_SPTM_PORT,
    auth: {
      user: process.env.MAIL_SPTM_USER,
      pass: process.env.MAIL_SPTM_PASS
    }
  });

  const mail = {
    from: "mail.taskmager@example.com",
    to: options.email,
    subject: options.subject,
    text: emailTexual,
    html: emailHTML
  }

  try {
    await transport.sendMail(mail)
  } catch (err) {
    console.error("service failed:", err);
  }
};

const emailVerification = (username, verificationURL) => {
  return {
    body: {
      name: username,
      intro: "Welcome! We're excited to have you on board.",
      action: {
        instructions: "To verify your email address, please click the button below:",
        button: {
          color: "#1aae5a",
          text: "Verify Email",
          link: verificationURL,
        },
      },
      outro: "If you need help or have any questions, feel free to reply to this email.",
    },
  };
};

const resetPassword = (username, passResetURL) => {
  return {
    body: {
      name: username,
      intro: "We received a request to reset your password.",
      action: {
        instructions: "Click the button below to reset your password:",
        button: {
          color: "#1aae5a",
          text: "Reset Password",
          link: passResetURL,
        },
      },
      outro: "If you didn’t request a password reset, you can safely ignore this email.",
    },
  };
};

export { resetPassword, emailVerification, sendEmail }
