import { NgModule, ModuleWithProviders } from '@angular/core';

@NgModule({
    imports: [],
    declarations: [],
    exports: []
})
export class ExtensionsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ExtensionsModule,
            providers: []
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: ExtensionsModule
        };
    }
}
