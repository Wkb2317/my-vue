import { ComputedRefImpl } from './computed'
import { Dep } from './dep'

export let activeEffect: ReactiveEffect | null = null

export function effect(fn: () => any) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

export class ReactiveEffect {
  deps: Dep[] = []

  constructor(
    public fn: () => any,
    public scheduler?: () => any,
    public computed?: ComputedRefImpl,
  ) {}

  run() {
    activeEffect = this
    return this.fn()
  }
}

export function trackEffect(activeEffect: ReactiveEffect, dep: Dep) {
  dep.add(activeEffect)
  const oldDep = activeEffect.deps[activeEffect.deps.length - 1]
  if (oldDep !== dep) {
    activeEffect.deps.push(dep)
  }
}

export function triggerEffects(dep: Dep) {
  const effects = [...dep]
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect)
    }
  }

  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect)
    }
  }
}

export function triggerEffect(effect: ReactiveEffect) {
  if (effect.scheduler) {
    effect.scheduler()
  } else {
    effect.run()
  }
}
