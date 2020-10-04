---
Title: 拡張フォーマット
nav: ja
---

# 拡張フォーマット

フォーマットは、次のような構造の JSON ファイルで表されます:

```json
{
  "$id": "unique.id",
  "$name": "extension.name",
  "$version": "1.0.0",
  "$vendor": "author.name",
  "$license": "license",
  "$runtime": "1.5.0",
  "$description": "some description",

  "routes": [],
  "actions": [],
  "rules": [],
  "features": {}
}
```

## スキーマ

JSON スキーマは、プロジェクトのルートフォルダ [extension.schema.json](../../extension.schema.json) にあります。

**Tip:** スキーマを使用すると、拡張ファイルを検証し、コード補完とドキュメントヒントを提供できます。

```json
{
  "$schema": "../../extension.schema.json",
  "$name": "app",
  "$version": "1.0.0"
}
```

## 複数のファイル

複数の拡張ファイルを個別に配布できます。
すべての追加ファイルは、`$references` プロパティを介してリンクされます。
宣言の順序は、ロードの順序を定義します。

```json
{
  "$schema": "../../extension.schema.json",
  "$name": "app",
  "$version": "1.0.0",
  "$references": ["plugin1.json", "plugin2.json"]
}
```

**注:** すべての拡張ファイルは、実行時にマージされます。
これにより、プラグインはメインアプリケーションのコードを上書きしたり、他のプラグインを変更したりできます。

## 起動時の動作

最初に、ルートの `app.extensions.json` が特別な `Loader` サービスによってロードされます。
ファイルには、アプリケーションが機能するために必要なすべての宣言を含めることができます。追加のプラグインファイルは完全にオプションです。

次に、`Loader` は `$references` メタデータを走査し、提供されている場合は追加のファイルをロードします。
速度を上げるため、ファイルは並行してロードされますが、すべてがロードされると、宣言順に適用されます。

すべての外部ファイルが取得された後、`Loader` はそれらをソートし、メタデータプロパティを削除して、結果の JSON オブジェクトを互いの上にスタックします。

**Tip:** `$` 記号で始まる最上位のプロパティ名はメタデータと見なされ、マージプロセスには参加しません。
これにより、たとえばプラグインは、`$name`、`$version`、`$description`、`$license` など、メンテナンスおよび視覚化のために追加情報を保持できます。

### プロパティのマージ

JSON 構造およびネストのレベルに制限はありません。
すべてのオブジェクトは、プロパティキーとオブジェクトID (配列用) に基づいて単一のセットにマージされます。

マージ前: Plugin 1

```json
{
  "$name": "plugin1",
  "plugin1.key": "value",
  "plugin1.text": "string"
}
```

マージ前: Plugin 2

```json
{
  "$name": "plugin2",
  "plugin2.key": "value",
  "plugin1.text": "custom string"
}
```

最終結果:

```json
{
  "plugin1.key": "value",
  "plugin1.text": "custom string",
  "plugin2.key": "value"
}
```

その結果、2つの一意のプロパティ `plugin1.key` と `plugin2.key` があり、
`Plugin 1` で最初に定義されたが `Plugin 2` で上書きされた `plugin1.text` もあります。

**Tip:** JSON マージは、アプリケーションまたは対応するプラグインライブラリを再構築せずに、ベースアプリケーションの設定を変更したり、
他のプラグインの機能を切り替えたりすることができるため、非常に強力な概念です。

### オブジェクトのマージ

複雑なオブジェクトはプロパティによってマージされます。このプロセスは再帰的であり、ネストレベルに制限はありません。

マージ前: Plugin 1

```json
{
  "$name": "plugin1",
  "features": {
    "title": "some title",
    "page1": {
      "title": "page 1"
    }
  }
}
```

マージ前: Plugin 2

```json
{
  "$name": "plugin2",
  "features": {
    "page1": {
      "title": "custom title"
    },
    "page2": {
      "title": "page 2"
    }
  }
}
```

最終結果:

```json
{
  "features": {
    "title": "some title",
    "page1": {
      "title": "custom title"
    },
    "page2": {
      "title": "page 2"
    }
  }
}
```

一意のプロパティが1つのオブジェクトにマージされていることがわかります。
ただし、最後の一意でないプロパティは以前の値を上書きします。

現在のデザインを使用して、プラグインからアプリケーションプロパティを削除することはできません。
ローダーエンジンは、値の上書きのみをサポートします。ただし、多くのコンポーネントは、外部定義を使用して変更できる `disabled` プロパティをサポートしています:

マージ前: Plugin 1

```json
{
  "$name": "plugin1",
  "feature1": {
    "disabled": false,
    "text": "some-feature",
    "icon": "some-icon"
  }
}
```

マージ前: Plugin 2

```json
{
  "$name": "plugin2",
  "feature1": {
    "disabled": true
  }
}
```

最終結果:

```json
{
  "feature1": {
    "disabled": true,
    "text": "some-feature",
    "icon": "some-icon"
  }
}
```

詳細については、[コンテンツの無効化](#コンテンツを無効にする) セクションをご覧ください。

### 配列のマージ

拡張機能 `Loader` は、配列のマージを特別にサポートします。
デフォルトでは、オブジェクトに `id` プロパティがない限り、2つのコレクションは単一の配列にマージされます。

**Tip:** 配列に同じ `id` プロパティを持つ2つのオブジェクトが含まれる場合、オブジェクトは追加されるのではなくマージされます。

マージ前: Plugin 1

```json
{
  "$name": "plugin1",
  "features": [
    { "text": "common 1" },
    {
      "id": "page1",
      "text": "page 1"
    }
  ]
}
```

マージ前: Plugin 2

```json
{
  "$name": "plugin2",
  "features": [
    { "text": "common 2" },
    {
      "id": "page1",
      "text": "custom page"
    }
  ]
}
```

最終結果:

```json
{
  "features": [
    { "text": "common 1" },
    { "text": "common 2" },
    {
      "id": "page1",
      "text": "custom page"
    }
  ]
}
```

同じ `page1` 識別子を持つオブジェクトがマージされ、他の一意のエントリが結果の配列に追加されることに注意してください。

## コンテンツを無効にする

ほとんどのスキーマ要素は、`disabled` プロパティを使用してオフにすることができます:

```json
{
  "$schema": "../../extension.schema.json",
  "$name": "app",
  "$version": "1.0.0",

  "features": {
    "create": [
      {
        "id": "app.create.folder",
        "disabled": true,
        "order": 100,
        "icon": "create_new_folder",
        "title": "Create Folder"
      }
    ]
  }
}
```

この機能は、外部プラグイン内から既存の機能を無効にする場合に便利です。

以下の例では、`plugin1` というプラグインは、アプリケーションによって公開される標準の `app.create.folder` メニューを、
プラグインに付属するカスタムメニューに置き換えます。

```json
{
    "$schema": "../../../extension.schema.json",
    "$version": "1.0.0",
    "$name": "plugin1",

    "features": {
        "create": [
            {
                "id": "app.create.folder",
                "disabled": true
            },
            {
                "id": "plugin1.create.folder",
                "title": "Create Folder"
            }
        ]
    }
}
```
