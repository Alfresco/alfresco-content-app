---
Title: アプリケーションの機能
nav: ja
---

# アプリケーションの機能

このセクションには、最終的な実装に応じて異なるアプリケーション固有の機能が含まれています。

ACA は、次の拡張ポイントのセットをサポートします:

- 作成メニュー
- ナビゲーションバー
- ツールバー
- コンテキストメニュー
- ビューア
- サイドバー (情報ドロアー)
- コンテンツメタデータプリセット (`Properties` タブ用)

すべてのカスタマイズは設定ファイルの `features` セクションに保存されます:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "create": [],
    "navbar": [],
    "toolbar": [],
    "contextMenu": [],
    "viewer": {
      "toolbarActions:": [],
      "openWith": [],
      "content": []
    },
    "sidebar": [],
    "content-metadata-presets": []
  }
}
```

他のアプリケーションまたは外部プラグインは、上記の構成の異なるサブセットを利用できます。
また、構成スキーマに追加のエントリを追加できます。

## コンテンツアクション

ツールバーボタンやメニューなど、コンテンツを操作する UI 要素のほとんどは、
`ContentActionRef` インターフェイスの実装に基づいています:

```ts
interface ContentActionRef {
  id: string;
  type: ContentActionType;

  title?: string;
  description?: string;
  order?: number;
  icon?: string;
  disabled?: boolean;
  children?: Array<ContentActionRef>;
  component?: string;
  actions?: {
    click?: string;
    [key: string]: string;
  };
  rules?: {
    enabled?: string;
    visible?: string;
    [key: string]: string;
  };
}
```

上記の構造を使用して、`app.extensions.json` ファイルでコンテンツアクションを定義できます。

## 作成メニュー

"新規" メニューオプションの拡張エンドポイントを提供します。

以下の例のように、メニューに追加のエントリを追加できます:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "create": [
      {
        "id": "plugin1.create.folder",
        "icon": "create_new_folder",
        "title": "Create Folder (plugin1)",
        "actions": {
          "click": "CREATE_FOLDER"
        },
        "rules": {
          "enabled": "app.navigation.folder.canCreate"
        }
      },
      {
        "id": "plugin1.create.uploadFile",
        "icon": "file_upload",
        "title": "Upload Files (plugin1)",
        "actions": {
          "click": "UPLOAD_FILES"
        },
        "rules": {
          "enabled": "app.navigation.folder.canUpload"
        }
      }
    ]
  }
}
```

サポートされているプロパティの詳細については、[コンテンツアクション](#コンテンツアクション) セクションを参照してください。

**Tip:** 外部拡張ファイル内から既存のエントリを更新または無効にすることもできます。カスタマイズするには、ターゲット要素の `id` を知る必要があります。

## ナビゲーションバー

ナビゲーションバーは、グループ (`NavBarGroupRef`) に編成されたリンク要素 (`NavBarLinkRef`) で構成されます。

```ts
export interface NavBarGroupRef {
  id: string;
  items: Array<NavBarLinkRef>;

  order?: number;
  disabled?: boolean;
}

export interface NavBarLinkRef {
  id: string;
  icon: string;
  title: string;
  route: string;

  url?: string; // evaluated at runtime based on route ref
  description?: string;
  order?: number;
  disabled?: boolean;
}
```

拡張機能は、実行時に次のアクションを実行できます:

- リンクを使用して新しいグループを登録する
- 既存のグループに新しいリンクを挿入します
- 既存のリンクのプロパティを更新する
- 既存のリンクまたはグループ全体を無効にします

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "navbar": [
      {
        "id": "app.navbar.primary",
        "items": [
          {
            "id": "app.navbar.personalFiles",
            "icon": "folder",
            "title": "Personal Files",
            "route": "personal-files"
          },
          {
            "id": "app.navbar.libraries",
            "icon": "group_work",
            "title": "Libraries",
            "route": "libraries"
          }
        ]
      },
      {
        "id": "app.navbar.secondary",
        "items": [
          {
            "id": "app.navbar.shared",
            "icon": "people",
            "title": "Shared",
            "route": "shared"
          }
        ]
      }
    ]
  }
}
```

## サイドバー (情報ドロアー)

サイドバー (情報ドロアー) コンポーネントに次のカスタマイズを提供できます:

- カスタムコンポーネントを使用してタブを追加する
- メインアプリケーションまたは拡張機能のタブを無効にする
- 既存のタブのコンテンツまたはプロパティを置き換える

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "sidebar": {
      "tabs": [
            {
              "id": "app.sidebar.properties",
              "order": 100,
              "title": "Properties",
              "component": "app.components.tabs.metadata"
            },
            {
              "id": "app.sidebar.comments",
              "order": 200,
              "title": "Comments",
              "component": "app.components.tabs.comments"
            }
      ]
    }
  }
}
```

