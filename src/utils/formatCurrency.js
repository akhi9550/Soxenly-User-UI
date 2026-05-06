/**
 * Formats a number into a premium currency string (INR).
 * @param {number} amount - The amount to format.
 * @param {boolean} showDecimals - Whether to show decimal points.
 * @returns {string} - The formatted currency string.
 */
export const formatCurrency = (amount, showDecimals = true) => {
  const num = Number(amount);
  if (isNaN(num)) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(num);
};
