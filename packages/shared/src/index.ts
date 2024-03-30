export const isArray = (a: unknown) => Array.isArray(a)

export const isObject = (val: any) => val !== null && typeof val === 'object'

export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)

export const isFunction = (fn: any): boolean => typeof fn === 'function'

export const isString = (value: any) => typeof value === 'string'

export const isON = (key: string) => key.startsWith('on')

export const extend = Object.assign
