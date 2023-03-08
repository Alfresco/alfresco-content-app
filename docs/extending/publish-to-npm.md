---
Title: Publish to npm
---

## Create a new library

New library can be created using standard `ng` command

e.g. if we would like to create `aca-new-lib` we need to run the following:

```sh
ng generate @schematics/angular:library aca-new-lib
```

## Publish library


### Build library

In order to publish new library, we need to build it first. You need to add build of your library to `build-libs` command in `package.json`

```sh
"build-libs": "ng build aca-shared && ng build aca-new-lib",
```

### Update publish script

If we would like to publish the new library we need to update `scripts/gh/npm-publish.sh`

The only thing that need to be done is to update `PROJECTS` variable by adding your library name i.e.

```sh
PROJECTS=(
    'aca-shared',
    'aca-new-lib'
);
```

## Caveats

- The versions of libraries are updated automatically by the script (should not be done manually)
