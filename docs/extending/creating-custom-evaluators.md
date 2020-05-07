---
Title: Creating custom evaluators
---

# Creating custom evaluators

Rule evaluators are plain JavaScript (or TypeScript) functions that take `RuleContext` references and an optional list of `RuleParameter` instances.

Application provides a special
[RuleEvaluator](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/extensions/src/lib/config/rule.extensions.ts)
type alias for evaluator functions:

```ts
export type RuleEvaluator = (context: RuleContext, ...args: any[]) => boolean;
```

Create a function that is going to check if a user has selected one or multiple nodes.

```ts
export function hasSelection(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  return !context.selection.isEmpty;
}
```

The `context` is a reference to a special instance of the [RuleContext](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/extensions/src/lib/config/rule.extensions.ts) type,
that provides each evaluator access to runtime entities.

```ts
export interface RuleContext {
  selection: SelectionState;
  navigation: NavigationState;
  permissions: NodePermissions;

  getEvaluator(key: string): RuleEvaluator;
}
```

The `SelectionState` interface exposes information about the global selection state:

```ts
export interface SelectionState {
  count: number;
  nodes: MinimalNodeEntity[];
  libraries: SiteEntry[];
  isEmpty: boolean;
  first?: MinimalNodeEntity;
  last?: MinimalNodeEntity;
  folder?: MinimalNodeEntity;
  file?: MinimalNodeEntity;
  library?: SiteEntry;
}
```

Next, register the function you have created earlier with the `ExtensionService` and give it a unique identifier:

```ts
extensions.setEvaluators({
  'plugin1.rules.hasSelection': hasSelection
});
```

Now, the `plugin1.rules.hasSelection` evaluator can be used as an inline rule reference,
or part of the composite rule like `core.every`.

**Tip:** See the [Registration](/extending/registration) section for more details
on how to register your own entries to be re-used at runtime.
