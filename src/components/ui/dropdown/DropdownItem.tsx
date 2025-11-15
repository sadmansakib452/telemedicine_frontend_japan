import type React from "react";
import Link from "next/link";

interface DropdownItemProps {
  tag?: "a" | "button";
  href?: string;
  onClick?: () => void;
  onItemClick?: () => void;
  baseClassName?: string;
  className?: string;
  children: React.ReactNode;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  tag = "button",
  href,
  onClick,
  onItemClick,
  baseClassName = "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900",
  className = "",
  children,
}) => {
  const combinedClasses = `${baseClassName} ${className}`.trim();

  const handleClick = (event: React.MouseEvent) => {
    // Stop event propagation to prevent click-outside handlers from firing
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    
    // Prevent default for buttons (but not for links - we want navigation to work)
    if (tag === "button" && !href) {
      event.preventDefault();
    }
    
    // Execute onClick handler first (for navigation/logout)
    if (onClick) {
      onClick();
    }
    
    // Then execute onItemClick handler (for closing dropdown, etc.)
    if (onItemClick) {
      onItemClick();
    }
  };
  
  // Handle mousedown to prevent immediate closing
  const handleMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  if (tag === "a" && href) {
    return (
      <Link href={href} className={combinedClasses} onClick={handleClick} onMouseDown={handleMouseDown}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={handleClick} onMouseDown={handleMouseDown} className={combinedClasses}>
      {children}
    </button>
  );
};
