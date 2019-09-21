---
Title: 設定
nav: ja
---

# 設定

Alfresco Content Application は、Content Application と ADF コンポーネントの動作をカスタマイズするために使用できるグローバル設定ファイル `app.config.json` のサポートを提供します。

## サーバの設定

Content Application が起動したら、Alfresco Content Services サーバの場所と、ファイル共有 URL を確認する必要があります。

### Content Services アドレス

"ecmHost" プロパティを使用すると、動的または静的形式を使用してサーバのアドレスを設定できます。

#### 動的アドレス

以下の例は、開発環境で最も一般的な動的形式を示しています:

```json
{
    "ecmHost": "http://{hostname}{:port}",
    ...
}
```

上記の構成では、ACS と Alfresco Content Application を同じサーバとポートで実行していることを前提としており、
同じ統合構成ファイルを持つ異なるサーバに展開できます。

たとえば、ルートアプリケーションとして Alfresco Content Application をホストしている `localhost:4200` のプロキシサーバと、
ACS リポジトリの `localhost:4200/alfresco` のプロキシサーバです。

実行時に、アプリケーションは自動的に "{hostname}" の値を元のホスト名に置き換えます。
オプションで、ローカルマシンの "4200" など、元のポートの値が存在する場合はポート 80 の値をスキップしてそれを使用することもできます。

#### 静的アドレス

または、必要に応じて、ACS サーバの静的アドレスを提供できます:

```json
{
    "ecmHost": "http://localhost:4200",
    ...
}
```

### 共有ファイルのアドレス

"baseShareUrl" プロパティは、ユーザーが共有ファイルにアクセスするアドレスを作成する方法をアプリケーションに指示します。

```json
{
  "baseShareUrl": "{protocol}//{hostname}{:port}/#/preview/s"
}
```

## アプリケーションの設定

アプリケーションのデフォルトの動作を置き換えるために変更できる多くの設定があります。

### アプリケーション名

次のブロックでは、アプリケーションの名前を変更できます。

```json
{
    ...,
    "application": {
        "name": "Alfresco Example Content Application"
    }
}
```

`application.name` キーの値は、実行時に `[ページタイトル] - [アプリケーション名]` の形式ですべてのブラウザタブタイトルに追加されます。
例: "個人ファイル - Alfresco サンプルコンテンツアプリケーション"

### アプリケーションロゴ

Alfresco コンテンツアプリケーションの左上隅に表示されるデフォルトのロゴは変更できます:

1. カスタムロゴ画像ファイルを[アプリ名]/src/assets/images フォルダに配置します。表示された画像は自動的にサイズ変更され、極端な幅/高さの画像は寸法を保持できない場合があります。

2. app.config.json ファイルで、application.logo の値にカスタムロゴ画像の名前を含むように設定します: "logo": "/assets/images/[カスタムロゴ画像ファイル名].[拡張子]"

```json
{
    ...,
    "application": {
        "logo": "/assets/images/alfresco-logo-white.svg"
    }
}
```

### ヘッダーの背景色

"headerColor" キーの色コードを指定することにより、ヘッダーの背景色を変更できます:

```json
{
    ...,
    "headerColor": "#2196F3"
}
```

### 制限されたコンテンツ

"files.excluded" パスでルールのリストを設定または拡張することにより、ユーザーが特定のタイプのファイルおよびフォルダーをアップロードすることを制限できます。

デフォルトでは、アプリケーションには以下のルールがあらかじめ定義されています:

```json
{
    ...,
    "files": {
        "excluded": [
            ".DS_Store",
            "desktop.ini",
            "thumbs.db",
            ".git"
        ]
    },
    ...
}
```

**Tip:** サポートされているルールの詳細については、ADF [Upload Service](https://www.alfresco.com/abn/adf/docs/core/services/upload.service/) のドキュメントをご覧ください。

### ページネーション設定

アプリケーション内のすべてのドキュメントリストに適用されるページネーションのデフォルト設定を変更できます。

```json
{
    ...,
    "pagination": {
        "supportedPageSizes": [
            25,
            50,
            100
        ]
    },
    ...
}
```

## カスタム設定

アプリケーション設定ファイルに情報を保存し、ADF が提供する `AppConfigService` サービスを使用して実行時にアクセスできます。

**Tip:** 利用可能なアプリケーション構成機能および API の詳細については、
ADF の [App Config Service](https://www.alfresco.com/abn/adf/docs/core/services/app-config.service/) のドキュメントを参照してください。
