---
Title: Custom extension loaders
---

# Creating an extension loader

There can be scenarios when there is a need to be able to preload some data, doing some health check or just kick off some services to be sure that a particular extension/plugin is set up properly and ready to function.

## Lifecycle

The extension loader callbacks are invoked when hitting the `root logged-in route` (''), which means they are called (once per application lifetime), when a user wants to access any of the authentication protected routes.

```ts
export const APP_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'APP.SIGN_IN'
    }
  },
  ...// more unauthenticated routes
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuardEcm, ExtensionsDataLoaderGuard],
    children: [
      ...// more authenticated routes
      {
        path: 'trashcan',
        loadChildren: './components/trashcan/trashcan.module#AppTrashcanModule'
      }
    ],
    canActivateChild: [AuthGuardEcm]
  }
];
```

The Alfresco Content App provided `ExtensionsDataLoaderGuard` router guards executes the registered callback in the order they were registered.

## Examples

- Ensuring that a backend service is running and showing the extension provided features only if the service is working correctly.
- Preloading some data after the application is started but before it got rendered in an asynchronous way, which might be needed for an extension to work.

## Registering a loader for an extension

For this each extension can register its own loader, which can be either synchronous or asynchronous. The application is going to be rendered only after every extension loader is either finished or any of them errored.
This registering can be done, using Angular's multi-provider capabilities:

```ts
import { EXTENSION_DATA_LOADERS } from '@alfresco/aca-shared';

@NgModule({
    providers: [
        {
            provide: EXTENSION_DATA_LOADERS,
            multi: true,
            useValue: myExtensionLoader
        }
    ]
})
export class MyExtensionModule {}
```

1. `MyExtensionModule` is the extension's entry module, which needs to be imported by the extensions.module.ts.
2. `EXTENSION_DATA_LOADERS` is an injection token which can be imported from the `aca-shared` package.
3. `myExtensionLoader` is the function which preloads data / sets the necessary services for the extension.

### ExtensionLoaderCallback

The signature of an extension loader callback is the following:

```ts
type ExtensionLoaderCallback = (route: ActivatedRouteSnapshot) => Observable<boolean>;
```

The callback needs to return an Observable of boolean (of success). The boolean value returned, from application loading/rendering perspective doesn't really matter, it is rather representative, it doesn't block the application to be rendered.

Because of the following behaviour mentioned above, each extension's loader might implement its own error handling within itself, to provide a better User eXperience by for example notifying the user with an error snackbar about the problem.

```ts
export const myExtensionLoader = (route: ActivatedRouteSnapshot) => {
        if (!isExtensionEnabled()) {
            // Do nothing, simply let the next extension's loader callback invoked, if any
            // The returned boolean doesn't matter here, doesn't block anything
            return of(true);
        }

        // The returned boolean doesn't matter here, doesn't block anything
        return myExtensionService.checkBackendHealth().pipe(
            tap((status) => {
                if (!status) {
                    // If the BE is down, let the user know what to expect
                    store.dispatch(
                      new SnackbarErrorAction("Backend error. My Extension's features are disabled.")
                    );
                }
            })
        );
    };
```

## Warning

Always handle (catch) the errors in your extension loader! Although an uncaught, errored extension loader can't prevent the application to be rendered, but it can short circuit any of the other extension loaders. (This is coming from the nature of how the forkJoin is implemented in the RxJs library.)
This would essentially mean, that if you have 3 extensions, with registered asynchronous loaders for each, in case of one of them errors, the application doesn't wait the other 2 to be finished, but continues to render. Which can result that the other (2) not errored extension won't behave properly, since the application rendering haven't waited until their loaders were finished.