上記の例は2つのタブをレンダリングします:

- `app.components.tabs.metadata` コンポーネントを参照する `Properties` タブ
- `app.components.tabs.comments` コンポーネントを参照する `Comments` タブ

対応するすべてのコンポーネントは、実行環境で使用するために登録する必要があります。

**Tip:** 実行時に再利用される独自のエントリを登録する方法の詳細については、
[登録](/ja/extending/registration) セクションを参照してください。

### タブプロパティ

| プロパティ名          | 説明                                                       |
| ------------- | ----------------------------------------------------------------- |
| **id**        | 一意の識別子。                                                |
| **component** | ルートに使用するメインの[コンポーネント](/ja/extending/components)。 |
| **title**     | タブのタイトルまたはリソースのキー                                       |
| icon          | タブのアイコン                                                          |
| disabled      | 無効状態を切り替えます。他のプラグインから割り当てることができます。       |
| order         | 要素の順序。                                         |

### タブコンポーネント

タブのコンテンツに割り当てるすべてのコンポーネントは、実行時に次の追加プロパティを受け取ります:

| プロパティ名 | タイプ                   | 説明                 |
| ---- | ---------------------- | --------------------------- |
| node | MinimalNodeEntryEntity | 表示されるノードエントリ。 |

## ツールバー

ツールバーの拡張ポイントは、コンテンツアクション参照の配列で表されます。

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "toolbar": [
      {
        "id": "app.toolbar.preview",
        "title": "View",
        "icon": "open_in_browser",
        "actions": {
          "click": "VIEW_FILE"
        },
        "rules": {
          "visible": "app.toolbar.canViewFile"
        }
      },
      {
        "id": "app.toolbar.download",
        "title": "Download",
        "icon": "get_app",
        "actions": {
          "click": "DOWNLOAD_NODES"
        },
        "rules": {
          "visible": "app.toolbar.canDownload"
        }
      }
    ]
  }
}
```

コンテンツアクションは、次のビューのツールバーに適用されます:

- 個人用ファイル
- ライブラリ
- 共有ファイル
- 最近使用したファイル
- お気に入り
- ゴミ箱
- 検索結果
- ライブラリ検索結果

## コンテキストメニュー

コンテキストメニューの拡張性は、ツールバーの拡張性に似ています。
ルールによって裏付けられ、アプリケーションアクションに関連付けられたコンテンツアクションのリストを定義することができます。

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "contextMenu": [
      {
        "id": "app.context.menu.download",
        "order": 100,
        "title": "Download",
        "icon": "get_app",
        "actions": {
          "click": "DOWNLOAD_NODES"
        },
        "rules": {
          "visible": "app.toolbar.canDownload"
        }
      }
    ]
  }
}
```

メモ: 使用可能なルールとエバリュエータを再利用できます。

上記の例では、コンテキストメニューアクション `Download` は、`rules` セクションで宣言された
`app.toolbar.canDownload` ルールを利用します:

