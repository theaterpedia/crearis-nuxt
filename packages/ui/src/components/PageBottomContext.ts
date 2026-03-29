import type { Ref, InjectionKey } from 'vue'

/**
 * Context provided to child components (e.g., ConsultingDialog)
 * to communicate interaction state with PageBottom.
 */
export interface PageBottomContext {
  /** Whether the user is actively interacting (e.g., selecting categories) */
  interaction: Ref<boolean>
  /** Set the interaction state */
  setInteraction: (value: boolean) => void
  /** The anchor ID for scrolling */
  anchor: string
}

/**
 * Injection key for PageBottomContext.
 * Use with provide() in PageBottom and inject() in child components.
 */
export const pageBottomContextKey: InjectionKey<PageBottomContext> = Symbol('pageBottomContext')
