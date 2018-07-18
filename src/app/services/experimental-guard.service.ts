import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AppConfigService, StorageService } from '@alfresco/adf-core';
import { environment } from '../../environments/environment';

@Injectable()
export class ExperimentalGuard implements CanActivate {
    constructor(
        private config: AppConfigService,
        private storage: StorageService,
        private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot) {
        const key = `experimental.${route.data.ifExperimentalKey}`;
        const value = this.config.get(key);
        const override = this.storage.getItem(key);

        if (override === 'true') {
            return true;
        }

        if (!environment.production) {
            if (value === true || value === 'true') {
                return true;
            }

            this.router.navigate(['/']);
        }

        this.router.navigate(['/']);

        return false;
    }
}
