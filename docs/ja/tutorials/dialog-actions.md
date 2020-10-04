---
Title: ダイアログアクション
nav: ja
---

# ダイアログアクション

このチュートリアルでは、カスタムマテリアルダイアログを呼び出すアクションを作成します。

ダイアログコンポーネントの詳細については、こちらをご覧ください: [ダイアログの概要](https://material.angular.io/components/dialog/overview)

### ダイアログを作成する

```sh
ng g component dialogs/my-extension-dialog --module=app
```

以下の例に従って `src/app/app.module.ts` ファイルを更新します:

```ts
@NgModule({
  declarations: [
    MyExtensionDialogComponent
  ]
})
```

`my-extension-dialog.component.ts` を更新します:

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

`my-extension-dialog.component.html` を更新します:

```html
<h2 mat-dialog-title>Delete all</h2>
<mat-dialog-content>Are you sure?</mat-dialog-content>
<mat-dialog-actions>
  <button mat-button mat-dialog-close>No</button>
  <!-- The mat-dialog-close directive optionally accepts a value as a result for the dialog. -->
  <button mat-button [mat-dialog-close]="true">Yes</button>
</mat-dialog-actions>
```

### アクションを作成する

次のコードを `src/app/store/actions/app.actions.ts` に追加します:

```ts
export const SHOW_MY_DIALOG = 'SHOW_MY_DIALOG';

export class ShowMydDialogAction implements Action {
  readonly type = SHOW_MY_DIALOG;
}
```

あわせて参照:

- [Comprehensive Introduction to @ngrx/store](https://gist.github.com/btroncone/a6e4347326749f938510)

### エフェクトを作成する

`src/app/store/effects/app.effects.ts` を更新します:

```ts
import { ShowMydDialogAction, SHOW_MY_DIALOG } from '../actions/app.actions';

@Injectable()
export class AppEffects {
  @Effect({ dispatch: false })
  showMyDialog$ = this.actions$.pipe(
    ofType<ShowMydDialogAction>(SHOW_MY_DIALOG),
    map(() => {})
  );
}
```

あわせて参照:

- [Comprehensive Introduction to @ngrx/store](https://gist.github.com/btroncone/a6e4347326749f938510)

ダイアログを表示するための更新

```ts
import { MatDialog } from '@angular/material/dialog';
import { MyExtensionDialogComponent } from '../../dialogs/my-extension-dialog/my-extension-dialog.component';

@Injectable()
export class AppEffects {
  constructor(private dialog: MatDialog) {}

  @Effect({ dispatch: false })
  showMyDialog$ = this.actions$.pipe(
    ofType<ShowMydDialogAction>(SHOW_MY_DIALOG),
    map(() => {
      this.dialog.open(MyExtensionDialogComponent)
    })
  );
}
```

### ツールバーアクションを登録する

`src/assets/app.extensions.json` ファイルを更新し、`features.toolbar` セクションに新しいエントリを挿入します:

```json
{
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

これで、アプリケーションを実行すると、クリックするたびにダイアログを呼び出す追加のボタンが表示されます。
