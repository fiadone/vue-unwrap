import type { Component, SetupContext, VNodeRef } from 'vue'
import { cloneVNode, h, shallowReactive, shallowRef, useSlots } from 'vue'

import type { NodeRef } from './types'
import { getNodeElement, unwrapVNodes } from './utils'

export function useUnwrap <N = NodeRef, P = Record<string, any>> (propTypes?: Record<string, any>) {
  const children = shallowReactive<N[]>([])
  const root = shallowRef<Element | null>(null)
  const slots = useSlots()

  const trackChildRef = (index: number): VNodeRef => node => (children[index] = node as N)
  const trackRootRef: VNodeRef = node => (root.value = getNodeElement(node as N))

  function Unwrap (props: P, context: SetupContext) {
    const { is, ...attrs } = context.attrs as { is: string | Component }
    const content = unwrapVNodes(slots.default?.(props) ?? [])
    const childNodes = content.map((node, i) => cloneVNode(node, { ref: trackChildRef(i) }, true))
    const rootNode = is ? cloneVNode(h(is, attrs, childNodes), { ref: trackRootRef }, true) : null
    children.splice(childNodes.length) // remove orphan children
    return rootNode || childNodes
  }

  Unwrap.inheritAttrs = false
  Unwrap.props = { ...propTypes }

  return {
    children,
    root,
    Unwrap
  }
}
