export interface BaseComponentSpec {
  /**
   * Specifies whether the component can be used at the top level of a page's `<main>` content area.
   */
  isPageComponent: boolean

  /**
   * Specifies whether the component has slots that can contain other components.
   */
  isNestable: boolean

  /**
   * The name of the Vue component `prop` that will be used to pass the image URL to the component.
   *
   * If the component does not have an image, it is `undefined`.
   */
  imgProp?: string
}

export interface SingletonComponentSpec extends BaseComponentSpec {
  isNestable: false
}

export interface NestableComponentSpec extends BaseComponentSpec {
  isNestable: true

  /**
   * Specifies whether the component can contain prose content as a direct child.
   */
  allowsProse: boolean
}

export type ComponentSpec = SingletonComponentSpec | NestableComponentSpec

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
    isNestable: true,
    allowsProse: true,
  },
  ButtonTmp: {
    isPageComponent: false,
    isNestable: true,
    allowsProse: false,
  },
  Column: {
    isPageComponent: false,
    isNestable: true,
    allowsProse: true,
  },
  Columns: {
    isPageComponent: true,
    isNestable: true,
    allowsProse: false,
  },
  Container: {
    isPageComponent: false,
    isNestable: true,
    allowsProse: true,
  },
  FormTmp: {
    isPageComponent: false,
    isNestable: true,
    allowsProse: true,
  },
  Heading: {
    isPageComponent: false,
    isNestable: false,
  },
  Hero: {
    isPageComponent: true,
    isNestable: true,
    allowsProse: true,
    imgProp: 'imgTmp',
  },
  InputTmp: {
    isPageComponent: false,
    isNestable: false,
  },
  Prose: {
    isPageComponent: false,
    isNestable: true,
    allowsProse: false,
  },
  RadioGroup: {
    isPageComponent: false,
    isNestable: false,
  },
  SecTmp: {
    isPageComponent: true,
    isNestable: true,
    allowsProse: false,
  },
  Slide: {
    isPageComponent: false,
    isNestable: true,
    allowsProse: true,
  },
  Slider: {
    isPageComponent: false,
    isNestable: true,
    allowsProse: false,
  },
  TextAreaTmp: {
    isPageComponent: false,
    isNestable: false,
  },
}
