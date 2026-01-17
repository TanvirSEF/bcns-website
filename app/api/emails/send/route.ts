/**
 * API Route: Send Promotional Emails
 * POST /api/emails/send
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendBulkEmails, validateEmails } from '@/lib/email-service';
import type { EmailRequest, EmailResponse } from '@/types/email';

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body: EmailRequest = await request.json();
        const { subject, htmlContent, recipients, attachments } = body;

        // Validate input
        if (!subject || !htmlContent || !recipients || recipients.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Missing required fields: subject, htmlContent, or recipients',
                } as EmailResponse,
                { status: 400 }
            );
        }

        // Validate email addresses
        const { valid, invalid } = validateEmails(recipients);

        if (valid.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No valid email addresses provided',
                    errors: invalid.map((email) => `Invalid email: ${email}`),
                } as EmailResponse,
                { status: 400 }
            );
        }

        // Convert attachments to nodemailer format
        const nodemailerAttachments = attachments?.map((att) => ({
            filename: att.filename,
            content: att.content,
            encoding: 'base64' as const,
        }));

        // Send emails
        const results = await sendBulkEmails(valid, subject, htmlContent, nodemailerAttachments);

        // Return response
        return NextResponse.json(
            {
                success: results.sent > 0,
                message:
                    results.sent === results.total
                        ? 'All emails sent successfully'
                        : `Sent ${results.sent} out of ${results.total} emails`,
                sent: results.sent,
                failed: results.failed,
                total: results.total,
                errors: results.errors,
            } as EmailResponse,
            { status: 200 }
        );
    } catch (error) {
        console.error('Email API error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
                errors: [error instanceof Error ? error.message : 'Unknown error'],
            } as EmailResponse,
            { status: 500 }
        );
    }
}
