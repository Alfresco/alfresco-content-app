---
Title: 登録
nav: ja
---

# 登録

`ExtensionService` を使用して、カスタムコンポーネント、認証ガード、
ルールエバリュエータなどを登録できます。

モジュールコンストラクタ内からカスタムコンテンツを登録することをお勧めします。
その場合、すべてのプラグインはメインアプリケーションコンポーネントの準備ができた直後に利用可能になります。

メインアプリケーションモジュール `app.module.ts` を更新するか、
独自のモジュールを作成し、次のスニペットを使用してカスタムコンテンツを登録します:

```ts
import { ExtensionsModule, ExtensionService } from '@alfresco/adf-extensions';

@NgModule({
    imports: [ ExtensionsModule ],
    declarations: [ MyComponent1, MyLayout ]
})
export class MyExtensionModule {

    constructor(extensions: ExtensionService) {
        extensions.setComponents({
            'plugin1.components.my': MyComponent1,
            'plugin1.layouts.my': MyLayout
        });

        extensions.setAuthGuards({
            'plugin.auth': MyAuthGuard
        });

        extensions.setEvaluators({
            'plugin1.rules.custom1': MyCustom1Evaluator,
            'plugin1.rules.custom2': MyCustom2Evaluator
        });
    }

}
```

Registration API は、カスタムコンテンツのみに限定されません。
モジュールの値を置き換えることにより、既存のエントリを置き換えることができます。
