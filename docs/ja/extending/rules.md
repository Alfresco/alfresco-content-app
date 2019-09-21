---
Title: ルール
nav: ja
---

# ルール

ルールを使用すると、拡張コンポーネントの条件を評価できるため、たとえば特定のルールに基づいて要素を無効化または非表示にできます。

すべてのルールは、コンディションエバリュエータによって裏付けられています。

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "rules": [
    {
      "id": "app.trashcan",
      "type": "app.navigation.isTrashcan"
    }
  ]
}
```

ルールはパラメータとして他のルールを受け入れることができます:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "rules": [
    {
      "id": "app.toolbar.favorite.canAdd",
      "type": "core.every",
      "parameters": [
        { "type": "rule", "value": "app.selection.canAddFavorite" },
        { "type": "rule", "value": "app.navigation.isNotRecentFiles" },
        { "type": "rule", "value": "app.navigation.isNotSharedFiles" },
        { "type": "rule", "value": "app.navigation.isNotSearchResults" }
      ]
    }
  ]
}
```

**Tip:** また、`!` プレフィックスを使用して、ルールを無効にすることもできます。
`!app.navigation.isTrashcan` は `app.navigation.isTrashcan` の反対です。

追加のパラメータを提供したり、複数のルールを連結したりする必要がない場合は、
ルールを宣言せずに、登録されたエバリュエータへのインライン参照を使用することもできます。

## コアエバリュエータ

他のルールとエバリュエータを連鎖させることにより、新しいルールを作成できます。

| バージョン | キー        | 説明                                                                   |
| ------- | ---------- | ----------------------------------------------------------------------------- |
| 1.7.0   | core.every | すべての連鎖ルールが `true` と評価される場合、`true` と評価されます。                 |
| 1.7.0   | core.some  | 連鎖ルールの少なくとも1つが `true` と評価された場合、`true` と評価されます。 |
| 1.7.0   | core.not   | すべての連鎖ルールが `false` に評価される場合、`true` に評価されます。                |

以下は、次の条件を組み合わせた複合ルール定義の例です:

- ユーザーが単一のファイルを選択しました
- ユーザーは **ゴミ箱** ページを使用していません

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "rules": [
    {
      "id": "app.toolbar.canViewFile",
      "type": "core.every",
      "parameters": [
        {
          "type": "rule",
          "value": "app.selection.file"
        },
        {
          "type": "rule",
          "value": "core.not",
          "parameters": [
            {
              "type": "rule",
              "value": "app.navigation.isTrashcan"
            }
          ]
        }
      ]
    }
  ]
}
```

これで、上記のルールに基づいたツールバーボタンアクションを宣言できます。

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "toolbar": [
      {
        "id": "app.toolbar.preview",
        "type": "button",
        "title": "View File",
        "icon": "open_in_browser",
        "actions": {
          "click": "VIEW_FILE"
        },
        "rules": {
          "visible": "app.toolbar.canViewFile"
        }
      }
    ]
  }
}
```

ボタンは、リンクされたルールが `true` と評価された場合にのみ表示されます。

## アプリケーションエバリュエータ

| バージョン  | キー                                 | 説明                                                              |
| ----- | ----------------------------------- | ------------------------------------------------------------------------ |
| 1.7.0 | app.selection.canDelete             | ユーザーには、選択したノードを削除する権限があります。                          |
| 1.7.0 | app.selection.canDownload           | ユーザーは選択したノードをダウンロードできます。                                      |
| 1.7.0 | app.selection.notEmpty              | 少なくとも1つのノードが選択されています。                                           |
| 1.7.0 | app.selection.canUnshare            | ユーザーは、選択したノードを公開共有から削除できます。             |
| 1.7.0 | app.selection.canAddFavorite        | ユーザーは、選択したノードをお気に入りに追加できます。                              |
| 1.7.0 | app.selection.canRemoveFavorite     | ユーザーは、選択したノードをお気に入りから削除できます。                         |
| 1.7.0 | app.selection.first.canUpdate       | ユーザーには、選択したノードを更新する権限があります。                          |
| 1.7.0 | app.selection.file                  | 単一のファイルノードが選択されています。                                          |
| 1.7.0 | app.selection.file.canShare         | ユーザーは選択したファイルを共有できます。                                 |
| 1.7.0 | app.selection.file.isShared         | 共有ノードが選択されています。                                               |
| 1.7.0 | app.selection.file.isLocked         | ファイルは編集のためにロックされています。                                              |
| 1.7.0 | app.selection.file.isLockOwner      | ファイルはロックされており、現在のユーザーはロック所有者です。                       |
| 1.7.0 | app.selection.file.canUploadVersion | ユーザーはファイルのバージョンを更新できます。                                            |
| 1.7.0 | app.selection.library               | 単一のライブラリノードが選択されています。                                       |
| 1.7.0 | app.selection.isPrivateLibrary      | プライベートライブラリノードが選択されています。                                      |
| 1.7.0 | app.selection.hasLibraryRole        | 選択したライブラリノードにはロールプロパティがあります。                           |
| 1.7.0 | app.selection.hasNoLibraryRole      | 選択したライブラリノードにはロールプロパティがありません。                          |
| 1.7.0 | app.selection.folder                | 単一のフォルダノードが選択されます。                                        |
| 1.7.0 | app.selection.folder.canUpdate      | ユーザーには、選択したフォルダを更新する権限があります。                      |
| 1.7.0 | app.selection.file.canLock          | ユーザーにはファイルをロックする権限があります。                                       |
| 1.7.0 | app.selection.file.canUnlock        | ユーザーにはファイルのロックを解除する権限があります。                                     |
| 1.7.0 | repository.isQuickShareEnabled      | クイック共有リポジトリオプションが有効かどうか。             |
| 1.8.0 | canCopyNode                         | ユーザーが選択したノードをコピーできるかどうかを確認します。                                   |
| 1.8.0 | canToggleJoinLibrary                | ユーザーがライブラリで "参加" または "参加リクエストのキャンセル" を実行できるかどうかを確認します。 |
| 1.8.0 | canEditFolder                       | ユーザーが選択したフォルダを編集できるかどうかを確認します。                             |
| 1.8.0 | isTrashcanItemSelected              | ユーザーがゴミ箱アイテムを選択しているかどうかを確認します。                               |
| 1.8.0 | canViewFile                         | ユーザーがファイルを表示できるかどうかを確認します。                                        |
| 1.8.0 | canLeaveLibrary                     | ユーザーが選択したライブラリを**離れる**ことができるかどうかを確認します。                           |
| 1.8.0 | canToggleSharedLink                 | ユーザーが共有リンクモードを切り替えることができるかどうかを確認します。                              |
| 1.8.0 | canShowInfoDrawer                   | ユーザーが選択したノードの**情報ドロアー**を表示できるかどうかを確認します。           |
| 1.8.0 | canManageFileVersions               | ユーザーが選択したノードのファイルバージョンを管理できるかどうかを確認します。          |
| 1.8.0 | canManagePermissions                | ユーザーが選択したノードの権限を管理できるかどうかを確認します。             |
| 1.8.0 | canToggleEditOffline                | ユーザーが選択したノードの**オフライン編集**モードを切り替えることができるかどうかを確認します。       |
| 1.8.0 | user.isAdmin                        | ユーザーが管理者かどうかを確認します。                                                 |

