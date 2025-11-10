/**
 * TypeScript Interface Contracts for Sticky Anchor Navigation
 * Feature: 002-sticky-anchor-nav
 *
 * This file defines all TypeScript interfaces used across the feature.
 * These are contracts between components, hooks, and pages.
 */

// ============================================================================
// CORE ENTITIES
// ============================================================================

/**
 * Represents a single anchor link configuration for a page section
 *
 * @example
 * {
 *   id: "mission",
 *   label: "Mission",
 *   i18nKey: "about.navigation.mission"
 * }
 */
export interface PageAnchorConfig {
  /**
   * HTML element ID of the target section (must match section id attribute)
   * Example: "mission", "values", "team"
   */
  id: string;

  /**
   * Display text for the anchor link (fallback if i18nKey not provided)
   * Example: "Mission", "Our Values"
   */
  label: string;

  /**
   * Optional translation key for internationalized label
   * If provided, will use translation; otherwise falls back to label
   * Example: "about.navigation.mission"
   */
  i18nKey?: string;
}

/**
 * Context object passed from page components to layout via React Router Outlet Context
 *
 * @example
 * <Outlet context={{ anchors: pageAnchors } satisfies PageLayoutContext} />
 */
export interface PageLayoutContext {
  /**
   * Array of anchor configurations for current page
   * Undefined means page doesn't use anchor navigation
   * Empty array means page explicitly has no anchors
   */
  anchors?: PageAnchorConfig[];
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * Props for NavigationHeader component
 * Extends existing navbar with anchor navigation
 */
export interface NavigationHeaderProps {
  /**
   * Optional anchor links to display below main menu
   * If undefined, no anchor navigation is rendered
   */
  anchors?: PageAnchorConfig[];
}

/**
 * Props for AnchorLinks component (horizontal desktop navigation)
 */
export interface AnchorLinksProps {
  /**
   * Anchor links to render horizontally
   */
  anchors: PageAnchorConfig[];

  /**
   * Currently active section ID for highlighting
   * Null if no section is active (e.g., at top of page)
   */
  activeId?: string | null;

  /**
   * Optional CSS class name for customization
   */
  className?: string;
}

/**
 * Props for MobileAnchorLinks component (vertical sheet navigation)
 */
export interface MobileAnchorLinksProps {
  /**
   * Anchor links to render vertically in mobile sheet
   */
  anchors: PageAnchorConfig[];

  /**
   * Optional CSS class name for customization
   */
  className?: string;
}

// ============================================================================
// HOOK PARAMETERS & RETURN TYPES
// ============================================================================

/**
 * Parameters for useScrollSpy hook
 */
export interface UseScrollSpyParams {
  /**
   * Array of section IDs to observe
   * Example: ['mission', 'values', 'regions']
   */
  sectionIds: string[];

  /**
   * Optional root margin for Intersection Observer
   * Default: '-100px 0px -80% 0px'
   * Format: top, right, bottom, left (like CSS margin)
   */
  rootMargin?: string;

  /**
   * Optional callback when active section changes
   */
  onActiveChange?: (sectionId: string | null) => void;
}

/**
 * Return type for useScrollSpy hook
 */
export interface UseScrollSpyReturn {
  /**
   * Currently active section ID
   * Null if no section is active (e.g., at top of page)
   */
  activeSectionId: string | null;
}

/**
 * Parameters for useSmoothScroll hook
 */
export interface UseSmoothScrollParams {
  /**
   * Scroll behavior
   * Default: 'smooth'
   */
  behavior?: ScrollBehavior;

  /**
   * Block alignment
   * Default: 'start'
   */
  block?: ScrollLogicalPosition;

  /**
   * Whether to update URL hash
   * Default: true
   */
  updateHash?: boolean;
}

/**
 * Return type for useSmoothScroll hook
 */
export interface UseSmoothScrollReturn {
  /**
   * Function to scroll to a section by ID
   *
   * @param sectionId - ID of section to scroll to
   * @example
   * scrollToSection('mission')
   */
  scrollToSection: (sectionId: string) => void;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Validator function for PageAnchorConfig
 * Returns true if valid, error message if invalid
 */
export type AnchorConfigValidator = (config: PageAnchorConfig) => true | string;

/**
 * Validator function for checking if section ID exists in DOM
 */
export type SectionExistenceValidator = (sectionId: string) => boolean;

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if PageLayoutContext has anchors
 *
 * @param context - Page layout context
 * @returns True if context has non-empty anchors array
 */
export function hasAnchors(context: PageLayoutContext): context is Required<PageLayoutContext> {
  return Array.isArray(context.anchors) && context.anchors.length > 0;
}

/**
 * Type guard to check if PageAnchorConfig is valid
 *
 * @param config - Anchor configuration
 * @returns True if config has required fields
 */
export function isValidAnchorConfig(config: unknown): config is PageAnchorConfig {
  return (
    typeof config === 'object' &&
    config !== null &&
    'id' in config &&
    'label' in config &&
    typeof (config as PageAnchorConfig).id === 'string' &&
    typeof (config as PageAnchorConfig).label === 'string' &&
    (config as PageAnchorConfig).id.length > 0 &&
    (config as PageAnchorConfig).label.length > 0
  );
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default configuration values
 */
export const DEFAULT_SCROLL_SPY_CONFIG = {
  rootMargin: '-100px 0px -80% 0px',
  threshold: 0.6,
} as const;

/**
 * Responsive breakpoint (matches Tailwind md)
 */
export const MOBILE_BREAKPOINT = 768; // px

/**
 * Media query for mobile detection
 */
export const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

/**
 * Media query for desktop detection
 */
export const DESKTOP_MEDIA_QUERY = `(min-width: ${MOBILE_BREAKPOINT}px)`;
