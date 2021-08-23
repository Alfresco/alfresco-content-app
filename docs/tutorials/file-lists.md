---
Title: File Lists
---

## Custom File lists layout

In this tutorial, we are going to implement the following features:

- [Add a column in the Files list using a Node property](#add-a-column-in-the-files-list-using-a-node-property)
- [Replace a column in the Files list](#replace-a-column-in-the-files-list)
- [Add a Column in the Files list using a custom template](#add-a-column-in-the-files-list-using-a-node-property)

## File lists layout

The file list layout of:
- files
- libraries
- favoriteLibraries
- shared
- recent
- favorites
- trashcan
- searchLibraries

are all defined in the `/src/assets/app.extensions.json` of the content-app.
All the possible properties customizable in the column are:

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| id | `string` |  | Unique identifier of the column |
| key | `string` |  | Data source key. Can be either a column/property key like `title`  or a property path like `createdBy.name`. |
| title | `string` | "" | Display title of the column, typically used for column headers. You can use the i18n resource key to get it translated automatically. |
| type | `string` | "text" | Value type for the column. Possible settings are 'text', 'image', 'date', 'fileSize', 'location', and 'json'. |
| class | `string` |  | Additional CSS class to be applied to column (header and cells). |
| sortable | `boolean` | true | Toggles ability to sort by this column, for example by clicking the column header. |
| template | `string` | optional |Custom layout template ID  |
| desktopOnly | `string` |  | Show the column only in bigger viewport  |
| order | `string` |  | Visualization order of the column |


#### Type

- **text** this will show the property as a plain text
- **fileSize** will convert the text into kb/mb/gb as needed.
- **json** Shows a JSON-formatted value
- **date** For the `date` column type, the Angular [DatePipe](https://angular.io/docs/ts/latest/api/common/DatePipe-class.html) formatting is used.
- **Location** this displays a clickable location link pointing to the parent path of the node.

### Add a column in the Files list using a Node property

Update the `your-app.extensions.json` file, and insert a new entry to the `features.documentList` section:

```json
{
  "features": {
    "documentList": {
      "files": [
        {
          "id": "app.files.type",
          "key": "nodeType",
          "title": "APP.DOCUMENT_LIST.COLUMNS.TYPE",
          "type": "text",
          "class": "adf-ellipsis-cell adf-expand-cell-5",
          "sortable": true,
          "desktopOnly": false,
          "order": 102
        }
      ]
    }
  }
}
```

Now, once you run the application, you should see an extra column that contain the code of your custom component

### Replace a column in the Files list

In order to replace a column in the list you need to use the same `id` in your extension file. For example to replace the modifedOn column add the following JSON in `your-app.extensions.json`

```json
{
  "features": {
    "documentList": {
      "files": [
        {
          "id": "app.files.modifiedOn",
          "key": "modifiedByUser.displayName",
          "title": "APP.DOCUMENT_LIST.COLUMNS.MODIFIED_FROM",
          "type": "text",
          "class": "adf-ellipsis-cell",
          "sortable": true,
          "desktopOnly": true,
          "order": 40
        }
      ]
    }
  }
}
```

### Add a Column in the Files list using a custom component template

As first step we can create our custom component in our extension:
```typescript
import { NameColumnComponent } from '@alfresco/adf-content-services';
import { Component, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { AlfrescoApiService } from '@alfresco/adf-core';

@Component({
  selector: 'custom-template-column',
  template: `<div *ngIf="isFile()">
                 This is a custom Template For File
               </div>
                <div *ngIf="!isFile()">
                    This is a custom Template For Folders
                </div>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'adf-datatable-content-cell adf-name-column' },
})
export class CustomTemplateComponent extends NameColumnComponent implements OnInit, OnDestroy {

  constructor(public elementRef: ElementRef, private apiService: AlfrescoApiService) {
    super(elementRef, apiService);
  }

  isFile(){
    return this.node.entry.isFile;
  }

}

```

In order to understand how to register a custom component refer to the [Registration](/extending/registration) documentation
Once your component is registered.
Register your new template component:

```typescript
        extensions.setComponents({
            'app.columns.custom': CustomTemplateComponent,
        });
```

Add your new Column in `your-app.extensions.json` :

```json
{
  "features": {
    "documentList": {
      "files": [
        {
          "id": "app.files.custom",
          "key": "name",
          "title": "APP.DOCUMENT_LIST.COLUMNS.CUSTOM",
          "type": "text",
          "class": "adf-ellipsis-cell adf-expand-cell-5",
          "sortable": true,
          "template": "app.columns.custom",
          "desktopOnly": false
        }
      ]
    }
  }
}
```
