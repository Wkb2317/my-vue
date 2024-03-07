import { isArray, isString } from '@vue/shared'
import { ShapeFlags } from '../../shared/src/shapeFlags'

export interface VNode {
  __v_isVNode: boolean
  type: any
  props: any
  children: any
  shapeFlag: number
}

export function isVNode(value: any) {
  return value ? value.__v_isVNode === true : false
}

export function createVNode(type: any, props: any, children: any): VNode {
  let shapeFlag

  if (props) {
    // TODO 对props进行优化
  }

  if (isString(type)) {
    shapeFlag = ShapeFlags.ELEMENT
  }
  return createBaseVNode(type, props, children, shapeFlag!)
}

function createBaseVNode(
  type: any,
  props: any,
  children: any,
  shapeFlag: number,
): VNode {
  const vnode: VNode = {
    __v_isVNode: true,
    type,
    props,
    children,
    shapeFlag,
  }

  if (children) {
    normalizeChildren(vnode, children)
  }

  return vnode
}

function normalizeChildren(vnode: VNode, children: any) {
  let type = 0
  const { shapeFlag } = vnode
  if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN
  } else if (typeof children === 'object') {
    //
  } else if (typeof children === 'function') {
    type = ShapeFlags.SLOTS_CHILDREN
  } else {
    children = String(children)
  }

  vnode.children = children
  vnode.shapeFlag |= type
}
