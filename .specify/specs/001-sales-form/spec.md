# Feature Specification: Sales Contact Form

**Feature Branch**: `001-sales-form`
**Created**: 2025-11-03
**Status**: Draft
**Input**: User description: "Sales-Formular auf Vertriebsseite für Lead-Erfassung"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Lead Contact Submission (Priority: P1)

Ein potenzieller Kunde besucht die Vertriebsseite und möchte Kontakt aufnehmen. Er füllt das Formular mit seinen Daten aus (Name, Email, Telefon, Nachricht) und sendet es ab.

**Why this priority**: Core MVP - ohne funktionierende Lead-Erfassung kein Business Value. Kritisch für Sales-Team.

**Independent Test**: Besuche Sales Page (`/sales` oder `/vertrieb`), scrolle zum Kontaktformular, fülle alle Felder korrekt aus, klicke "Absenden". Erfolgsmeldung erscheint, Formular wird zurückgesetzt.

**Acceptance Scenarios**:

1. **Given** User ist auf `/vertrieb`, **When** User füllt alle Pflichtfelder aus und klickt "Absenden", **Then** Erfolgsmeldung "Vielen Dank! Wir melden uns in Kürze." erscheint
2. **Given** Formular wurde erfolgreich abgesendet, **When** Erfolgsmeldung erscheint, **Then** Formular wird zurückgesetzt (alle Felder leer)

---

### User Story 2 - Client-Side Validation (Priority: P2)

User füllt Formular aus, macht dabei Fehler (ungültige Email, fehlendes Pflichtfeld). System zeigt sofortige Validierungsfehler an.

**Why this priority**: Verbessert UX erheblich, verhindert ungültige Submissions. Nicht kritisch für MVP, aber wichtig für Qualität.

**Independent Test**: Fülle Formular mit ungültiger Email aus (`test@`). Validierungsfehler "Bitte gültige Email-Adresse eingeben" erscheint bei Email-Feld.

**Acceptance Scenarios**:

1. **Given** User gibt ungültige Email ein (`test@`), **When** User verlässt Email-Feld, **Then** Fehler "Bitte gültige Email-Adresse eingeben" erscheint
2. **Given** User lässt Pflichtfeld leer, **When** User versucht Formular abzusenden, **Then** Fehler "Dieses Feld ist erforderlich" erscheint beim leeren Feld

---

### User Story 3 - Loading State During Submission (Priority: P3)

Während Formular abgesendet wird, sieht User Loading-Indikator und Button ist deaktiviert.

**Why this priority**: Verhindert Doppel-Submissions, gibt visuelles Feedback. Nice-to-have für bessere UX.

**Independent Test**: Fülle Formular aus, klicke "Absenden". Button zeigt Loading-Spinner und ist disabled während Submission.

**Acceptance Scenarios**:

1. **Given** User klickt "Absenden", **When** Formular wird gesendet, **Then** Button zeigt Loading-Spinner und ist disabled
2. **Given** Submission ist erfolgreich, **When** Antwort kommt zurück, **Then** Button wird wieder enabled mit "Absenden" Text

---

### Edge Cases

- Was passiert bei Netzwerkfehler während Submission? (shadcn/ui Sonner Toast mit Error-Message zeigen, Form bleibt ausgefüllt)
- Was passiert bei sehr langer Nachricht (>1000 Zeichen)? (Validierung limitiert auf 500 Zeichen)
- Was passiert bei Sonderzeichen in Name/Nachricht? (Erlaubt, nur XSS-Prevention)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST validate Email-Format client-side (RFC 5322 basic pattern)
- **FR-002**: System MUST validate required fields (Name, Email, Nachricht) vor Submission
- **FR-003**: System MUST zeigen Fehler direkt beim jeweiligen Formular-Feld
- **FR-004**: System MUST Formular nach erfolgreicher Submission zurücksetzen
- **FR-005**: System MUST Success/Error Feedback geben via shadcn/ui Sonner Toast (4 Sekunden Auto-Dismiss, manuell schließbar)
- **FR-006**: System MUST Telefon-Feld optional behandeln (kein required)
- **FR-009**: System MUST Telefon-Eingabe automatisch formatieren (Leerzeichen alle 3 Ziffern, z.B. +49 123 456 789 28)
- **FR-007**: System MUST Nachricht auf 500 Zeichen limitieren
- **FR-008**: System MUST use mock submission handler (console.log) for MVP phase, replaced by Supabase in Phase 8a

