/**
 * Utility helper functions for the Unwind application.
 */

/**
 * Format date string into a localized clean display representation.
 * @param {string|Date} dateVal - Date value to convert.
 * @returns {string} Formatted date.
 */
export const formatDate = (dateVal) => {
  if (!dateVal) return '';
  const dateObj = new Date(dateVal);
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Capitalize first letter of a string.
 * @param {string} text - Input text.
 * @returns {string} Capitalized text.
 */
export const capitalize = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};
