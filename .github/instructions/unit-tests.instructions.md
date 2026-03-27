---
applyTo: "**/*.spec.ts"
---

# Unit testing best practices

* Write unit tests for components, services, and pipes using Jasmine and Karma.
* Test cases should be reasonably grouped based on tested functionality/behaviour using describe blocks.
* Use plain English test names based on the should <expectedBehavior> when <stateUnderTest> pattern as a guideline.
* Use Angular's TestBed for component testing with mocked dependencies
* Avoid Direct Calls to Component Lifecycle Hooks: Instead of directly invoking lifecycle hooks like `ngOnInit()`, use Angular's testing utilities to trigger them naturally. For example, use `fixture.detectChanges()` to trigger change detection, which will automatically call `ngOnInit()` and other lifecycle hooks in the correct order.
* Use fixture.componentRef.setInput() Instead of Direct Input Assignment: When testing components with inputs, use `fixture.componentRef.setInput()` to set input values. This method ensures that Angular's change detection is properly triggered, allowing the component to react to input changes as it would in a real application.
* Use `provideMockStore` for testing components that rely on NgRx state management. This allows you to mock the store and control the state during tests without needing to set up a full NgRx environment.
* Mock HTTP requests using `provideHttpClientTesting()`
* Import only the minimal required modules
* Avoid NO_ERRORS_SCHEMA and CUSTOM_ELEMENTS_SCHEMA in tests to ensure proper error detection
* Do not verify mocked methods
* Avoid mocking component methods unless necessary; prefer testing actual behavior
* Avoid testing private methods directly; test them through public methods instead
* Avoid testing methods or behaviours of children components; use shallow testing or mock child components instead
* Use the overrideProviders API to replace components, directives, pipes, or services declared deep within the module hierarchy
* Avoid async/await in synchronous unit tests
* Prefer data-automation-id over CSS class when possible
* Do not use toBeDefined() to check if an element is visible.
