export function wrapAngle(angle: number): number {
  angle %= 360;
  if (angle > 180) {
    angle -= 360;
  } else if (angle < -180) {
    angle += 360;
  }
  return angle;
}