# Feature Specification: Sticky Anchor Navigation

**Feature Branch**: `002-sticky-anchor-nav`
**Created**: 2025-11-07
**Status**: Draft
**Input**: User description: "statt es wie bei about mitten auf der seite zu haben, sollte so eine anchor übersicht auf jeder seite zu sehen und zwar im header. so kann man über die breadcrumbs die anchor der jeweiligen seite navigieren. dafür muss der header aber als sticky header fungieren."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Quick Section Navigation (Priority: P1)

Als Besucher der Website möchte ich schnell zu verschiedenen Abschnitten einer Seite springen können, ohne manuell scrollen zu müssen, damit ich gezielt die Informationen finde, die ich suche.

**Why this priority**: Kernfunktionalität für die Navigation. Ohne diese Funktion hat das Feature keinen Mehrwert.

**Independent Test**: Kann vollständig getestet werden, indem man auf einen Anchor-Link klickt und überprüft, ob die Seite zum entsprechenden Bereich scrollt. Liefert sofort Mehrwert für Nutzer.

**Acceptance Scenarios**:

1. **Given** ich befinde mich auf einer Seite mit Anchor-Navigation (z.B. About), **When** ich auf einen Anchor-Link im Header klicke (z.B. "Mission"), **Then** scrollt die Seite smooth zum entsprechenden Abschnitt
2. **Given** ich klicke auf einen Anchor-Link, **When** das Scrollen abgeschlossen ist, **Then** wird die URL mit dem entsprechenden Hash aktualisiert (z.B. `/about#mission`)
3. **Given** ich teile eine URL mit Hash (z.B. `/about#values`), **When** jemand die URL öffnet, **Then** scrollt die Seite automatisch zum entsprechenden Abschnitt

---

### User Story 2 - Visual Scroll Position Feedback (Priority: P2)

Als Besucher möchte ich sehen, in welchem Abschnitt der Seite ich mich aktuell befinde, damit ich meine Position auf der Seite einordnen kann.

**Why this priority**: Verbessert die User Experience erheblich, ist aber nicht zwingend für die Grundfunktionalität notwendig.

**Independent Test**: Kann getestet werden, indem man manuell durch die Seite scrollt und überprüft, ob der entsprechende Anchor-Link hervorgehoben wird. Funktioniert unabhängig von User Story 1.

**Acceptance Scenarios**:

1. **Given** ich scrolle manuell durch eine Seite, **When** ich in den Bereich eines bestimmten Abschnitts scrolle (z.B. "Mission"), **Then** wird der entsprechende Anchor-Link im Header in Pacon-Rot hervorgehoben
2. **Given** mehrere Abschnitte sind teilweise sichtbar, **When** ich scrolle, **Then** wird der Anchor-Link des Abschnitts hervorgehoben, dessen oberer Rand am nächsten am oberen Viewport-Rand ist
3. **Given** ich befinde mich am Seitenanfang (vor dem ersten Abschnitt), **When** kein spezifischer Abschnitt aktiv ist, **Then** ist kein Anchor-Link hervorgehoben

---

### User Story 3 - Persistent Navigation Access (Priority: P1)

Als Besucher möchte ich die Anchor-Navigation jederzeit sehen können, auch wenn ich nach unten scrolle, damit ich nicht zum Seitenanfang zurückscrollen muss, um zu einem anderen Abschnitt zu navigieren.

**Why this priority**: Kritisch für die Usability. Ohne Sticky-Verhalten ist die Navigation nach dem ersten Scroll nicht mehr zugänglich.

**Independent Test**: Kann getestet werden, indem man nach unten scrollt und überprüft, ob der Header mit der Anchor-Navigation sichtbar bleibt. Liefert sofort Mehrwert.

**Acceptance Scenarios**:

