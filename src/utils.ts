import type { ComponentPublicInstance, VNode, VNodeArrayChildren } from 'vue'
import { Comment, Fragment, isVNode } from 'vue'

import type { NodeRef } from './types'

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
