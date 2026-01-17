/**
 * Email-related TypeScript interfaces
 */

// Email request payload
export interface EmailRequest {
    subject: string;
    htmlContent: string;
    recipients: string[];
    recipientType: 'all' | 'selected';
    attachments?: EmailAttachment[];
}

// Email attachment
export interface EmailAttachment {
    filename: string;
    content: string; // base64 encoded
    contentType: string;
}

// Email recipient
export interface EmailRecipient {
    email: string;
    name?: string;
    id?: string;
}

// Email response
export interface EmailResponse {
    success: boolean;
    message: string;
    sent?: number;
    failed?: number;
    total?: number;
    errors?: string[];
}

// Email template (for future use)
export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    htmlContent: string;
    category?: string;
}
