// KES conversion utility
const CURRENT_RATE = 129.60 // 1 USD = 129.60 KES

// Format number with commas for readability
const formatNumberWithCommas = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const formatPriceKES = (priceUSD) => {
  if (!priceUSD) return 'KES 0.00'
  const kesAmount = (priceUSD * CURRENT_RATE).toFixed(2)
  const [wholePart, decimalPart] = kesAmount.split('.')
  return 'KES ' + formatNumberWithCommas(wholePart) + '.' + decimalPart
}

export const getCurrentRate = () => CURRENT_RATE
