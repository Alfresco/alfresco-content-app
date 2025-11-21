---
Title: Search Results
---

# Search Results

When you type queries into the Search Input component, the application will return the Search Results in a page. From the search results page you can open files and perform various actions depending on the permissions available for the selected item.

![Search Results](../images/aca-search-results.png)

This page consists of the following ADF components:

- [Search Filter](https://www.alfresco.com/abn/adf/docs/content-services/components/search-filter.component/)
- [Search Chip List](https://www.alfresco.com/abn/adf/docs/content-services/components/search-chip-list.component/)
- [Search Sorting Picker](https://www.alfresco.com/abn/adf/docs/content-services/components/search-sorting-picker.component/)
- [Document List](https://www.alfresco.com/abn/adf/docs/content-services/components/document-list.component/) with custom layout template
- [Info Drawer](/features/info-drawer) with Metadata and [Version Management](#version-manager)
- [Toolbar with basic actions](/features/document-list-layout#actions-and-the-actions-toolbar) like `Preview`, `Download`, `Favorite`, `Copy`, etc.

And also the Info Drawer, Toolbar and Node Selector dialogs for copy and move operations.

## Alfresco Full Text Search

The following table describes current support of the
[Alfresco Full Text Search](https://support.hyland.com/r/Alfresco/Alfresco-Search-Services/2.0/Alfresco-Search-Services/Using/Full-text-search-reference) (FTS) syntax
in the Content Application when using **Search Input** component.

| Feature                                                          | Full | Partial | N/A | Details                                                                            |
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

> **Partial** support means the feature supports basic scenarios
> and there are edge cases that are not yet fully tested and might not work.

## Search Queries and Precise Searching

You can customize the queries to get better results.

Given that, no colon ":" suffixes the term, then the default query is constructed for text searches. The default query is:

```text
(cm:name:"[term]*" OR cm:title:"[term]*" OR cm:description:"[term]*" OR TEXT:"[term]*" OR TAG:"[term]*")
```

Note that compared to Share the following defaults are removed from ACA:

```text
OR ia:whatEvent:"[term]*" OR ia:descriptionEvent:"[term]*" OR lnk:title:"[term]*" OR lnk:description:"[term]*"
```

### Key facts

1. If you have entered more than one word into the search input box, then the search query is constructed automatically using an `AND` operation.

2. If you have entered more than one word encapsulated in quotation marks, then the search query is constructed treated everything as a single string.

3. If you have entered more than one word separated by `AND`, then the search query is constructed using an `AND` conjunction. Since `AND` is the default operator (see fact 1), the explicit `AND` keywords are removed when the search input value is processed.

4. If you have entered more than one word separated by `OR`, then the search query is constructed using an `OR` disjunction. Unlike `AND`, the `OR` operators are preserved when processing the search input value because `OR` is not the default operator.

5. If you have entered an `=` symbol before the search term, then the search query is constructed using exact term matching. **Note:** Works only with Solr search. For Elastic Search consider using Search Logical Filter.

### Examples

| Search Type | Entered search input value | Expected result                                                                  | Processed search input value |
| ----------- | -------------------------- | -------------------------------------------------------------------------------- | ---------------------------- |
| Single Term | banana                     | Nodes that contain the term **banana** in any content                            | banana                       |
| Conjunction | big yellow banana          | Nodes that contain all of the terms **big**, **yellow**, and **banana**          | big yellow banana            |
| Phrase      | "big yellow banana"        | Nodes that contain the exact phrase **big yellow banana**                        | "big yellow banana"          |
| Conjunction | big AND yellow AND banana  | Nodes that contain all of the terms **big**, **yellow**, and **banana**          | big yellow banana            |
| Disjunction | orange OR banana OR apple  | Nodes that contain at least one of the terms **orange**, **banana** or **apple** | orange OR banana OR apple    |
| Exact term  | =orange                    | Nodes that contain the exact term **orange** in any content.                     | orange                       |

**Important note:** Consider using Search Logical Filter when you need to combine multiple search types. Mixing search types directly in the input may result in wrong query format and incorrect results.
