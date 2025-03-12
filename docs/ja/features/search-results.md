---
Title: 検索結果
nav: ja
---

# 検索結果

検索入力コンポーネントにクエリを入力すると、アプリケーションはページに検索結果を返します。検索結果ページからファイルを開いて、選択したアイテムに使用可能な権限に応じてさまざまなアクションを実行できます。

![検索結果](../images/aca-search-results.png)

このページは、次の ADF コンポーネントで構成されています:

- [Search Filter](https://www.alfresco.com/abn/adf/docs/content-services/components/search-filter.component/)
- [Search Chip List](https://www.alfresco.com/abn/adf/docs/content-services/components/search-chip-list.component/)
- [Search Sorting Picker](https://www.alfresco.com/abn/adf/docs/content-services/components/search-sorting-picker.component/)
- [Document List](https://www.alfresco.com/abn/adf/docs/content-services/components/document-list.component/) with custom layout template
- [Info Drawer](/features/info-drawer) with Metadata and [Version Management](#version-manager)
- [Toolbar with basic actions](/features/document-list-layout#actions-and-the-actions-toolbar) 例えば `Preview`, `Download`, `Favorite`, `Copy`, など

また、コピーおよび移動操作用の情報ドロワー、ツールバー、およびノードセレクターダイアログもあります。

## Alfresco 全文検索

次の表は、**検索入力**コンポーネントを使用する場合のコンテンツアプリケーションでの
[Alfresco 全文検索](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference) (FTS) 構文の
現在のサポートについて説明しています。

| 機能                                                          | フル | 部分的 | N/A | 詳細                                                                            |
| ---------------------------------------------------------------- | ---- | ------- | --- | ---------------------------------------------------------------------------------- |
| Search for a single term                                         | 1.6  |         |     | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Search-for-a-single-term)         |
| Search for a phrase                                              |      | 1.7     |     | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Search-for-a-phrase)         |
| Search for an exact term                                         | 1.7  |         |     | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Search-for-an-exact-term)          |
| Search for term expansion                                        |      |         | X   | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Search-for-term-expansion)           |
| Search for conjunctions                                          | 1.7  |         |     | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Enterprise/4.1/Alfresco-Search-Enterprise/Using/Search-query-syntax/Search-for-conjunctions)       |
| Search for disjunctions                                          | 1.7  |         |     | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Search-for-disjunctions)       |
| Search for negation                                              |      |         | X   | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Search-for-negation)         |
| Search for optional, mandatory, and excluded elements of a query |      |         | X   | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Search-for-optional-mandatory-and-excluded-elements-of-a-query)       |
| Search in fields                                                 |      | 1.7     |     | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Search-in-fields)         |
| Search for wildcards                                             |      | 1.7     |     | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Search-for-wildcards)      |
| Search for ranges                                                |      |         | X   | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Search-for-ranges)         |
| Search for fuzzy matching                                        |      |         | X   | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Search-for-fuzzy-matching)          |
| Search for proximity                                             |      |         | X   | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Search-for-proximity)      |
| Search for boosts                                                |      |         | X   | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Query-time-boosts)         |
| Search for grouping                                              |      |         | X   | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Search-for-grouping)       |
| Search for spans and positions                                   |      |         | X   | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Search-for-spans-and-positions)          |
| Escaping characters                                              |      |         | X   | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Escaping-characters)       |
| Mixed FTS ID behavior                                            |      |         | X   | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Mixed-FTS-ID-behavior)          |
| Search for operator precedence                                   |      |         | X   | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Search-for-operator-precedence)     |
| Search query templates                                           |      |         | X   | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Search-query-templates) |
| Search query literals                                            |      |         | X   | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Search-query-literals)       |
| Search using date math                                           |      |         | X   | [Docs](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference/Search-using-date-math)      |

> **部分的**なサポートとは、この機能が基本的なシナリオをサポートすることを意味し、
> まだ完全にはテストされておらず動作しない可能性があるエッジケースがあります。
