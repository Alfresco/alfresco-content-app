---
Title: アクション
nav: ja
---

# アクション

以下は、アクションを定義するために使用される JSON プロパティの詳細です。

| プロパティ名 | 説明 |
| -- | -- |
| **id** | 一意の識別子。 |
| **type** | アクションタイプ。詳細については、[アプリケーションアクション](/ja/extending/application-actions) を参照してください。 |
| **payload** | アクションペイロード、値または式を含む文字列。 |

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "actions": [
    {
      "id": "plugin1.actions.settings",
      "type": "NAVIGATE_URL",
      "payload": "/settings"
    },
    {
      "id": "plugin1.actions.info",
      "type": "SNACKBAR_INFO",
      "payload": "I'm a nice little popup raised by extension."
    },
    {
      "id": "plugin1.actions.node-name",
      "type": "SNACKBAR_INFO",
      "payload": "$('Action for ' + context.selection.first.entry.name)"
    }
  ]
}
```

## 値の式

軽量の式構文を使用して、アクションペイロードのカスタムパラメータを提供できます。

```text
$(<expression>)
```

式は、値を評価する有効な JavaScript ブロックです。

例:

```text
$('hello world')                //  'hello world'
$('hello' + ', ' + 'world')     //  'hello, world'
$(1 + 1)                        //  2
$([1, 2, 1 + 2])                //  [1, 2, 3]
```
