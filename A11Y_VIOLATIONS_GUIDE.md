# Accessibility Violations Found in Personal Files - A11y POC Tests

## Summary
Found **4 types of violations** with **6 affected elements** during test runs. Below is a detailed explanation of each violation, how to reproduce it manually, and the impact.

---

## Violation #1: `aria-required-children`
**Severity:** 🔴 CRITICAL  
**Count:** 2 nodes affected

### What It Is:
Elements with specific ARIA roles require certain child elements to function properly. When a parent role expects children with specific roles, but they're missing, screen readers can't navigate the structure correctly.

### Example:
```html
<!-- WRONG: menubar role requires menuitem children -->
<div role="menubar">
  <button>File</button>  <!-- ❌ Should be role="menuitem" -->
</div>

<!-- CORRECT: -->
<div role="menubar">
  <div role="menuitem">File</div>
</div>
```

### Where Found in Code:
- **Element:** `#cdk-drop-list-2` (CDK Drag & Drop list)
- **Issue:** Likely a drag-drop list container missing required ARIA child roles

### How to Reproduce Manually:
1. Navigate to Personal Files
2. Look for drag-and-drop interactions (file/folder lists)
3. Open DevTools (F12)
4. Inspect the drop list container
5. Check if children have proper role attributes (e.g., `role="listitem"`)
6. Run axe in DevTools Console:
   ```javascript
   const results = await axe.run();
   results.violations.find(v => v.id === 'aria-required-children');
   ```

### How to Fix:
```typescript
// Add proper ARIA roles to children
<div role="list">
  <div role="listitem" data-automation-id="datatable-row-0">
    <!-- content -->
  </div>
</div>
```

---

## Violation #2: `empty-heading`
**Severity:** 🟡 MINOR  
**Count:** 1 node affected

### What It Is:
A heading element (`<h1>`, `<h2>`, `<div role="heading">`, etc.) exists but has no discernible text content. Screen reader users can't understand what the heading is for.

### Example:
```html
<!-- WRONG: Empty heading -->
<h2 aria-label=""></h2>  <!-- ❌ No text, empty aria-label -->
<div role="heading"></div>  <!-- ❌ No content -->

<!-- CORRECT: -->
<h2>Page Title</h2>
<div role="heading">Section Title</div>
```

### Where Found in Code:
- **Element:** `div[role="heading"]`
- **Issue:** Heading exists but has no text content inside

### How to Reproduce Manually:
1. Navigate to Personal Files
2. Open DevTools (F12)
3. Run in Console:
   ```javascript
   // Find all headings
   document.querySelectorAll('[role="heading"], h1, h2, h3, h4, h5, h6').forEach(h => {
     const text = h.textContent?.trim();
     if (!text) console.log('Empty heading found:', h);
   });
   ```
4. Or use axe:
   ```javascript
   const results = await axe.run();
   results.violations.find(v => v.id === 'empty-heading');
   ```

### How to Fix:
```typescript
// Add text content to headings
<div role="heading" aria-level="2">Personal Files</div>
```

---

## Violation #3: `nested-interactive`
**Severity:** 🔴 SERIOUS  
**Count:** 2 nodes affected

### What It Is:
Interactive controls (buttons, links) are nested inside other interactive elements. This breaks keyboard navigation and confuses screen readers because they can't determine which element should handle the interaction.

### Example:
```html
<!-- WRONG: Button inside button -->
<button>
  Click me
  <button>Sub-action</button>  <!-- ❌ Nested button -->
</button>

<!-- WRONG: Link inside link -->
<a href="/page1">
  Go to page 1
  <a href="/page2">Also go to page 2</a>  <!-- ❌ Nested link -->
</a>

<!-- CORRECT: Use different container -->
<button>Click me</button>
<button>Sub-action</button>
```

### Where Found in Code:
- **Elements:** 
  - `div[aria-description="Ascending by Name"]` (sorting column header)
  - `div[aria-label="Sortable Size"]` (sortable column)
- **Issue:** Interactive elements nested within other interactive containers (likely sortable column headers with nested buttons/divs)

### How to Reproduce Manually:
1. Navigate to Personal Files data table
2. Look at the **column headers** (Name, Size, Modified, etc.)
3. Open DevTools (F12)
4. Right-click on a column header → Inspect
5. Look for nested buttons or links:
   ```html
   <div role="columnheader" aria-sort="ascending">
     <div>Name</div>
     <button>Sort</button>  <!-- ❌ If there's a button here for sorting -->
     <button>Filter</button>  <!-- ❌ And another button -->
   </div>
   ```
