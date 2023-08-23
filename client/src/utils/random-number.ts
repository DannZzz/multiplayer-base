export function getRandomNumber(min: number, max: number) {
  // Make sure min is smaller than max
  if (min > max) {
    ;[min, max] = [max, min]
  }

  // Calculate the range and generate a random integer within the range
  const range = max - min + 1
  return Math.floor(Math.random() * range) + min
}
