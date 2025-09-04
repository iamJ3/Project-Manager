import Mailgen from "mailgen";
import nodemailer from 'nodemailer'

const sendEmail = async(options)={
} 

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

export {resetPassword,emailVerification}