6. Run axe to confirm:
   ```javascript
   const results = await axe.run();
   results.violations.find(v => v.id === 'nested-interactive');
   ```

### How to Fix:
```typescript
// Structure 1: Make parent a single interactive element
<button role="columnheader" aria-sort="ascending">
  Name
  <span aria-hidden="true">↑</span>
</button>

// Structure 2: Use separate, non-nested interactive elements
<div role="columnheader">
  <button aria-label="Sort by Name ascending">Name ↑</button>
</div>
```

---

## Violation #4: `role-img-alt`
**Severity:** 🔴 SERIOUS  
**Count:** 1 node affected

### What It Is:
An element with `role="img"` (which should be treated as an image) must have alternative text via `aria-label` or `aria-labelledby`. Without alt text, screen readers can't describe the image to users.

### Example:
```html
<!-- WRONG: Image role without alt text -->
<div role="img" style="background: url('icon.svg')"></div>  <!-- ❌ No alt -->
<span role="img"></span>  <!-- ❌ Empty, no aria-label -->

<!-- CORRECT: Image role with alt text -->
<div role="img" aria-label="Ascending sort indicator"></div>
<span role="img" aria-label="Warning icon"></span>
```

### Where Found in Code:
- **Element:** `.mat-badge` (Material badge component)
- **Issue:** Badge element likely has `role="img"` but no `aria-label`

### How to Reproduce Manually:
1. Navigate to Personal Files
2. Look for **Material badge indicators** (like notification counts, status badges)
3. Open DevTools (F12)
4. Find the badge element:
   ```javascript
   // Find all elements with role="img"
   document.querySelectorAll('[role="img"]').forEach(el => {
     const ariaLabel = el.getAttribute('aria-label');
     const ariaLabelledBy = el.getAttribute('aria-labelledby');
     if (!ariaLabel && !ariaLabelledBy) {
       console.log('Image without alt text:', el);
     }
   });
   ```
5. Run axe to confirm:
   ```javascript
   const results = await axe.run();
   results.violations.find(v => v.id === 'role-img-alt');
   ```

### How to Fix:
```typescript
// Add aria-label to badge
<span role="img" aria-label="3 new items">
  <mat-badge content="3"></mat-badge>
</span>

// OR use aria-labelledby
<span id="badge-label">New items</span>
<span role="img" aria-labelledby="badge-label">
  <mat-badge content="3"></mat-badge>
</span>
```

---

## Quick Reference: How to Run Axe Manually in Console

### Step 1: Open DevTools
```
Press F12 (or Cmd+Option+I on Mac)
```

### Step 2: Go to Console tab

### Step 3: Paste and run:
```javascript
// Run axe accessibility checker
const results = await axe.run();

// Show all violations
console.table(results.violations.map(v => ({
  id: v.id,
  impact: v.impact,
  nodes: v.nodes.length,
  description: v.description
})));

// Show detailed info for a specific violation
results.violations.forEach(v => {
  console.log(`\n${v.id} (${v.impact}):`);
  console.log(v.description);
  console.log('Affected elements:', v.nodes.map(n => n.target));
});
```

---

## Checklist for Logging Issues

When you find an accessibility violation, create an issue with:

- [ ] **Violation ID:** (e.g., `aria-required-children`)
- [ ] **Severity:** 🔴 Critical / 🔴 Serious / 🟡 Minor
- [ ] **Number of Elements Affected:** (e.g., 2 nodes)
- [ ] **Description:** What the violation is
- [ ] **Steps to Reproduce:** How to see it manually
- [ ] **Expected Behavior:** What should happen
- [ ] **Code Example:** HTML/component code showing the issue
- [ ] **How to Fix:** Proposed solution with code example
- [ ] **Impact:** How it affects users (especially screen reader users)

---

## Impact Summary

| Violation | Impact | Users Affected | Priority |
|-----------|--------|---|----------|
| `aria-required-children` | Can't navigate complex structures | Screen reader users | 🔴 Critical |
| `empty-heading` | Don't know section purpose | Screen reader users | 🟡 Medium |
| `nested-interactive` | Can't activate controls properly | Keyboard & screen reader users | 🔴 Critical |
| `role-img-alt` | Don't understand visual content | Screen reader & vision impaired users | 🔴 Critical |

---

## Next Steps

1. ✅ **Document violations** - Use this guide to explain them to the team
2. 🔍 **Create tickets** - Log issues in your tracking system (Jira, GitHub Issues, etc.)
3. 📋 **Prioritize fixes** - Focus on Critical/Serious issues first
4. 🔧 **Fix incrementally** - Address issues in sprints as capacity allows
5. ✔️ **Re-test** - Run the A11y tests again after fixes to confirm

