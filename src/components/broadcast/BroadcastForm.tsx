/**
 * Broadcast Form Component
 * 
 * Form for creating a new broadcast (patients only).
 * Allows patients to send messages to all verified doctors.
 */

'use client';

import { useState, FormEvent } from 'react';
import TextArea from '@/components/form/input/TextArea';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { validateBroadcastForm } from '@/utils/validators';
import { getErrorMessage, getFieldErrors } from '@/utils/error-handler';
import type { CreateBroadcastRequest } from '@/types/broadcast.types';

type BroadcastFormProps = {
  onSubmit: (data: CreateBroadcastRequest) => Promise<void>;
  isLoading?: boolean;
  error?: Error | null;
  onSuccess?: () => void;
};

export default function BroadcastForm({
  onSubmit,
  isLoading = false,
  error = null,
  onSuccess,
}: BroadcastFormProps) {
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    message?: string;
  }>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate form
    const validation = validateBroadcastForm({ message });
    if (!validation.isValid) {
      setValidationErrors(validation.errors || {});
      return;
    }

    try {
      await onSubmit({ message });
      setMessage('');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Error is handled by parent component
      const fieldErrors = getFieldErrors(err);
      if (fieldErrors) {
        setValidationErrors({
          message: fieldErrors.message?.[0],
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {getErrorMessage(error)}
        </div>
      )}

      {/* Message input */}
      <div>
        <Label>
          Message <span className="text-error-500">*</span>
        </Label>
        <TextArea
          placeholder="Describe your symptoms or medical concerns..."
          value={message}
          onChange={(value) => {
            setMessage(value);
            if (validationErrors.message) {
              setValidationErrors({ ...validationErrors, message: undefined });
            }
          }}
          disabled={isLoading}
          rows={6}
          error={!!validationErrors.message}
        />
        {validationErrors.message && (
          <p className="mt-1 text-xs text-error-500">
            {validationErrors.message}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Your message will be broadcast to all verified doctors. They can
          respond to help you.
        </p>
      </div>

      {/* Submit button */}
      <div>
        <Button type="submit" size="sm" disabled={isLoading || !message.trim()}>
          {isLoading ? 'Sending...' : 'Send Broadcast'}
        </Button>
      </div>
    </form>
  );
}

