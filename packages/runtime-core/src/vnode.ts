import { isArray, isObject, isString } from '@vue/shared'
import { ShapeFlags } from '../../shared/src/shapeFlags'

export interface VNode {
  __v_isVNode: boolean
  type: any
  props: any
  children: any
  shapeFlag: number
  el?: Element
  key?: any
}

export const Text = Symbol('Text')
export const Coment = Symbol('Coment')
export const Fragment = Symbol('Fragment')

export function isVNode(value: any) {
  return value ? value.__v_isVNode === true : false
}

export function createVNode(type: any, props: any, children: any): VNode {
  let shapeFlag

  if (props) {
    const { class: klass, style } = props
    if (klass) {
      props.class = normalizeClass(klass)
    }
  }

  shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
      ? ShapeFlags.STATEFUL_COMPONENT
      : 0
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

  if (children == null) {
    children = null
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN
  } else if (typeof children === 'object') {
    //
  } else if (typeof children === 'function') {
    type = ShapeFlags.SLOTS_CHILDREN
  } else {
    children = String(children)
    type = ShapeFlags.TEXT_CHILDREN
  }

  vnode.children = children
  vnode.shapeFlag |= type
}

/**
 * 处理 class
 * @param value
 */
function normalizeClass(value: any) {
  let res = ''
  if (isString(value)) {
    res = value
    return res
  } else if (isArray(value)) {
    for (let item in value) {
      const normalized = normalizeClass(item)
      res += ' ' + normalized
    }
  } else if (isObject(value)) {
    for (let key in value) {
      if (value[key]) {
        res += ' ' + value[key]
      }
    }
  }

  return res.trim()
}

export function isSameVnodeType(n1: VNode, n2: VNode) {
  return n1.type === n2.type && n1.key === n2.key
}
