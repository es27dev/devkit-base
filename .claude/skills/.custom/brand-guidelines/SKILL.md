---
name: brand-guidelines
description: Applies PACON Real Estate GmbH's official brand colors and visual identity to any sort of artifact that may benefit from having PACON's professional look-and-feel. Use it when brand colors or style guidelines, visual formatting, or company design standards apply.
license: Complete terms in LICENSE.txt
---

# PACON Real Estate GmbH Brand Styling

## Overview

To access PACON Real Estate GmbH's official brand identity and style resources, use this skill.

**Keywords**: branding, corporate identity, visual identity, post-processing, styling, brand colors, PACON brand, visual formatting, visual design, facility management branding

## Brand Guidelines

### Logo Colors (Exact from SVG)

**Do NOT use these exact colors for UI elements - they are reserved for logo visibility:**

- Red: `#98221F` - PACON signature red (logo only)
- Dark Gray: `#3C3C3B` - Logo dark elements
- Light Gray: `#9C9B9B` - Logo light elements
- Black: `#1D1D1B` - Logo text

### UI Colors (Slightly Adjusted for Logo Contrast)

**Light Mode (Warm Beige/Cream Theme):**

- Background: `#faf8f5` - Warm off-white background
- Foreground: `#1d1d1b` - Logo black for primary text
- Card: `#ffffff` - Pure white cards
- Primary: `#a63631` - Slightly lighter red (not logo-exact)
- Secondary: `#f5f2ed` - Warm light gray
- Muted: `#f0ece6` - Warmer muted background
- Border: `#e0dcd5` - Warm borders

**Dark Mode (Professional Dark Gray):**

- Background: `#2a2a29` - Slightly lighter than logo dark gray
- Foreground: `#f5f2ed` - Warm off-white text
- Card: `#3c3c3b` - Logo dark gray for cards
- Primary: `#b13d38` - Brighter red for dark mode (not logo-exact)
- Secondary: `#4a4a48` - Lighter than card
- Muted: `#4a4a48` - Dark subtle background
- Border: `#4a4a48` - Dark borders

**Semantic Colors:**

Light Mode:
- Destructive: `#7c3aed` - Violet-600 (distinct from PACON red)
- Success: `#4a7c59` - Professional green
- Warning: `#d97706` - Amber warning
- Info: `#0369a1` - Professional blue

Dark Mode:
- Destructive: `#a855f7` - Purple-500 (brighter for dark bg)
- Success: `#5d9b6d` - Brighter green
- Warning: `#f59e0b` - Brighter amber
- Info: `#3b82f6` - Brighter blue

**Rationale:** Destructive uses purple/violet instead of red to clearly distinguish error states from the PACON brand red (Primary) and ensure logo visibility.

### Typography

- **Headings**: Poppins (with Arial fallback)
- **Body Text**: Lora (with Georgia fallback)
- **Note**: Fonts should be pre-installed in your environment for best results

## Features

### Smart Font Application

- Applies Poppins font to headings (24pt and larger)
- Applies Lora font to body text
- Automatically falls back to Arial/Georgia if custom fonts unavailable
- Preserves readability across all systems

### Text Styling

- Headings (24pt+): Poppins font
- Body text: Lora font
- Smart color selection based on background
- Preserves text hierarchy and formatting

### Shape and Accent Colors

- Non-text shapes use accent colors
- Cycles through orange, blue, and green accents
- Maintains visual interest while staying on-brand

## Technical Details

### Font Management

- Uses system-installed Poppins and Lora fonts when available
- Provides automatic fallback to Arial (headings) and Georgia (body)
- No font installation required - works with existing system fonts
- For best results, pre-install Poppins and Lora fonts in your environment

### Color Application

- Uses RGB color values for precise brand matching
- Applied via python-pptx's RGBColor class
- Maintains color fidelity across different systems
