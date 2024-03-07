import { isArray, isObject } from '@vue/shared'
import { createVNode, isVNode } from './vnode'

export function h(type: any, propsOrChildren: any, children: any) {
  const l = arguments.length

  if (l === 2) {
    // 传入参数长度为2，需判断传入的是props还是children
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        // 传入的为vnode
        return createVNode(type, null, [propsOrChildren])
      }
      // 传入的为props
      return createVNode(type, propsOrChildren, null)
    } else {
      // 传入的为children
      return createVNode(type, null, propsOrChildren)
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    } else if (l === 3 && isVNode(children)) {
      children = [children]
    }

    return createVNode(type, propsOrChildren, children)
  }
}
