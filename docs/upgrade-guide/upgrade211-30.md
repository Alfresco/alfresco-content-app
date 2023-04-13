Upgrade guide ACA V3.0 application compitable with ADF V5.0

---

Title: Upgrading from ACA v2.11 to v3.0

---

# Upgrading from ACA v2.11 to v3.0

This guide explains how to upgrade your ACA v2.11 app to work with ADF v5.0.
Do not skip this task, if you want your application to be updated to a most recent version of ADF(v5.0). Upgrades of multiple versions of ACA cannot be done in one step only, but should follow the chain of sequential updates.
Note: the steps described below might involve making changes to your code. If you are working with a versioning system then you should commit any changes you are currently working on. If you aren't using versioning then be sure to make a backup copy of your project before going ahead with the upgrade.
You can't run ng update to update ANGULAR applications more than one major version at a time.

Library updates:

Upgrade ACA app built with ADF v4.11 to a one supporting ADF v5.0, you need to upgrade ANGULAR version v14. You need to upgrade ANGULAR versions from v10 to v14 step by step (single major version at a time). In terms to support ADF v5.0 you have to follow the below commands.


**Upgrade to v11:**

To update ANGULAR version from 10.0 to 11.0 by running the below update commands

    • ng update @angular/core@11 @angular/cli@11 –force
    
    • npm i
      
      
Below are the some updates when you upgrade to v11.0

    • ANGULAR now requires TypeScript 4.0. ng update will migrate you automatically.
    
    • Support for IE9, IE10, and IE mobile has been removed.



**Upgrade to v12:**

To update ANGULAR version from 11.0 to 12.0 by running the below update commands

    • ng update @angular/core@12 @angular/cli@12 –force
    
    • npm i
    
Below are the some updates when you upgrade to v12.0

    • ANGULAR now requires TypeScript 4.2. ng update will update you automatically.
    
    • IE11 support has been deprecated.
    
    • You can no longer use ANGULAR with Node.js version 10 or older.
    
    • Update zone.js to version 0.11.4. ng update will update this dependency automatically.
    
    • Remove 'emitDecoratorMetadata' TypeScript compiler option.
    
    • Remove deprecated ViewEngine-based i18n build and extract options.
    
    • Updates Web Worker consumer usage to use the new syntax supported directly by Webpack 5.
    
    • `XhrFactory` has been moved from `@angular/common/http` to `@angular/common`.



**Upgrade to v13:**

To update ANGULAR version from 12.0 to 13.0 by running the below update commands

    • ng update @angular/core@13 @angular/cli@13 –force
    
    • npm i
    
Below are the some updates when you upgrade to v13.0

    • ANGULAR now uses TypeScript 4.4.
    
    • Make sure you are using Node 12.20.0 or later
    
    • Use [routerLink]="" in templates to [routerLink]="[]" because these links are likely intended to route to the current page with updated fragment/query params.
    
    • As of ANGULAR version 13, `entryComponents` are no longer necessary.
    
    • Remove polyfills required only for Internet Explorer which is no longer supported.
    
    • Remove no longer valid ANGULAR schematic options from `angular.json`.



**Upgrade to v14:**

To update ANGULAR version from 13.0 to 14.0 by running the below update commands

    • ng update @angular/core@14 @angular/cli@14 –force
    
    • npm i
    
Below are the some updates when you upgrade to v14.0

    • ANGULAR now uses TypeScript 4.6
    
    • Make sure you are using Node 14.15.0 or later
    
    • Update ANGULAR packages 'dependencies' and 'devDependencies' version prefix to '^' instead of '~'.
    
    • Remove 'package.json' files from library projects secondary entrypoints.
    
    • Update TypeScript compilation target to 'ES2020'.


Make sure you have install dev dependency for the below dependecies

inquirer, winston

npm install --save-dev inquirer@^8.0.0

npm install --save-dev winston@^3.8.2


BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.

This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:

	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
    
	- install 'path-browserify'
    
If you don't want to include a polyfill, you can use an empty module like this:

	resolve.fallback: { "path": false }



**Need to update:**

@ngrx/router-store    			  ^14.0.0

@mat-datetimepicker/core		  ^9.0.68

@mat-datetimepicker/moment		^9.0.68
