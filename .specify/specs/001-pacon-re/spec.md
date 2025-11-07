# Feature Specification: PACON Real Estate Company Website

**Feature Branch**: `001-pacon-re`
**Created**: 2025-11-07
**Status**: Draft
**Input**: User description: "PACON Real Estate facility management company presentation website for potential employees and customers"

## Clarifications

### Session 2025-11-07

- Q: What file formats and size limits should be accepted for CV uploads? → A: PDF only, maximum 10MB
- Q: How should forms handle submission failures when network connection is lost? → A: Show error message with manual retry button
- Q: How should empty sections (logos, jobs) be displayed? → A: Show specific placeholder messages (e.g., "Gerade gibt es keine Jobs", "Die Kunden konnten nicht geladen werden")
- Q: What timeframe should be used for duplicate submission detection? → A: 24 hours
- Q: How should invalid/missing anchor links be handled? → A: Scroll to top of page silently
- Q: Should i18n infrastructure be implemented? → A: Yes, use i18n infrastructure throughout all content areas. Initial content in German only, but structure prepared for future translations

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Main Landing Page (Priority: P1)

As a property decision-maker, I want to understand at a glance what PACON stands for, which core services they offer, where PACON is regionally active, and which customers trust them, so that I request an offer or learn more about PACON in a targeted way.

**Why this priority**: This is the primary entry point for all visitors and must communicate the core value proposition immediately. Without this, the website cannot function as a marketing tool.

**Independent Test**: Can be fully tested by loading the home page and verifying all hero elements, service teasers, customer logos, and regional presence sections are visible and navigable. Delivers immediate brand awareness and initial trust signals.

**Acceptance Scenarios**:

1. **Given** the landing page loads, **When** the hero section is visible, **Then** there is a primary CTA "Angebot anfordern" leading to /sales and a secondary CTA "Jetzt bewerben" leading to /career
2. **Given** the "Unsere Kernleistungen" section, **When** I click "Mehr erfahren", **Then** I am navigated to /about#leistungen
3. **Given** the "Vertraut von bekannten Kunden" section, **When** I click the secondary link, **Then** I am navigated to /about#kunden
4. **Given** the "Regional stark vertreten" section, **When** I click "Standorte ansehen", **Then** I am navigated to /about#regionen
5. **Given** the "Objektbilder und Projekte" section, **When** I click "Referenzen ansehen", **Then** I am navigated to /about#referenzen
6. **Given** the page end, **When** the three CTA cards are visible, **Then** they lead to /sales, /career, and /about
7. **Given** the rest of the page content, **Then** no other links exist besides those mentioned above

---

### User Story 2 - Sales Lead Generation Page (Priority: P2)

As a property decision-maker, I want to see the benefits, core services, implementation process, and contact options from PACON, so that I request an offer or directly book an appointment with sales.

**Why this priority**: This is the primary conversion page for business leads and directly impacts revenue generation. It's the second most critical page after the landing page.

**Independent Test**: Can be fully tested by navigating to /sales, viewing all service information, and successfully submitting the contact form. Delivers lead capture functionality.

**Acceptance Scenarios**:

1. **Given** the sales page loads, **When** the hero section is visible, **Then** three service metrics are shown and a primary CTA "Angebot anfordern" leads to /sales#kontakt
2. **Given** the "Unsere Kernleistungen" section, **When** I read it, **Then** I see 5 services with short benefits and no additional links
3. **Given** the "So läuft die Implementation" section, **When** I open the 3 phases, **Then** each phase shows a brief process with 1 CTA "Unverbindlich anfragen" to /sales#kontakt
4. **Given** the "Objektbilder und Projekte" section, **When** I see the gallery, **Then** 3-6 objects are shown with 1-line impact statements, without external links
5. **Given** the "Jetzt kaufen" section, **When** I fill out the form, **Then** I can submit Name, Email, Phone, Company, Location, Area of Use, Message and receive confirmation
6. **Given** the contact form, **When** I submit valid data, **Then** I see "Danke. Wir melden uns binnen 1 Werktag."
7. **Given** the page end, **When** the two CTA cards are visible, **Then** they lead to /career and /about

---

### User Story 3 - Company Information & Trust Building (Priority: P3)

