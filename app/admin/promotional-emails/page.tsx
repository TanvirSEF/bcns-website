/**
 * Promotional Emails Page - Admin Dashboard
 */

'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { EmailComposer } from '@/components/admin/EmailComposer';
import { RecipientSelector } from '@/components/admin/RecipientSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { EmailRequest, EmailResponse } from '@/types/email';

export default function PromotionalEmailsPage() {
    const [subject, setSubject] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [recipients, setRecipients] = useState<string[]>([]);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [lastResult, setLastResult] = useState<EmailResponse | null>(null);

    // Helper function to convert File to base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                // Remove data:mime/type;base64, prefix
                const base64 = result.split(',')[1];
                if (!base64) {
                    reject(new Error('Failed to convert file to base64'));
                    return;
                }
                resolve(base64);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSendEmail = async () => {
        // Validation
        if (!subject.trim()) {
            toast.error('Please enter an email subject');
            return;
        }

        if (!htmlContent.trim()) {
            toast.error('Please enter email content');
            return;
        }

        if (recipients.length === 0) {
            toast.error('Please add at least one recipient');
            return;
        }

        // Confirm before sending
        const confirmed = window.confirm(
            `Are you sure you want to send this email to ${recipients.length} recipient(s)?`
        );

        if (!confirmed) return;

        setIsSending(true);
        setLastResult(null);

        try {
            // Convert attachments to base64
            const emailAttachments = await Promise.all(
                attachments.map(async (file) => ({
                    filename: file.name,
                    content: await fileToBase64(file),
                    contentType: file.type,
                }))
            );

            const payload: EmailRequest = {
                subject,
                htmlContent,
                recipients,
                recipientType: 'selected',
                ...(emailAttachments.length > 0 && { attachments: emailAttachments }),
            };

            const response = await fetch('/api/emails/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result: EmailResponse = await response.json();
            setLastResult(result);

            if (result.success) {
                toast.success(result.message || 'Emails sent successfully!');
                // Clear form on success
                setSubject('');
                setHtmlContent('');
                setRecipients([]);
                setAttachments([]);
            } else {
                toast.error(result.message || 'Failed to send emails');
            }
        } catch (error) {
            console.error('Email sending error:', error);
            toast.error('An error occurred while sending emails');
            setLastResult({
                success: false,
                message: 'Network error',
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            <PageHeader
                title="Promotional Emails"
                description="Send promotional emails to members using ZeptoMail"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Email Composer - Takes 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    <EmailComposer
                        subject={subject}
                        htmlContent={htmlContent}
                        onSubjectChange={setSubject}
                        onContentChange={setHtmlContent}
                        attachments={attachments}
                        onAttachmentsChange={setAttachments}
                    />

                    {/* Send Button */}
                    <Card>
                        <CardContent className="p-6">
                            <Button
                                onClick={handleSendEmail}
                                disabled={isSending || recipients.length === 0}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg"
                                size="lg"
                            >
                                {isSending ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                        <span>Sending...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Send className="h-5 w-5" />
                                        <span>Send Email to {recipients.length} Recipient(s)</span>
                                    </div>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Results */}
                    {lastResult && (
                        <Card className={lastResult.success ? 'border-green-500' : 'border-red-500'}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {lastResult.success ? (
                                        <>
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <span className="text-green-600">Success</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-5 w-5 text-red-600" />
                                            <span className="text-red-600">Failed</span>
                                        </>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm mb-2">{lastResult.message}</p>
                                {lastResult.sent !== undefined && (
                                    <div className="text-sm space-y-1">
                                        <p>✅ Sent: {lastResult.sent}</p>
                                        <p>❌ Failed: {lastResult.failed}</p>
                                        <p>📊 Total: {lastResult.total}</p>
                                    </div>
                                )}
                                {lastResult.errors && lastResult.errors.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm font-semibold mb-2">Errors:</p>
                                        <ul className="text-xs space-y-1 max-h-40 overflow-y-auto">
                                            {lastResult.errors.map((error, idx) => (
                                                <li key={idx} className="text-red-600">
                                                    {error}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Recipient Selector - Takes 1 column */}
                <div className="lg:col-span-1">
                    <RecipientSelector
                        recipients={recipients}
                        onRecipientsChange={setRecipients}
                    />
                </div>
            </div>
        </div>
    );
}
