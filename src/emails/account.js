// const mailerSend= require("mailersend")
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";



const mailerSend = new MailerSend({ apiKey: process.env.MAILERSEND_API_KEY });

const sender = new Sender(process.env.SENDER_EMAIL, "Saim");

export const sendWelcome = async function (name, email) {
  const recipients = [new Recipient(email, "")];

  const emailParams = new EmailParams()
    .setFrom(sender)
    .setTo(recipients)
    .setReplyTo(sender)
    .setSubject("Thanks for joining in!")
    // .setHtml("<strong>How ar you?</strong>")
    .setText(
      `Welcome to the app, ${name}. Let me know how you get along with the app.`
    );

  await mailerSend.email.send(emailParams);
};

export const sendCancellation = async function (name, email) {
  const recipients = [new Recipient(email, "")];

  const emailParams = new EmailParams()
    .setFrom(sender)
    .setTo(recipients)
    .setReplyTo(sender)
    .setSubject("Service Cancellation Confirmation")
    // .setHtml("<strong>How ar you?</strong>")
    .setText(
      `${name}, your subscription has been successfully cancelled.`
    );

  await mailerSend.email.send(emailParams);
};

