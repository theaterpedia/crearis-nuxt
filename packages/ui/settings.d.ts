import type { TopnavParentItem } from './src/components/TopNav.vue';
import type { ToggleOption } from './src/components/ToggleMenu.vue';
/**
 * UI Package Settings
 *
 * This file contains all configurable settings for the UI components.
 * Import and customize these settings in your application.
 */
export declare const pageSettings: {
    showAside: boolean;
    showBottom: boolean;
    alertBanner: {
        message: string;
        alertType: "warning";
    };
};
export type SiteLayout = 'default' | 'sidebar' | 'fullSidebar' | 'fullTwo' | 'fullThree';
export declare const layoutSettings: {
    /**
     * Site Layout Options:
     * - 'default': Boxed layout with optional right sidebar (current implementation)
     * - 'sidebar': Reserved for future - boxed layout with different sidebar behavior
     * - 'fullSidebar': Reserved for future - full-width with different sidebar behavior
     * - 'fullTwo': Full-width 2-column layout (main + right sidebar)
     * - 'fullThree': Full-width 3-column layout (left sidebar + main + right sidebar)
     */
    siteLayout: SiteLayout;
    baseWideHeader: boolean;
    baseWideTopnav: boolean;
    baseWideContent: boolean;
    baseBottomWide: boolean;
    baseFooterWide: boolean;
    fullwidthPadding: boolean;
    backgroundColor: "default" | "primary" | "secondary" | "muted" | "accent" | "positive" | "negative" | "warning";
};
export declare const navbarSettings: {
    scrollStyle: "simple" | "overlay" | "overlay_reappear";
    navbarSticky: boolean;
    navbarReappear: boolean;
};
export declare const mainMenuItems: TopnavParentItem[];
export declare const layoutToggleOptions: ToggleOption[];
