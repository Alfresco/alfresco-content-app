---

Title: Upgrading from ACA v2.11 to v3.0

---

# Upgrading from ACA v2.11 to v3.0

This guide explains how to upgrade your ACA v2.11 app to work with ADF v5.0.
Do not skip this task, if you want your application to be updated to the most recent version of ADF(v5.0). Upgrades of multiple versions of ACA cannot be done in one step only but should follow the chain of sequential updates.

**Note:** The steps described below might involve making changes to your code. If you are working with a versioning system then you should commit any changes you are currently working on. If you aren't using versioning then be sure to make a backup copy of your project before going ahead with the upgrade. You can't run ng update to update Angular applications more than one major version at a time.

Library updates:

Upgrade the ACA app built with ADF v4.11 to one supporting ADF v5.0, you need to upgrade to Angular version v14. You need to upgrade Angular versions from v10 to v14 step by step (single major version at a time). In terms to support ADF v5.0, you have to follow the below commands. There are no such ADF-specific changes required to be compatible with ADF v5.0 (No breaking changes in ADF v5.0)


This is a major release of the Alfresco Content Application containing upgrade to Angular 14.
For a complete list of changes, supported browsers and new feature please refer to the official documentation

| Angular version | link |
| --- | --- |
| v11 | [Changes & Deprecations](https://v11.angular.io/guide/updating-to-version-11)|
| v12 | [Changes & Deprecations](https://v12.angular.io/guide/updating-to-version-12)|
| v13 | [Changes & Deprecations](https://v13.angular.io/guide/update-to-latest-version)|
| v14 | [Changes & Deprecations](https://angular.io/guide/update-to-latest-version) |

Make sure you have installed dev dependency for the below dependencies

```sh
npm install --save-dev inquirer@^8.0.0
npm install --save-dev winston@^3.8.2
```

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.

This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:

	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
    
	- install 'path-browserify'
    
If you don't want to include a polyfill, you can use an empty module like this:
```sh
resolve.fallback: { "path": false }
```


**Need to update:**

| Dependencies | Version | 
| --- | --- | 
| @ngrx/router-store | ^14.0.0 |
| @mat-datetimepicker/core | ^9.0.68 |
| @mat-datetimepicker/moment | ^9.0.68 |
| @angular/flex-layout | ^14.0.0-beta.40 |
| @angular/cdk | 14.2.7 |
| @ngx-translate/core | ^14.0.02 |
| @angular-eslint/builder | ^14.0.3 |
| @angular-eslint/eslint-plugin | ^14.0.3 |
| @angular-eslint/eslint-plugin-template | ^14.0.3 |
| @angular/schematics | 14.0.3 |
| @angular-eslint/template-parser | ^14.0.3 |
| moment | 2.29.4 |
| rxjs | 6.6.6 |
| zone.js | 0.11.7 |
