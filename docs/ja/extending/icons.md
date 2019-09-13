---
Title: カスタムアイコン
nav: ja
---

# カスタムアイコン

カスタムの `.svg` アイコンを登録して、ツールバー、コンテキストメニューなどで使用できます。

アイコンは `features.icons` セクションで宣言されています。たとえば:

```json
{
  "features": {
    "icons": [
      {
        "id": "adf:join_library",
        "value": "./assets/images/join-library.svg"
      },
      {
        "id": "adf:move_file",
        "value": "./assets/images/adf-move-file-24px.svg"
      }
    ]
  }
}
```

`id` の値は、[Material Icon](https://material.angular.io/components/icon/api) コンポーネントの形式と同様に、
`[namespace]:[name]` の形式に準拠する必要があります。
アイコンファイルのパスは、デプロイされたアプリケーションルート (または `index.html` ファイル) に対して相対的でなければなりません。

その後、他の要素でアイコン ID を使用できます。たとえば:

```json
{
  "id": "app.toolbar.move",
  "order": 500,
  "title": "APP.ACTIONS.MOVE",
  "icon": "adf:move_file",
  "actions": {
    "click": "MOVE_NODES"
  }
}
```

また、アイコンの値を上書きしたり、外部拡張機能からエントリを無効にしたりすることもできます。
