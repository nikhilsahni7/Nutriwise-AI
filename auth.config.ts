import GoogleProvider from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { type NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: process.env.EMAIL_FROM!,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const { host } = new URL(url);
        try {
          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${provider.apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: provider.from,
              to: identifier,
              subject: `Verify your email for Brevit`,
              html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verify your email for Brevit</title>
                  </head>
                  <body style="margin: 0; padding: 0; background-color: #f9fafb;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; padding: 45px 15px;">
                      <tr>
                        <td align="center" style="padding: 0 0 30px;">
                          <img src="https://asset.cloudinary.com/dwkdf5cqv/35ea6392795ecbdf527700f3224aa611" alt="Brevit" width="120" style="display: block; margin: 0 auto;">
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td align="center" style="padding-bottom: 30px;">
                                <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: bold; color: #111827;">
                                  Verify your email
                                </h1>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 30px;">
                                <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; color: #6b7280; text-align: center;">
                                  Click the button below to verify your email address and complete your registration for Brevit.
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="padding-bottom: 30px;">
                                <a href="${url}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; text-decoration: none; padding: 12px 45px; border-radius: 6px;">
                                  Verify Email
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 30px;">
                                <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #6b7280; text-align: center;">
                                  If you didn't request this verification, you can safely ignore this email.
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #9ca3af; text-align: center;">
                                  Button not working? Copy and paste this URL into your browser:<br>
                                  <a href="${url}" style="color: #2563eb; text-decoration: underline;">${url}</a>
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 30px 0;">
                          <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #6b7280; text-align: center;">
                            © ${new Date().getFullYear()} Brevit. All rights reserved.<br>
                            ${host}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>
              `,
              text: `Verify your email for Nutriwise\n${url}\n\n`,
            }),
          });
          if (!response.ok) {
            throw new Error("Failed to send verification email");
          }
        } catch (error) {
          console.error("Error sending verification email:", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
