export const isArray = (a: unknown) => Array.isArray(a)

export const isObject = (val: any) => val !== null && typeof val === 'object'
