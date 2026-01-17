/**
 * Email Composer Component
 * Rich text editor for composing promotional emails
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, FileText, Paperclip, X } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface EmailComposerProps {
    subject: string;
    htmlContent: string;
    onSubjectChange: (subject: string) => void;
    onContentChange: (content: string) => void;
    attachments: File[];
    onAttachmentsChange: (files: File[]) => void;
}

export function EmailComposer({
    subject,
    htmlContent,
    onSubjectChange,
    onContentChange,
    attachments,
    onAttachmentsChange,
}: EmailComposerProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            onAttachmentsChange([...attachments, ...newFiles]);
        }
    };

    const removeAttachment = (index: number) => {
        onAttachmentsChange(attachments.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Compose Email
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Subject */}
                <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium">
                        Subject *
                    </Label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            id="subject"
                            type="text"
                            placeholder="Enter email subject..."
                            value={subject}
                            onChange={(e) => onSubjectChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Email Content */}
                <div className="space-y-2">
                    <Label htmlFor="content" className="text-sm font-medium">
                        Email Message *
                    </Label>
                    <RichTextEditor
                        content={htmlContent}
                        onChange={onContentChange}
                        placeholder="Compose your email message... Use the toolbar to format text, add emojis, and more!"
                    />
                    <p className="text-xs text-gray-500">
                        💡 Tip: Use the formatting toolbar to style your message. Click the emoji icon to add emojis!
                    </p>
                </div>

                {/* Attachments */}
                <div className="space-y-2">
                    <Label htmlFor="attachments" className="text-sm font-medium">
                        Attachments (Optional)
                    </Label>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('file-upload')?.click()}
                            className="w-full"
                        >
                            <Paperclip className="h-4 w-4 mr-2" />
                            Add Attachments
                        </Button>
                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    {/* Attachment List */}
                    {attachments.length > 0 && (
                        <div className="space-y-2 mt-3">
                            <p className="text-xs font-medium text-gray-700">
                                {attachments.length} file(s) attached
                            </p>
                            <div className="space-y-2">
                                {attachments.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2"
                                    >
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <Paperclip className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium truncate">{file.name}</p>
                                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeAttachment(index)}
                                            className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                                            aria-label="Remove attachment"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>


            </CardContent>
        </Card>
    );
}
