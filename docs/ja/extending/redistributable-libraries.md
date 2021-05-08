---
Title: 再配布可能なライブラリ
nav: ja
---

# 再配布可能なライブラリ

拡張ライブラリは、JSON 形式の標準の Angular ライブラリと定義ファイルに基づいています。

詳細については、次の記事をご覧ください: [Angular CLI 6のライブラリサポート](https://github.com/angular/angular-cli/wiki/stories-create-library#library-support-in-angular-cli-6)

あわせて参照

- Angular Library Series - Angular CLI を使用したライブラリの作成
  - Part 1: https://blog.angularindepth.com/creating-a-library-in-angular-6-87799552e7e5
  - Part 2: https://blog.angularindepth.com/creating-a-library-in-angular-6-part-2-6e2bc1e14121

## 拡張ライブラリの作成

最初に、ワークスペース内で新しいプロジェクトを生成します:

```sh
ng generate library my-extension
```

`projects/my-extensions` フォルダに新しいプロジェクトを取得します。
デフォルトでは、プロジェクトには少なくとも次のコンテンツが含まれています:

- Example component `my-extension.component.ts`
- Example service `my-extension.service.ts`
- Angular Module example `my-extension.module.ts`

次に、次のコマンドでプロジェクトをビルドします:

```sh
ng build my-extension
```

Angular CLI は、プロジェクトの Typescript パスマッピングを自動的に構成するため、ライブラリをリンクするための追加手順は必要ありません。

### 動的コンポーネントを登録する

ここで、`MyExtensionComponent` を拡張コンポーネントとして登録する必要があります。
次の例のようにコードを更新します:

```typescript
import { ExtensionService } from '@alfresco/adf-extensions';

@NgModule({...})
export class MyExtensionModule {
    constructor(extensions: ExtensionService) {
        extensions.setComponents({
            'my-extension.main.component': MyExtensionComponent,
        });
    }
}
```

`MyExtensionComponent` を参照する場合、
JSON 定義で `my-extension.main.component` 識別子を使用できるようになりました。

### プラグイン定義ファイル

ライブラリプロジェクトのルートフォルダに次の内容の新しい `assets/my-extension.json` ファイルを作成します:

```json
{
  "$schema": "../../../extension.schema.json",
  "$version": "1.0.0",
  "$name": "plugin1",
  "$description": "demo plugin",

  "routes": [
    {
      "id": "my.extension.route",
      "path": "ext/my/route",
      "component": "my-extension.main.component"
    }
  ],

  "features": {
    "navbar": [
      {
        "id": "my.extension.nav",
        "items": [
          {
            "id": "my.extension.main",
            "icon": "extension",
            "title": "My Extension",
            "route": "my.extension.route"
          }
        ]
      }
    ]
  }
}
```

ルートの `package.json` ファイルを更新し、`scripts` セクションに次のエントリを追加します:

```json
{
    "scripts": {
        "build:my-extension":
            "ng build my-extension && npx cpr projects/my-extension/assets dist/my-extension/assets --deleteFirst"
    }
}
```

このスクリプトを使用して、ライブラリを構築し、アセットをアウトプットフォルダにコピーできるようになりました。

**Tip:** ライブラリのインストール手順を `README.md` ファイルで提供することをお勧めします。
プラグイン定義ファイルをメインアプリケーションの `assets/plugins` フォルダにコピーするビルドルールが開発者に必要であることを忘れないでください。

## NPM へのライブラリの公開

公開する前に、常にライブラリを再構築する必要があります:

```sh
npm run build:my-extension
```

アウトプットフォルダに移動し、publish コマンドを実行します。

```sh
cd dist/my-extension
npm publish
```

注: 有効な [NPM](https://www.npmjs.com/) アカウントが必要です。

詳細については、[ライブラリの公開](https://github.com/angular/angular-cli/wiki/stories-create-library#publishing-your-library) の記事をご覧ください。

## 拡張ライブラリの使用

拡張ライブラリを NPM に公開していると仮定すると、標準コマンドを使用してインストールできます:

```sh
npm install my-extension
```

これにより、ライブラリとそのすべての依存関係がインストールされます。

**注:** アプリケーションはすでに `dist` フォルダのローカルバージョンを使用するように設定されているため、元のワークスペースにライブラリをインストールする必要はありません。

### アセットをコピーする

同じワークスペースで拡張ライブラリを開発およびテストする場合は、`angular.json` 設定ファイルを編集し、次のルールを追加します。

```json
{
  "glob": "**/*.json",
  "input": "dist/my-extension/assets",
  "output": "/assets/plugins"
}
```

NPM から拡張機能をインストールする場合は、次のルールを使用します:

```json
{
  "glob": "**/*.json",
  "input": "node_modules/my-extension/assets",
  "output": "/assets/plugins"
}
```

### モジュールの登録

メインアプリケーションで、`src/app/extensions.module.ts` ファイルを編集し、次の例のようにモジュール宣言を追加します:

```typescript
import { MyExtensionModule } from 'my-extension';

@NgModule({
    imports: [
        MyExtensionModule
    ]
})
export class AppExtensionsModule {}
```

### プラグインの登録

最後に、`assets/app.extensions.json` ファイルを更新し、新しいプラグインへの参照を追加します:

```json
{
    "$references": [
        "my-extension.json"
    ]
}
```

## ライブラリのテスト

アプリケーションを実行し、追加のナビゲーションサイドバーエントリがあることを確認します:

```sh
npm start
```

`My Extension` リンクをクリックすると、メインコンテンツ領域にライブラリからの拡張機能コンポーネントが表示されます。

**Note:** アプリケーションの設定によっては、`admin` ユーザーが利用できる `Settings` ダイアログ (アプリケーションプロファイルボタンをクリックします) を介して外部プラグインを有効にする必要がある場合があります。
