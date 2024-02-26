import { isFunction } from '@vue/shared'
import { Dep } from './dep'
import { ReactiveEffect } from './effect'
import { RefImpl, trackRefValue, triggerRefValue } from './ref'

export function computed(fn: Function) {
  const onlyGetter: boolean = isFunction(fn)

  let getter: any = null
  let setter: any = null

  if (onlyGetter) {
    getter = fn
    setter = () => {}
  }

  return new ComputedRefImpl(getter, setter)
}

export class ComputedRefImpl {
  public dep: Dep | undefined
  public _dirty: boolean // 为true代表当前没有缓存
  public _value: any
  public effect: ReactiveEffect
  private _getter: any
  private _setter: any

  constructor(getter: any, setter: any) {
    this._getter = getter
    this._setter = setter
    this.dep = undefined
    this._dirty = true

    this.effect = new ReactiveEffect(this._getter, () => {
      if (!this._dirty) {
        this._dirty = true
        // 触发依赖
        triggerRefValue(this as unknown as RefImpl)
      }
    })
    this.effect.computed = this
  }

  get value() {
    // 收集依赖
    trackRefValue(this as unknown as RefImpl)
    // 没有缓存
    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }
    return this._value
  }

  set value(newValue: any) {
    this._setter(newValue)
  }
}
