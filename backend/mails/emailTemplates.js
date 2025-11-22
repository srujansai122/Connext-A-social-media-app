import { client, sender } from "./../config/mailtrap.js";

export function createWelcomeTemplate(userName, userProfileUrl) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Welcome to Connext</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f6f8;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #0077b5;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 30px;
          color: #333333;
        }
        .button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 24px;
          background-color: #0077b5;
          color: white;
          text-decoration: none;
          border-radius: 4px;
        }
        .section-title {
          font-size: 18px;
          margin-top: 30px;
          margin-bottom: 10px;
          color: #0077b5;
        }
        ul {
          padding-left: 20px;
        }
        li {
          margin-bottom: 10px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #888888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Connext, ${userName}!</h1>
        </div>
        <div class="content">
          <p>We're thrilled to have you join our professional community. Connext is your space to connect, grow, and thrive in your career.</p>
          <p>Start building your network and showcase your profile to the world.</p>
          <a href="${userProfileUrl}" class="button">View Your Profile</a>

          <div class="section-title">Getting Started</div>
          <ul>
            <li><strong>Complete Your Profile:</strong> Add your photo, bio, skills, and experience to stand out.</li>
            <li><strong>Connect with Friends & Colleagues:</strong> Search for people you know and expand your network.</li>
            <li><strong>Join Professional Groups:</strong> Find communities that match your interests and grow together.</li>
            <li><strong>Explore Job Opportunities:</strong> Browse curated listings and apply directly or through referrals.</li>
            <li><strong>Stay Active:</strong> Post updates, share insights, and engage with others to boost your visibility.</li>
          </ul>
        </div>
        <div class="footer">
          &copy; 2025 Connext. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

export function createCommentNotificationTemplate(
  recipientName,
  commentedName,
  commentContent,
  postUrl
) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>New Comment on Your Post</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f6f8;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #0077b5;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 30px;
          color: #333333;
        }
        .comment-box {
          background-color: #f0f2f5;
          padding: 15px;
          border-left: 4px solid #0077b5;
          margin-top: 20px;
          font-style: italic;
        }
        .button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 24px;
          background-color: #0077b5;
          color: white;
          text-decoration: none;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #888888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>You've Got a New Comment!</h1>
        </div>
        <div class="content">
          <p>Hi ${recipientName},</p>
          <p><strong>${commentedName}</strong> just commented on your post:</p>
          <div class="comment-box">
            "${commentContent}"
          </div>
          <p>Click below to view the full conversation and reply:</p>
          <a href="${postUrl}" class="button">View Post</a>
        </div>
        <div class="footer">
          &copy; 2025 Connext. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

export function createConnectionAcceptedTemplate(
  recipientName,
  acceptedByName,
  profileUrl
) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Connection Accepted</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f6f8;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #0077b5;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 30px;
          color: #333333;
        }
        .button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 24px;
          background-color: #0077b5;
          color: white;
          text-decoration: none;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #888888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Connection Request Was Accepted!</h1>
        </div>
        <div class="content">
          <p>Hi ${recipientName},</p>
          <p><strong>${acceptedByName}</strong> has accepted your connection request on Connext.</p>
          <p>Start engaging and explore their profile:</p>
          <a href="${profileUrl}" class="button">View Profile</a>
        </div>
        <div class="footer">
          &copy; 2025 Connext. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}
