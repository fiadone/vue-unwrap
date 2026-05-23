import type { Component, ComponentPublicInstance, SetupContext, VNode, VNodeArrayChildren, VNodeRef } from 'vue'
import { cloneVNode, Comment, Fragment, h, isVNode, shallowReactive, shallowRef, useSlots } from 'vue'

export type NodeRef = Element | ComponentPublicInstance | null

export function getNodeElement<N = NodeRef> (node: N) {
  const el = (node as ComponentPublicInstance)?.$el as Element || node
  return el instanceof Element ? el : null
}

export function unwrapVNodes (vnodes: VNodeArrayChildren): VNode[] {
  const nodes: VNode[] = []
  for (const node of vnodes) {
    if (node == null || typeof node === 'boolean') continue
    if (Array.isArray(node)) {
      nodes.push(...unwrapVNodes(node))
      continue
    }
    if (!isVNode(node) || node.type === Comment) continue
    if (node.type === Fragment && Array.isArray(node.children)) {
      nodes.push(...unwrapVNodes(node.children))
    } else {
      nodes.push(node)
    }
  }
  return nodes
}

export function useUnwrap <N = NodeRef, P = Record<string, any>> (propTypes?: Record<string, any>) {
  const $el = shallowRef<Element | null>(null)
  const children = shallowReactive<N[]>([])
  const slots = useSlots()

  const trackChildRef = (index: number): VNodeRef => node => (children[index] = node as N)
  const trackWrapperRef: VNodeRef = node => ($el.value = getNodeElement(node as N))

  function Unwrap (props: P, context: SetupContext) {
    const { is, ...attrs } = context.attrs as Record<string, unknown> & { is: string | Component }
    const content = unwrapVNodes(slots.default?.(props) ?? [])
    const nodes = content.map((node, i) => cloneVNode(node, { ref: trackChildRef(i) }, true))
    const wrapper = is ? cloneVNode(h(is, attrs, nodes), { ref: trackWrapperRef }, true) : null
    // remove orphan children
    children.splice(nodes.length) 
    return wrapper || nodes
  }

  Unwrap.inheritAttrs = false
  Unwrap.props = { ...propTypes }

  return {
    $el,
    children,
    Unwrap
  }
}
