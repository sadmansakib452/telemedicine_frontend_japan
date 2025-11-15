"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import type { PrescriptionListItem as PrescriptionListItemType } from "@/types/prescription.types";

type PrescriptionListItemProps = {
  prescription: PrescriptionListItemType;
  onClick: () => void;
};

export default function PrescriptionListItem({
  prescription,
  onClick,
}: PrescriptionListItemProps) {
  const {
    sender,
    patient_name,
    medicine_details,
    created_at,
  } = prescription;

  // Get doctor name and avatar
  const doctorName = sender?.name || "Unknown Doctor";
  const doctorAvatar =
    sender?.avatar_url || sender?.avatar || "/images/user/user-01.jpg";

  // Format medicine details preview (first 100 characters)
  const medicinePreview =
    medicine_details.length > 100
      ? `${medicine_details.substring(0, 100)}...`
      : medicine_details;

  // Format time ago
  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true });

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-theme-sm transition hover:border-brand-200 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-start gap-4">
        {/* Doctor Avatar */}
        <div className="relative inline-flex h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src={doctorAvatar}
            alt={doctorName}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Prescription Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white/90">
                {doctorName}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Prescription for {patient_name} • {timeAgo}
              </p>
            </div>
          </div>

          {/* Medicine Details Preview */}
          <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Medicine Details:
            </p>
            <p className="mt-1 text-sm leading-5 text-gray-700 dark:text-gray-300">
              {medicinePreview}
            </p>
          </div>

          {/* Click Indicator */}
          <p className="mt-3 text-xs text-brand-500 dark:text-brand-400">
            Click to view full prescription and chat with doctor →
          </p>
        </div>
      </div>
    </button>
  );
}

