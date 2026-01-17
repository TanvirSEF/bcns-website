/**
 * Recipient Selector Component
 * Allows selecting email recipients
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Users, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RecipientSelectorProps {
    recipients: string[];
    onRecipientsChange: (recipients: string[]) => void;
}

export function RecipientSelector({
    recipients,
    onRecipientsChange,
}: RecipientSelectorProps) {
    const [emailInput, setEmailInput] = useState('');

    const handleAddEmails = () => {
        if (!emailInput.trim()) return;

        // Split by comma, newline, or semicolon
        const newEmails = emailInput
            .split(/[,;\n]/)
            .map((email) => email.trim())
            .filter((email) => email.length > 0)
            .filter((email) => !recipients.includes(email)); // Avoid duplicates

        if (newEmails.length > 0) {
            onRecipientsChange([...recipients, ...newEmails]);
            setEmailInput('');
        }
    };

    const handleRemoveEmail = (emailToRemove: string) => {
        onRecipientsChange(recipients.filter((email) => email !== emailToRemove));
    };

    const handleClearAll = () => {
        onRecipientsChange([]);
    };

    return (
        <Card className="sticky top-6">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Recipients
                    </div>
                    <Badge variant="secondary" className="text-sm">
                        {recipients.length}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                    <Label htmlFor="email-input" className="text-sm font-medium">
                        Add Email Addresses
                    </Label>
                    <Textarea
                        id="email-input"
                        placeholder="Enter email addresses (separated by comma, semicolon, or new line)&#10;&#10;Example:&#10;user1@example.com&#10;user2@example.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        rows={4}
                        className="text-sm"
                    />
                    <Button
                        onClick={handleAddEmails}
                        disabled={!emailInput.trim()}
                        className="w-full"
                        size="sm"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Recipients
                    </Button>
                </div>

                {/* Recipients List */}
                {recipients.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Selected Recipients</Label>
                            <Button
                                onClick={handleClearAll}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 h-auto p-1"
                            >
                                Clear All
                            </Button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto space-y-2 border rounded-lg p-3 bg-gray-50">
                            {recipients.map((email, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-white border rounded px-3 py-2 text-sm"
                                >
                                    <span className="truncate flex-1">{email}</span>
                                    <button
                                        onClick={() => handleRemoveEmail(email)}
                                        className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                                        aria-label="Remove"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {recipients.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                        No recipients added yet
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
