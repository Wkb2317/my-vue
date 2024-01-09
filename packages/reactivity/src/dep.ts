import { ReactiveEffect } from './effect'

export type Dep = Map<ReactiveEffect, number>

export function createDep(): Dep {
  const dep: Dep = new Map()
  return dep
}
