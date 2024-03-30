import { ShapeFlags } from 'packages/shared/src/shapeFlags'
import { Coment, Fragment, Text, VNode } from './vnode'

interface IRenderOptions {
  patchProp: (el: Element, key: string, prevValue: any, nextValue: any) => void
  setElementText: (node: Element, text: string) => void
  insert: (el: Element, parent: Element, anchor?: Element) => void
  createElement: (type: string) => Element
}

export function createRender(options: IRenderOptions) {
  return baseCreateRender(options)
}

function baseCreateRender(options: IRenderOptions) {
  const { createElement, patchProp, insert, setElementText } = options

  const processElement = (
    oldVnode: VNode,
    newVnode: VNode,
    container: Element,
    anchor: any,
  ) => {
    if (oldVnode === null) {
      // 挂载
      mountElement(newVnode, container, anchor)
    } else {
      // 更新
      patchElement(oldVnode, newVnode, container, anchor)
    }
  }

  const mountElement = (vnode: VNode, container: Element, anchor: any) => {
    const { shapeFlag, type, props, children } = vnode
    // 1、创建element
    const el = (vnode.el = createElement(type))
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 2、设置文本
      setElementText(el, children)
    }
    // 3、设置props
    if (props) {
      for (const key in props) {
        patchProp(el, key, null, props[key])
      }
    }
    // 4、插入
    insert(el, container)
  }

  // 更新element
  const patchElement = (
    oldVnode: VNode,
    newVnode: VNode,
    container: Element,
    anchor: any,
  ) => {
    const el = (newVnode.el = oldVnode.el!)
    const oldProps = oldVnode.props || {}
    const newProps = newVnode.props || {}

    // 更新子节点
    patchChildren(oldVnode, newVnode, el!, null)
    // 更新props
    patchProps(el, oldProps, newProps)
  }

  /**
   *子节点打补丁
   * @param oldVnode
   * @param newVnode
   * @param container
   * @param anchor
   */
  function patchChildren(
    oldVnode: VNode,
    newVnode: VNode,
    container: Element,
    anchor: any,
  ) {
    // 旧节点的children
    const c1 = oldVnode && oldVnode.children
    // 新节点的children
    const c2 = newVnode && newVnode.children
    // 新节点的shapeFlag
    const { shapeFlag } = newVnode
    // 旧节点的shapeFlag
    const prevShapeFlag = oldVnode ? oldVnode.shapeFlag : 0

    // 新节点为text_children
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 旧节点为数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // TODO 卸载旧节点
      }

      if (c2 !== c1) {
        // 挂载新节点的文本
        setElementText(container, c2)
      }
    } else {
      // 新节点为数组
      // 旧节点为数组的情况
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 新节点为数组
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // TODO  diff算法
        } else {
          //  TODO 卸载
        }
      } else {
        // 旧节点为文本的情况
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          // 删除旧节点的text
          setElementText(container, '')
        }
        // 新节点为array
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 单独挂载新子节点操作
        }
      }
    }
  }

  /**
   * 更新props
   * @param el
   * @param vnode
   * @param oldProps
   * @param newProps
   */
  function patchProps(el: Element, oldProps: any, newProps: any) {
    if (oldProps !== newProps) {
      // 遍历新key
      for (const key in newProps) {
        const next = newProps[key]
        const prev = oldProps[key]

        if (next !== prev) {
          patchProp(el, key, prev, next)
        }
      }

      // 旧节点存在key，新节点不存在时
      for (const key in oldProps) {
        if (!(key in newProps)) {
          // 移除key
          patchProp(el, key, oldProps[key], null)
        }
      }
    }
  }

  const patch = (
    oldVnode: VNode,
    newVnode: VNode,
    container: any,
    anchor = null,
  ) => {
    if (oldVnode === newVnode) return

    switch (newVnode.type) {
      case Text:
        break
      case Coment:
        break
      case Fragment:
        break
      default:
        const { shapeFlag } = newVnode
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(oldVnode, newVnode, container, anchor)
        } else if (shapeFlag & ShapeFlags.COMPONENT) {
        }
        break
    }
  }

  const render = (vnode: VNode, container: any) => {
    if (vnode === null) {
      //TODO 卸载操作
    } else {
      // patch操作
      patch(container._vnode || null, vnode, container)
    }

    container._vnode = vnode
  }

  return {
    render,
  }
}
