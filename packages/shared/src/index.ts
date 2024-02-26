export const isArray = (a: unknown) => Array.isArray(a)

export const isObject = (val: any) => val !== null && typeof val === 'object'

export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)

export const isFunction = (fn: any): boolean => typeof fn === 'function'