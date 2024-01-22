import { ReactiveEffect } from './effect'

export type Dep = Set<ReactiveEffect>

export function createDep(): Dep {
  const dep: Dep = new Set()
  return dep
}