### Key Entities

- **Lead Contact Form**: Name (string, required), Email (string, required, validated), Telefon (string, optional, auto-formatted with spaces every 3 digits), Nachricht (string, required, max 500 chars)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: User kann Formular in unter 60 Sekunden ausfüllen und absenden
- **SC-002**: Validierungsfehler erscheinen innerhalb 100ms nach Field-Blur
- **SC-003**: 95% der Submissions mit gültigen Daten sind erfolgreich (keine Tech-Errors)
- **SC-004**: Formular ist responsive und funktioniert auf Mobile/Desktop gleich gut

## Clarifications

### Session 2025-11-03

- Q: Error Handling - Netzwerkfehler: Welche Toast-Library für Error-Feedback verwenden? → A: shadcn/ui Sonner (Toast component) - Standard shadcn toast solution
- Q: Submission Endpoint URL: Wohin wird das Formular submitted? → A: Mock submission handler (console.log für MVP, später Supabase)
- Q: Telefon-Feldformat: Welches Format und Validierung für Telefon-Feld? → A: Automatische Formatierung mit Leerzeichen alle 3 Ziffern (z.B. +49 123 456 789 28)
- Q: Formular-Route und Integration: Eigenständige Page oder Component? → A: Component auf bestehender Sales Page (/sales oder /vertrieb)
- Q: Success Message Dauer: Wie lange wird Success-Toast angezeigt? → A: 4 Sekunden Auto-Dismiss

## Technical Decisions (based on Constitution)

### Component Structure Pattern (§3.2)
**Decision**: 7 Regions Pattern verwenden

**Rationale**: Formular hat mehrere Data Sources (i18n Translations, Form State, Submission Logic) - Region-Pattern hilft Separation.

### State Management (§4.1)
**Decision**: Component-local state mit `react-hook-form`

**Rationale**: <3 components (nur SalesContactForm), kein global state nötig. Form-State via react-hook-form hook.

### Form Library
**Decision**: react-hook-form + Zod (per Constitution §1.1)

**Validation Pattern**: Zod Schema für type-safe validation

```typescript
const salesContactSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  email: z.string().email("Bitte gültige Email-Adresse eingeben"),
  telefon: z.string().optional(),
  nachricht: z.string().min(1, "Nachricht ist erforderlich").max(500, "Maximal 500 Zeichen erlaubt")
});
```

### Component Location
**Decision**: `src/components/features/salesContactForm/`

**Rationale**: Business logic (Form-Submission, Validation) + später DB-Zugriff → features/ (nicht blocks/)

### Integration Pattern
**Decision**: Reusable Component auf bestehender Sales Page

**Rationale**: Component wird in `src/pages/Sales.tsx` (oder `/vertrieb` Route) eingebunden. Keine neue Route erforderlich, flexibel wiederverwendbar.

### shadcn/ui Components (§1.1)
- Form (form, form-field, form-item, form-label, form-control, form-description, form-message)
- Input
- Textarea
- Button
- Sonner (Toast notifications for success/error feedback)

## Implementation Notes

**File Structure**:
```
src/components/features/salesContactForm/
├── sales-contact-form.tsx       # Main form component
├── sales-contact-form.ts        # Barrel export
└── i18n/
    └── locales/
        └── de.json              # Form-specific translations
```

**Next Steps**:
1. `/speckit.plan` - Technische Planung + shadcn/ui Component Research
2. `/speckit.tasks` - Task breakdown
3. Coder implements with mock submission (console.log)
4. Reviewer checks (chrome-devtools MCP)
5. Database-Architect adds Supabase integration (leads table)
