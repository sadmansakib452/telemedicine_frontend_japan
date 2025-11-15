"use client";
import type React from "react";
import { useEffect, useRef } from "react";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if click is inside dropdown container (including nested elements)
      const isInsideDropdown = dropdownRef.current?.contains(target as Node);
      
      // Check if click is on toggle button
      const isToggleButton = target.closest('.dropdown-toggle');
      
      // Check if click is on any interactive element inside dropdown
      const clickedElement = target.closest('button, a, [role="button"]');
      const isDropdownItem = clickedElement && dropdownRef.current?.contains(clickedElement as Node);

      // Don't close if click is inside dropdown, on toggle button, or on dropdown item
      if (isInsideDropdown || isToggleButton || isDropdownItem) {
        return;
      }

      // Click is outside - close dropdown
      if (dropdownRef.current) {
        onClose();
      }
    };

    // Use click event with bubble phase (default)
    // This allows dropdown item click handlers to execute first
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose]);


  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-40  right-0 mt-2  rounded-xl border border-gray-200 bg-white  shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark ${className}`}
    >
      {children}
    </div>
  );
};
