// External Libraries
import { useState, useEffect } from "react";

// Types
export interface UseBottomSheetOptions {
  breakpoint?: number; // Screen width below which to use bottom sheet
}

// Hook: Manage bottom sheet state for mobile overflow content
export function useBottomSheet(options: UseBottomSheetOptions = {}) {
  const { breakpoint = 768 } = options; // md breakpoint by default

  // Hooks
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Data Loading
  // (none)

  // Early Returns
  // (none)

  // Computed Data
  const shouldUseBottomSheet = isMobile;

  // Event Handlers
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  // Effects
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Initial check
    checkScreenSize();

    // Listen for resize
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [breakpoint]);

  // Auto-close when switching to desktop
  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  return {
    isOpen,
    isMobile,
    shouldUseBottomSheet,
    open,
    close,
    toggle,
  };
}