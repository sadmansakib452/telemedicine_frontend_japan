/**
 * Broadcast Types
 * 
 * Type definitions for broadcast-related data structures.
 */

import { BroadcastStatus } from '@/config/constants';
import { User } from './user.types';

/**
 * Broadcast
 */
export interface Broadcast {
  id: string;
  patient_id: string;
  message: string | null;
  status: BroadcastStatus;
  assisted_by: string | null;
  conversation_id: string | null;
  created_at: string;
  updated_at: string;
  patient: User;
}

/**
 * Broadcast List Item
 */
export interface BroadcastListItem {
  id: string;
  patient_id: string;
  message: string | null;
  status: BroadcastStatus;
  assisted_by: string | null;
  conversation_id: string | null;
  created_at: string;
  updated_at: string;
  patient: User;
}

/**
 * Create Broadcast Request
 */
export interface CreateBroadcastRequest {
  message: string;
  // patient_id is extracted from JWT token
}

/**
 * Broadcast Response
 */
export interface BroadcastResponse {
  success: boolean;
  data: Broadcast;
  message?: string;
}

/**
 * Broadcast List Response
 */
export interface BroadcastListResponse {
  success: boolean;
  data: BroadcastListItem[];
  count?: number;
}

/**
 * Broadcast Inbox Response (Doctors Only)
 * Returns only broadcasts with status 'open'
 */
export interface BroadcastInboxResponse {
  success: boolean;
  data: BroadcastListItem[]; // Only 'open' status broadcasts
  count?: number;
}

