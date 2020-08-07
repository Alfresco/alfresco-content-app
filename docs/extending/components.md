---
Title: Components
---

# Components

You can register any Angular component to participate in extensibility.

The components are used to create custom:

- routes and pages
- toolbar buttons
- menu items

| Key                               | Type                           | Description                                                                                                     |
| --------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| app.layout.main                   | LayoutComponent                | Main application layout with the menu bar, navigation sidebar and main content area to project your components. |
| app.toolbar.toggleInfoDrawer      | ToggleInfoDrawerComponent      | The toolbar button component that toggles Info Drawer for the selection.                                        |
| app.toolbar.toggleFavorite        | ToggleFavoriteComponent        | The toolbar button component that toggles Favorite state for the selection.                                     |
| app.toolbar.toggleFavoriteLibrary | ToggleFavoriteLibraryComponent | The toolbar button component that toggles Favorite library state for the selection.                             |
| app.toolbar.toggleJoinLibrary     | ToggleJoinLibraryComponent     | The toolbar button component that toggles Join/Cancel Join request for the selected library                     |
| app.toolbar.viewNode              | ViewNodeComponent              | Action component to view files                                                                                  |
| app.components.preview              | PreviewComponent              | Preview feature which can be used by plugins. For more info see the [tutorials](/extending/tutorials) about the Preview.  |

See [Registration](/extending/registration) section for more details
on how to register your own entries to be re-used at runtime.

Note that custom extensions can also replace any existing component at runtime by a known identifier,
besides registering a new one.
