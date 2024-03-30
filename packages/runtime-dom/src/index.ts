import { extend } from '@vue/shared'
import { patchProp } from '../../runtime-dom/src/patchProps'
import { nodeOps } from 'packages/runtime-dom/src/nodeOps'
import { createRender } from 'packages/runtime-core/src/render'

let renderer: any

const renderOptions = extend({ patchProp }, nodeOps)

function ensureRender() {
  return renderer || (renderer = createRender(renderOptions))
}

export function render(...args: any[]) {
  return ensureRender().render(...args)
}
