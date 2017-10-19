import { NgModule } from '@angular/core';

// ADF modules
import { CoreModule } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { ViewerModule } from 'ng2-alfresco-viewer';
import { DocumentListModule } from 'ng2-alfresco-documentlist';
import { LoginModule } from 'ng2-alfresco-login';
import { UploadModule } from 'ng2-alfresco-upload';
import { SearchModule } from 'ng2-alfresco-search';

export function modules() {
    return [
        CoreModule,
        DataTableModule,
        DocumentListModule,
        LoginModule,
        SearchModule,
        UploadModule,
        ViewerModule
    ];
}

@NgModule({
    imports: modules(),
    exports: modules()
})
export class AdfModule { }
