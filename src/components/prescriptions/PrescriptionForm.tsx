/**
 * Prescription Form Component
 * 
 * Form for creating prescriptions (inside modal).
 * Used by doctors in patient_doctor conversations.
 */

'use client';

import { useState, FormEvent } from 'react';
import TextArea from '@/components/form/input/TextArea';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { validatePrescriptionForm } from '@/utils/validators';
import { getErrorMessage, getFieldErrors } from '@/utils/error-handler';
import type { PrescriptionFormData } from '@/types/prescription.types';

type PrescriptionFormProps = {
  patientName: string;
  onSubmit: (data: PrescriptionFormData) => Promise<void>;
  isLoading?: boolean;
  error?: Error | null;
  onCancel?: () => void;
};

export default function PrescriptionForm({
  patientName,
  onSubmit,
  isLoading = false,
  error = null,
  onCancel,
}: PrescriptionFormProps) {
  const [formData, setFormData] = useState<PrescriptionFormData>({
    medicine_details: '',
    patient_name: patientName,
    message: 'Prescription',
  });
  const [validationErrors, setValidationErrors] = useState<{
    medicine_details?: string;
    patient_name?: string;
    message?: string;
  }>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate form
    const validation = validatePrescriptionForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors || {});
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      // Error is handled by parent component
      const fieldErrors = getFieldErrors(err);
      if (fieldErrors) {
        setValidationErrors({
          medicine_details: fieldErrors.medicine_details?.[0],
          patient_name: fieldErrors.patient_name?.[0],
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

      {/* Patient Name */}
      <div>
        <Label>
          Patient Name <span className="text-error-500">*</span>
        </Label>
        <Input
          type="text"
          placeholder="Enter patient name"
          value={formData.patient_name}
          onChange={(e) => {
            setFormData({ ...formData, patient_name: e.target.value });
            if (validationErrors.patient_name) {
              setValidationErrors({
                ...validationErrors,
                patient_name: undefined,
              });
            }
          }}
          disabled={isLoading}
          error={!!validationErrors.patient_name}
        />
        {validationErrors.patient_name && (
          <p className="mt-1 text-xs text-error-500">
            {validationErrors.patient_name}
          </p>
        )}
      </div>

      {/* Medicine Details */}
      <div>
        <Label>
          Medicine Details <span className="text-error-500">*</span>
        </Label>
        <TextArea
          placeholder="Enter medicine details (e.g., Paracetamol 500mg - 2 tablets, 3 times daily for 5 days. Take after meals.)"
          value={formData.medicine_details}
          onChange={(value) => {
            setFormData({ ...formData, medicine_details: value });
            if (validationErrors.medicine_details) {
              setValidationErrors({
                ...validationErrors,
                medicine_details: undefined,
              });
            }
          }}
          disabled={isLoading}
          rows={6}
          error={!!validationErrors.medicine_details}
        />
        {validationErrors.medicine_details && (
          <p className="mt-1 text-xs text-error-500">
            {validationErrors.medicine_details}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Medicine details must be between 5 and 5000 characters.
        </p>
      </div>

      {/* Optional Message */}
      <div>
        <Label>Optional Message</Label>
        <Input
          type="text"
          placeholder="Prescription"
          value={formData.message || 'Prescription'}
          onChange={(e) => {
            setFormData({ ...formData, message: e.target.value });
            if (validationErrors.message) {
              setValidationErrors({
                ...validationErrors,
                message: undefined,
              });
            }
          }}
          disabled={isLoading}
          error={!!validationErrors.message}
        />
        {validationErrors.message && (
          <p className="mt-1 text-xs text-error-500">
            {validationErrors.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            size="sm"
            disabled={isLoading}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          >
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" disabled={isLoading || !formData.medicine_details.trim()}>
          {isLoading ? 'Sending...' : 'Send Prescription'}
        </Button>
      </div>
    </form>
  );
}

