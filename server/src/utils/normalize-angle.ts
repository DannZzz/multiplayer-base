export const normalizeAngle = (angle: number): number => {
  const twoPi = Math.PI * 2
  return ((angle + Math.PI) % twoPi) - Math.PI
}
