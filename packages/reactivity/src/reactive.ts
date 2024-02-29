import { mutableHandlers } from './baseHandlers'

// 存放已经存在的reactive对象
const reactiveMap = new WeakMap<object, any>()

function createReactiveObject(
  target: any,
  mutableHandlers: any,
  reactiveMap: WeakMap<object, any>,
) {
  const existingProxy = reactiveMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  target['__v_reactive'] = true
  const proxy = new Proxy(target, mutableHandlers)

  reactiveMap.set(target, proxy)
  return proxy
}

export function reactive(target: object) {
  return createReactiveObject(target, mutableHandlers, reactiveMap)
}

export function isReactive(source: any) {
  return source['__v_reactive']
}
