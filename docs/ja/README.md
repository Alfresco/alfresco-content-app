---
Title: Alfresco Content Application
Github only: true
nav: ja
---

# Alfresco Content Application

<!-- markdownlint-disable MD033 -->

Alfresco Content Application は、[Alfresco Application Development Framework (ADF)](https://www.alfresco.com/abn/adf/docs) コンポーネントを使用して構築され、
[Angular CLI](https://github.com/angular/angular-cli) で生成されたファイル管理アプリケーションです。

## このアプリケーションの対象者

Content Application は、Alfresco Content Services の上で、Alfresco コンテンツリポジトリ内のファイル管理を中心としたエンドユーザー向けの合理的なエクスペリエンスです。開発者には、カスタムコントロール、ビューアコンポーネント、ページ、プラグインをアップグレードせずに安全に注入する方法を提供することで、簡単に拡張できる環境を提供し、迅速にカスタムアプリケーションを開発することができます。

## どこで助けを求めるか

Content App や ADF を使い始めるのに役立つリソースが多数用意されています。

- [Gitter Chat](https://gitter.im/Alfresco/content-app) - 開発者コミュニティチャット
- [Content App Documentation](https://alfresco-content-app.netlify.app/) - 開発者向けドキュメント
- [Alfresco ADF Documentation](https://www.alfresco.com/abn/adf/) - Application Development Framework のドキュメント
- [Alfresco Community Portal](https://community.alfresco.com/) - 開発者コミュニティフォーラム
- [Alfresco Customer Support](https://support.alfresco.com/) - Alfresco Digital Workspace のカスタマーサポート

## ドキュメント

ドキュメントは次のセクションに分かれています:

- [アプリの機能](/ja/features/): ユーザーインターフェイスとアプリの使用方法の詳細。
- [入門](/ja/getting-started/): 開発環境とアプリの構成。
- [拡張](/ja/extending/): 独自のコードでアプリの機能を拡張する方法。
- [チュートリアル](/ja/tutorials/): 開発技術の詳細な調査。
- [ヘルプ](/ja/help): さらなるヘルプとサポートの詳細が利用可能です。

## 互換性

| ACA バージョン | 構築バージョン | テスト済み環境 |
| ----------- | ---------- | --------- |
| ACA 2.2.0   | ADF 4.2.0  | ACS 6.2   |
| ACA 2.1.0   | ADF 4.1.0  | ACS 6.2   |
| ACA 1.12    | ADF 3.9.0  | ACS 6.2   |
| ACA 1.11    | ADF 3.8.0  | ACS 6.2   |
| ACA 1.10    | ADF 3.7.0  | ACS 6.2   |
| ACA 1.9     | ADF 3.6.0  | ACS 6.2   |
| ACA 1.8     | ADF 3.3.0  | ACS 6.1   |
| ACA 1.7     | ADF 3.0.0  | ACS 6.1   |
| ACA 1.6     | ADF 2.6.1  | ACS 6.1   |
| ACA 1.5     | ADF 2.6.0  | ACS 6.0   |
| ACA 1.4     | ADF 2.5.0  | ACS 6.0   |
| ACA 1.3     | ADF 2.4.0  | ACS 6.0   |
| ACA 1.2     | ADF 2.3.0  | ACS 5.2   |
| ACA 1.1     | ADF 2.2.0  | ACS 5.2   |
| ACA 1.0     | ADF 2.0.0  | ACS 5.2   |

## 利用可能な機能

| バージョン | 機能                            | 説明                                                                                                                                                                                    |
| ------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.5     | あなたのファイル                           | 個人用ファイルのフォルダ/ファイル閲覧。                                                                                                                                                        |
| 1.5     | ファイルライブラリ                     | リポジトリに作成されたサイトのファイルライブラリを作成、検索、サイトへの参加、参照することができます。                                                                                                       |
| 1.5     | 共有ファイル                       | 共有しているファイルを一覧表示します。                                                                                                                                                              |
| 1.5     | 最近使用したファイル                       | ログに記録されたユーザーが過去30日以内に作成・変更したファイルを一覧表示します。                                                                                                                |
| 1.5     | お気に入り                          | ユーザーのお気に入りのファイルを一覧表示します。                                                                                                                                                         |
| 1.5     | ごみ箱                              | ゴミ箱に保存されているすべての削除済みアイテムを一覧表示し、ユーザーは復元または永久に削除することができます。管理者ユーザーは、すべてのユーザーが削除したアイテムを見ることができます。                                                      |
| 1.5     | アップロード                             | ファイルやフォルダのアップロードは、「新規」ボタンをクリックするか、ブラウザにドラッグ＆ドロップすることで実行できます。                                                                                         |
| 1.5     | 検索                             | 検索結果をライブで表示するクイック検索と、フルファセットの検索結果ページ。                                                                                                                          |
| 1.5     | 処理                            | ファイルやフォルダに対して個別に、あるいは複数のファイルを同時に、さまざまな処理を行うことができます。                                                                                      |
| 1.5     | ビューア                             | ブラウザでネイティブにファイルを表示すると、サポートされていないフォーマットはリポジトリで変換されます。                                                                                               |
| 1.5     | メタデータ                           | 情報ドロワーは、app.config.json でメタデータ情報を表示するように設定できます。デフォルトでは、ファイルのプロパティアスペクトが表示され、画像には EXIF 情報も表示されます。 |
| 1.5     | File Sharing                       | 必要に応じて期限付きのファイルを、一意に生成された URL で外部に共有することができます。                                                                                                            |
| 1.5     | バージョニング                         | バージョンマネージャーでは、過去のファイルのバージョンにアクセスして管理したり、新しいバージョンをアップロードすることができます。                                                                          |
| 1.5     | 顕現                        | リポジトリ内のフォルダやファイルに対するきめ細かなユーザー権限管理。                                                                                                        |
| 1.5     | 拡張性                      | このアプリケーションには、安全な拡張ポイントが用意されており、完全なカスタマイズが可能です。詳細は[ドキュメント](https://alfresco-content-app.netlify.app/#/ja/extending/)を参照してください。                            |
| 1.6     | ライブラリの管理                 | ライブラリに参加したり、お気に入りに登録することができます。ライブラリ、ファイル、フォルダを検索するための新しい検索入力。                                                                                                         |
| 1.7     | オフライン編集                       | 編集のためのロックとロック解除、現在のバージョンのダウンロード、新しいバージョンのアップロード。                                                                                                                     |
| 1.7     | Microsoft Office™ で編集         | Alfresco Office Services (AOS) でオンライン編集ができるように拡張しました。                                                                                                                                   |
| 1.7     | Single Sign-On (SSO)               | Alfresco Identity Service のサポート、ADF 3.0.0 から                                                                                                                                          |
| 1.7     | Search Query Language              | Alfresco Search Query Language による検索入力の強化                                                                                                                                 |
| 1.8     | ローカライゼーション                    | アラビア語、チェコ語、デンマーク語、フィンランド語、ポーランド語、スウェーデン語                                                                                                                                             |
| 1.8     | メタデータの改善              | アスペクトとプロパティの自動表示                                                                                                                                                    |
| 1.8     | 検索ファセットの改善          | ファセット間隔とグループ化されたファセットクエリ                                                                                                                                                      |
| 1.8     | 拡張性の向上         | 各種 - 詳細は[リリースノート](https://github.com/Alfresco/alfresco-content-app/releases)をご覧ください。                                                                                           |
| 1.9     | シングルログアウト                     | ユーザーは、同じブラウザセッションで他のアプリケーションからログアウトした後、Content App から自動的にログアウトされます。                                                             |
| 1.9     | アクセシビリティの向上         | 各種 - 詳細は[リリースノート](https://github.com/Alfresco/alfresco-content-app/releases)をご覧ください。                                                                                           |
| 1.10    | テンプレートからファイル/フォルダを作成する | あらかじめ設定されたテンプレートからファイルやフォルダの構造を作成することができます。                                                                                                                           |

機能の一覧は[リリース](https://github.com/Alfresco/alfresco-content-app/releases)をご参照ください。

## 課題や機能のリクエストの提起

課題は、[GitHub] または Alfresco JIRA プロジェクトで提起することができます。
その際には、明確な説明、再現するための手順、必要に応じてスクリーンショットを添付してください。バグは再現可能であれば分類され、機能強化や機能提案は、そのユースケースが汎用的なニーズに応えるものであれば、既存の優先事項と照らし合わせて検討されます。

## 貢献する方法

バグを報告したり、コードを寄稿したり、ドキュメントを改善したいですか? 素晴らしい!
[貢献][contributing]に関するガイドラインを読み、[Jira][jira] または [GitHub][github] の問題の1つをチェックしてください。

### 貢献がレビューされるまでどれくらいかかりますか

コードのレビューに必要な時間は異なります。小さな変更は数日以内にレビューされ、大きな変更には時間がかかる場合があります。

[contributing]: https://github.com/Alfresco/alfresco-content-app/blob/master/CONTRIBUTING.md
[github]: https://github.com/Alfresco/alfresco-content-app/issues
[jira]: https://issues.alfresco.com/jira/projects/ACA
[release notes]: https://github.com/Alfresco/alfresco-content-app/releases
