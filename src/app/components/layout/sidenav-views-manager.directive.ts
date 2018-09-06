import { Directive, ContentChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {
    UserPreferencesService,
    AppConfigService,
    SidenavLayoutComponent
} from '@alfresco/adf-core';
import { filter } from 'rxjs/operators';

@Directive({
    selector: '[acaSidenavManager]',
    exportAs: 'acaSidenavManager'
})
export class SidenavViewsManagerDirective {
    @ContentChild(SidenavLayoutComponent) sidenavLayout: SidenavLayoutComponent;

    minimizeSidenav = false;
    hideSidenav = false;

    private _run = false;
    private minimizeConditions: string[] = ['search'];
    private hideConditions: string[] = ['preview'];

    constructor(
        private router: Router,
        private userPreferenceService: UserPreferencesService,
        private appConfigService: AppConfigService
    ) {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: any) => {
                this.minimizeSidenav = this.minimizeConditions.some(el =>
                    event.urlAfterRedirects.includes(el)
                );
                this.hideSidenav = this.hideConditions.some(el =>
                    event.urlAfterRedirects.includes(el)
                );

                if (this._run) {
                    this.manageSidenavState();
                }
            });
    }

    run(shouldRun) {
        this._run = shouldRun;
    }

    manageSidenavState() {
        if (this.minimizeSidenav && !this.sidenavLayout.isMenuMinimized) {
            this.sidenavLayout.isMenuMinimized = true;
            this.sidenavLayout.container.toggleMenu();
        }

        if (!this.minimizeSidenav) {
            if (this.sidenavState && this.sidenavLayout.isMenuMinimized) {
                this.sidenavLayout.isMenuMinimized = false;
                this.sidenavLayout.container.toggleMenu();
            }
        }
    }

    setState(state) {
        if (
            !this.minimizeSidenav &&
            this.appConfigService.get('sideNav.preserveState')
        ) {
            this.userPreferenceService.set('expandedSidenav', state);
        }
    }

    get sidenavState(): boolean {
        const expand = this.appConfigService.get<boolean>(
            'sideNav.expandedSidenav',
            true
        );
        const preserveState = this.appConfigService.get<boolean>(
            'sideNav.preserveState',
            true
        );

        if (preserveState) {
            return (
                this.userPreferenceService.get(
                    'expandedSidenav',
                    expand.toString()
                ) === 'true'
            );
        }

        return expand;
    }
}
