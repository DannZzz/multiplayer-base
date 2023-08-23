import { Template } from "@aeolz/core/lib/objects/Template";

import {
  MovementEventTemplateData,
  PlayerInputsTemplateData,
} from "./template-data";

export const MovementEventTemplate = new Template<MovementEventTemplateData>(
  ["id", "position().x", "position().y", "angle()"],
  { default: null }
);

export const PlayerInputsTemplate = new Template<PlayerInputsTemplateData>(
  ["up", "down", "right", "left", "clicking"],
  { default: 0 }
);
