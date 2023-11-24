# Page Layout Component

Selector: `aca-page-layout`

## Layout Structure

The layout component provides a set of slots for your custom content:

- header
- error
- content

```html
<aca-page-layout>
  
  <div class="aca-page-layout-header">
    <!-- Header Component -->
  </div>
  
  <div class="aca-page-layout-error">
    <!-- Error Component -->
  </div>
  
  <div class="aca-page-layout-content">
    <!-- Main Content -->
  </div>
  
</aca-page-layout>
```

## Layout Header

Supports any HTML or Angular component as a content

```html
<aca-page-layout>
  <div class="aca-page-layout-header">
    <!-- Header Component -->
  </div>
</aca-page-layout>
```

## Layout Error

Supports any HTML or Angular component as the error visualisation.
Displayed only when an error is detected by the parent container component.

```html
<aca-page-layout>
  <div class="aca-page-layout-error">
    <!-- Error Component -->
  </div>
</aca-page-layout>
```

## Layout Content

You can provide any Angular component or HTML element as the main content.
In addition, you can use `aca-scrollable` class to make the content scroll.

The content is displayed only when there are no errors detected.

```html
<aca-page-layout>
  <div class="aca-page-layout-content aca-scrollable">
    <!-- Main Content -->
  </div>
</aca-page-layout>
```
