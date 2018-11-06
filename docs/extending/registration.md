---
---

# Registration

You can use `ExtensionService` to register custom components, authentication guards,
rule evaluators, etc.

It is recommended to register custom content from within the module constructor.
In that case all plugins will be available right after the main application component is ready.

Update the main application module `app.module.ts`, or create your own module,
and use the following snippet to register custom content:

```ts
import { ExtensionsModule, ExtensionService } from '@alfresco/adf-extensions';

@NgModule({
    imports: [ ExtensionsModule.forChild() ]
    declarations: [ MyComponent1, MyLayout ],
    entryComponents: [ MyComponent1, MyLayout ]
})
export class MyExtensionModule {

    constructor(extensions: ExtensionService) {
        extensions.setComponents({
            'plugin1.components.my': MyComponent1,
            'plugin1.layouts.my': MyLayout
        });

        extensions.setAuthGuards({
            'plugin.auth': MyAuthGuard
        });

        extensions.setEvaluators({
            'plugin1.rules.custom1': MyCustom1Evaluator,
            'plugin1.rules.custom2': MyCustom2Evaluator
        });
    }

}
```

Use `ExtensionsModule.forChild()` when importing into the child modules,
and `ExtensionsModule.forRoot()` for the main application module.

<p class="warning">
According to Angular rules, all components that are created dynamically at runtime
need to be registered within the `entryComponents` section of the NgModule.
</p>

The Registration API is not limited to the custom content only.
You can replace any existing entries by replacing the values from your module.
