import type { MainMenuLinkItem, MainMenuParentItem } from '@crearis-nuxt/ui'
import type { NavItem } from '@nuxt/content'

export const useMainMenu = () =>
  useState<{ items: MainMenuParentItem[]; initialized: boolean }>('mainMenu', () => ({
    items: [],
    initialized: false,
  }))

/**
 * Transforms the Nuxt Content navigation into `@crearis-nuxt/ui` main menu items.
 */
export function navigationToMenu(navigation: NavItem[], currentPath: string): MainMenuParentItem[] {
  return navigation.map((item) => ({
    label: item.title,
    children: item.children ? navigationToMenuItems(item.children, currentPath) : [],
    expanded: currentPath.startsWith(`${item._path}/`),
  }))
}

function navigationToMenuItems(navigation: NavItem[], currentPath: string): (MainMenuParentItem | MainMenuLinkItem)[] {
  return navigation.map((item) =>
    item.children?.length
      ? {
          label: item.title,
          children: item.children ? navigationToMenuItems(item.children, currentPath) : [],
          expanded: currentPath.startsWith(`${item._path}/`),
        }
      : {
          label: item.title,
          link: item._path,
        },
  )
}
