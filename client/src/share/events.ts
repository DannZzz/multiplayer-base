import {
  MovementEventTemplateData,
  PlayerInputsTemplateData,
} from "./templates/template-data";

export type ServerToClientEvents = {
  movement: MovementEventTemplateData;
};

export type ClientToServerEvents = {
  pointer: [angle: number];
  inputs: PlayerInputsTemplateData;
};
