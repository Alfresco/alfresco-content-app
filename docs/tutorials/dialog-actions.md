---
Title: Dialog actions
---

# Dialog actions

In this tutorial, we are going to create an action that invokes a custom material dialog.

Please read more details on Dialog components here: [Dialog Overview](https://material.angular.io/components/dialog/overview)

## Create a dialog

```sh
ng g component dialogs/my-extension-dialog --module=app
```

According to Angular rules, the component needs to also be registered within the `entryComponents` section of the module.

Update the `src/app/app.module.ts` file according to the example below:

```ts
@NgModule({
  imports: [...],
  declarations: [
    ...,
    MyExtensionDialogComponent
  ],
  entryComponents: [
    ...,
    MyExtensionDialogComponent
  ]
})
```

Update `my-extension-dialog.component.ts`:

```ts
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'aca-my-extension-dialog',
  templateUrl: './my-extension-dialog.component.html',
  styleUrls: ['./my-extension-dialog.component.scss']
})
export class MyExtensionDialogComponent {
  constructor(public dialogRef: MatDialogRef<MyExtensionDialogComponent>) {}
}
```

Update `my-extension-dialog.component.html`:

```html
<h2 mat-dialog-title>Delete all</h2>
<mat-dialog-content>Are you sure?</mat-dialog-content>
<mat-dialog-actions>
  <button mat-button mat-dialog-close>No</button>
  <!-- The mat-dialog-close directive optionally accepts a value as a result for the dialog. -->
  <button mat-button [mat-dialog-close]="true">Yes</button>
</mat-dialog-actions>
```

## Create an action

Append the following code to the `src/app/store/actions/app.actions.ts`:

```ts
export const SHOW_MY_DIALOG = 'SHOW_MY_DIALOG';

export class ShowMydDialogAction implements Action {
  readonly type = SHOW_MY_DIALOG;
}
```

See also:

- [Comprehensive Introduction to @ngrx/store](https://gist.github.com/btroncone/a6e4347326749f938510)

## Create an effect

Update `src/app/store/effects/app.effects.ts`:

```ts
import { ShowMydDialogAction, SHOW_MY_DIALOG } from '../actions/app.actions';

@Injectable()
export class AppEffects {
  constructor(...) {}

  @Effect({ dispatch: false })
  showMyDialog$ = this.actions$.pipe(
    ofType<ShowMydDialogAction>(SHOW_MY_DIALOG),
    map(() => {})
  );

  // ...
}
```

See also:

- [Comprehensive Introduction to @ngrx/store](https://gist.github.com/btroncone/a6e4347326749f938510)

Update to raise a dialog

```ts
import { MatDialog } from '@angular/material/dialog';
import { MyExtensionDialogComponent } from '../../dialogs/my-extension-dialog/my-extension-dialog.component';

@Injectable()
export class AppEffects {
  constructor(
    ...,
    private dialog: MatDialog
  ) {}

  @Effect({ dispatch: false })
  showMyDialog$ = this.actions$.pipe(
    ofType<ShowMydDialogAction>(SHOW_MY_DIALOG),
    map(() => {
      this.dialog.open(MyExtensionDialogComponent)
    })
  );

  ...

}
```

## Register a toolbar action

Update the `src/assets/app.extensions.json` file, and insert a new entry to the `features.toolbar` section:

```json
{
  ...,

  "features": {
    "toolbar": [
      {
        "id": "my.custom.toolbar.button",
        "order": 10,
        "title": "Custom action",
        "icon": "extension",
        "actions": {
          "click": "SHOW_MY_DIALOG"
        }
      }
    ]
  }
}
```

Now, once you run the application, you should see an extra button that invokes your dialog on every click.
