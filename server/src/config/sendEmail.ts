import { Resend } from "resend";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Provider-agnostic email sender.
//
// Preferred path: standard SMTP via nodemailer — works with Postmark, SMTP2GO,
// SES, SendGrid, Brevo, or any other provider. Switching providers is a .env
// change only:
//
// Fallback: if SMTP_* is not configured, or an SMTP send fails, the Resend
// integration (RESEND_API_KEY) sends the email instead.
//
// NOTE: whichever provider you use, the sending domain must be verified there
// (SPF + DKIM DNS records) or customer inboxes will reject the mail.

interface Attachment {
    filename: string;
    content: Buffer | string;
}

interface Type {
    sendTo: string;
    subject: string;
    html: any;
    attachments?: Attachment[];
}

const FROM = process.env.EMAIL_FROM || "Health U Australia <hello@bestiee.com>";
// Each provider can only send from domains verified with it, so Resend gets
// its own sender address.
const RESEND_FROM = process.env.RESEND_FROM || FROM;
const useSmtp = Boolean(process.env.SMTP_HOST);

// Reuse a single pooled SMTP connection across sends.
const transporter = useSmtp
    ? nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465, // 465 = implicit TLS
          auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
          },
          pool: true,
      })
    : null;

// Resend is both the provider when SMTP isn't configured and the backup when
// an SMTP send fails (e.g. the SMTP account is suspended or deactivated).
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

if (!useSmtp && !resend) {
    console.warn("Email: neither SMTP_HOST nor RESEND_API_KEY configured — emails will fail.");
}

const sendViaResend = async ({ sendTo, subject, html, attachments }: Type) => {
    const { data, error } = await resend!.emails.send({
        from: RESEND_FROM,
        to: sendTo,
        subject,
        html,
        ...(attachments && attachments.length > 0 ? { attachments } : {}),
    });
    if (error) {
        // Surface the failure instead of swallowing it — callers already
        // handle rejections (.catch / try-catch).
        throw new Error(error.message || "Resend send failed");
    }
    return data;
};

export const sendEmail = async ({ sendTo, subject, html, attachments }: Type) => {
    try {
        if (transporter) {
            try {
                const info = await transporter.sendMail({
                    from: FROM,
                    to: sendTo,
                    subject,
                    html,
                    attachments: attachments?.map((a) => ({
                        filename: a.filename,
                        content: a.content,
                    })),
                });
                return info;
            } catch (smtpError: any) {
                if (!resend) throw smtpError;
                console.warn(`Email: SMTP send failed (${smtpError.message}) — retrying with Resend.`);
            }
        }

        if (resend) return await sendViaResend({ sendTo, subject, html, attachments });

        throw new Error("No email provider configured (set SMTP_* or RESEND_API_KEY)");
    } catch (error: any) {
        console.error(`Email send failed (to: ${sendTo}, subject: ${subject}):`, error.message);
        throw error;
    }
};