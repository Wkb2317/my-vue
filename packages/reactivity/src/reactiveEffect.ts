import { Dep, createDep } from './dep'
import { activeEffect, trackEffect, triggerEffects } from './effect'

/**
 * 使用WeakMap储存对象中的依赖，存储格式如下
 * weakMap: key    value
 *       target    depsMap
 * depsMap:    key      value
 *         key      Dep
 * Dep: Set
 *      reactiveEffect
 */
const targetMap = new WeakMap<object, Map<String, Dep>>()

/**
 * 收集依赖
 * @param target
 * @param key
 */
export function track(target: object, key: string) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = createDep()
    depsMap.set(key, dep)
  }
  if (activeEffect) {
    trackEffect(activeEffect, dep)
  }
}

/**
 * 触发依赖
 * @param target
 * @param key
 */
export function trigger(target: object, key: string) {
  const depsMap = targetMap.get(target)
  let deps: Dep[] = []
  if (depsMap) {
    let dep = depsMap.get(key)
    if (dep) {
      deps.push(dep)
    }

    deps.forEach(dep => {
      triggerEffects(dep)
    })
  }
}
