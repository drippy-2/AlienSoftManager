// Predefined measurement units for products
export const MEASUREMENT_UNITS = [
  { value: 'units', label: 'Units' },
  { value: 'trays', label: 'Trays' },
  { value: 'pieces', label: 'Pieces' },
  { value: 'pcs', label: 'Pcs' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'liters', label: 'Liters' },
  { value: 'L', label: 'Liters (L)' },
  { value: 'packs', label: 'Packs' },
  { value: 'bottles', label: 'Bottles' }
]

// Format stock with unit
export const formatStockWithUnit = (stock, unit = 'units') => {
  if (!stock && stock !== 0) return `0 ${unit}`
  return `${stock} ${unit}`
}
