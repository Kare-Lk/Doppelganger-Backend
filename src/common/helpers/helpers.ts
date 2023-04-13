export const formatPriceToNumber = (price: string): number => {
  return Number(price.replace(/[^\d]/g, ''))
}
