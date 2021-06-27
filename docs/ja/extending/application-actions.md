---
Title: アプリケーションアクション
nav: ja
---

# アプリケーションアクション

アプリは **NgRx** (Angular のリアクティブライブラリ、Redux にインスパイアされた) を使用して、
アプリケーションアクションを実装します。

NgRx の詳細については、次のリソースを参照してください:

- [Comprehensive Introduction to @ngrx/store](https://gist.github.com/btroncone/a6e4347326749f938510)

ほとんどのアプリケーションの機能は、NgRx アクションおよび対応するエフェクトの形式で既に公開されています。
次のように、単一の `Store` ディスパッチャーを介して任意のアクションを呼び出すことができます:

```ts
export class MyComponent {
  constructor(private store: Store<AppStore>) {}

  onClick() {
    this.store.dispatch(new SearchByTermAction('*'));
  }
}
```

上記のコードは、`Search by Term` 機能を呼び出す単純な 'click' ハンドラを示しています
ユーザーを **検索結果** ページに自動的にリダイレクトします。

カスタムアプリケーションサービス API からノードを表示する別の例:

```ts
export class MyService {
  constructor(private store: Store<AppStore>) {}

  viewFile(node: MinimalNodeEntity) {
    this.store.dispatch(new ViewFileAction(node));
  }
}
```

## 拡張機能で使用する

拡張機能 (ボタン、メニューなど) からすべてのアプリケーションアクションを呼び出すことができます。

**Tip:** ペイロードが提供されない場合、アクションの多くは現在選択されているノードを使用します。
これにより、拡張ファイルからのアクションの宣言と呼び出しが簡単になります。

以下の例では、"NEW" メニュードロップダウンへの新しいエントリを作成し、
`CREATE_FOLDER` アプリケーションアクションを呼び出す新しい`Create Folder (plugin1)` コマンドを提供します。

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",

  "features": {
    "create": [
      {
        "id": "plugin1.create.folder",
        "type": "default",
        "icon": "create_new_folder",
        "title": "Create Folder (plugin1)",
        "actions": {
          "click": "CREATE_FOLDER"
        }
      }
    ]
  }
}
```

`CREATE_FOLDER` アクションは、対応する NgRx エフェクトをトリガーしてダイアログを表示し、
必要に応じてドキュメントリストの再読み込みを実行します。

以下は、アクションへの参照としてプラグイン定義で使用できるパブリックアクションタイプのリストです:

| バージョン | アクション名                   | ペイロード             | 説明                                                                                     |
| ------- | ---------------------- | ------------------- | ----------------------------------------------------------------------------------------------- |
| 1.7.0   | SET_CURRENT_FOLDER     | Node                | 現在開いているフォルダについてコンポーネントに通知します。                                                |
| 1.7.0   | SET_CURRENT_URL        | string              | 現在のブラウザ URL についてコンポーネントに通知します。                                                    |
| 1.7.0   | SET_USER_PROFILE       | Person              | 現在のユーザープロファイルを割り当てます。                                                                    |
| 1.7.0   | TOGGLE_INFO_DRAWER     | n/a                 | 選択したノードの情報ドロワーを切り替えます。                                                       |
| 1.7.0   | ADD_FAVORITE           | MinimalNodeEntity[] | ノード (または選択したもの) をお気に入りに追加します。                                                          |
| 1.7.0   | REMOVE_FAVORITE        | MinimalNodeEntity[] | お気に入りからノード (または選択したもの) を削除します。                                                    |
| 1.7.0   | DELETE_LIBRARY         | string              | ライブラリを ID で削除します。ペイロードが提供されない場合、選択したノードを使用します。                            |
| 1.7.0   | CREATE_LIBRARY         | n/a                 | "ライブラリの作成" ダイアログを呼び出します。                                                               |
| 1.7.0   | SET_SELECTED_NODES     | MinimalNodeEntity[] | 選択したノードについてコンポーネントに通知します。                                                         |
| 1.7.0   | DELETE_NODES           | MinimalNodeEntity[] | ノード (または選択したもの) を削除します。元に戻すアクションをサポートします。                                         |
| 1.7.0   | UNDO_DELETE_NODES      | any[]               | ノード (または選択したもの) の削除を取り消します。                                                       |
| 1.7.0   | RESTORE_DELETED_NODES  | MinimalNodeEntity[] | 削除されたノード (または選択したもの) を復元します。通常、Trashcan で使用されます。                            |
| 1.7.0   | PURGE_DELETED_NODES    | MinimalNodeEntity[] | ノード (または選択したもの) を完全に削除します。通常、Trashcan で使用されます。                          |
| 1.7.0   | DOWNLOAD_NODES         | MinimalNodeEntity[] | ノード (または選択したもの) をダウンロードします。フォルダまたは複数のアイテムの ZIP アーカイブを作成します。            |
| 1.7.0   | CREATE_FOLDER          | string              | 開いているフォルダ (またはペイロードの親フォルダ ID) の "フォルダーの作成" ダイアログを呼び出します。 |
| 1.7.0   | EDIT_FOLDER            | MinimalNodeEntity   | ノード (または選択したもの) の "フォルダの編集" ダイアログを呼び出します。                                     |
| 1.7.0   | SHARE_NODE             | MinimalNodeEntity   | ノード (または選択したもの) の "共有" ダイアログを呼び出します。                                            |
| 1.7.0   | UNSHARE_NODES          | MinimalNodeEntity[] | 共有ノードからノード (または選択したもの) を削除します (コンテンツは削除しません)。                    |
| 1.7.0   | COPY_NODES             | MinimalNodeEntity[] | ノード (または選択したもの) の "コピー" ダイアログを呼び出します。 元に戻すアクションをサポートします。                     |
| 1.7.0   | MOVE_NODES             | MinimalNodeEntity[] | ノード (または選択したもの) の "移動" ダイアログを呼び出します。元に戻すアクションをサポートします。                     |
| 1.7.0   | MANAGE_PERMISSIONS     | MinimalNodeEntity   | ノード (または選択したもの) の "アクセス許可の管理" ダイアログを呼び出します。                               |
| 1.7.0   | MANAGE_VERSIONS        | MinimalNodeEntity   | ノード (または選択したもの) の "バージョンの管理" ダイアログを呼び出します。                                 |
| 1.7.0   | NAVIGATE_URL           | string              | アプリケーション内の特定のルート URL に移動します。                                           |
| 1.7.0   | NAVIGATE_ROUTE         | any[]               | 特定のルートに移動します (パラメータをサポート)。                                          |
| 1.7.0   | NAVIGATE_FOLDER        | MinimalNodeEntity   | ノードのプロパティに基づいてフォルダに移動します。                                             |
| 1.7.0   | NAVIGATE_PARENT_FOLDER | MinimalNodeEntity   | ノードのプロパティに基づいて、含まれる親フォルダに移動します。                                   |
| 1.7.0   | NAVIGATE_LIBRARY       | string              | ライブラリに移動します。                                                                            |
| 1.7.0   | SEARCH_BY_TERM         | string              | 用語で簡単な検索を実行し、検索結果に移動します。                             |
| 1.7.0   | SNACKBAR_INFO          | string              | 提供されたメッセージとともに情報スナックバーを表示します。                                           |
| 1.7.0   | SNACKBAR_WARNING       | string              | 提供されるメッセージとともに警告スナックバーを表示します。                                                |
| 1.7.0   | SNACKBAR_ERROR         | string              | 提供されたメッセージとともにエラースナックバーを表示します。                                                  |
| 1.7.0   | UPLOAD_FILES           | n/a                 | "ファイルのアップロード" ダイアログを呼び出して、現在開いているフォルダにファイルをアップロードします。                   |
| 1.7.0   | UPLOAD_FOLDER          | n/a                 | "フォルダのアップロード" ダイアログを呼び出し、選択したフォルダを現在開いているフォルダにアップロードします。          |
| 1.7.0   | UPLOAD_FILE_VERSION    | n/a                 | "新しいファイルバージョン" ダイアログを呼び出します。                                                               |
| 1.7.0   | VIEW_FILE              | MinimalNodeEntity   | ビューアでファイル (または選択したもの) をプレビューします。                                                  |
| 1.7.0   | UNLOCK_WRITE           | NodeEntry           | ファイルを読み取り専用モードからロック解除します。                                                                 |
| 1.7.0   | PRINT_FILE             | MinimalNodeEntity   | ビューアで開いた (または選択した) ファイルを印刷します。                                             |
| 1.7.0   | FULLSCREEN_VIEWER      | n/a                 | ビューアで開いたファイルを表示するために、フルスクリーンモードを開始します。                                  |
| 1.7.0   | LOGOUT                 | n/a                 | ログアウトして、ログイン画面にリダイレクトします。                                                           |
| 1.7.0   | RELOAD_DOCUMENT_LIST   | n/a                 | アクティブなドキュメントリストを再読み込みします。                                                                     |
| 1.8.0   | VIEW_NODE              | string              | ID によるノードの軽量プレビュー。拡張機能から呼び出すことができます。                            |
| 1.8.0   | CLOSE_PREVIEW          | n/a                 | ビューア (アイテムのプレビュー) を閉じます。                                                       |
| 1.9.0   | RESET_SELECTION        | n/a                 | アクティブなドキュメントリストの選択をリセットします                                                           |