```json
{
  "rules": [
    {
      "id": "app.toolbar.canDownload",
      "type": "core.every",
      "parameters": [
        { "type": "rule", "value": "app.selection.canDownload" },
        { "type": "rule", "value": "app.navigation.isNotTrashcan" }
      ]
    }
  ]
}
```

## ビューア

ACA の Viewer コンポーネントは、次の拡張ポイントをサポートします:

- コンテンツビューア
- ツールバーアクション
- `その他` のツールバーアクション
- `開く` アクション
- ルール

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "viewer": {
      "content": [],
      "toolbarActions:": [],
      "openWith": []
    }
  }
}
```

### コンテンツビュー

拡張機能に基づいて特定の種類のコンテンツをレンダリングするカスタムコンポーネントを提供できます。

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "viewer": {
      "content": [
        {
          "id": "app.viewer.pdf",
          "fileExtension": "pdf",
          "component": "app.components.tabs.metadata"
        },
        {
          "id": "app.viewer.docx",
          "fileExtension": "docx",
          "component": "app.components.tabs.comments"
        }
      ]
    }
  }
}
```

上記の例では、`PDF` ビューを `metadata` タブに、
`DOCX` ビューを `comments` タブに置き換えています。

すべてのカスタムコンポーネントは、実行時に次のプロパティを受け取ります:

| プロパティ名      | タイプ                   | 説明                 |
| --------- | ---------------------- | --------------------------- |
| node      | MinimalNodeEntryEntity | 表示されるノードエントリ。 |
| url       | string                 | ファイルコンテンツの URL。           |
| extension | string                 | ファイル名拡張子。        |

#### ルール

`disabled` 状態のルールを提供することもできます。
これにより、外部要因に基づいてビューア拡張の条件付き可用性を提供できます。

```json
{
  "id": "app.viewer.pdf",
  "fileExtension": "png",
  "component": "app.components.tabs.metadata",
  "rules": {
    "disabled": "isViewerDisabled"
  }
}
```

### ツールバーアクション

ACA ビューアのデフォルトのツールバーアクションは、拡張機能を使用してカスタマイズし、置換、変更、または無効にすることができます。
拡張機能の設定から新しいビューアツールバーアクションを追加することもできます:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "viewer": {
      "toolbarActions": [
        {
          "id": "app.viewer.versions",
          "order": 500,
          "title": "APP.ACTIONS.VERSIONS",
          "icon": "history",
          "actions": {
            "click": "MANAGE_VERSIONS"
          },
          "rules": {
            "visible": "app.toolbar.versions"
          }
        }
      ]
    }
  }
}
```

サブメニューを提供することもできます:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "viewer": {
      "toolbarActions": [
        {
          "id": "app.toolbar.more",
          "type": "menu",
          "order": 10000,
          "icon": "more_vert",
          "title": "APP.ACTIONS.MORE",
          "children": [
            {
              "id": "app.viewer.share",
              "order": 300,
              "title": "Share",
              "icon": "share",
              "actions": {
                "click": "SHARE_NODE"
              },
              "rules": {
                "visible": "app.selection.file.canShare"
              }
            }
          ]
        }
      ]
    }
  }
}
```

### 「開く」アクション

ビューアのすべてのインスタンスでレンダリングするために`開く` アクションのリストを提供できます。

