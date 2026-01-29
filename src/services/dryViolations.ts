/**
 * DRY VIOLATION – intentional: Duplicate validation logic
 * The same email validation logic is repeated in multiple places
 * This violates the DRY (Don't Repeat Yourself) principle
 */

/**
 * DRY VIOLATION – intentional: Duplicate email validation
 * This validation logic is duplicated in multiple files
 */
export function validateEmailFormat1(email: string): boolean {
  // DRY VIOLATION – intentional: Same logic repeated elsewhere
  if (!email) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * DRY VIOLATION – intentional: Same email validation logic duplicated
 */
export function validateEmailFormat2(email: string): boolean {
  // DRY VIOLATION – intentional: Duplicate of validateEmailFormat1
  if (!email) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * DRY VIOLATION – intentional: Same email validation logic duplicated again
 */
export function checkEmail(email: string): boolean {
  // DRY VIOLATION – intentional: Same validation logic repeated
  if (email === null || email === undefined || email === '') {
    return false;
  }
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/**
 * DRY VIOLATION – intentional: Duplicate business logic
 * Age validation is repeated in multiple places
 */
export function validateAge1(age: number): boolean {
  // DRY VIOLATION – intentional: Same logic in validateUserProfileUpdate middleware
  return age >= 0 && age <= 150;
}

/**
 * DRY VIOLATION – intentional: Same age validation duplicated
 */
export function validateAge2(age: number): boolean {
  // DRY VIOLATION – intentional: Duplicate of validateAge1
  if (age < 0) {
    return false;
  }
  if (age > 150) {
    return false;
  }
  return true;
}

/**
 * DRY VIOLATION – intentional: Duplicate password strength check
 */
export function checkPasswordStrength1(password: string): boolean {
  // DRY VIOLATION – intentional: Same logic in validatePassword middleware
  if (!password || password.length < 8) {
    return false;
  }
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  return hasNumber && hasLetter;
}

/**
 * DRY VIOLATION – intentional: Same password validation duplicated
 */
export function checkPasswordStrength2(password: string): boolean {
  // DRY VIOLATION – intentional: Duplicate of checkPasswordStrength1
  if (password.length < 8) {
    return false;
  }
  const hasDigit = /\d/.test(password);
  const hasAlpha = /[a-zA-Z]/.test(password);
  return hasDigit && hasAlpha;
}
