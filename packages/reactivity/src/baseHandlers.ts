import { track, trigger } from './reactiveEffect'

class MutableReactiveHandler {
  constructor() {}

  set(target: object, key: string, value: any, receiver: object) {
    const res = Reflect.set(target, key, value, receiver)
    trigger(target, key)
    return res
  }

  get(target: object, key: string, receiver: object) {
    track(target, key)
    return Reflect.get(target, key, receiver)
  }
}

export const mutableHandlers = new MutableReactiveHandler()
