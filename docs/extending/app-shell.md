---
Title: Shell
---

# Shell

[AppShellModule](../../app/src/app/app-shell/app-shell.module.ts) is designated as a main layout for the application.

I order to attach routes to appShell, `withChildren(childRouters: Routes[])` method should be used.

All passed routes are going to be attached as children to [shell main route](../../app/src/app/app-shell/app-shell.routes.ts)

If you would like to provide custom app guard, you can provide your own using [SHELL_AUTH_TOKEN](../../app/src/app/app-shell/app-shell.routes.ts)

## Shell Service

In order to use `shell`, you need to provide `SHELL_APP_SERVICE` which provides necessary options for shell component to work.