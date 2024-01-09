import { Dep } from './dep'

export let activeEffect: ReactiveEffect | null = null

export function effect(fn: () => any) {
  const _effect = new ReactiveEffect(fn, () => {})
  _effect.run()
}

export class ReactiveEffect {
  deps: Dep[] = []

  constructor(
    public fn: () => any,
    public trigger: () => any,
  ) {}

  run() {
    activeEffect = this
    return this.fn()
  }
}

export function trackEffect(activeEffect: ReactiveEffect, dep: Dep) {
  dep.set(activeEffect, activeEffect.deps.length)
  const oldDep = activeEffect.deps[activeEffect.deps.length - 1]
  if (oldDep !== dep) {
    activeEffect.deps.push(dep)
  }
}

export function triggerEffects(dep: Dep) {
  dep.forEach((value, effect) => {
    effect.run()
  })
}