As a property decision-maker, I want to understand PACON's mission, values, regional presence, references, and certifications, so that I build trust and then contact them or request an offer.

**Why this priority**: This page builds credibility and trust but is not immediately required for initial engagement. Users typically visit this after initial interest from the landing or sales page.

**Independent Test**: Can be fully tested by navigating to /about, scrolling through all sections (mission, values, regions, references, testimonials, certifications, customers, news), and verifying internal anchor navigation. Delivers comprehensive company information.

**Acceptance Scenarios**:

1. **Given** the About page, **When** I open it, **Then** I see H1 "Über pacon" and a brief introduction
2. **Given** the internal navigation, **When** I click on a section, **Then** the page jumps to /about#mission, #werte, #regionen, #referenzen, #kundenstimmen, #zertifikate, #kunden, #news
3. **Given** the Mission section, **When** I read it, **Then** I understand PACON's core value proposition for building operations
4. **Given** the Values section, **When** I view it, **Then** I see 4 tiles: Quality, Trust, Innovation, Team
5. **Given** the Regional Presence section, **When** I view it, **Then** I see teams in Berlin, Hamburg, Heidelberg and other regions with contact hints
6. **Given** the References section, **When** I view the gallery, **Then** I see 6-8 images with titles and 1-line impact statements
7. **Given** the Customer Testimonials section, **When** I read it, **Then** I see 3 quotes with 1-2 sentences each
8. **Given** the Certifications section, **When** I view it, **Then** I see badges for ISO 9001, ISO 14001, GEFMA guidelines, VDI 6000
9. **Given** the Customers section, **When** I view it, **Then** I see 8-12 customer logos
10. **Given** the page end, **When** the three CTA cards are visible, **Then** they lead to /sales, /career, and /about

---

### User Story 4 - Career & Job Applications (Priority: P4)

As an applicant in the FM environment, I want to quickly see how PACON works, which positions are open, what benefits exist, and who the team is, so that I apply for a suitable position or submit an unsolicited application.

**Why this priority**: While important for recruitment, this is the lowest priority for initial website launch as it doesn't directly impact immediate business revenue. Can be added after core marketing pages are established.

**Independent Test**: Can be fully tested by navigating to /career, filtering job listings by location, viewing team profiles and benefits, and successfully submitting an application. Delivers recruitment functionality.

**Acceptance Scenarios**:

1. **Given** the Career page, **When** the hero is visible, **Then** there are CTAs "Jetzt bewerben" → /career#jobs and "Auch initiativ" → /career#initiativ
2. **Given** the "Mitarbeiterstimmen" section, **When** I use the slider navigation, **Then** I see at least 3 testimonials
3. **Given** the "Offene Stellen" section, **When** I select a location filter (Alle, Heidelberg, Berlin, Hamburg), **Then** only matching jobs are listed
4. **Given** a job teaser, **When** I click "Für diese Stelle bewerben", **Then** the page jumps to /career#bewerben with pre-filled job title
5. **Given** the "Unser Team" section, **When** I view profiles, **Then** I see Name, Role, Focus in one sentence
6. **Given** the "Deine Benefits" section, **When** I view the tiles, **Then** there are at least 6 benefits with 1 sentence each explaining them
7. **Given** the application form, **When** I fill it out, **Then** I can submit Name, Email, Location, Job Title (readonly if from teaser), CV Upload, Message
8. **Given** the page end, **When** the CTA cards are visible, **Then** they lead to /career#bewerben, /career#initiativ, /about

---

### Edge Cases

