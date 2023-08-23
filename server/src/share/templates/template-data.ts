import { NB } from "../share.type";

export type MovementEventTemplateData = [
  playerId: string,
  x: number,
  y: number,
  angle: number
];

export type PlayerInputsTemplateData = [
  up: NB,
  down: NB,
  right: NB,
  left: NB,
  clicking: NB
];
