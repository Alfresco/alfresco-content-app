---
Title: パラメータ付きのカスタムルート
nav: ja
---

# パラメータ付きのカスタムルート

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
