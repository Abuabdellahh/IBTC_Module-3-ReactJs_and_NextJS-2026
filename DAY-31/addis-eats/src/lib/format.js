/** Format a Birr amount for display: 1234.5 -> "1,234.50 ETB". */
export function formatEtb(amount) {
  return `${amount.toLocaleString('en-ET', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ETB`
}
