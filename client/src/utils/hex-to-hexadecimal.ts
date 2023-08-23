export function hexToHexadecimal(hexColor: string): number {
  const hexValue = hexColor.substring(1)
  const decimalValue = parseInt(hexValue, 16)
  return decimalValue
}
