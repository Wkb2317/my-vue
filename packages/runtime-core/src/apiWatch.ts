import { hasChanged, isObject } from './../../shared/src/index'
import { isFunction } from '@vue/shared'
import { isReactive } from 'packages/reactivity/src/reactive'
import { isRef } from 'packages/reactivity/src/ref'
import { queuePreFlushCb } from './scheduler'
import { ReactiveEffect } from 'packages/reactivity/src/effect'

interface WatchOptions {
  deep?: boolean
  immediate?: boolean
}

export function watch(source: any, cb: Function, options?: WatchOptions) {
  return doWatch(source, cb, options)
}

function doWatch(
  source: any,
  cb: Function,
  { immediate, deep }: WatchOptions = {},
) {
  let getter: Function
  let oldValue = {}
  let newValue

  if (isReactive(source)) {
    getter = () => source
  } else if (isRef(source)) {
    getter = () => source.value
  } else if (isFunction(source)) {
    getter = source
  } else {
    getter = () => {}
  }

  let baseGetter: Function
  if (cb && deep) {
    baseGetter = getter
    getter = () => traverse(baseGetter())
  }

  const job = () => {
    if (cb) {
      newValue = effect.run()
      if (deep || hasChanged(newValue, oldValue)) {
        cb(newValue, oldValue)
        oldValue = newValue
      }
    }
  }

  const scheduler = () => queuePreFlushCb(job)
  const effect = new ReactiveEffect(getter, scheduler!)

  if (cb) {
    if (immediate) {
      job()
      oldValue = effect.run()
    }
  } else {
    effect.run()
  }
}

function traverse(value: unknown) {
  if (!isObject(value)) {
    return value
  }

  for (const key in value as object) {
    traverse((value as object)[key])
  }

  return value
}
