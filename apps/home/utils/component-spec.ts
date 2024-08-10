export interface BaseComponentSpec {
  /**
   * Specifies whether the component can be used at the top level of a page's `<main>` content area.
   */
  isPageComponent: boolean

  /**
   * Specifies whether the component has slots that can contain other components.
   */
  isParent: boolean

  /**
   * Specifies whether the component has the #actions-slot that shows links as buttons.
   */
  // hasActionSlot?: boolean  
  // maybe we add this later, at the moment it is all the same
  // with having the buttons inside the prose-slot

  /**
   * The name of the Vue component `prop` that will be used to pass the image URL to the component.
   *
   * If the component does not have an image, it is `undefined`.
   */
  imgProp?: string
}

export interface SingletonComponentSpec extends BaseComponentSpec {
  isParent: false
  allowsProse: false
}

export interface ParentComponentSpec extends BaseComponentSpec {
  isParent: true

  /**
   * Specifies whether the component can contain prose content as a direct child.
   */
  allowsProse: boolean
}

export type ComponentSpec = SingletonComponentSpec | ParentComponentSpec

/**
 * A map of component names to their specifications.
 *
 * @example
 * ```ts
 * import { kebabCase } from 'scule'
 *
 * for (const [name, spec] of Object.entries(componentSpecs)) {
 *   const kebabName = kebabCase(name)
 *
 *   if (spec.isPageComponent) {
 *     // Do something
 *   }
 * }
 * ```
 */
export const componentSpecs: Record<string, ComponentSpec> = {
  Banner: {
    isPageComponent: true,
    isParent: true,
    allowsProse: true,
  },
  ButtonTmp: {
    isPageComponent: false,
    isParent: true,
    allowsProse: false,
  },
  Catalog: {
    isPageComponent: false,
    isParent: true,
    allowsProse: true,
  },
  Column: {
    isPageComponent: false,
    isParent: true,
    allowsProse: true,
  },
  Columns: {
    isPageComponent: true,
    isParent: true,
    allowsProse: false,
  },
  FormTmp: {
    isPageComponent: false,
    isParent: true,
    allowsProse: true,
  },
  Heading: {
    isPageComponent: false,
    isParent: false,
  },
  Hero: {
    isPageComponent: true,
    isParent: true,
    allowsProse: true,
    imgProp: 'imgTmp',
  },
  InputTmp: {
    isPageComponent: false,
    isParent: false,
  },
  Prose: {
    isPageComponent: false,
    isParent: true,
    allowsProse: false,
  },
  RadioGroup: {
    isPageComponent: false,
    isParent: false,
  },
  Slide: {
    isPageComponent: false,
    isParent: true,
    allowsProse: true,
  },
  Slider: {
    isPageComponent: false,
    isParent: true,
    allowsProse: false,
  },
  TextAreaTmp: {
    isPageComponent: false,
    isParent: false,
  },
  Timeline: {
    isPageComponent: true,
    isParent: true,
    allowsProse: true,
  },  
}
