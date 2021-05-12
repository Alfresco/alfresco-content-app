---
Title: 既存の拡張機能のインストール方法
nav: ja
---

このチュートリアルの目的は、[Alfresco Content Application (通称 ACA)](https://github.com/Alfresco/alfresco-content-app "https://github.com/Alfresco/alfresco-content-app") に既存の拡張機能をインストールする方法を説明することです。[ACA 拡張メカニズム](https://alfresco-content-app.netlify.app/#/extending/ "https://alfresco-content-app.netlify.app/#/extending/")は、ADF ベースのフロントエンドアプリケーションをカスタマイズするための推奨された方法であり、このチュートリアルは、拡張機能を管理するためのこの関連タスクに役立つはずです。

# 前提条件

このチュートリアルのスタート地点は、テスト済みで動作する ACA 拡張機能と、[Alfresco Content Application (通称 ACA)](https://github.com/Alfresco/alfresco-content-app "https://github.com/Alfresco/alfresco-content-app") の完全なリポジトリが利用可能であることです。このチュートリアルは、以下のバージョンのソフトウェアで書かれています。
-   ACA バージョン 2.2.0,
-   ACS 7.0.0-M3,
-   NodeJs バージョン 14.15.2,
-   Chrome バージョン 87.0.4280.88.

このチュートリアルでは、既存の ACA 拡張機能が `my-extension` という名前で、その構造がチュートリアル [こちら](How-to-create-your-first-extension.md "how-to-create-your-first-extension.md") で説明されている `projects/my-extension` パスの内容と構造に準拠していることを前提としています。

# ACA 拡張機能のインストール

このタスクの背景にある考え方は、既存の ACA 拡張機能と同じ名前で全く新しい ACA 拡張機能を作成し、説明されている目標を達成するためにそのコンテンツを置き換えることです。

ACA プロジェクトのルートフォルダから、ターミナルで以下のコマンドを起動します。その際、既存の拡張機能 (ここでは my-extension) と同じ名前を使用することを確認してください。

    ng generate library my-extension

エラーが発生した場合は、`tsconfig.json` ファイルに以下の行を追加してください。

    "compilerOptions": { "baseUrl": ".", "rootDir": "." }

完了したら、`projects/my-extension` フォルダの内容をすべて削除し、既存の ACA 拡張機能のソースコードで置き換えます。

作成を完了するには、次のコマンドを起動して拡張機能を構築します。

    ng build my-extension

エラーが発生した場合は、`tsconfig.json` ファイルに以下の設定を追加してください。

    "compilerOptions": { ..., "allowSyntheticDefaultImports":true }

# ACA アプリケーションの一部として拡張を行う

ACA 拡張機能が初期バージョンで開発されたので、アプリケーションで使用されるもののリストに拡張モジュールを追加してみましょう。この作業は、[Alfresco Content Application (通称ACA) で最初の拡張機能を作成する方法](how-to-create-your-first-extension.md)というチュートリアルで説明されているのと同じ作業を行うことができます(パラグラフ「ACA アプリケーションの一部として拡張を行う」)。拡張機能のインストール (`npm install my-extension`) が成功すると、タスクは完了したとみなすことができます。

# 拡張機能を含む ACA の動作

すべての開発が適切に行われたので、いよいよ ACA を起動して結果を見てみましょう。ADW を起動するには、ターミナルから次のコマンドを実行します。

    npm start

ACA のランディングページの左メニューに新しい項目が追加され、次のような内容の新しいページへのルートが実装されているはずです。下のスクリーンショットは、それがどのように見えるかを説明しています。

![extension](../images/extension-02.png)