1. **Given** ich befinde mich auf einer Seite mit Anchor-Navigation, **When** ich nach unten scrolle, **Then** bleibt der Header mit Hauptmenü und Anchor-Navigation am oberen Bildschirmrand fixiert
2. **Given** der Header ist sticky, **When** ich weiter scrolle, **Then** überlappt der Header nicht den Seiteninhalt auf störende Weise
3. **Given** ich scrolle schnell durch die Seite, **When** der Header sticky ist, **Then** bleibt die Navigation flüssig und ohne Ruckeln sichtbar

---

### User Story 4 - Page-Specific Anchors (Priority: P2)

Als Content-Manager möchte ich für jede Seite unterschiedliche Anchor-Links definieren können, damit die Navigation zum jeweiligen Seiteninhalt passt.

**Why this priority**: Wichtig für Flexibilität, aber die Implementierung für eine einzelne Seite würde bereits Mehrwert liefern.

**Independent Test**: Kann getestet werden, indem man verschiedene Seiten öffnet und überprüft, ob jeweils unterschiedliche Anchor-Links angezeigt werden.

**Acceptance Scenarios**:

1. **Given** ich bin auf der About-Seite, **When** der Header geladen wird, **Then** werden die About-spezifischen Anchors angezeigt (Mission, Werte, Regionen, etc.)
2. **Given** ich bin auf der Career-Seite, **When** der Header geladen wird, **Then** werden die Career-spezifischen Anchors angezeigt (Jobs, Benefits, Team, etc.)
3. **Given** ich navigiere von About zu Career, **When** die neue Seite lädt, **Then** wechseln die Anchor-Links zur neuen Seite und der aktive State wird zurückgesetzt

---

### User Story 5 - Mobile Navigation Integration (Priority: P2)

Als Mobile-Nutzer möchte ich über das Navigation Sheet auf die Anchor-Links zugreifen können, damit ich auch auf kleinen Bildschirmen gezielt zu Abschnitten navigieren kann, ohne dass der Header überladen wird.

**Why this priority**: Wichtig für Mobile-Usability, aber Desktop-Version kann unabhängig davon funktionieren.

**Independent Test**: Kann getestet werden, indem man auf einem Mobile-Gerät (<768px) das Navigation Sheet öffnet und überprüft, ob Anchor-Links dort verfügbar sind.

**Acceptance Scenarios**:

1. **Given** ich bin auf einem Mobile-Gerät (Viewport <768px), **When** ich eine Seite mit Anchor-Navigation öffne, **Then** wird die horizontale Anchor-Navigation im Header nicht angezeigt
2. **Given** ich bin auf einem Mobile-Gerät, **When** ich das linke Navigation Sheet öffne, **Then** sehe ich die seitenspezifischen Anchor-Links als Unterpunkte oder separate Sektion
3. **Given** ich bin im Mobile Navigation Sheet, **When** ich auf einen Anchor-Link klicke, **Then** schließt sich das Sheet und die Seite scrollt zum entsprechenden Abschnitt
4. **Given** ich wechsle von Mobile- zu Desktop-Ansicht (>768px), **When** die Seite neu rendert, **Then** verschwindet die Anchor-Navigation aus dem Sheet und erscheint im Header

---

### Edge Cases

