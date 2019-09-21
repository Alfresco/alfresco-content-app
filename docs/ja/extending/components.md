---
Title: コンポーネント
nav: ja
---

# コンポーネント

任意の Angular コンポーネントを登録して、拡張を加えることができます。

コンポーネントは、カスタムを作成するために使用されます:

- ルートとページ
- ツールバーボタン
- メニューアイテム

| キー                               | タイプ                           | 説明                                                                                                     |
| --------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| app.layout.main                   | LayoutComponent                | コンポーネントを投影するためのメニューバー、ナビゲーションサイドバー、メインコンテンツ領域を備えたメインアプリケーションレイアウト。 |
| app.toolbar.toggleInfoDrawer      | ToggleInfoDrawerComponent      | 選択のために情報ドロアーを切り替えるツールバーボタンコンポーネント。                                        |
| app.toolbar.toggleFavorite        | ToggleFavoriteComponent        | 選択したお気に入りの状態を切り替えるツールバーボタンコンポーネント。                                     |
| app.toolbar.toggleFavoriteLibrary | ToggleFavoriteLibraryComponent | 選択したお気に入りライブラリの状態を切り替えるツールバーボタンコンポーネント。                             |
| app.toolbar.toggleJoinLibrary     | ToggleJoinLibraryComponent     | 選択したライブラリの参加/キャンセルのリクエストを切り替えるツールバーボタンコンポーネント。                     |
| app.toolbar.viewNode              | ViewNodeComponent              | ファイルを表示するアクションコンポーネント。                                                                                  |

実行時に再利用される独自のエントリを登録する方法の詳細については、
[登録](/ja/extending/registration) セクションを参照してください。

カスタム拡張機能は、新しいコンポーネントを登録するだけでなく、
実行時に既存のコンポーネントを既知の識別子で置き換えることもできます。
