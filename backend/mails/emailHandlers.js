import { client, sender } from "./../config/mailtrap.js";
import {
  createWelcomeTemplate,
  createCommentNotificationTemplate,
  createConnectionAcceptedTemplate,
} from "./emailTemplates.js";
export async function sendWelcomeEmail(userEmail, userName, userProfileUrl) {
  const recepient = [{ email: userEmail }];
  try {
    const resposne = await client.send({
      from: sender,
      to: recepient,
      subject: "Welcome To Connext",
      html: createWelcomeTemplate(userName, userProfileUrl),
      category: "welcome",
    });

    console.log("Welcome Email Send SucessFully");
  } catch (error) {
    throw error;
  }
}

export const SendCommentNotificationEmail = async (
  recepientEmail,
  recepientName,
  commentedName,
  content,
  postUrl
) => {
  const recepient = [{ email: recepientEmail }];
  try {
    const response = await client.send({
      from: sender,
      to: recepient,
      subject: `${commentedName} commented on your post`,
      html: createCommentNotificationTemplate(
        recepientName,
        commentedName,
        content,
        postUrl
      ),
      category: "comment",
    });

    console.log("Comment Notification Email Sent Successfully");
  } catch (error) {
    console.error("Error sending comment notification email:", error);
  }
};

export const SendConnectionAcceptedEmail = async (
  recipientEmail,
  recipientName,
  acceptedByName,
  profileUrl
) => {
  const recipient = [{ email: recipientEmail }];
  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: `${acceptedByName} accepted your connection request`,
      html: createConnectionAcceptedTemplate(
        recipientName,
        acceptedByName,
        profileUrl
      ),
      category: "connectionAccepted",
    });

    console.log("Connection Accepted Email Sent Successfully");
  } catch (error) {
    console.error("Error sending connection accepted email:", error);
  }
};
