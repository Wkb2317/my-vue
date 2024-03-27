import { isON } from '@vue/shared'
import { patchClass } from './modules/class'

export function patchProps(
  el: Element,
  key: string,
  prevValue: any,
  nextValue: any,
) {
  if (key === 'class') {
    patchClass(el, nextValue)
  } else if (key === 'style') {
  } else if (isON(key)) {
    // 处理事件
  }
}
