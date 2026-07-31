# A11y Violations - Quick Debugging Guide

## 🔧 How to Debug Accessibility Issues Locally

### Method 1: Using Browser DevTools (Easiest)
```javascript
// Open Console (F12) and paste:
const results = await axe.run();
console.table(results.violations);
```

### Method 2: Inspect Individual Elements
```javascript
// Find elements with specific issues:
document.querySelectorAll('[role="img"]').forEach(el => {
  if (!el.getAttribute('aria-label')) {
    console.log('Missing alt text:', el);
  }
});
```

---

## 📋 Violations Found in Tests

### ❌ Violation 1: ARIA Required Children (CRITICAL)
**Where:** `#cdk-drop-list-2`  
**Problem:** Parent role requires child roles but they're missing  
**Example Issue:** Drop list without proper ARIA hierarchy  
**Manual Test:**
1. Find drag-drop areas in the UI
2. Inspect the container
3. Check if children have `role="listitem"` or similar

```html
<!-- ❌ WRONG -->
<div role="list">
  <div>Item 1</div>
</div>

<!-- ✅ CORRECT -->
<div role="list">
  <div role="listitem">Item 1</div>
</div>
```

---

### ❌ Violation 2: Empty Heading (MINOR)
**Where:** `div[role="heading"]`  
**Problem:** Heading exists but has no text content  
**Manual Test:**
```javascript
// Find empty headings:
document.querySelectorAll('[role="heading"]').forEach(h => {
  if (!h.textContent.trim()) console.log('Empty:', h);
});
```

```html
<!-- ❌ WRONG -->
<div role="heading"></div>

<!-- ✅ CORRECT -->
<div role="heading">Section Title</div>
```

---

### ❌ Violation 3: Nested Interactive (CRITICAL)
**Where:** Column headers (sorting/filtering)  
**Problem:** Interactive elements nested inside other interactive elements  
**Manual Test:**
1. Right-click on a column header (Name, Size, etc.)
2. Inspect the HTML
3. Look for buttons/links inside buttons/links

```html
<!-- ❌ WRONG: Button inside div with button role -->
<div role="button">
  Sort ascending
  <button>Filter</button>
</div>

<!-- ✅ CORRECT: Single interactive element -->
<button aria-label="Sort Name ascending">
  Name <span aria-hidden="true">↑</span>
</button>
```

---

### ❌ Violation 4: Image Alt Text Missing (CRITICAL)
**Where:** `.mat-badge` elements  
**Problem:** `role="img"` without `aria-label` or `aria-labelledby`  
**Manual Test:**
```javascript
// Find images without alt text:
document.querySelectorAll('[role="img"]').forEach(el => {
  if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
    console.log('Missing alt text:', el);
  }
});
```

```html
<!-- ❌ WRONG -->
<span role="img"><mat-badge content="3"></mat-badge></span>

<!-- ✅ CORRECT -->
<span role="img" aria-label="3 notifications">
  <mat-badge content="3"></mat-badge>
</span>
```

---

## 🎯 Quick Fix Checklist

| Issue | Quick Fix | Verification |
|-------|-----------|--------------|
| Nested interactive | Combine into single interactive element | Tab through - only 1 focus stop |
| Missing ARIA children | Add proper roles to children | Run axe - 0 violations |
| Empty heading | Add text or aria-label | Screen reader announces content |
| Missing img alt | Add aria-label or aria-labelledby | Screen reader describes image |

---

## 📝 Logging an Issue

When you find a violation, create a ticket with:

```markdown
## Accessibility Issue: [Violation Type]

**Severity:** 🔴 Critical / 🔴 Serious / 🟡 Minor

**Violation ID:** aria-required-children

**Affected Elements:** 2 nodes
- #cdk-drop-list-2
- adf-datatable-row[data-automation-id="datatable-row-0"]

**Steps to Reproduce:**
1. Navigate to Personal Files
2. Look at drag-drop list area
3. Inspect with axe using DevTools Console

**Expected:** No accessibility violations

**Actual:** aria-required-children violation

**Fix:**
Add role="listitem" to child elements

**Impact:** Screen reader users cannot navigate the structure
```

---

## 🚀 Test Command
```bash
# Run the A11y tests locally:
npm run e2e -- --project=a11y-personal-files
```

---

## 📚 Resources

- [MDN: ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Axe DevTools](https://www.deque.com/axe/devtools/)
- [WebAIM Guidelines](https://webaim.org/)
- [W3C WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
