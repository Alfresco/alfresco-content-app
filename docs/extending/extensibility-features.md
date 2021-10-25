---
Title: Extensibility features
---

# Extensibility features

Application extensibility is performed via the root `/src/assets/app.extensions.json`,
and any number of external plugins that are references of the main entry point.

The application also comes with the `/src/assets/plugins/` folder
already preconfigured to store external files.

You can create plugins that change, toggle, or extend the following areas:

- Navigation sidebar links and groups
- Context Menu
- Sidebar (aka Info Drawer)
- Toolbar entries
  - buttons
  - menu buttons
  - separators
- File viewer  
- Viewer actions
  - "Open With" entries
  - toolbar entries
    - buttons
    - "More actions" buttons
- Content metadata presets (used on `Properties` tab)
- Search
- Custom icons
- File list column layout
  - files
  - libraries
  - favoriteLibraries
  - shared
  - recent
  - favorites
  - trashcan
  - searchLibraries

Extensions can also:

- Overwrite or disable extension points of the main application or other plugins
- Change rules, actions or any visual element
- Register new application routes based on empty pages or layouts
- Register new rule evaluators, components, guards
