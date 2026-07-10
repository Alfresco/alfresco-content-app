---
Title: Application features
Github only: true
---

# Application features

The concept of this application is a simple user interface which makes accessing files in the Alfresco Content Services repository easy.

Often Content Management systems provide more capabilities out of the box than most users need;
providing too many capabilities to these users prevents them from working efficiently,
so they may end up using unsanctioned file management solutions which presents a proliferation of content storage
and collaboration solutions as well as compliance issues for organizations.

This application simplifies the complexity of Content Management and provides comprehensive extensibility features for developers, using the Alfresco Application Development Framework, to easily and quickly create custom solutions for specific user cases.

## Contents

- [User interface layout](/features/user-interface-layout)
- [Header](/features/header)
- [Side navigation](/features/side-navigation)
- [Document List Layout](/features/document-list-layout)
- [File Viewer](/features/file-viewer)
- [Info Drawer](/features/info-drawer)
- [Version Manager](/features/version-manager)
- [Search results](/features/search-results)
- [Search forms](/features/search-forms)
- [Application Hook](/extending/application-hook)
- [Context Menu actions](context-menu-actions)

## Notes

### Knowledge Discovery removal (v8.0.0)

The Knowledge Discovery components, services, and APIs have been removed as of ACA version 8.0.0 and ADF version 9.0.0.
The integrated Knowledge Discovery features have been replaced with a section in the side navigation panel containing a link to the standalone Knowledge Discovery UI in ACA and ADW.

If you were using those features, please consider cleaning Local Storage in your browser as *aiReferences* entry may remain.
