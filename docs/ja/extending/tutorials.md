---
Title: チュートリアル
nav: ja
---

# チュートリアル

以下は、一般的なタスクをカバーする短いチュートリアルです。

## パラメータ付きのカスタムルート

このチュートリアルでは、次の機能を実装します:

- **Trashcan** コンポーネントを更新して、ルートパラメータを受信および記録します。
- メインレイアウトを使用して **Trashcan** コンポーネントに遷移する新しいルートを作成します。
- 新しいルートへのリダイレクトを許可するアクションリファレンスを作成します。
- **New** メニューにアクションを呼び出すボタンを作成します。

`src/app/components/trashcan/trashcan.component.ts` を更新し、次のコードを `ngOnInit` 本体に追加します:

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

上記のコードは、現在のルートパラメータをブラウザコンソールに記録し、
インテグレーションが期待どおりに機能することを証明しています。

次に、以下の例のように新しいルート定義を追加します:

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

上記のテンプレートは、`ext/trashcan/` ルートを指し、`nodeId` パラメータを受け入れる ID `custom.routes.trashcan` を持つ新しいルート参照を作成します。

また、デフォルトのアプリケーションレイアウト (`app.layout.main`) と
認証ガード (`app.auth`) を使用します。

次に、`NAVIGATE_ROUTE` アプリケーションアクションのアクション参照を作成し、ルートパラメータを渡します。
パスには `/ext/trashcan`、`nodeId` の値には `10` を渡します。

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

最後に、`NEW` ボタンの新しいメニュー項目を宣言し、上記で作成した `custom.actions.trashcan` アクションを使用します。

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

これで、アプリケーションを実行すると、"NEW" ドロップダウンに "Custom Trashcan Route" という新しいメニュー項目が表示されます。
このアイテムをクリックすると、**Trashcan** コンポーネントを含む `/ext/trashcan/10` ルートに移動します。

ブラウザコンソールの出力を確認し、次の出力があることを確認します:

```text
node:  10
```

カスタムアクションを呼び出し、追加のアプリケーションルートにリダイレクトする
新しいメニューボタンが正常に作成されました。

## ダイアログアクション

このチュートリアルでは、カスタムマテリアルダイアログを呼び出すアクションを作成します。

ダイアログコンポーネントの詳細については、こちらをご覧ください: [ダイアログの概要](https://material.angular.io/components/dialog/overview)

### ダイアログを作成する

```sh
ng g component dialogs/my-extension-dialog --module=app
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
