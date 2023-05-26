---

Title: Upgrading from ACA v2.11 to v3.0

---

# Upgrading from ACA v2.11 to v3.0

This guide explains how to upgrade your ACA v2.11 app to work with ADF v5.0.
Do not skip this task, if you want your application to be updated to the most recent version of ADF(v5.0). Upgrades of multiple versions of ACA cannot be done in one step only but should follow the chain of sequential updates.

**Note:** The steps described below might involve making changes to your code. If you are working with a versioning system then you should commit any changes you are currently working on. If you aren't using versioning then be sure to make a backup copy of your project before going ahead with the upgrade. You can't run ng update to update Angular applications more than one major version at a time.

Library updates:

Upgrade the ACA app built with ADF v4.11 to one supporting ADF v5.0. In terms to support ADF v5.0, you have to follow the below steps.

1. Check the ADF dependencies in the application (package.json). Update the ADF dependencies to v5.0.0 manually.

Before Replace:
```json
"dependencies": {
  "@alfresco/adf-content-services": "4.11.0",
  "@alfresco/adf-core": "4.11.0",
  "@alfresco/adf-extensions": "4.11.0",
}
"devDependencies": {
  "@alfresco/adf-cli": "4.11.0",
  "@alfresco/adf-testing": "4.11.0",
  "@alfresco/js-api": "4.11.0"
}
```

After Replace:
```json
"dependencies": {
  "@alfresco/adf-content-services": "5.0.0",
  "@alfresco/adf-core": "5.0.0",
  "@alfresco/adf-extensions": "5.0.0",
}
"devDependencies": {
  "@alfresco/adf-cli": "5.0.0",
  "@alfresco/adf-testing": "5.0.0",
  "@alfresco/js-api": "5.0.0"
}
```
2. Install your dependencies
```sh
npm i
```

3. Run the application
```sh
npm start
```

**Note:** The compiler gives errors and complains about adf libraries with ‘has no exported member’ errors. You can find many errors with different adf libraries. 


4. To fix this adf library error, you need to upgrade Angular versions from v10 to v14 step by step (a single major version at a time).

For a complete list of changes, supported browsers, and new features please refer to the official documentation

| Angular version | link |
| --- | --- |
| v11 | [Changes & Deprecations](https://v11.angular.io/guide/updating-to-version-11)|
| v12 | [Changes & Deprecations](https://v12.angular.io/guide/updating-to-version-12)|
| v13 | [Changes & Deprecations](https://v13.angular.io/guide/update-to-latest-version)|
| v14 | [Changes & Deprecations](https://angular.io/guide/update-to-latest-version) |


5. After upgrading to Angular v14 install your dependencies & start the application. The compiler gives errors & there are certain breaking changes.
You will find the below errors along with solutions.

Error 1:
```
./app/src/styles.scss - Error: Module build failed (from ./node_modules/postcss-loader/dist/cjs.js):
Error: Failed to find '@alfresco/adf-core/prebuilt-themes/adf-blue-orange.css' in [/home/raviraj.bahirsheth/project/alfresco-content-app-2.11.0-new/app/src]
```
To resolve this error you have to make a change in your ./app/src/styles.scss

Update from this

```sh
@import '~@alfresco/adf-core/prebuilt-themes/adf-blue-orange.css';
```

To this
```sh
@import '~@alfresco/adf-core/lib/prebuilt-themes/adf-blue-orange.css';
```

Error 2:
```
'"@mat-datetimepicker/core"' has no exported member named 'MatDatetimepickerComponent'. Did you mean 'MatDatetimepickerContent'?
```

You need to update the datetimepicker dependencies.

```sh
npm install --save @mat-datetimepicker/core@9
npm install --save @mat-datetimepicker/moment@9
```

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


**Need to update dependencies:**

| Dependencies | Version | 
| --- | --- | 
| @ngrx/router-store | ^14.0.0 |
| @mat-datetimepicker/core | ^9.0.68 |
| @mat-datetimepicker/moment | ^9.0.68 |
| @angular/flex-layout | ^14.0.0-beta.40 |
| @angular/cdk | 14.2.7 |
| @angular/material | ^14.1.2 |
| @angular/material-moment-adapter | ^14.1.2 |
| @ngx-translate/core | ^14.0.02 |
| @angular-eslint/builder | ^14.0.3 |
| @angular-eslint/eslint-plugin | ^14.0.3 |
| @angular-eslint/eslint-plugin-template | ^14.0.3 |
| @angular/schematics | 14.0.3 |
| @angular-eslint/template-parser | ^14.0.3 |
| moment | 2.29.4 |
| rxjs | 6.6.6 |
| zone.js | 0.11.7 |
