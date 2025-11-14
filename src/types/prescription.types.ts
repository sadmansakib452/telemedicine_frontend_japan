/**
 * Prescription Types
 * 
 * Type definitions for prescription-related data structures.
 */

import { Message } from './message.types';
import { User } from './user.types';

/**
 * Prescription
 * Prescription is a type of message with message_type === 'prescription'
 */
export interface Prescription extends Message {
  message_type: 'prescription';
  medicine_details: string; // Required for prescriptions
  patient_name: string; // Required for prescriptions
}

/**
 * Prescription List Item (Shop Owner)
 */
export interface PrescriptionListItem {
  id: string;
  message: string | null;
  message_type: 'prescription';
  medicine_details: string;
  patient_name: string;
  sender_id: string;
  receiver_id: string;
  conversation_id: string;
  status: string;
  created_at: string;
  updated_at?: string;
  sender: User;
  receiver?: User;
  conversation?: {
    id: string;
    type: string;
    status: string;
    creator_id?: string;
    participant_id?: string;
  };
}

/**
 * Prescription Response
 */
export interface PrescriptionResponse {
  success: boolean;
  data: Prescription;
  message?: string;
}

/**
 * Prescription List Response (Shop Owner)
 */
export interface PrescriptionListResponse {
  success: boolean;
  data: PrescriptionListItem[];
  count?: number;
  cursor?: string;
  limit?: number;
}

/**
 * Prescription Pagination Parameters (Shop Owner)
 */
export interface PrescriptionPaginationParams {
  limit?: number; // Default: 20
  cursor?: string; // Prescription ID
}

/**
 * Prescription Form Data
 */
export interface PrescriptionFormData {
  medicine_details: string;
  patient_name: string;
  message?: string; // Optional, defaults to 'Prescription'
}

