## Application Actions

Application is using NgRx (Reactive libraries for Angular, inspired by Redux).
To get more information on NxRx please refer to the following resources:

- [Comprehensive Introduction to @ngrx/store](https://gist.github.com/btroncone/a6e4347326749f938510)

Most of the application features are already exposed in the form of NgRx Actions and corresponding Effects.
You can invoke any action via a single `Store` dispatcher, similar to the following:

```typescript
export class MyComponent {
  constructor(private store: Store<AppStore>) {}

  onClick() {
    this.store.dispatch(new SearchByTermAction('*'));
  }
}
```

The code above demonstrates a simple 'click' handler that invokes `Search by Term` feature
and automatically redirects user to the **Search Results** page.

Another example demonstrates viewing a node from a custom application service API:

```typescript
export class MyService {
  constructor(private store: Store<AppStore>) {}

  viewFile(node: MinimalNodeEntity) {
    this.store.dispatch(new ViewFileAction(node));
  }
}
```