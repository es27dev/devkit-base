---
name: webapp-testing
description: Interactive testing toolkit for local web applications using Chrome DevTools MCP. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and inspecting console logs - all with visual feedback in real-time.
license: Complete terms in LICENSE.txt
---

# Web Application Testing (Chrome DevTools MCP)

To test local web applications interactively, use Chrome DevTools MCP tools. This provides **visual feedback** - you can see the browser in real-time while AI performs tests.

**Key Advantage**: Unlike headless testing frameworks, Chrome MCP allows collaborative debugging where both you and AI can see and interact with the same browser instance.

---

## Prerequisites Check

**CRITICAL: Always check if dev server is already running before starting a new one**

```bash
# Check if Vite dev server is running on port 5173
curl http://localhost:5173 2>/dev/null || echo "Server not running"
```

**Why this matters**: Running multiple dev servers simultaneously causes port conflicts and resource waste.

**If server is not running**:
```bash
npm run dev
```

**If server is already running**: Proceed directly to testing with Chrome MCP.

---

## Chrome DevTools MCP Workflow

### Step 1: Open Page

**New page**:
```
mcp__chrome-devtools__new_page(url: "http://localhost:5173")
```

**Or navigate existing page**:
```
mcp__chrome-devtools__navigate_page(url: "http://localhost:5173")
```

### Step 2: Inspect DOM

**Take snapshot** to find element UIDs:
```
mcp__chrome-devtools__take_snapshot()
```

Returns accessible tree with UIDs like:
```
[uid=123] button "Submit Form"
[uid=456] textbox "Email Address"
```

### Step 3: Interact

**Click elements**:
```
mcp__chrome-devtools__click(uid: "123")
```

**Fill forms**:
```
mcp__chrome-devtools__fill(uid: "456", value: "test@example.com")
```

**Fill multiple fields at once**:
```
mcp__chrome-devtools__fill_form(elements: [
  {uid: "456", value: "test@example.com"},
  {uid: "789", value: "password123"}
])
```

### Step 4: Verify

**Take screenshot**:
```
mcp__chrome-devtools__take_screenshot(filePath: "/path/to/screenshot.png")
```

**Check console for errors**:
```
mcp__chrome-devtools__list_console_messages(types: ["error", "warn"])
```

**Inspect network requests**:
```
mcp__chrome-devtools__list_network_requests(resourceTypes: ["xhr", "fetch"])
```

---

## Available MCP Tools

### Navigation & Page Management
- `list_pages()` - List all open browser tabs
- `select_page(pageIdx)` - Switch to specific tab
- `new_page(url)` - Open new tab
- `navigate_page(url)` - Navigate current tab
- `navigate_page_history(navigate: "back"|"forward")` - Browser history
- `close_page(pageIdx)` - Close tab

### DOM Inspection & Interaction
- `take_snapshot(verbose?)` - Get accessible tree with UIDs
- `click(uid, dblClick?)` - Click element
- `hover(uid)` - Hover over element
- `fill(uid, value)` - Fill input/select
- `fill_form(elements)` - Fill multiple fields at once
- `drag(from_uid, to_uid)` - Drag and drop

### Verification & Debugging
- `take_screenshot(uid?, fullPage?, filePath?)` - Capture visuals
- `list_console_messages(types?, pageSize?)` - Get console logs
- `get_console_message(msgid)` - Full message details
- `list_network_requests(resourceTypes?, pageSize?)` - Network activity
- `get_network_request(reqid)` - Request/response details
- `evaluate_script(function, args?)` - Run custom JavaScript

### Advanced
- `resize_page(width, height)` - Test responsive breakpoints
- `emulate_cpu(throttlingRate)` - Performance testing
- `emulate_network(throttlingOption)` - Network conditions
- `upload_file(uid, filePath)` - File input testing
- `wait_for(text, timeout?)` - Wait for text to appear
- `handle_dialog(action, promptText?)` - Handle alerts/confirms

---

## Test Patterns

### Pattern 1: Form Validation Testing

**Goal**: Test that form validates correctly and shows error messages.

```
1. navigate_page("http://localhost:5173/contact")
2. take_snapshot() → find submit button UID
3. click(uid="submit-btn") → trigger validation
4. take_snapshot() → verify error messages visible
5. list_console_messages(types=["error"]) → check for JS errors
```

### Pattern 2: Navigation Flow Testing

**Goal**: Test multi-page user flow (e.g., signup → dashboard).

```
1. navigate_page("http://localhost:5173/signup")
2. take_snapshot() → find form field UIDs
3. fill_form([
     {uid="email", value="test@example.com"},
     {uid="password", value="secure123"}
   ])
4. click(uid="signup-btn")
5. wait_for("Welcome to Dashboard")
6. take_screenshot() → verify dashboard loaded
```

### Pattern 3: Responsive Testing

**Goal**: Test layout at different breakpoints.

```
1. navigate_page("http://localhost:5173")
2. resize_page(375, 667) → Mobile (iPhone SE)
3. take_screenshot(filePath="mobile.png")
4. resize_page(1920, 1080) → Desktop
5. take_screenshot(filePath="desktop.png")
6. Compare screenshots visually
```

### Pattern 4: Error State Testing

**Goal**: Verify error handling (e.g., API failure).

```
1. navigate_page("http://localhost:5173/dashboard")
2. emulate_network("Offline") → simulate network failure
3. click(uid="load-data-btn")
4. wait_for("Failed to load data")
5. list_console_messages(types=["error"]) → check error logs
6. emulate_network("No emulation") → restore network
```

