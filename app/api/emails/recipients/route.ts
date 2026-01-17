/**
 * API Route: Get Email Recipients
 * GET /api/emails/recipients
 */

import { NextResponse } from 'next/server';
import type { EmailRecipient } from '@/types/email';

export async function GET() {
    try {
        // In a real application, you would fetch this from your database
        // For now, we'll return a placeholder response

        // You can integrate with your existing members API
        // const response = await fetch(`${process.env.BACKEND_API_URL}/api/users`);
        // const users = await response.json();

        const recipients: EmailRecipient[] = [
            {
                id: '1',
                email: 'office@bcns.org.bd',
                name: 'BCNS Office',
            },
            // Add more recipients from your database
        ];

        return NextResponse.json(
            {
                success: true,
                recipients,
                total: recipients.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Recipients API error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch recipients',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
