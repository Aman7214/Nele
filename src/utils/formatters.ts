/**
 * Formats a number in standard Indian currency representation.
 * e.g., 1850000 -> ₹18,50,000
 * Or compact: 1850000 -> ₹18.5 L, 12000000 -> ₹1.2 Cr, 4500 -> ₹4,500
 */
export function formatIndianPrice(amount: number, isMonthlyRent = false, compact = false): string {
  if (amount == null || isNaN(amount)) return '₹0';

  if (compact) {
    if (amount >= 10000000) {
      const cr = (amount / 10000000).toFixed(1).replace(/\.0$/, '');
      return `₹${cr} Cr${isMonthlyRent ? '/mo' : ''}`;
    }
    if (amount >= 100000) {
      const l = (amount / 100000).toFixed(1).replace(/\.0$/, '');
      return `₹${l} L${isMonthlyRent ? '/mo' : ''}`;
    }
    if (amount >= 1000) {
      const k = (amount / 1000).toFixed(1).replace(/\.0$/, '');
      return `₹${k} k${isMonthlyRent ? '/mo' : ''}`;
    }
  }

  // Standard Indian comma separator: 12,34,567
  const str = Math.round(amount).toString();
  let result = '';
  const lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== '') {
    result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  } else {
    result = lastThree;
  }

  return `₹${result}${isMonthlyRent ? ' / month' : ''}`;
}

export function formatTimeAgo(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 30) {
      return `${Math.floor(diffDays / 30)} months ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays > 1) return `${diffDays} days ago`;
    if (diffHours === 1) return '1 hour ago';
    if (diffHours > 1) return `${diffHours} hours ago`;
    if (diffMins > 0) return `${diffMins} min ago`;
    return 'Just now';
  } catch {
    return 'Recently';
  }
}

export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 10) return '+91 98••••••21';
  const last10 = cleaned.slice(-10);
  return `+91 ${last10.slice(0, 2)}••••••${last10.slice(-2)}`;
}
