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
[Alfresco Full Text Search](http://docs.alfresco.com/6.1/concepts/rm-searchsyntax-intro.html) (FTS) syntax
in the Content Application when using **Search Input** component.

| Feature                                                          | Full | Partial | N/A | Details                                                                            |
| ---------------------------------------------------------------- | ---- | ------- | --- | ---------------------------------------------------------------------------------- |
| Search for a single term                                         | 1.6  |         |     | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-single.html)         |
| Search for a phrase                                              |      | 1.7     |     | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-phrase.html)         |
| Search for an exact term                                         | 1.7  |         |     | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-exact.html)          |
| Search for term expansion                                        |      |         | X   | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-term.html)           |
| Search for conjunctions                                          | 1.7  |         |     | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-conjunct.html)       |
| Search for disjunctions                                          | 1.7  |         |     | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-disjunct.html)       |
| Search for negation                                              |      |         | X   | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-negate.html)         |
| Search for optional, mandatory, and excluded elements of a query |      |         | X   | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-optional.html)       |
| Search in fields                                                 |      | 1.7     |     | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-fields.html)         |
| Search for wildcards                                             |      | 1.7     |     | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-wildcards.html)      |
| Search for ranges                                                |      |         | X   | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-ranges.html)         |
| Search for fuzzy matching                                        |      |         | X   | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-fuzzy.html)          |
| Search for proximity                                             |      |         | X   | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-proximity.html)      |
| Search for boosts                                                |      |         | X   | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-boosts.html)         |
| Search for grouping                                              |      |         | X   | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-grouping.html)       |
| Search for spans and positions                                   |      |         | X   | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-spans.html)          |
| Escaping characters                                              |      |         | X   | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-escaping.html)       |
| Mixed FTS ID behavior                                            |      |         | X   | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-ftsid.html)          |
| Search for operator precedence                                   |      |         | X   | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-precedence.html)     |
| Search query templates                                           |      |         | X   | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-querytemplates.html) |
| Search query literals                                            |      |         | X   | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-literals.html)       |
| Search using date math                                           |      |         | X   | [Docs](https://docs.alfresco.com/6.0/concepts/rm-searchsyntax-datemaths.html)      |

> **Partial** support means the feature supports basic scenarios
> and there are edge cases that are not yet fully tested and might not work.
