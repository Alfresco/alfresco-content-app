---
applyTo: "**/*.ts"
---

# Angular Best Practices

* Standalone Components: Always use standalone components, directives, and pipes. Avoid using `NgModules` for new features or refactoring existing ones.
* Implicit Standalone: When creating standalone components, you do not need to explicitly set `standalone: true` inside the `@Component`, `@Directive` and `@Pipe` decorators, as it is implied by default.
* Lazy Loading: Implement lazy loading for feature routes to improve initial load times of your application.
* Use Angular Material or other modern UI libraries for consistent styling and UI components.
* Implement proper error handling with RxJS operators (e.g., catchError)
* Verify if newly added functionalities can utilize Angular Signals for fine-grained reactivity, reducing change detection overhead.
* Utilize AOT (Ahead-of-Time) compilation and tree-shaking for efficient, smaller bundle sizes.
* Prefer class binding over `ngClass` and `ngStyle` for better performance.
* Use protected on class members that are only used by a component's template, as it allows for better encapsulation while still being accessible to the template.
* Use readonly for properties that shouldn't change.
* Use `takeUntilDestroyed` & `destroyRef`: The `takeUntilDestroyed` and `destroyRef` have been introduced with Angular 16 and help to reduce boilerplate code related to unsubscribing on the `OnDestroy` hook.
* Organize the order of properties and methods in Angular components for readability and maintainability. Recommended order is:
  1. **Injected services** Whether they are public or private, it's clear they are dependencies of the class.
  2. **Inputs**: Properties that receive data from outside.
  3. **Outputs**: Events that the component can trigger.
  4. **ViewChild/ContentChild**: References to HTML elements.
  5. **Public static properties**: Constants and static members that are accessible to everyone.
  6. **Readonly properties**: Immutable public properties.
  7. **Public properties**: Data and functions available to everyone.
  8. **Private static properties**: Constants and static members that are only accessible within the class.
  9. **Private readonly properties**: Immutable private properties.
  10. **Private properties**: Data and functions used only inside the component.
  11. **Setters and Getters**: Methods for accessing and modifying properties.
  12. **Constructor**: Used to initialize the component.
  13. **Lifecycle Hooks**: Methods that run at specific times in the component’s lifecycle.
  14. **Public methods**: Functions available to everyone.
  15. **Private methods**: Functions used only inside the component.

## Components

* Single Responsibility: Keep components small, focused, and responsible for a single piece of functionality.
* Reactive Forms: Prefer Reactive forms over Template-driven forms for complex forms, validation, and dynamic controls due to their explicit, immutable, and synchronous nature.
* Use Typed Forms: Typed Forms in Angular are a new feature introduced in Angular 14 that provide stronger type checking for reactive forms. They allow developers to define the structure and types of form controls, making it easier to catch errors at compile-time rather than runtime.

## Services

* Single Responsibility: Design services around a single, well-defined responsibility.
* `providedIn: 'root'`: Use the `providedIn: 'root'` option when declaring injectable services to ensure they are singletons and tree-shakable.
* `inject()` Function: Prefer the `inject()` function over constructor injection when injecting dependencies, especially within `provide` functions, `computed` properties, or outside of constructor context.
