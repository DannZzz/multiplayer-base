import { uuid } from "./uuid"

export class Listener<T extends Record<any, any[]>, K extends keyof T> {
  readonly id: string = uuid()

  constructor(readonly event: K, public cb: (...args: T[K]) => void) {}
}

export type EventObject = { [k: string | number | symbol]: any[] }

export class EventEmitter<T extends Record<any, any[]> = {}> {
  listeners: Listener<T, keyof T>[] = []

  on<K extends keyof T>(event: K, cb: (...args: T[K]) => void) {
    this.listeners.push(new Listener(event, cb))
  }

  emit<K extends keyof T>(event: K, ...args: T[K]) {
    this.listeners.forEach((l) => l.event === event && l.cb(...args))
  }

  clearListeners() {
    this.listeners = []
  }
}
