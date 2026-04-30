export function useCurrency() {
  function formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined) return '—'
    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  }

  function formatMillions(value: number | null | undefined): string {
    if (value === null || value === undefined) return '—'
    return '$' + (value / 1_000_000).toFixed(1) + 'M'
  }

  return { formatCurrency, formatMillions }
}