### Pattern 5: Dark Mode Toggle Testing

**Goal**: Test theme switching.

```
1. navigate_page("http://localhost:5173")
2. take_screenshot(filePath="light-mode.png")
3. click(uid="theme-toggle")
4. take_screenshot(filePath="dark-mode.png")
5. evaluate_script("() => document.documentElement.classList.contains('dark')")
```

### Pattern 6: Performance Testing (Core Web Vitals)

**Goal**: Generate performance report for testing agent.

```
1. navigate_page("http://localhost:5173/[target-page]")
2. performance_start_trace(reload=true, autoStop=true)
3. wait for trace completion
4. performance_stop_trace() → returns Core Web Vitals
5. Output report with:
   - LCP (target: <2.5s) - Red/Orange/Green
   - FID (target: <100ms) - Red/Orange/Green
   - CLS (target: <0.1) - Red/Orange/Green
   - Performance Insights (if any)
6. analyze_insight(insightName="LCPBreakdown") for failures
```

**Report Format:**
```
Performance Report - [Page Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ LCP: 2.1s (Green - Target: <2.5s)
✗ FID: 150ms (Red - Target: <100ms)
✓ CLS: 0.05 (Green - Target: <0.1)

Issues:
- FID exceeds threshold by 50ms
- Main thread blocked by heavy JavaScript execution

Insights:
[LCPBreakdown details if applicable]

Status: REQUIRES_PATCH
```

---

## Reconnaissance-Then-Action Pattern

**Best practice for unknown UIs:**

1. **Take snapshot first** - Always start with `take_snapshot()` to see available elements
2. **Identify target UIDs** - Find buttons, inputs, links by their text/role
3. **Execute actions** - Use discovered UIDs for interactions
4. **Verify results** - Take screenshots or snapshots to confirm

**Example**:
```
User: "Test the login form"
AI:
1. take_snapshot() → discovers [uid=123] textbox "Email", [uid=456] textbox "Password", [uid=789] button "Login"
2. fill(uid="123", value="test@example.com")
3. fill(uid="456", value="password")
4. click(uid="789")
5. wait_for("Dashboard")
```

---

## Common Pitfalls

### ❌ Don't: Start new dev server without checking
**Problem**: Multiple servers cause port conflicts.
**Solution**: Always check `curl localhost:5173` first.

### ❌ Don't: Click before page loads
**Problem**: Elements may not be interactive yet.
**Solution**: Use `wait_for(text)` or take snapshot first to verify page is ready.

### ❌ Don't: Hardcode UIDs
**Problem**: UIDs change between page loads.
**Solution**: Always take fresh snapshot to get current UIDs.

### ❌ Don't: Ignore console errors
**Problem**: Silent JS errors break functionality.
**Solution**: Check `list_console_messages()` after interactions.

---

## Best Practices

1. **Server Management**
   - Check if server is running before starting new one
   - Use `curl localhost:5173` to verify
   - Keep one dev server per project

2. **Visual Verification**
   - Take screenshots at key test points
   - User can see browser in real-time (collaborative debugging)
   - Compare before/after states visually

3. **Element Discovery**
   - Always start with `take_snapshot()`
   - Use descriptive element text to find UIDs
   - Re-snapshot after page changes

4. **Error Handling**
   - Check console messages after interactions
   - Inspect network requests for API failures
   - Use `evaluate_script()` for custom checks

5. **Test Isolation**
   - Each test should start from known state
   - Clear localStorage/cookies between tests if needed
   - Reset network emulation after tests

---

## Project-Specific Configuration

**For PACON Vite + React App:**

- Dev server: `npm run dev` → http://localhost:5173
- Tech stack: React 18 + TypeScript + Tailwind CSS + shadcn/ui
- Routes: `/home`, `/mehr-erfahren`, `/karriere`, `/vertrieb`
- Dark mode: Toggle in navbar (check `.dark` class on `<html>`)

**Common test scenarios:**
- Form submissions (react-hook-form + Zod validation)
- i18n translations (react-i18next)
- Responsive layouts (Tailwind breakpoints)
- Component interactions (shadcn/ui components)

---

## Comparison: Chrome MCP vs. Playwright

| Feature | Chrome MCP (This Skill) | Playwright Python |
|---------|------------------------|-------------------|
| **Visual Feedback** | ✅ See browser in real-time | ❌ Headless only |
| **Interactive** | ✅ User can intervene | ❌ Fully automated |
| **Setup** | ✅ No extra install (MCP built-in) | ⚠️ Requires Python + packages |
| **Debugging** | ✅ Collaborative (AI + User) | ❌ Solo debugging |
| **CI/CD** | ⚠️ Not ideal (requires GUI) | ✅ Perfect for pipelines |
| **Learning Curve** | ✅ Intuitive (click, fill, screenshot) | ⚠️ Python scripting required |

**Recommendation**: Use Chrome MCP for development/debugging. Use Playwright for CI/CD automated testing.

---

## References

- **Chrome DevTools Protocol**: Foundation for all MCP tools
- **MCP Specification**: https://modelcontextprotocol.io
- **PACON Stack**: React 18 + Vite + Tailwind v4 + shadcn/ui

---

**License**: MIT (same as MCP SDK)

**Version**: 2.0.0 (Chrome MCP Edition)
**Last Updated**: 2025-11-03
**Replaces**: Playwright Python version (1.x)
