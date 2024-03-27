export const nodeOps = {
  insert: (el: Element, parent: Element, anchor?: Element) => {
    parent.insertBefore(el, anchor || null)
  },

  createElement: (type: string) => {
    const el = document.createElement(type)
    return el
  },

  setElementText: (node: Element, text: string) => {
    node.textContent = text
  },
}
