---
Title: ルート
nav: ja
---

# ルート

新しいルートを作成するには、`routes` セクションに対応するエントリを入力します。

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "routes": [
    {
      "id": "plugin1.routes.bin",
      "path": "ext/bin",
      "layout": "app.layout.main",
      "component": "your.component.id"
    }
  ]
}
```

## ルートのプロパティ

| プロパティ名          | 説明                                                                            |
| ------------- | -------------------------------------------------------------------------------------- |
| **id**        | 一意の識別子。                                                                     |
| **path**      | ルートの実行パス。                                                             |
| **component** | ルートに使用するメインの[コンポーネント](/ja/extending/components)。                                |
| layout        | ルートに使用するレイアウト[コンポーネント](/ja/extending/components)。                              |
| auth          | [認証ガード](#認証ガード)のリスト。デフォルトは `[ "app.auth" ]` です。 |
| data          | ルートとともに移すカスタムプロパティバッグ。                                           |

レイアウトプロパティの `app.layout.main` の値を使用して、
ヘッダー、ナビゲーションサイドバー、メインコンテンツ領域を備えたデフォルトのアプリケーションレイアウトを取得します。
任意のコンポーネントを登録して、`app.layout.main` の値をバックアップできます。

**Tip:** デフォルトでは、カスタム値を指定しない場合は `app.layout.main` が使用されます。
ルートコンポーネントにページ全体を表示させる場合は、`blank` を使用します。

次の例のように完全なルートスキーマを定義できます:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "routes": [
    {
      "id": "plugin1.routes.bin",
      "path": "ext/bin",
      "component": "your.component.id",
      "layout": "app.layout.main",
      "auth": ["app.auth"],
      "data": {
        "title": "Custom Trashcan"
      }
    }
  ]
}
```

すべてのアプリケーションルートには、少なくとも1つの認証ガードが必要です。
デフォルトは `['app.auth']` の値です。

## 認証ガード

以下は、起動時にメインアプリケーションが登録する認証ガードのリストです。

| キー      | タイプ         | 説明                                                               |
| -------- | ------------ | ------------------------------------------------------------------------- |
| app.auth | AuthGuardEcm | ADF ガードは、ACS の認証を検証し、必要に応じてログインにリダイレクトします。 |

カスタムエクステンション内からこれらのガードを参照するか、
カスタム実装を [登録](/ja/extending/registration) できます。
