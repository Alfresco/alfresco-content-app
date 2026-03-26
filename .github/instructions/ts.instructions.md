---
applyTo: "**/*.ts"
---

# TypeScript Development Standards

## Type Safety

* Strict Type Checking: Always enable and adhere to strict type checking. This helps catch errors early and improves code quality.
* Prefer Type Inference: Allow TypeScript to infer types when they are obvious from the context. This reduces verbosity while maintaining type safety.
* Avoid `any`: Do not use the `any` type unless absolutely necessary as it bypasses type checking. Prefer `unknown` when a type is uncertain and you need to handle it safely.
* Use strict null checks (no `null` or `undefined` without explicit handling)
* Use type guards and union types for robust type checking

## Naming Conventions

* Use PascalCase for types, interfaces, and classes
* Use camelCase for variables, functions, and methods
* Use UPPER_CASE for constants

## Modern TypeScript Patterns

* Use optional chaining (`?.`) and nullish coalescing (`??`)
* Prefer `const` over `let`; never use `var`
* Use arrow functions for callbacks and short functions
* Avoid enums - they generate additional code at compile time, which increases the size of the final file. This can have a negative impact on the loading speed and performance of the app. Prefer union types or literal types instead.
