---
Title: Custom route with parameters
---

## Custom route with parameters

In this tutorial, we are going to implement the following features:

- Update the **Trashcan** component to receive and log route parameters.
- Create a new route that points to the **Trashcan** component and uses the main layout.
- Create an action reference that allows redirecting to the new route.
- Create a button in the **New** menu that invokes an action.

Update `src/app/components/trashcan/trashcan.component.ts` and append the following code to the `ngOnInit` body:

```typescript
import { ActivatedRoute, Params } from '@angular/router';

@Component({...})
export class TrashcanComponent {

    constructor(
        // ...
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        // ...

        this.route.params.subscribe(({ nodeId }: Params) => {
            console.log('node: ', nodeId);
        });
    }

}
```

The code above logs the current route parameters to the browser console
and is proof the integration works as expected.

Next, add a new route definition as in the example below:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "routes": [
    {
      "id": "custom.routes.trashcan",
      "path": "ext/trashcan/:nodeId",
      "component": "your.component.id",
      "layout": "app.layout.main",
      "auth": ["app.auth"]
    }
  ]
}
```

The template above creates a new route reference with the id `custom.routes.trashcan` that points to the `ext/trashcan/` route and accepts the `nodeId` parameter.

Also, we are going to use the default application layout (`app.layout.main`)
and authentication guards (`app.auth`).

Next, create an action reference for the `NAVIGATE_ROUTE` application action
and pass route parameters: `/ext/trashcan` for the path, and `10` for the `nodeId` value.

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "routes": [...],

    "actions": [
        {
            "id": "custom.actions.trashcan",
            "type": "NAVIGATE_ROUTE",
            "payload": "$(['/ext/trashcan', '10'])"
        }
    ]
}
```

Finally, declare a new menu item for the `NEW` button and use the `custom.actions.trashcan` action created above.

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "routes": [...],
    "actions": [...],

    "features": {
        "create": [
            {
                "id": "custom.create.trashcan",
                "type": "default",
                "icon": "build",
                "title": "Custom trashcan route",
                "actions": {
                    "click": "custom.actions.trashcan"
                }
            }
        ]
    }
}
```

Now, if you run the application, you should see a new menu item called "Custom Trashcan Route" in the "NEW" dropdown.
Upon clicking this item you should navigate to the `/ext/trashcan/10` route containing a **Trashcan** component.

Check the browser console output and ensure you have the following output:

```text
node:  10
```

You have successfully created a new menu button that invokes your custom action
and redirects you to the extra application route.
