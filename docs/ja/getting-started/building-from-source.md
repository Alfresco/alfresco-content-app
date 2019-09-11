---
Title: ソースからビルド
nav: ja
---

# ソースからビルド

Content App は [Angular CLI](https://cli.angular.io) をベースとしており、CLI でサポートされているすべてのコマンド、ジェネレーター、およびブループリントを使用できます。

## ビルドの前提条件

- [Node.js](https://nodejs.org/ja/) LTS
- (オプション) [Angular CLI](https://cli.angular.io/) 7.3.4 以降

> Angular CLI ライブラリはすでにセットアップの一部です。
> CLI コマンドを個別に使用する場合にのみ、グローバル (推奨) ツールとしてインストールすることをお勧めします。

## クローンと実行

次のコマンドを使用してプロジェクトのクローンを作成し、依存関係をインストールして実行します。

```sh
git clone https://github.com/Alfresco/alfresco-content-app.git
cd alfresco-content-app
npm install
npm start
```

アプリケーションはデフォルトでポート `4200` で実行され、プロジェクトがコンパイルされるとデフォルトのブラウザで自動的に開きます。

## プロキシ設定

Content App は、ローカル開発サーバのプロキシ設定を提供します。これにより、CORS とネイティブ認証ダイアログを使用して特定のシナリオに対処できます。

プロジェクトのルートディレクトリにある `proxy.conf.js` ファイルの中に設定があります。

**注:** プロキシ設定は `npm start` スクリプトでアプリケーションを実行するたびに自動的に適用されます。
設定を変更するたびにアプリケーションを再起動する必要があります。

## 単体テストの実行

[Karma](https://karma-runner.github.io) を介して単体テストを実行するには、`npm test` を実行します。
