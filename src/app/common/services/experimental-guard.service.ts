import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@alfresco/adf-core';
import { environment } from '../../../environments/environment';

@Injectable()
export class ExperimentalGuard implements CanActivate {
    constructor(private config: AppConfigService) {}

    canActivate(route: ActivatedRouteSnapshot) {
        const key = `experimental.${route.data.ifExperimentalKey}`;
        const value = this.config.get(key);

        if (!environment.production) {
            return value === true || value === 'true';
        }

        return false;
    }
}
