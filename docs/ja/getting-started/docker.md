---
Title: Docker
nav: ja
---

# Docker

ACA には ACS 6.0 Community 版が事前構成されています。

アプリケーションは 2 つのモードで実行されます:

- Development (最新のソースコードを実行し、アプリケーションのビルドが必要)
- Preview (最新の公開されたコンテナー、マスターブランチで実行)

## Development モード

ACS イメージと共に、Docker イメージにパッケージ化されたアプリケーションのローカルインスタンスを実行します:

```sh
npm run build.release
npm run start:docker
```

コンテナ内から提供される場合、ACA は `8080` ポートで実行されます。

次のコマンドを使用して、すべてのコンテナを停止します:

```sh
npm run stop:docker
```

アプリケーションを開発し、デフォルトのポート (4200) で実行することもできます。
これは、同じ docker コンテナを自動的に使用します。