## ナビゲーションエバリュエータ

アプリケーションは、表示されるルートまたはページに基づいて特定のアクションを開発者が制限または有効化できるように、ナビゲーション関連のエバリュエータのセットを公開します。

否定されたエバリュエータは、開発を単純化するためだけに提供され、`core.every` と `core.not` を混合するなど、
規則を否定するためだけに複雑な規則ツリーを持つことを回避します。

**Tip:** また、`!` プレフィックスを使用して、ルールを無効にすることもできます。
`!app.navigation.isTrashcan` は `app.navigation.isTrashcan` の反対です。

| バージョン | キー                               | 説明                                                      |
| ------- | --------------------------------- | ---------------------------------------------------------------- |
| 1.7.0   | app.navigation.folder.canCreate   | ユーザーは、現在開いているフォルダにコンテンツを作成できます。          |
| 1.7.0   | app.navigation.folder.canUpload   | ユーザーは、現在開いているフォルダにコンテンツをアップロードできます。          |
| 1.7.0   | app.navigation.isTrashcan         | ユーザーは**ゴミ箱**ページを使用しています。                             |
| 1.7.0   | app.navigation.isNotTrashcan      | 現在のページは**ゴミ箱**ではありません。                              |
| 1.7.0   | app.navigation.isLibraries        | ユーザーは**ライブラリ**または**ライブラリ検索結果**ページを使用しています。 |
| 1.7.0   | app.navigation.isNotLibraries     | 現在のページは**ライブラリ**ページではありません。                        |
| 1.7.0   | app.navigation.isSharedFiles      | ユーザーは**共有ファイル**ページを使用しています。                         |
| 1.7.0   | app.navigation.isNotSharedFiles   | 現在のページは**共有ファイル**ではありません。                            |
| 1.7.0   | app.navigation.isFavorites        | ユーザーは**お気に入り**ページを使用しています。                            |
| 1.7.0   | app.navigation.isNotFavorites     | 現在のページは**お気に入り**ではありません。                               |
| 1.7.0   | app.navigation.isRecentFiles      | ユーザーは**最近のファイル**ページを使用しています。                         |
| 1.7.0   | app.navigation.isNotRecentFiles   | 現在のページは**最近のファイル**ではありません。                            |
| 1.7.0   | app.navigation.isSearchResults    | ユーザーは**検索結果**ページを使用しています。                       |
| 1.7.0   | app.navigation.isNotSearchResults | 現在のページは**検索結果**ではありません。                      |
| 1.7.0   | app.navigation.isSharedPreview    | 現在のページはプレビュー**共有ファイル**です。                        |
| 1.7.0   | app.navigation.isFavoritesPreview | 現在のページはプレビュー**お気に入り**です。                           |
| 1.7.0   | app.navigation.isSharedFileViewer | 現在のページは共有ファイルのプレビューページです。                        |
| 1.7.0   | app.navigation.isPreview          | 現在のページは**プレビュー**です。                                     |
| 1.7.0   | app.navigation.isPersonalFiles    | 現在のページは**個人用ファイル**です。                              |
| 1.7.0   | app.navigation.isLibraryFiles     | 現在のページは**ライブラリファイル**です。                               |

**Tip:** 実行時に再利用される独自のエントリを登録する方法の詳細については、
[登録](/ja/extending/registration) セクションを参照してください。

### 例

以下の例のルールは、すべての条件が満たされた場合に `true` と評価されます:

- ユーザーがノードを選択しました
- ユーザーは**ゴミ箱**ページを使用していません
- ユーザーは**ライブラリ**ページ (**マイライブラリ**、**お気に入りライブラリ**、**ライブラリ検索結果**ページ) を使用していません

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "rules": [
    {
      "id": "app.toolbar.canCopyNode",
      "type": "core.every",
      "parameters": [
        { "type": "rule", "value": "app.selection.notEmpty" },
        { "type": "rule", "value": "app.navigation.isNotTrashcan" },
        { "type": "rule", "value": "app.navigation.isNotLibraries" }
      ]
    }
  ]
}
```