- What happens when a user tries to navigate to an anchor link (e.g., /about#mission) that doesn't exist or hasn't loaded yet? System must scroll to top of page silently without error message.
- How does the system handle form submissions when network connection is lost? System must display clear error message with manual retry button.
- What happens when a mobile user tries to view content that doesn't fit on screen? System should use bottom sheet pattern to display overflow content.
- How does the system handle invalid file uploads in application forms (wrong format, too large)? System should validate and show clear error messages before submission.
- What happens when the customer logo wall or job listings are empty? System must display specific contextual placeholder messages (e.g., "Gerade gibt es keine offenen Stellen", "Die Kundenlogos konnten nicht geladen werden").
- How does the system handle extremely long job descriptions or company names in forms? System should truncate with ellipsis or provide scrollable containers.
- What happens when a user submits duplicate applications or contact requests? System must detect duplicates within 24 hours and show confirmation that previous submission exists.

## Requirements *(mandatory)*

### Functional Requirements

**Main Landing Page**:

- **FR-001**: System MUST display a hero section with H1 "pacon Real Estate – Wir kümmern uns um die Technik", subline "Betrieb, Instandhaltung, Services. Messbar besser.", and two CTAs ("Angebot anfordern" → /sales, "Jetzt bewerben" → /career)
- **FR-002**: System MUST display "Unsere Kernleistungen" section with 5 service bullets (Technisches FM, Infrastrukturelle Services, Betreiberverantwortung & Compliance, Energie & Nachhaltigkeit, Digitalisierung & Reporting) and link to /about#leistungen
- **FR-003**: System MUST display "Vertraut von bekannten Kunden" logo wall with link to /about#kunden
- **FR-004**: System MUST display "Regional stark vertreten" section with locations (Berlin, Hamburg, Heidelberg) and link to /about#regionen
- **FR-005**: System MUST display "Objektbilder und Projekte" gallery section with link to /about#referenzen
- **FR-006**: System MUST display optional "Unsere Mission" teaser with copy "Nachhaltiger Gebäudebetrieb. Messbar, sicher, wirtschaftlich"
- **FR-007**: System MUST display three CTA cards at page end linking to /sales, /career, and /about
- **FR-008**: System MUST NOT include any links besides those explicitly specified in acceptance scenarios

**Sales Page**:

- **FR-009**: System MUST display hero with H1 "Profis für Ihren Gebäudebetrieb", subline "Wartung, Instandhaltung, Services – messbar, sicher, wirtschaftlich", and three metrics (10.000 Anlagen gewartet, 400.000 m² im Griff, 30 Rechnungen nicht geprüft)
- **FR-010**: System MUST display 5 core services with descriptions (Technisches FM, Infrastrukturelle Services, Betreiberverantwortung & Compliance, Energie & Nachhaltigkeit, Digitalisierung & Reporting)
- **FR-011**: System MUST display implementation process with 3 phases (Vorbereitungsphase, Implementierung, Laufender Betrieb) each with CTA to /sales#kontakt
- **FR-012**: System MUST display 3-6 project gallery items with titles and 1-line impact statements
- **FR-013**: System MUST display contact form with fields: Name (required), Email (required), Phone, Company, Location (dropdown: Berlin | Hamburg | Heidelberg | anderes), Area of Use (dropdown: Technisches FM | Infra-Services | Compliance | Energie | Digitalisierung), Message
- **FR-014**: System MUST display contact person details (Mario Unger-Faulhaber, Vertriebsleitung) with phone and email
- **FR-015**: System MUST validate email format before submission
- **FR-016**: System MUST require data processing consent checkbox before submission
- **FR-017**: System MUST display confirmation message "Danke. Wir melden uns binnen 1 Werktag." after successful submission
- **FR-018**: System MUST display privacy notice "Keine Werbung. Keine Weitergabe an Dritte." under form

**About Page**:

- **FR-019**: System MUST display H1 "Über pacon Real Estate GmbH" with 2-sentence introduction
- **FR-020**: System MUST provide internal anchor navigation to sections: #mission, #werte, #regionen, #referenzen, #kundenstimmen, #zertifikate, #kunden, #news
- **FR-021**: System MUST display Mission section with core value proposition
- **FR-022**: System MUST display Values section with 4 tiles (Qualität, Vertrauen, Innovation, Team) each with description
- **FR-023**: System MUST display Regional Presence section with locations (Berlin, Hamburg, Heidelberg) and contact hints
- **FR-024**: System MUST display References section with 6-8 project images with titles and 1-line impact statements
- **FR-025**: System MUST display Customer Testimonials section with 3 quotes (1-2 sentences each)
- **FR-026**: System MUST display Certifications section with badges for ISO 9001, ISO 14001, GEFMA, VDI 6000 with note "Zertifikate auf Anfrage verfügbar"
- **FR-027**: System MUST display Customer logos section with 8-12 logos
- **FR-028**: System MUST display News section with 3 update cards showing text and date

**Career Page**:

- **FR-029**: System MUST display hero with H1 "Arbeiten bei pacon", subline "Technik, die funktioniert. Teams, die wirken. Starte bei uns in FM, Service und Projektmanagement", and two CTAs to #jobs and #initiativ
- **FR-030**: System MUST display Employee Testimonials section with slider showing at least 3 testimonials
- **FR-031**: System MUST display Open Positions section with location filter (Alle, Heidelberg, Berlin, Hamburg)
- **FR-032**: System MUST filter job listings based on selected location
- **FR-033**: System MUST display job teasers with Title, Location, Entry Level, Employment Type, 3 bullet tasks, 3 bullet profile requirements, and CTA to #bewerben with pre-filled job title
- **FR-034**: System MUST display Unsolicited Application section with CTA to #bewerben?job=Initiativ
- **FR-035**: System MUST display Team section with 6-10 profile cards showing Name, Role, 1-sentence focus
- **FR-036**: System MUST display Benefits section with at least 6 benefit tiles (Karriereentwicklung, Weiterbildung, Work-Life-Balance, Teamgeist, Anerkennung, Vielfalt) each with 1-sentence benefit
- **FR-037**: System MUST display application form with fields: Name (required), Email (required), Location, Job Title (readonly if from job teaser), CV Upload, Message
- **FR-038**: System MUST validate CV file format (PDF only) and size (maximum 10MB) before submission
- **FR-039**: System MUST display GDPR notice and contact option with application form
- **FR-040**: System MUST display appropriate field error messages ("Bitte gültige E-Mail angeben", "Dieses Feld ist erforderlich")

**Global/Cross-Page**:

- **FR-041**: System MUST implement PACON brand colors from brand guidelines (Light mode: background #faf8f5, primary #a63631, Dark mode: background #2a2a29, primary #b13d38)
- **FR-042**: System MUST use Poppins font for headings and Lora font for body text with fallbacks
- **FR-043**: System MUST be fully responsive across desktop, tablet, and mobile viewports
- **FR-044**: System MUST implement bottom sheet pattern on mobile for content that doesn't fit on screen
- **FR-045**: System MUST implement proper SEO meta tags for each page (Title, Description, Keywords as specified in user stories)
- **FR-046**: System MUST provide smooth anchor link navigation with scroll behavior
- **FR-047**: System MUST display error message with manual retry button when form submission fails due to network issues
- **FR-048**: System MUST display specific contextual placeholder messages when sections are empty (e.g., "Gerade gibt es keine offenen Stellen" for empty job listings, "Die Kundenlogos konnten nicht geladen werden" for empty customer logos)
- **FR-049**: System MUST detect duplicate form submissions (same email + form type) within 24 hours and display confirmation message that previous submission exists
- **FR-050**: System MUST scroll to top of page silently when navigating to invalid or missing anchor links without displaying error messages
- **FR-051**: System MUST implement i18n infrastructure throughout all content areas using react-i18next with feature-colocated translation files. Initial content in German (de) only, with structure prepared for future language additions

### Key Entities *(include if feature involves data)*

- **Contact Form Submission**: Represents a sales inquiry with Name, Email, Phone, Company, Location, Area of Use, Message, Timestamp, Consent flag
- **Job Application**: Represents a career application with Name, Email, Location, Job Title, CV File reference, Message, Timestamp, GDPR consent
- **Job Listing**: Represents an open position with Title, Location, Entry Level, Employment Type, Tasks list, Profile requirements list, Active status
- **Team Member Profile**: Represents employee information with Name, Role, Focus statement, optional Photo reference
- **Customer Logo**: Represents client reference with Company name, Logo image reference, Display order
- **Project Reference**: Represents completed work with Title, Description (1-line), Image reference, Display order
- **Testimonial**: Represents user quote with Text content, Optional author name/function, Type (Customer/Employee), Display order

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can understand PACON's core value proposition within 10 seconds of landing on the homepage
- **SC-002**: Users can navigate from any page to any other page within 2 clicks
- **SC-003**: Contact form on sales page can be completed in under 3 minutes
- **SC-004**: Job application form can be completed in under 5 minutes
- **SC-005**: All pages load within 3 seconds on standard broadband connection
- **SC-006**: Website is fully functional on mobile devices with viewport width of 320px and above
- **SC-007**: All interactive elements (buttons, forms, links) are accessible via keyboard navigation
- **SC-008**: Form validation provides immediate feedback within 1 second of user input
- **SC-009**: Successful form submission displays confirmation within 2 seconds
- **SC-010**: Website achieves 90/100 or higher on Lighthouse performance score
- **SC-011**: All images are optimized and load progressively without layout shift
- **SC-012**: Contact conversion rate of at least 2% of total visitors (sales form submissions / total visitors)

### SEO Requirements

**Main Page**:
- Title: "pacon Real Estate – Facility Management, Betreiberverantwortung, Referenzen"
- Meta Description: "pacon optimiert den Gebäudebetrieb: FM, Compliance, Energie, Digitalisierung. Regional stark. Jetzt Angebot anfordern."
- Keyword Focus: facility management, betreiberverantwortung, gebäudebetrieb, referenzen

**Sales Page**:
- Title: "pacon Sales – Angebot für Facility Management und Betreiberverantwortung"
- Meta Description: "Angebot für Gebäudebetrieb anfordern: FM, Compliance, Energie, Digitalisierung. Klarer Ablauf, feste Ansprechpartner."

**About Page**:
- Title: "Über pacon Real Estate – Mission, Werte, Referenzen, Zertifikate"
- Meta Description: "pacon Real Estate: Mission, Werte, regionale Präsenz, Referenzen und Zertifikate. Erfahren Sie, warum Kunden uns vertrauen."

**Career Page**:
- Title: "Karriere bei pacon – Jobs im Facility Management, Service, Projekte"
- Meta Description: "Offene Stellen, Team und Benefits bei pacon Real Estate. Jetzt bewerben oder initiativ starten."

## Assumptions *(optional)*

- Application forms will be processed server-side but specification focuses on frontend user experience
- Image assets (logos, project photos, team photos) will be provided by client and optimized before implementation
- Job listings will be manually managed initially (no CMS integration required in MVP)
- Customer testimonials and employee testimonials content will be provided by client
- GDPR compliance for forms follows standard German data protection requirements
- Email notifications for form submissions will be handled server-side (outside scope of this spec)
- All initial content is in German language with i18n infrastructure prepared for future multi-language support
- Website does not require user authentication or login functionality
- Contact form submissions are sent to a single email address initially (no routing logic)
- Analytics tracking (Google Analytics or similar) will be added in a separate implementation phase

## Out of Scope *(optional)*

- User authentication and login system
- Content Management System (CMS) integration
- Additional language translations beyond German (English, other languages) - infrastructure prepared but translations not included in MVP
- Real-time chat or chatbot functionality
- Integration with third-party HR systems or applicant tracking systems
- Integration with CRM systems for lead management
- Payment processing or e-commerce functionality
- Blog or news publishing system
- Advanced analytics dashboard
- A/B testing framework
- Email marketing integration
- Social media feed integration (beyond static links)
- Dynamic content personalization
- Search functionality across website content
- PDF generation for application confirmations

## Dependencies & Constraints *(optional)*

### Dependencies

- Brand assets (logos, fonts, color specifications) available in `.claude/skills/.custom/brand-guidelines/SKILL.md`
- User story content available in `/home/eriks/devkit-base/pacon/` directory (us-main.md, us-about.md, us-career.md, us-sales.md)
- Existing component patterns from `src/pages/Sales.tsx` for reference (bottom sheet pattern, mobile-first approach)
- React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui tech stack already in place

### Constraints

- Must follow PACON brand guidelines strictly (colors, typography)
- Must use existing design system and component library (no new UI frameworks)
- Must maintain mobile-first responsive approach
- Implementation workflow must follow: Text+Layout → Structure Verification → Component Integration
- Bottom sheet pattern must be used for mobile overflow content (following Sales.tsx example)
- Must use named exports only (no default exports) per project conventions
- Must follow naming conventions: kebab-case for files, ComponentNameProps for interfaces
- Must implement proper i18n structure with feature-colocated translations
- No backend APIs or complex logic - frontend-only marketing website
- Forms submit to simple email endpoints (no database persistence in this phase)
