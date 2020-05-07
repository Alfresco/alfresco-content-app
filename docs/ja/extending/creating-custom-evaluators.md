---
Title: カスタムエバリュエータの作成
nav: ja
---

# カスタムエバリュエータの作成

ルールエバリュエータは、`RuleContext` 参照とオプションの `RuleParameter` インスタンスのリストを受け取るプレーンな JavaScript (または TypeScript) 関数です。

アプリケーションは、評価関数に特別な
[RuleEvaluator](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/extensions/src/lib/config/rule.extensions.ts)
タイプエイリアスを提供します:

```ts
export type RuleEvaluator = (context: RuleContext, ...args: any[]) => boolean;
```

ユーザーが 1 つまたは複数のノードを選択したかどうかを確認する関数を作成します。

```ts
export function hasSelection(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  return !context.selection.isEmpty;
}
```

`context` は、[RuleContext](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/extensions/src/lib/config/rule.extensions.ts) 型の特別なインスタンスへの参照であり、
各エバリュエータがランタイムエンティティにアクセスできるようにします。

```ts
export interface RuleContext {
  selection: SelectionState;
  navigation: NavigationState;
  permissions: NodePermissions;

  getEvaluator(key: string): RuleEvaluator;
}
```

`SelectionState` インターフェイスはグローバルな選択状態に関する情報を公開します:

```ts
export interface SelectionState {
  count: number;
  nodes: MinimalNodeEntity[];
  libraries: SiteEntry[];
  isEmpty: boolean;
  first?: MinimalNodeEntity;
  last?: MinimalNodeEntity;
  folder?: MinimalNodeEntity;
  file?: MinimalNodeEntity;
  library?: SiteEntry;
}
```

次に、先ほど作成した関数を `ExtensionService` で登録し、一意の識別子を付けます:

```ts
extensions.setEvaluators({
  'plugin1.rules.hasSelection': hasSelection
});
```

これで、`plugin1.rules.hasSelection` エバリュエータをインラインルールリファレンスとして使用したり、
`core.every` のような複合ルールの一部として使用したりできます。

**Tip:** 実行時に再利用される独自のエントリを登録する方法の詳細については、
[登録](/ja/extending/registration) セクションを参照してください。