- Was passiert, wenn ein Seiten-Abschnitt kürzer ist als der Viewport (z.B. sehr kurzer "Mission"-Abschnitt)? Wird der Anchor trotzdem als aktiv markiert, wenn der Abschnitt vollständig sichtbar ist? (Lösung: Mehrere kurze Sections werden zu größeren Sections gebündelt)
- Wie verhält sich die Navigation bei sehr langen Seiten mit vielen Anchor-Links auf Desktop? Umbrechen sie in mehrere Zeilen oder wird horizontal gescrollt?
- Was passiert, wenn ein Nutzer einen nicht existierenden Hash in der URL eingibt (z.B. `/about#nonexistent`)? Scrollt die Seite zum Anfang oder bleibt sie wo sie ist?
- Was passiert beim Scrollen während einer Animation (z.B. Nutzer klickt auf Anchor, beginnt aber sofort manuell zu scrollen)?
- Wie verhält sich die aktive Hervorhebung beim schnellen Scrollen durch mehrere Sections?
- Was passiert, wenn der User im Mobile Navigation Sheet ist und die Anchor-Links sieht, dann aber den Viewport vergrößert (z.B. Tablet dreht von Portrait zu Landscape)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a horizontal navigation bar with anchor links directly below the main menu in the header
- **FR-002**: System MUST make the header (including main menu and anchor navigation) sticky, so it remains visible at the top of the viewport when scrolling
- **FR-003**: System MUST highlight the currently active section's anchor link in Pacon brand red color as the user scrolls through the page
- **FR-004**: System MUST scroll smoothly to the corresponding section when a user clicks on an anchor link
- **FR-005**: System MUST update the browser URL with the appropriate hash fragment when navigating to a section (e.g., `#mission`)
- **FR-006**: System MUST automatically scroll to the correct section when a page is loaded with a hash fragment in the URL
- **FR-007**: System MUST detect which section is currently in the viewport and update the active state of the anchor navigation accordingly
- **FR-008**: System MUST allow each page to define its own set of anchor links specific to its content structure
- **FR-009**: System MUST handle the transition between pages with different anchor configurations without showing stale anchor links
- **FR-010**: System MUST detect scroll position changes in real-time and update the active anchor highlight with minimal delay (perceived as instant by users)
- **FR-011**: System MUST determine the "active" section based on which section's top edge is closest to the top of the viewport (first visible section at top)
- **FR-012**: Anchor navigation MUST be hidden on mobile devices (viewport <768px) and instead be integrated into the mobile navigation sheet
- **FR-013**: System MUST display anchor links within the mobile navigation sheet (left slide-in menu) on devices with viewport width <768px
- **FR-014**: System MUST close the mobile navigation sheet and scroll to the selected section when a user clicks an anchor link within the sheet
- **FR-015**: System MUST dynamically show/hide the horizontal anchor navigation based on viewport width, switching between header display (≥768px) and sheet integration (<768px)

### Key Entities

- **Page Configuration**: Represents a page's anchor link definitions, including anchor ID, display label, and order. Each page defines which sections can be navigated to via the anchor navigation.
- **Scroll Position State**: Tracks the current scroll position and determines which section is currently active based on viewport intersection or scroll offset calculations.
- **Anchor Link Item**: Represents an individual navigation item with properties like label, target section ID, and active state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can navigate to any section of a page within 1 second by clicking an anchor link
- **SC-002**: The active section indicator updates within 100ms of scrolling past a section boundary, appearing instant to users
- **SC-003**: The sticky header remains visible and functional at all scroll positions on pages with anchor navigation
- **SC-004**: 90% of users successfully navigate to their intended section on the first click without confusion
- **SC-005**: Pages with anchor navigation load with the correct section visible if a URL hash is present, within 2 seconds of page load
- **SC-006**: The navigation system works correctly on all target devices (desktop, tablet, mobile) with screen widths from 320px to 2560px
- **SC-007**: Users can share deep links to specific sections and recipients land on the correct section 100% of the time

## Assumptions

- The existing navbar component can be extended to include the anchor navigation without requiring a complete rewrite
- The current routing system (React Router) supports hash-based navigation and URL updates
- Page components can provide their anchor configuration through props or context
- The Pacon brand red color is already defined in the design system (e.g., as a CSS variable or Tailwind color)
- Smooth scrolling is supported in all target browsers (modern browsers have native support)
- Section detection will use Intersection Observer API for performance (supported in all modern browsers)
- The header height is known or can be measured dynamically to offset scroll positions correctly
- A mobile navigation sheet component exists or will be created as part of the mobile navigation enhancement
- The breakpoint for mobile/desktop switching is 768px (standard Tailwind md breakpoint)
- Very short page sections will be combined into larger sections to ensure meaningful anchor navigation
- The mobile navigation sheet will have sufficient space to accommodate anchor links without compromising main navigation items
