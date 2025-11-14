/**
 * User Utility Functions
 * 
 * Utility functions for user-related operations.
 */

/**
 * Get user type label for display
 * 
 * Converts user type to a human-readable label.
 * Handles both frontend constants ('shop_keeper') and backend values ('shop_owner').
 * 
 * @param userType - User type (patient, doctor, shop_owner, shop_keeper, admin)
 * @returns Human-readable label (Patient, Doctor, Shop Owner, Admin, User)
 */
export const getUserTypeLabel = (userType: string | undefined): string => {
  if (!userType) {
    return "User"; // Fallback (should not occur now, but kept for safety)
  }
  
  switch (userType) {
    case "patient":
      return "Patient";
    case "doctor":
      return "Doctor";
    case "shop_owner": // Backend returns "shop_owner"
    case "shop_keeper": // Frontend constant
      return "Shop Owner";
    case "admin":
      return "Admin";
    default:
      return "User";
  }
};

