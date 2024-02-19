import { isObject } from '../../shared/src/index'
import { reactive } from './reactive'

export function ref(value: any) {
  return createRef(value, false)
}

function isRef(value: any) {
  return !!(value && value.__v_isRef)
}

function toRaw(observed: any): any {
  const raw = observed && observed['__v_raw']
  return raw ? toRaw(raw) : observed
}

function toReactive(value: any) {
  return isObject(value) ? reactive(value) : value
}

function createRef(value: any, isShallow: boolean) {
  if (isRef(value)) {
    return value
  }
  return new RefImpl(value, isShallow)
}

function trackRefValue(ref: RefImpl) {}

class RefImpl {
  public __v_isShallow: boolean
  public dep: undefined
  public __v_isRef: boolean
  public _rawValue: any
  public _value: any

  constructor(value: any, isShallow: boolean) {
    this.__v_isShallow = isShallow
    this.dep = undefined
    this.__v_isRef = isRef(value)
    this._rawValue = isShallow ? value : toRaw(value)
    this._value = isShallow ? value : toReactive(value)
  }

  get value() {
    console.log(this._value)
    return this._value
  }
}
