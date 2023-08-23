import { Signal } from "@aeolz/core/lib/objects/Signal"
import { Vector2d, GameKitSignalMiddlewares, Size } from "@aeolz/gamekit"

export const VectorSignal = (val: Vector2d = Vector2d()) =>
  Signal(val).middleware(GameKitSignalMiddlewares.vector2dFilter)

export const SizeSignal = (val: Size) =>
  Signal(val).middleware(GameKitSignalMiddlewares.sizeFilter)
