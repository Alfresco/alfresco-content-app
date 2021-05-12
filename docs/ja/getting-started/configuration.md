---
Title: 設定
nav: ja
---

# 設定

Alfresco Content Application では、グローバル設定ファイル `app.config.json` がサポートされており、これを使用して Content Application と ADF コンポーネントの動作をカスタマイズすることができます。

## サーバの設定

Content Application が起動すると、Alfresco Content Services サーバーの場所と、ファイル共有用の URL を知る必要があります。

### Content Services アドレス

"ecmHost" プロパティでは、サーバーのアドレスを動的または静的な形式で設定できます。

#### 動的アドレス

以下の例は、開発環境で最も一般的な動的形式を示しています:

```json
{
    "ecmHost": "http://{hostname}{:port}"
}
```

上記の構成は、ACS と Alfresco Content Application が同じサーバーとポートで動作していることを前提としており、
同じ統一された設定ファイルを持つ異なるサーバーへのデプロイを可能にしています。

たとえば、ルートアプリケーションとして Alfresco Content Application をホストする `localhost:4200` のプロキシサーバーと、
ACS リポジトリをホストする`localhost:4200/alfresco` のプロキシサーバーです。

実行時には、アプリケーションが自動的に "{hostname}" の値を元のホスト名で置き換えます。
オプションとして、元のポートの値があればそれを使用することもできます。例えば、ローカルマシンでは "4200" のように、80 番ポートの値をスキップすることもできます。

#### 静的アドレス

または、必要に応じて、ACS サーバーの静的アドレスを提供できます:

```json
{
    "ecmHost": "http://localhost:4200"
}
```

### 共有ファイルのアドレス

"baseShareUrl" プロパティは、ユーザーが共有ファイルにアクセスする際のアドレスをどのように構築するかをアプリケーションに伝えるものです。

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
    "application": {
        "name": "Alfresco サンプルコンテンツアプリケーション"
    }
}
```

`application.name` のキーの値は、実行時に `[ページタイトル] - [アプリケーション名]` の形式ですべてのブラウザタブタイトルに追加されます。
例: "個人ファイル - Alfresco サンプルコンテンツアプリケーション"

### アプリケーションロゴ

Alfresco コンテンツアプリケーションの左上隅に表示されるデフォルトのロゴは変更できます:

1. カスタムロゴ画像ファイルを [アプリ名]/src/assets/images フォルダに配置します。表示された画像は自動的にサイズ変更され、極端な幅/高さの画像は寸法を保持できない場合があります。

2. app.config.json ファイルで、application.logo の値にカスタムロゴ画像の名前を含むように設定します: "logo": "/assets/images/[カスタムロゴ画像ファイル名].[拡張子]"

```json
{
    "application": {
        "logo": "/assets/images/alfresco-logo-white.svg"
    }
}
```

### ヘッダーの背景色

"headerColor" キーの色コードを指定することにより、ヘッダーの背景色を変更できます:

```json
{
    "headerColor": "#ffffff"
}
```

### ヘッダーの背景画像

ヘッダーの背景画像を変更するには、対応するリソースへのパスを指定します:

```json
{
    "application": {
      "headerImagePath": "assets/images/mastHead-bg-shapesPattern.svg"
    }
}
```

### 制限されたコンテンツ

"files.excluded" パスにあるルールのリストを設定または拡張することで、ユーザーが特定の種類のファイルやフォルダをアップロードできないように制限することができます。

デフォルトでは、以下のルールがあらかじめ定義された状態で提供されています:

```json
{
    "files": {
        "excluded": [
            ".DS_Store",
            "desktop.ini",
            "thumbs.db",
            ".git"
        ]
    }
}
```

**Tip:** サポートされているルールの詳細については、ADF [Upload Service](https://www.alfresco.com/abn/adf/docs/core/services/upload.service/) のドキュメントをご覧ください。

### ページネーション設定

アプリケーション内のすべてのドキュメントリストに適用されるページネーションのデフォルト設定を変更できます。

```json
{
    "pagination": {
        "supportedPageSizes": [
            25,
            50,
            100
        ]
    }
}
```

## カスタム設定

アプリケーション構成ファイルに任意の情報を定義し、ADF が提供する `AppConfigService` サービスを使って実行時にアクセスすることができます。

**Tip:** アプリケーション設定の機能や利用可能な API の詳細については、
ADF の [App Config Service](https://www.alfresco.com/abn/adf/docs/core/services/app-config.service/) のドキュメントを参照してください。
