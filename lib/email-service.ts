/**
 * Email Service using ZeptoMail SMTP
 * Handles sending promotional emails to members
 */

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Email configuration interface
export interface EmailConfig {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    attachments?: Array<{
        filename: string;
        content: string; // base64
        encoding: string;
    }>;
}

// Email response interface
export interface EmailResponse {
    success: boolean;
    message: string;
    messageId?: string;
    error?: string;
}

// Create reusable transporter
let transporter: Transporter | null = null;

/**
 * Get or create email transporter
 */
function getTransporter(): Transporter {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.ZEPTOMAIL_SMTP_HOST || 'smtp.zeptomail.com',
            port: parseInt(process.env.ZEPTOMAIL_SMTP_PORT || '587', 10),
            secure: false, // Use TLS
            auth: {
                user: process.env.ZEPTOMAIL_SMTP_USER || 'emailapikey',
                pass: process.env.ZEPTOMAIL_SMTP_PASS || '',
            },
        });
    }
    return transporter;
}

/**
 * Send a single email
 */
export async function sendEmail(config: EmailConfig): Promise<EmailResponse> {
    try {
        const transport = getTransporter();

        // Convert plain text to HTML with line breaks
        const htmlContent = config.html.replace(/\n/g, '<br>');
        const wrappedHtml = `
            <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
                ${htmlContent}
            </div>
        `;

        const mailOptions = {
            from: `"${process.env.ZEPTOMAIL_FROM_NAME || 'Bangladesh Child Neurology Society'}" <${process.env.ZEPTOMAIL_FROM_EMAIL || 'office@bcns.org.bd'}>`,
            to: Array.isArray(config.to) ? config.to.join(', ') : config.to,
            subject: config.subject,
            html: wrappedHtml,
            text: config.text || config.html,
            attachments: config.attachments,
        };

        const info = await transport.sendMail(mailOptions);

        return {
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId,
        };
    } catch (error) {
        console.error('Email sending error:', error);
        return {
            success: false,
            message: 'Failed to send email',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Send bulk emails (one by one to avoid spam filters)
 */
export async function sendBulkEmails(
    recipients: string[],
    subject: string,
    html: string,
    attachments?: Array<{ filename: string; content: string; encoding: string }>
): Promise<{ total: number; sent: number; failed: number; errors: string[] }> {
    const results = {
        total: recipients.length,
        sent: 0,
        failed: 0,
        errors: [] as string[],
    };

    for (const recipient of recipients) {
        try {
            const emailConfig: EmailConfig = {
                to: recipient,
                subject,
                html,
            };

            if (attachments) {
                emailConfig.attachments = attachments;
            }

            const result = await sendEmail(emailConfig);

            if (result.success) {
                results.sent++;
            } else {
                results.failed++;
                results.errors.push(`${recipient}: ${result.error}`);
            }

            // Add small delay to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
            results.failed++;
            results.errors.push(
                `${recipient}: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    return results;
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate multiple email addresses
 */
export function validateEmails(emails: string[]): {
    valid: string[];
    invalid: string[];
} {
    const valid: string[] = [];
    const invalid: string[] = [];

    for (const email of emails) {
        if (isValidEmail(email.trim())) {
            valid.push(email.trim());
        } else {
            invalid.push(email.trim());
        }
    }

    return { valid, invalid };
}

/**
 * Test email connection
 */
export async function testEmailConnection(): Promise<boolean> {
    try {
        const transport = getTransporter();
        await transport.verify();
        return true;
    } catch (error) {
        console.error('Email connection test failed:', error);
        return false;
    }
}
