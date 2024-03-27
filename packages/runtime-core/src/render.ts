import { ShapeFlags } from 'packages/shared/src/shapeFlags'
import { Coment, Fragment, Text, VNode } from './vnode'

interface IRenderOptions {
  patchProps: (el: Element, key: string, prevValue: any, nextValue: any) => void
  setElementText: (node: Element, text: string) => void
  insert: (el: Element, parent: Element, anchor?: Element) => void
  createElement: (type: string) => Element
}

function createRender(options: IRenderOptions) {
  return baseCreateRender(options)
}

function baseCreateRender(options: IRenderOptions) {
  const { createElement, patchProps, insert, setElementText } = options

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
        patchProps(el, key, null, props[key])
      }
    }
    // 4、插入
    insert(el, container)
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