次の例では、単純な `Snackbar` アクション参照を作成し、
`Snackbar` と呼ばれるカスタムの `開く` メニューエントリから呼び出します。

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "actions": [
    {
      "id": "plugin1.actions.info",
      "type": "SNACKBAR_INFO",
      "payload": "I'm a nice little popup raised by extension."
    }
  ],

  "features": {
    "viewer": {
      "openWith": [
        {
          "id": "plugin1.viewer.openWith.action1",
          "type": "button",
          "icon": "build",
          "title": "Snackbar",
          "actions": {
            "click": "plugin1.actions.info"
          }
        }
      ]
    }
  }
}
```

他のコンテンツアクションと同様に、カスタムプラグインは `開く` アクションを無効化、更新、または拡張できます。

### ルール

`features.viewer.rules` オブジェクトを利用して、ビューアにグローバルルールを提供できます:

```ts
export interface ViewerRules {
  /**
   * Checks if user can preview the node.
   */
  canPreview?: string;
}
```

例えば:

```json
{
  "features": {
    "viewer": {
      "rules": {
        "canPreview": "customRule"
      }
    }
  }
}
```

ルールは、ノードのプレビューが許可されている場合は `true`、そうでない場合は `false` を返す必要があります。

## コンテンツメタデータのプリセット

コンテンツメタデータプリセットは、[Content Metadata Component](https://www.alfresco.com/abn/adf/docs/content-services/components/content-metadata-card.component/) が特定のノードのメタデータアスペクトのプロパティをレンダリングするために必要です。
さまざまな側面とそのプロパティは `app.config.json` ファイルで設定されますが、拡張ファイルを介して実行時に設定することもできます。

`app.extensions.json` からこれらのプリセットを設定すると、デフォルトのアプリケーション設定が上書きされます。
カスタムプラグインから設定すると、これらのプリセットを無効化、更新、または拡張できます。
拡張機能のマージに関する詳細はこちらをご覧ください[here](/ja/extending/extension-format#プロパティのマージ)。

`content-metadata-presets` 要素は、`disabled` プロパティを設定することでオフにできます。
これはネストされたアイテムにも適用でき、アスペクトレベルまで無効にできます。

**Tip:** 既存のエントリを変更または無効にするには、ターゲット要素の ID とその親 ID を知る必要があります。

拡張機能は、実行時に次のアクションを実行できます:

- 新しいプリセット項目を追加します。
- 任意のレベルで既存のプリセットに新しいアイテムを追加します。
- アスペクトレベルまで特定のアイテムを無効にします。
- ID に基づいて既存のアイテムを変更します。

プロパティに関しては、次のことができます:

- 既存のアスペクトに新しいプロパティを追加する、または
- アスペクトのプロパティを再定義します。

このコードスニペットを確認して、外部プラグインから `exif:exif` アスペクトのプロパティを上書きする方法を確認してください:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "content-metadata-presets": [
      {
        "id": "app.content.metadata.custom",
        "custom": [
          {
            "id": "app.content.metadata.customGroup",
            "items": [
              {
                "id": "app.content.metadata.exifAspect",
                "disabled": true
              },
              {
                "id": "app.content.metadata.exifAspect2",
                "aspect": "exif:exif",
                "properties": [
                  "exif:orientation",
                  "exif:manufacturer",
                  "exif:model",
                  "exif:software"
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

この外部プラグインは、`app.extensions.json` で既に定義されている初期の `exif:exif` アスペクトを無効にし、 `exif:exif` アスペクトの他のプロパティを定義します。
`app.extension.json` の初期設定は次のとおりです:

```json
{
  "content-metadata-presets": [
    {
      "id": "app.content.metadata.custom",
      "custom": [
        {
          "id": "app.content.metadata.customGroup",
          "title": "APP.CONTENT_METADATA.EXIF_GROUP_TITLE",
          "items": [
            {
              "id": "app.content.metadata.exifAspect",
              "aspect": "exif:exif",
              "properties": [
                "exif:pixelXDimension",
                "exif:pixelYDimension",
                "exif:dateTimeOriginal",
                "exif:exposureTime",
                "exif:fNumber",
                "exif:flash",
                "exif:focalLength",
                "exif:isoSpeedRatings",
                "exif:orientation",
                "exif:manufacturer",
                "exif:model",
                "exif:software"
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

**Tip:** content-metadata プリセットを拡張できるようにするには、 `app.config.json` の設定を `app.extensions.json` ファイルにコピーし、その ID をすべてのアイテムに追加する必要があります。
ID を使用すると、外部プラグインが現在の設定を拡張できます。
