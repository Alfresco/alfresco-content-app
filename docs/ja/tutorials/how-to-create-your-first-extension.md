---
Title: 最初の拡張機能を作成する方法
nav: ja
---

このチュートリアルの目的は、[Alfresco Content Application (通称 ACA)](https://github.com/Alfresco/alfresco-content-app "https://github.com/Alfresco/alfresco-content-app")の “hello world” 拡張機能を開発する方法を説明することです。[ACA 拡張メカニズム](https://alfresco-content-app.netlify.app/#/extending/ "https://alfresco-content-app.netlify.app/#/extending/")は、サポートされているフロントエンドアプリケーションをカスタマイズするための推奨方法であり、このチュートリアルは、顧客やパートナーと共有するコンテンツの基礎となることを想定しています。

# 前提条件

このチュートリアルのスタート地点は、開発環境 (例えばあなたのラップトップ) で [Alfresco Content Application (通称 ACA)](https://github.com/Alfresco/alfresco-content-app "https://github.com/Alfresco/alfresco-content-app") の完全なリポジトリを利用できることです。このチュートリアルは、以下のバージョンのソフトウェアの利用を前提として書かれています。
-   ACA バージョン 2.2.0,
-   ACS 7.0.0-M3,
-   NodeJs バージョン 14.15.2,
-   Chrome バージョン 87.0.4280.88.

# ACA 拡張機能の作成

[こちら](https://github.com/Alfresco/alfresco-digital-workspace-app/blob/develop/docs/extending.md "https://github.com/Alfresco/alfresco-digital-workspace-app/blob/develop/docs/extending.md")に記載されているように、ADW 拡張機能の作成は、モノレポ用の [Nx Workspace](https://nx.dev/angular "https://nx.dev/angular") の開発ツールに沿って簡単に行うことができます。

ACA プロジェクトのルートフォルダから、ターミナルで以下のコマンドを起動します。ご覧のように、以下のコマンドでは、`my-extension` という名前の新しいエクステンションを作成しています。

    ng generate library my-extension

エラーが発生する場合は、`tsconfig.json` ファイルに以下の行を追加してください。

    "compilerOptions": { "baseUrl": ".", "rootDir": "." }

そうすると、`projects/my-extension` のパスに、以下のような構造が現れます。

-   すべての typescript のソースコードを含む `src` フォルダ。非常に重要なのは、拡張機能のすべてのインクルードを定義した `public-api.ts` ファイルと、拡張機能のモジュールクラスを定義した `lib/my-extension.module.ts` ファイルです
    
-   ドキュメント用の README.md ファイルや、テストや設定に使用するその他のファイル

作成を完了するには、次のコマンドを起動して拡張機能を構築します。

    ng build my-extension

# ACA 拡張機能の基礎知識を身につける

さて、`my-extension` ができたので、拡張モジュールに適切な設定を加えてみましょう。そのためには、`projects/my-extension/src/lib/my-extension.module.ts` ファイルを以下のように変更します。

    // 以下のようにインポートを追加します。
    import { ExtensionService } from '@alfresco/adf-extensions';
    
    // 以下のようにコンストラクタを追加します。
    NgModule({...})
    export class MyExtensionModule {
      constructor(extensions: ExtensionService) {
        extensions.setComponents({
          'my-extension.main.component': MyExtensionComponent,
        }); 
      }
    }

さて、いよいよ新しい拡張機能の設定を行います。このために、ACA のランディングページの左メニューで見ることができるリンクを追加するために拡張を指示します。

適切な設定を行うために、記述されたパスに以下のフォルダを作成します。

    projects/my-extension/assets

これができたら、次のような内容のファイル `projects/my-extension/assets/my-extension.json` を作成します。

    {
      "$schema": "../../../extension.schema.json",
      "$id": "my-extension",
      "$version": "1.0.0",
      "$vendor": "氏名または会社名",
      "$name": "plugin1",
      "$description": "demo plugin",
      "$license": "MIT",
      
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

これは非常に基本的な例で、既存の左メニューに “My Extension” という項目を追加し、ACA のランディングページに表示される “my-extension works!“ というテキストを含む空白のページを実装します。ここからは、[拡張](https://alfresco-content-app.netlify.app/#/extending/ "https://alfresco-content-app.netlify.app/#/extending/")のドキュメントに従って、拡張機能を充実させていくことができます。

# ACA アプリケーションの一部として拡張を行う

ACA の拡張機能が初期バージョンとして開発されたので、アプリケーションが使用するもののリストに拡張モジュールを追加してみましょう。タスクを完了するには、`src/app/extensions.module.ts` ファイルを以下のように編集します。

    // ページに次のようなインポートを追加します。
    import { MyExtensionModule } from 'my-extension';
    
    @NgModule({
      imports: [
        ...,
        MyExtensionModule
      ],
    })
    export class AppExtensionsModule {}

さらに、`src/assets/app.extensions.json` ファイルを編集して、`$references` 配列を作成します。下の図は、そのようになっています。

    "$references": ["my-extension.json"],

ACA アプリからパブリック URL を介して拡張機能が見えるように、設定ファイルを指示してみましょう。タスクを完了するには、以下のように angular.json ファイルを編集します。

    // 'src/app.config.json' 配列に追加します。
    ...
    {
      "glob": "my-extension.json",
      "input": "projects/my-extension/assets",
      "output": "./assets/plugins"
    },
    ...

最後に、package.json ファイルを編集して拡張機能のビルドを許可し、scripts セクションに以下の行を追加します。

    { ...
      "scripts": {
        ...,
        "build:my-extension": "ng build my-extension && npx cpr projects/my-extension/assets dist/my-extension/assets --deleteFirst"
      }, ...
    }

以下のコマンドを実行して、拡張機能のビルドを作成します。

    npm install my-extension

# 拡張機能を含む ACA の動作

すべての開発が完了したので、いよいよ ADW を起動して結果を見てみましょう。ADW を起動するには、ターミナルから次のコマンドを実行します。

    npm start

ACA のランディングページの左メニューに新しい項目が追加され、次のような内容の新しいページへのルートが実装されているはずです。下のスクリーンショットは、それがどのように見えるかを説明しています。

![extension](../images/extension-01.png)
