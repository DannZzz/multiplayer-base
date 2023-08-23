import { wrapAngle } from "./wrap-angle"

export function getNearestAngle(
  currentAngle: number,
  targetAngle: number,
  step: number
): number {
  currentAngle %= 360
  targetAngle %= 360

  const clockwiseDiff = (targetAngle - currentAngle + 360) % 360
  const counterclockwiseDiff = (currentAngle - targetAngle + 360) % 360

  if (clockwiseDiff < counterclockwiseDiff) {
    // Rotate clockwise
    const newAngle = currentAngle + Math.min(step, clockwiseDiff)
    return wrapAngle(newAngle)
  } else {
    // Rotate counterclockwise //
    const newAngle = currentAngle - Math.min(step, counterclockwiseDiff)
    return wrapAngle(newAngle)
  }
}
