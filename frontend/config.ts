// Configuration values for the frontend application

// Mock user ID for development (will be replaced with actual user from Clerk auth)
// TODO: Replace with actual authenticated user from Clerk
export const MOCK_USER_ID = "user-1";

// Primary brand color from Nuture logo
export const BRAND_COLOR = "#00A859";

// Currency symbol
export const CURRENCY = "₦";

// Claim categories
export const CLAIM_CATEGORIES = [
  "Emergency Care",
  "Medication",
  "Doctor Visit",
  "Lab Tests",
  "Dental Care",
  "Mental Health",
  "Other",
] as const;

// Payment methods
export const PAYMENT_METHODS = [
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "USSD",
] as const;
