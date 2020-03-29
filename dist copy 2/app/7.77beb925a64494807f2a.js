(window.webpackJsonp = window.webpackJsonp || []).push([
  [7],
  {
    '0Jpz': function(l, n, e) {
      'use strict';
      e.r(n);
      var a = e('CcnG'),
        t = e('gIcY'),
        u = e('26FU'),
        b = e('30XK'),
        i = (function() {
          function l(l, n, e, a) {
            (this.store = l),
              (this.appConfig = n),
              (this.storage = e),
              (this.fb = a),
              (this.defaultPath = '/assets/images/alfresco-logo-white.svg'),
              (this.profile$ = l.select(b.bb)),
              (this.appName$ = l.select(b.Q)),
              (this.languagePicker$ = l.select(b.V)),
              (this.headerColor$ = l.select(b.U));
          }
          return (
            Object.defineProperty(l.prototype, 'logo', {
              get: function() {
                return this.appConfig.get('application.logo', this.defaultPath);
              },
              enumerable: !0,
              configurable: !0
            }),
            (l.prototype.ngOnInit = function() {
              (this.aiExtensions$ = new u.a(
                'true' === this.storage.getItem('ai')
              )),
                (this.psExtensions$ = new u.a(
                  'true' === this.storage.getItem('processServices')
                )),
                (this.form = this.fb.group({
                  ecmHost: [
                    '',
                    [t.w.required, t.w.pattern('^(http|https)://.*[^/]$')]
                  ],
                  aisHost: [
                    '',
                    [t.w.required, t.w.pattern('^(http|https)://.*[^/]$')]
                  ],
                  authType: ['']
                })),
                this.reset();
            }),
            (l.prototype.apply = function(l, n) {
              if (n) {
                this.storage.setItem('ecmHost', l.ecmHost),
                  this.storage.setItem('authType', l.authType);
                var e = this.appConfig.get('oauth2', null);
                (e.host = l.aisHost),
                  this.storage.setItem('oauth2', JSON.stringify(e));
              }
            }),
            (l.prototype.reset = function() {
              var l = this.appConfig.get('oauth2', null);
              this.form.reset({
                ecmHost:
                  this.storage.getItem('ecmHost') ||
                  this.appConfig.get('ecmHost'),
                aisHost: l.host,
                authType: this.appConfig.get('authType')
              });
            }),
            (l.prototype.onLanguagePickerValueChanged = function(l) {
              this.storage.setItem('languagePicker', l.checked.toString()),
                this.store.dispatch(new b.x(l.checked));
            }),
            (l.prototype.onToggleAiExtensions = function(l) {
              this.storage.setItem('ai', l.checked.toString());
            }),
            (l.prototype.onTogglePsExtensions = function(l) {
              this.storage.setItem('processServices', l.checked.toString()),
                this.store.dispatch(new b.J(l.checked));
            }),
            l
          );
        })(),
        o = { title: 'Settings' },
        d = (function() {
          return function() {};
        })(),
        r = e('t68o'),
        c = e('zbXB'),
        s = e('xYTU'),
        p = e('NcP4'),
        m = e('X8zA'),
        S = e('pMnS'),
        h = e('r+ED'),
        g = e('seP3'),
        f = e('A7o+'),
        Q = e('ph/j'),
        _ = e('Ip0R'),
        v = e('ZYCi'),
        y = e('jlZm'),
        x = e('AyJq'),
        F = e('YlbQ'),
        C = e('wFw1'),
        k = e('lLAP'),
        w = e('dJrM'),
        I = e('Wf4p'),
        P = e('Fzqc'),
        G = e('dWZg'),
        T = e('b716'),
        A = e('/VYK'),
        E = e('Azqq'),
        H = e('uGex'),
        N = e('qAlS'),
        j = e('MlvX'),
        L = e('bujt'),
        q = e('UodH'),
        X = e('Z5h4'),
        U = e('de3e'),
        M = e('yGQT'),
        V = a.Eb({ encapsulation: 2, styles: [], data: {} });
      function D(l) {
        return a.gc(
          0,
          [
            (l()(),
            a.Gb(
              0,
              0,
              null,
              null,
              3,
              'mat-error',
              [['class', 'mat-error'], ['role', 'alert']],
              [[1, 'id', 0]],
              null,
              null,
              null,
              null
            )),
            a.Fb(1, 16384, [[6, 4]], 0, g.b, [], null, null),
            (l()(), a.ec(2, null, [' ', ' '])),
            a.Xb(131072, f.j, [f.k, a.h])
          ],
          null,
          function(l, n) {
            l(n, 0, 0, a.Sb(n, 1).id),
              l(
                n,
                2,
                0,
                a.fc(
                  n,
                  2,
                  0,
                  a.Sb(n, 3).transform('APP.SETTINGS.INVALID-VALUE-FORMAT')
                )
              );
          }
        );
      }
      function O(l) {
        return a.gc(
          0,
          [
            (l()(),
            a.Gb(
              0,
              0,
              null,
              null,
              3,
              'mat-error',
              [['class', 'mat-error'], ['role', 'alert']],
              [[1, 'id', 0]],
              null,
              null,
              null,
              null
            )),
            a.Fb(1, 16384, [[6, 4]], 0, g.b, [], null, null),
            (l()(), a.ec(2, null, [' ', ' '])),
            a.Xb(131072, f.j, [f.k, a.h])
          ],
          null,
          function(l, n) {
            l(n, 0, 0, a.Sb(n, 1).id),
              l(
                n,
                2,
                0,
                a.fc(
                  n,
                  2,
                  0,
                  a.Sb(n, 3).transform('APP.SETTINGS.REQUIRED-FIELD')
                )
              );
          }
        );
      }
      function R(l) {
        return a.gc(
          0,
          [
            (l()(),
            a.Gb(
              0,
              0,
              null,
              null,
              10,
              'adf-toolbar',
              [['class', 'app-menu adf-toolbar']],
              [[4, 'background-color', null]],
              null,
              null,
              h.Fb,
              h.Z
            )),
            a.Fb(1, 49152, null, 0, Q.Hd, [], null, null),
            a.Xb(131072, _.b, [a.h]),
            (l()(),
            a.Gb(
              3,
              0,
              null,
              0,
              7,
              'adf-toolbar-title',
              [['class', 'adf-toolbar-title']],
              null,
              null,
              null,
              h.Hb,
              h.bb
            )),
            a.Fb(4, 49152, null, 0, Q.Kd, [], null, null),
            (l()(),
            a.Gb(
              5,
              0,
              null,
              0,
              5,
              'a',
              [['class', 'app-menu__title']],
              [[8, 'title', 0], [1, 'target', 0], [8, 'href', 4]],
              [[null, 'click']],
              function(l, n, e) {
                var t = !0;
                return (
                  'click' === n &&
                    (t =
                      !1 !==
                        a
                          .Sb(l, 6)
                          .onClick(
                            e.button,
                            e.ctrlKey,
                            e.metaKey,
                            e.shiftKey
                          ) && t),
                  t
                );
              },
              null,
              null
            )),
            a.Fb(
              6,
              671744,
              null,
              0,
              v.t,
              [v.q, v.a, _.k],
              { routerLink: [0, 'routerLink'] },
              null
            ),
            a.Vb(7, 1),
            a.Xb(131072, _.b, [a.h]),
            (l()(),
            a.Gb(
              9,
              0,
              null,
              null,
              1,
              'img',
              [],
              [[8, 'src', 4], [8, 'alt', 0]],
              null,
              null,
              null,
              null
            )),
            a.Xb(131072, _.b, [a.h]),
            (l()(),
            a.Gb(
              11,
              0,
              null,
              null,
              152,
              'mat-accordion',
              [
                ['class', 'mat-accordion'],
                ['displayMode', 'flat'],
                ['multi', 'true']
              ],
              null,
              null,
              null,
              null,
              null
            )),
            a.Fb(
              12,
              1720320,
              null,
              1,
              y.c,
              [],
              { multi: [0, 'multi'], displayMode: [1, 'displayMode'] },
              null
            ),
            a.bc(603979776, 1, { _headers: 1 }),
            a.ac(2048, null, y.a, null, [y.c]),
            (l()(),
            a.Gb(
              15,
              16777216,
              null,
              null,
              100,
              'mat-expansion-panel',
              [['class', 'mat-expansion-panel']],
              [
                [2, 'mat-expanded', null],
                [2, '_mat-animation-noopable', null],
                [2, 'mat-expansion-panel-spacing', null]
              ],
              null,
              null,
              x.d,
              x.a
            )),
            a.Fb(
              16,
              1753088,
              null,
              1,
              y.e,
              [[3, y.a], a.h, F.d, a.W, _.d, [2, C.a], [2, y.b]],
              null,
              null
            ),
            a.bc(335544320, 2, { _lazyContent: 0 }),
            a.ac(256, null, y.a, void 0, []),
            (l()(),
            a.Gb(
              19,
              0,
              null,
              0,
              7,
              'mat-expansion-panel-header',
              [['class', 'mat-expansion-panel-header'], ['role', 'button']],
              [
                [1, 'id', 0],
                [1, 'tabindex', 0],
                [1, 'aria-controls', 0],
                [1, 'aria-expanded', 0],
                [1, 'aria-disabled', 0],
                [2, 'mat-expanded', null],
                [40, '@expansionHeight', 0]
              ],
              [[null, 'click'], [null, 'keydown']],
              function(l, n, e) {
                var t = !0;
                return (
                  'click' === n && (t = !1 !== a.Sb(l, 20)._toggle() && t),
                  'keydown' === n && (t = !1 !== a.Sb(l, 20)._keydown(e) && t),
                  t
                );
              },
              x.c,
              x.b
            )),
            a.Fb(
              20,
              180224,
              [[1, 4]],
              0,
              y.f,
              [y.e, a.m, k.h, a.h, [2, y.b]],
              null,
              null
            ),
            a.Yb(21, { collapsedHeight: 0, expandedHeight: 1 }),
            a.Yb(22, { value: 0, params: 1 }),
            (l()(),
            a.Gb(
              23,
              0,
              null,
              0,
              3,
              'mat-panel-title',
              [['class', 'mat-expansion-panel-header-title']],
              null,
              null,
              null,
              null,
              null
            )),
            a.Fb(24, 16384, null, 0, y.g, [], null, null),
            (l()(), a.ec(25, null, ['', ''])),
            a.Xb(131072, f.j, [f.k, a.h]),
            (l()(),
            a.Gb(
              27,
              0,
              null,
              1,
              88,
              'form',
              [['novalidate', '']],
              [
                [2, 'ng-untouched', null],
                [2, 'ng-touched', null],
                [2, 'ng-pristine', null],
                [2, 'ng-dirty', null],
                [2, 'ng-valid', null],
                [2, 'ng-invalid', null],
                [2, 'ng-pending', null]
              ],
              [[null, 'ngSubmit'], [null, 'submit'], [null, 'reset']],
              function(l, n, e) {
                var t = !0,
                  u = l.component;
                return (
                  'submit' === n && (t = !1 !== a.Sb(l, 29).onSubmit(e) && t),
                  'reset' === n && (t = !1 !== a.Sb(l, 29).onReset() && t),
                  'ngSubmit' === n &&
                    (t = !1 !== u.apply(u.form.value, u.form.valid) && t),
                  t
                );
              },
              null,
              null
            )),
            a.Fb(28, 16384, null, 0, t.y, [], null, null),
            a.Fb(
              29,
              540672,
              null,
              0,
              t.j,
              [[8, null], [8, null]],
              { form: [0, 'form'] },
              { ngSubmit: 'ngSubmit' }
            ),
            a.ac(2048, null, t.c, null, [t.j]),
            a.Fb(31, 16384, null, 0, t.q, [[4, t.c]], null, null),
            (l()(),
            a.Gb(
              32,
              0,
              null,
              null,
              24,
              'div',
              [],
              null,
              null,
              null,
              null,
              null
            )),
            (l()(),
            a.Gb(
              33,
              0,
              null,
              null,
              23,
              'mat-form-field',
              [
                ['appearance', 'outline'],
                ['class', 'settings-input mat-form-field']
              ],
              [
                [2, 'mat-form-field-appearance-standard', null],
                [2, 'mat-form-field-appearance-fill', null],
                [2, 'mat-form-field-appearance-outline', null],
                [2, 'mat-form-field-appearance-legacy', null],
                [2, 'mat-form-field-invalid', null],
                [2, 'mat-form-field-can-float', null],
                [2, 'mat-form-field-should-float', null],
                [2, 'mat-form-field-has-label', null],
                [2, 'mat-form-field-hide-placeholder', null],
                [2, 'mat-form-field-disabled', null],
                [2, 'mat-form-field-autofilled', null],
                [2, 'mat-focused', null],
                [2, 'mat-accent', null],
                [2, 'mat-warn', null],
                [2, 'ng-untouched', null],
                [2, 'ng-touched', null],
                [2, 'ng-pristine', null],
                [2, 'ng-dirty', null],
                [2, 'ng-valid', null],
                [2, 'ng-invalid', null],
                [2, 'ng-pending', null],
                [2, '_mat-animation-noopable', null]
              ],
              null,
              null,
              w.b,
              w.a
            )),
            a.Fb(
              34,
              7520256,
              null,
              7,
              g.c,
              [a.m, a.h, [2, I.h], [2, P.c], [2, g.a], G.a, a.F, [2, C.a]],
              { appearance: [0, 'appearance'] },
              null
            ),
            a.bc(335544320, 3, { _control: 0 }),
            a.bc(335544320, 4, { _placeholderChild: 0 }),
            a.bc(335544320, 5, { _labelChild: 0 }),
            a.bc(603979776, 6, { _errorChildren: 1 }),
            a.bc(603979776, 7, { _hintChildren: 1 }),
            a.bc(603979776, 8, { _prefixChildren: 1 }),
            a.bc(603979776, 9, { _suffixChildren: 1 }),
            (l()(),
            a.Gb(
              42,
              0,
              null,
              3,
              2,
              'mat-label',
              [],
              null,
              null,
              null,
              null,
              null
            )),
            a.Fb(43, 16384, [[5, 4]], 0, g.g, [], null, null),
            (l()(), a.ec(-1, null, ['ACS Repository URL'])),
            (l()(),
            a.Gb(
              45,
              0,
              null,
              1,
              7,
              'input',
              [
                ['class', 'mat-input-element mat-form-field-autofill-control'],
                ['formControlName', 'ecmHost'],
                ['matInput', ''],
                ['type', 'text']
              ],
              [
                [2, 'ng-untouched', null],
                [2, 'ng-touched', null],
                [2, 'ng-pristine', null],
                [2, 'ng-dirty', null],
                [2, 'ng-valid', null],
                [2, 'ng-invalid', null],
                [2, 'ng-pending', null],
                [2, 'mat-input-server', null],
                [1, 'id', 0],
                [1, 'placeholder', 0],
                [8, 'disabled', 0],
                [8, 'required', 0],
                [1, 'readonly', 0],
                [1, 'aria-describedby', 0],
                [1, 'aria-invalid', 0],
                [1, 'aria-required', 0]
              ],
              [
                [null, 'input'],
                [null, 'blur'],
                [null, 'compositionstart'],
                [null, 'compositionend'],
                [null, 'focus']
              ],
              function(l, n, e) {
                var t = !0;
                return (
                  'input' === n &&
                    (t = !1 !== a.Sb(l, 46)._handleInput(e.target.value) && t),
                  'blur' === n && (t = !1 !== a.Sb(l, 46).onTouched() && t),
                  'compositionstart' === n &&
                    (t = !1 !== a.Sb(l, 46)._compositionStart() && t),
                  'compositionend' === n &&
                    (t =
                      !1 !== a.Sb(l, 46)._compositionEnd(e.target.value) && t),
                  'blur' === n &&
                    (t = !1 !== a.Sb(l, 51)._focusChanged(!1) && t),
                  'focus' === n &&
                    (t = !1 !== a.Sb(l, 51)._focusChanged(!0) && t),
                  'input' === n && (t = !1 !== a.Sb(l, 51)._onInput() && t),
                  t
                );
              },
              null,
              null
            )),
            a.Fb(46, 16384, null, 0, t.d, [a.L, a.m, [2, t.a]], null, null),
            a.ac(
              1024,
              null,
              t.n,
              function(l) {
                return [l];
              },
              [t.d]
            ),
            a.Fb(
              48,
              671744,
              null,
              0,
              t.h,
              [[3, t.c], [8, null], [8, null], [6, t.n], [2, t.A]],
              { name: [0, 'name'] },
              null
            ),
            a.ac(2048, null, t.o, null, [t.h]),
            a.Fb(50, 16384, null, 0, t.p, [[4, t.o]], null, null),
            a.Fb(
              51,
              999424,
              null,
              0,
              T.b,
              [
                a.m,
                G.a,
                [6, t.o],
                [2, t.r],
                [2, t.j],
                I.b,
                [8, null],
                A.a,
                a.F
              ],
              { type: [0, 'type'] },
              null
            ),
            a.ac(2048, [[3, 4]], g.d, null, [T.b]),
            (l()(), a.sb(16777216, null, 5, 1, null, D)),
            a.Fb(
              54,
              16384,
              null,
              0,
              _.n,
              [a.W, a.T],
              { ngIf: [0, 'ngIf'] },
              null
            ),
            (l()(), a.sb(16777216, null, 5, 1, null, O)),
            a.Fb(
              56,
              16384,
              null,
              0,
              _.n,
              [a.W, a.T],
              { ngIf: [0, 'ngIf'] },
              null
            ),
            (l()(),
            a.Gb(
              57,
              0,
              null,
              null,
              28,
              'div',
              [],
              null,
              null,
              null,
              null,
              null
            )),
            (l()(),
            a.Gb(
              58,
              0,
              null,
              null,
              27,
              'mat-form-field',
              [
                ['appearance', 'outline'],
                ['class', 'settings-input mat-form-field']
              ],
              [
                [2, 'mat-form-field-appearance-standard', null],
                [2, 'mat-form-field-appearance-fill', null],
                [2, 'mat-form-field-appearance-outline', null],
                [2, 'mat-form-field-appearance-legacy', null],
                [2, 'mat-form-field-invalid', null],
                [2, 'mat-form-field-can-float', null],
                [2, 'mat-form-field-should-float', null],
                [2, 'mat-form-field-has-label', null],
                [2, 'mat-form-field-hide-placeholder', null],
                [2, 'mat-form-field-disabled', null],
                [2, 'mat-form-field-autofilled', null],
                [2, 'mat-focused', null],
                [2, 'mat-accent', null],
                [2, 'mat-warn', null],
                [2, 'ng-untouched', null],
                [2, 'ng-touched', null],
                [2, 'ng-pristine', null],
                [2, 'ng-dirty', null],
                [2, 'ng-valid', null],
                [2, 'ng-invalid', null],
                [2, 'ng-pending', null],
                [2, '_mat-animation-noopable', null]
              ],
              null,
              null,
              w.b,
              w.a
            )),
            a.Fb(
              59,
              7520256,
              null,
              7,
              g.c,
              [a.m, a.h, [2, I.h], [2, P.c], [2, g.a], G.a, a.F, [2, C.a]],
              { appearance: [0, 'appearance'] },
              null
            ),
            a.bc(335544320, 10, { _control: 0 }),
            a.bc(335544320, 11, { _placeholderChild: 0 }),
            a.bc(335544320, 12, { _labelChild: 0 }),
            a.bc(603979776, 13, { _errorChildren: 1 }),
            a.bc(603979776, 14, { _hintChildren: 1 }),
            a.bc(603979776, 15, { _prefixChildren: 1 }),
            a.bc(603979776, 16, { _suffixChildren: 1 }),
            (l()(),
            a.Gb(
              67,
              0,
              null,
              3,
              2,
              'mat-label',
              [],
              null,
              null,
              null,
              null,
              null
            )),
            a.Fb(68, 16384, [[12, 4]], 0, g.g, [], null, null),
            (l()(), a.ec(-1, null, ['Authentication Type'])),
            (l()(),
            a.Gb(
              70,
              0,
              null,
              1,
              15,
              'mat-select',
              [
                ['class', 'mat-select'],
                ['formControlName', 'authType'],
                ['role', 'listbox']
              ],
              [
                [2, 'ng-untouched', null],
                [2, 'ng-touched', null],
                [2, 'ng-pristine', null],
                [2, 'ng-dirty', null],
                [2, 'ng-valid', null],
                [2, 'ng-invalid', null],
                [2, 'ng-pending', null],
                [1, 'id', 0],
                [1, 'tabindex', 0],
                [1, 'aria-label', 0],
                [1, 'aria-labelledby', 0],
                [1, 'aria-required', 0],
                [1, 'aria-disabled', 0],
                [1, 'aria-invalid', 0],
                [1, 'aria-owns', 0],
                [1, 'aria-multiselectable', 0],
                [1, 'aria-describedby', 0],
                [1, 'aria-activedescendant', 0],
                [2, 'mat-select-disabled', null],
                [2, 'mat-select-invalid', null],
                [2, 'mat-select-required', null],
                [2, 'mat-select-empty', null]
              ],
              [[null, 'keydown'], [null, 'focus'], [null, 'blur']],
              function(l, n, e) {
                var t = !0;
                return (
                  'keydown' === n &&
                    (t = !1 !== a.Sb(l, 74)._handleKeydown(e) && t),
                  'focus' === n && (t = !1 !== a.Sb(l, 74)._onFocus() && t),
                  'blur' === n && (t = !1 !== a.Sb(l, 74)._onBlur() && t),
                  t
                );
              },
              E.b,
              E.a
            )),
            a.Fb(
              71,
              671744,
              null,
              0,
              t.h,
              [[3, t.c], [8, null], [8, null], [8, null], [2, t.A]],
              { name: [0, 'name'] },
              null
            ),
            a.ac(2048, null, t.o, null, [t.h]),
            a.Fb(73, 16384, null, 0, t.p, [[4, t.o]], null, null),
            a.Fb(
              74,
              2080768,
              null,
              3,
              H.c,
              [
                N.e,
                a.h,
                a.F,
                I.b,
                a.m,
                [2, P.c],
                [2, t.r],
                [2, t.j],
                [2, g.c],
                [6, t.o],
                [8, null],
                H.a,
                k.j
              ],
              null,
              null
            ),
            a.bc(603979776, 17, { options: 1 }),
            a.bc(603979776, 18, { optionGroups: 1 }),
            a.bc(335544320, 19, { customTrigger: 0 }),
            a.ac(2048, [[10, 4]], g.d, null, [H.c]),
            a.ac(2048, null, I.j, null, [H.c]),
            (l()(),
            a.Gb(
              80,
              0,
              null,
              1,
              2,
              'mat-option',
              [['class', 'mat-option'], ['role', 'option'], ['value', 'BASIC']],
              [
                [1, 'tabindex', 0],
                [2, 'mat-selected', null],
                [2, 'mat-option-multiple', null],
                [2, 'mat-active', null],
                [8, 'id', 0],
                [1, 'aria-selected', 0],
                [1, 'aria-disabled', 0],
                [2, 'mat-option-disabled', null]
              ],
              [[null, 'click'], [null, 'keydown']],
              function(l, n, e) {
                var t = !0;
                return (
                  'click' === n &&
                    (t = !1 !== a.Sb(l, 81)._selectViaInteraction() && t),
                  'keydown' === n &&
                    (t = !1 !== a.Sb(l, 81)._handleKeydown(e) && t),
                  t
                );
              },
              j.c,
              j.a
            )),
            a.Fb(
              81,
              8568832,
              [[17, 4]],
              0,
              I.q,
              [a.m, a.h, [2, I.j], [2, I.p]],
              { value: [0, 'value'] },
              null
            ),
            (l()(), a.ec(-1, 0, ['Basic'])),
            (l()(),
            a.Gb(
              83,
              0,
              null,
              1,
              2,
              'mat-option',
              [['class', 'mat-option'], ['role', 'option'], ['value', 'OAUTH']],
              [
                [1, 'tabindex', 0],
                [2, 'mat-selected', null],
                [2, 'mat-option-multiple', null],
                [2, 'mat-active', null],
                [8, 'id', 0],
                [1, 'aria-selected', 0],
                [1, 'aria-disabled', 0],
                [2, 'mat-option-disabled', null]
              ],
              [[null, 'click'], [null, 'keydown']],
              function(l, n, e) {
                var t = !0;
                return (
                  'click' === n &&
                    (t = !1 !== a.Sb(l, 84)._selectViaInteraction() && t),
                  'keydown' === n &&
                    (t = !1 !== a.Sb(l, 84)._handleKeydown(e) && t),
                  t
                );
              },
              j.c,
              j.a
            )),
            a.Fb(
              84,
              8568832,
              [[17, 4]],
              0,
              I.q,
              [a.m, a.h, [2, I.j], [2, I.p]],
              { value: [0, 'value'] },
              null
            ),
            (l()(), a.ec(-1, 0, ['OAuth (Identity Service)'])),
            (l()(),
            a.Gb(
              86,
              0,
              null,
              null,
              20,
              'div',
              [],
              null,
              null,
              null,
              null,
              null
            )),
            (l()(),
            a.Gb(
              87,
              0,
              null,
              null,
              19,
              'mat-form-field',
              [
                ['appearance', 'outline'],
                ['class', 'settings-input mat-form-field']
              ],
              [
                [2, 'mat-form-field-appearance-standard', null],
                [2, 'mat-form-field-appearance-fill', null],
                [2, 'mat-form-field-appearance-outline', null],
                [2, 'mat-form-field-appearance-legacy', null],
                [2, 'mat-form-field-invalid', null],
                [2, 'mat-form-field-can-float', null],
                [2, 'mat-form-field-should-float', null],
                [2, 'mat-form-field-has-label', null],
                [2, 'mat-form-field-hide-placeholder', null],
                [2, 'mat-form-field-disabled', null],
                [2, 'mat-form-field-autofilled', null],
                [2, 'mat-focused', null],
                [2, 'mat-accent', null],
                [2, 'mat-warn', null],
                [2, 'ng-untouched', null],
                [2, 'ng-touched', null],
                [2, 'ng-pristine', null],
                [2, 'ng-dirty', null],
                [2, 'ng-valid', null],
                [2, 'ng-invalid', null],
                [2, 'ng-pending', null],
                [2, '_mat-animation-noopable', null]
              ],
              null,
              null,
              w.b,
              w.a
            )),
            a.Fb(
              88,
              7520256,
              null,
              7,
              g.c,
              [a.m, a.h, [2, I.h], [2, P.c], [2, g.a], G.a, a.F, [2, C.a]],
              { appearance: [0, 'appearance'] },
              null
            ),
            a.bc(335544320, 20, { _control: 0 }),
            a.bc(335544320, 21, { _placeholderChild: 0 }),
            a.bc(335544320, 22, { _labelChild: 0 }),
            a.bc(603979776, 23, { _errorChildren: 1 }),
            a.bc(603979776, 24, { _hintChildren: 1 }),
            a.bc(603979776, 25, { _prefixChildren: 1 }),
            a.bc(603979776, 26, { _suffixChildren: 1 }),
            (l()(),
            a.Gb(
              96,
              0,
              null,
              3,
              2,
              'mat-label',
              [],
              null,
              null,
              null,
              null,
              null
            )),
            a.Fb(97, 16384, [[22, 4]], 0, g.g, [], null, null),
            (l()(), a.ec(-1, null, ['Alfresco Identity Service URL'])),
            (l()(),
            a.Gb(
              99,
              0,
              null,
              1,
              7,
              'input',
              [
                ['class', 'mat-input-element mat-form-field-autofill-control'],
                ['formControlName', 'aisHost'],
                ['matInput', ''],
                ['type', 'text']
              ],
              [
                [2, 'ng-untouched', null],
                [2, 'ng-touched', null],
                [2, 'ng-pristine', null],
                [2, 'ng-dirty', null],
                [2, 'ng-valid', null],
                [2, 'ng-invalid', null],
                [2, 'ng-pending', null],
                [2, 'mat-input-server', null],
                [1, 'id', 0],
                [1, 'placeholder', 0],
                [8, 'disabled', 0],
                [8, 'required', 0],
                [1, 'readonly', 0],
                [1, 'aria-describedby', 0],
                [1, 'aria-invalid', 0],
                [1, 'aria-required', 0]
              ],
              [
                [null, 'input'],
                [null, 'blur'],
                [null, 'compositionstart'],
                [null, 'compositionend'],
                [null, 'focus']
              ],
              function(l, n, e) {
                var t = !0;
                return (
                  'input' === n &&
                    (t = !1 !== a.Sb(l, 100)._handleInput(e.target.value) && t),
                  'blur' === n && (t = !1 !== a.Sb(l, 100).onTouched() && t),
                  'compositionstart' === n &&
                    (t = !1 !== a.Sb(l, 100)._compositionStart() && t),
                  'compositionend' === n &&
                    (t =
                      !1 !== a.Sb(l, 100)._compositionEnd(e.target.value) && t),
                  'blur' === n &&
                    (t = !1 !== a.Sb(l, 105)._focusChanged(!1) && t),
                  'focus' === n &&
                    (t = !1 !== a.Sb(l, 105)._focusChanged(!0) && t),
                  'input' === n && (t = !1 !== a.Sb(l, 105)._onInput() && t),
                  t
                );
              },
              null,
              null
            )),
            a.Fb(100, 16384, null, 0, t.d, [a.L, a.m, [2, t.a]], null, null),
            a.ac(
              1024,
              null,
              t.n,
              function(l) {
                return [l];
              },
              [t.d]
            ),
            a.Fb(
              102,
              671744,
              null,
              0,
              t.h,
              [[3, t.c], [8, null], [8, null], [6, t.n], [2, t.A]],
              { name: [0, 'name'] },
              null
            ),
            a.ac(2048, null, t.o, null, [t.h]),
            a.Fb(104, 16384, null, 0, t.p, [[4, t.o]], null, null),
            a.Fb(
              105,
              999424,
              null,
              0,
              T.b,
              [
                a.m,
                G.a,
                [6, t.o],
                [2, t.r],
                [2, t.j],
                I.b,
                [8, null],
                A.a,
                a.F
              ],
              { type: [0, 'type'] },
              null
            ),
            a.ac(2048, [[20, 4]], g.d, null, [T.b]),
            (l()(),
            a.Gb(
              107,
              0,
              null,
              null,
              8,
              'div',
              [['class', 'settings-buttons']],
              null,
              null,
              null,
              null,
              null
            )),
            (l()(),
            a.Gb(
              108,
              0,
              null,
              null,
              3,
              'button',
              [['mat-button', '']],
              [[8, 'disabled', 0], [2, '_mat-animation-noopable', null]],
              [[null, 'click']],
              function(l, n, e) {
                var a = !0;
                return (
                  'click' === n && (a = !1 !== l.component.reset() && a), a
                );
              },
              L.b,
              L.a
            )),
            a.Fb(
              109,
              180224,
              null,
              0,
              q.b,
              [a.m, G.a, k.h, [2, C.a]],
              null,
              null
            ),
            (l()(), a.ec(110, 0, [' ', ' '])),
            a.Xb(131072, f.j, [f.k, a.h]),
            (l()(),
            a.Gb(
              112,
              0,
              null,
              null,
              3,
              'button',
              [['color', 'primary'], ['mat-button', ''], ['type', 'submit']],
              [[8, 'disabled', 0], [2, '_mat-animation-noopable', null]],
              null,
              null,
              L.b,
              L.a
            )),
            a.Fb(
              113,
              180224,
              null,
              0,
              q.b,
              [a.m, G.a, k.h, [2, C.a]],
              { disabled: [0, 'disabled'], color: [1, 'color'] },
              null
            ),
            (l()(), a.ec(114, 0, [' ', ' '])),
            a.Xb(131072, f.j, [f.k, a.h]),
            (l()(),
            a.Gb(
              116,
              16777216,
              null,
              null,
              19,
              'mat-expansion-panel',
              [['class', 'mat-expansion-panel']],
              [
                [2, 'mat-expanded', null],
                [2, '_mat-animation-noopable', null],
                [2, 'mat-expansion-panel-spacing', null]
              ],
              null,
              null,
              x.d,
              x.a
            )),
            a.Fb(
              117,
              1753088,
              null,
              1,
              y.e,
              [[3, y.a], a.h, F.d, a.W, _.d, [2, C.a], [2, y.b]],
              null,
              null
            ),
            a.bc(335544320, 27, { _lazyContent: 0 }),
            a.ac(256, null, y.a, void 0, []),
            (l()(),
            a.Gb(
              120,
              0,
              null,
              0,
              7,
              'mat-expansion-panel-header',
              [['class', 'mat-expansion-panel-header'], ['role', 'button']],
              [
                [1, 'id', 0],
                [1, 'tabindex', 0],
                [1, 'aria-controls', 0],
                [1, 'aria-expanded', 0],
                [1, 'aria-disabled', 0],
                [2, 'mat-expanded', null],
                [40, '@expansionHeight', 0]
              ],
              [[null, 'click'], [null, 'keydown']],
              function(l, n, e) {
                var t = !0;
                return (
                  'click' === n && (t = !1 !== a.Sb(l, 121)._toggle() && t),
                  'keydown' === n && (t = !1 !== a.Sb(l, 121)._keydown(e) && t),
                  t
                );
              },
              x.c,
              x.b
            )),
            a.Fb(
              121,
              180224,
              [[1, 4]],
              0,
              y.f,
              [y.e, a.m, k.h, a.h, [2, y.b]],
              null,
              null
            ),
            a.Yb(122, { collapsedHeight: 0, expandedHeight: 1 }),
            a.Yb(123, { value: 0, params: 1 }),
            (l()(),
            a.Gb(
              124,
              0,
              null,
              0,
              3,
              'mat-panel-title',
              [['class', 'mat-expansion-panel-header-title']],
              null,
              null,
              null,
              null,
              null
            )),
            a.Fb(125, 16384, null, 0, y.g, [], null, null),
            (l()(), a.ec(126, null, [' ', ' '])),
            a.Xb(131072, f.j, [f.k, a.h]),
            (l()(),
            a.Gb(
              128,
              0,
              null,
              1,
              7,
              'mat-checkbox',
              [['class', 'mat-checkbox']],
              [
                [8, 'id', 0],
                [1, 'tabindex', 0],
                [2, 'mat-checkbox-indeterminate', null],
                [2, 'mat-checkbox-checked', null],
                [2, 'mat-checkbox-disabled', null],
                [2, 'mat-checkbox-label-before', null],
                [2, '_mat-animation-noopable', null],
                [2, 'ng-untouched', null],
                [2, 'ng-touched', null],
                [2, 'ng-pristine', null],
                [2, 'ng-dirty', null],
                [2, 'ng-valid', null],
                [2, 'ng-invalid', null],
                [2, 'ng-pending', null]
              ],
              [[null, 'change']],
              function(l, n, e) {
                var a = !0;
                return (
                  'change' === n &&
                    (a =
                      !1 !== l.component.onLanguagePickerValueChanged(e) && a),
                  a
                );
              },
              X.b,
              X.a
            )),
            a.Fb(
              129,
              8568832,
              null,
              0,
              U.b,
              [a.m, a.h, k.h, a.F, [8, null], [2, U.a], [2, C.a]],
              null,
              { change: 'change' }
            ),
            a.ac(
              1024,
              null,
              t.n,
              function(l) {
                return [l];
              },
              [U.b]
            ),
            a.Fb(
              131,
              671744,
              null,
              0,
              t.s,
              [[8, null], [8, null], [8, null], [6, t.n]],
              { model: [0, 'model'] },
              null
            ),
            a.Xb(131072, _.b, [a.h]),
            a.ac(2048, null, t.o, null, [t.s]),
            a.Fb(134, 16384, null, 0, t.p, [[4, t.o]], null, null),
            (l()(), a.ec(-1, 0, [' Language Picker '])),
            (l()(),
            a.Gb(
              136,
              16777216,
              null,
              null,
              27,
              'mat-expansion-panel',
              [['class', 'mat-expansion-panel']],
              [
                [2, 'mat-expanded', null],
                [2, '_mat-animation-noopable', null],
                [2, 'mat-expansion-panel-spacing', null]
              ],
              null,
              null,
              x.d,
              x.a
            )),
            a.Fb(
              137,
              1753088,
              null,
              1,
              y.e,
              [[3, y.a], a.h, F.d, a.W, _.d, [2, C.a], [2, y.b]],
              null,
              null
            ),
            a.bc(335544320, 28, { _lazyContent: 0 }),
            a.ac(256, null, y.a, void 0, []),
            (l()(),
            a.Gb(
              140,
              0,
              null,
              0,
              6,
              'mat-expansion-panel-header',
              [['class', 'mat-expansion-panel-header'], ['role', 'button']],
              [
                [1, 'id', 0],
                [1, 'tabindex', 0],
                [1, 'aria-controls', 0],
                [1, 'aria-expanded', 0],
                [1, 'aria-disabled', 0],
                [2, 'mat-expanded', null],
                [40, '@expansionHeight', 0]
              ],
              [[null, 'click'], [null, 'keydown']],
              function(l, n, e) {
                var t = !0;
                return (
                  'click' === n && (t = !1 !== a.Sb(l, 141)._toggle() && t),
                  'keydown' === n && (t = !1 !== a.Sb(l, 141)._keydown(e) && t),
                  t
                );
              },
              x.c,
              x.b
            )),
            a.Fb(
              141,
              180224,
              [[1, 4]],
              0,
              y.f,
              [y.e, a.m, k.h, a.h, [2, y.b]],
              null,
              null
            ),
            a.Yb(142, { collapsedHeight: 0, expandedHeight: 1 }),
            a.Yb(143, { value: 0, params: 1 }),
            (l()(),
            a.Gb(
              144,
              0,
              null,
              0,
              2,
              'mat-panel-title',
              [['class', 'mat-expansion-panel-header-title']],
              null,
              null,
              null,
              null,
              null
            )),
            a.Fb(145, 16384, null, 0, y.g, [], null, null),
            (l()(), a.ec(-1, null, ['Extensions'])),
            (l()(),
            a.Gb(
              147,
              0,
              null,
              1,
              16,
              'div',
              [['class', 'aca-settings-extensions-list']],
              null,
              null,
              null,
              null,
              null
            )),
            (l()(),
            a.Gb(
              148,
              0,
              null,
              null,
              7,
              'mat-checkbox',
              [['class', 'mat-checkbox']],
              [
                [8, 'id', 0],
                [1, 'tabindex', 0],
                [2, 'mat-checkbox-indeterminate', null],
                [2, 'mat-checkbox-checked', null],
                [2, 'mat-checkbox-disabled', null],
                [2, 'mat-checkbox-label-before', null],
                [2, '_mat-animation-noopable', null],
                [2, 'ng-untouched', null],
                [2, 'ng-touched', null],
                [2, 'ng-pristine', null],
                [2, 'ng-dirty', null],
                [2, 'ng-valid', null],
                [2, 'ng-invalid', null],
                [2, 'ng-pending', null]
              ],
              [[null, 'change']],
              function(l, n, e) {
                var a = !0;
                return (
                  'change' === n &&
                    (a = !1 !== l.component.onToggleAiExtensions(e) && a),
                  a
                );
              },
              X.b,
              X.a
            )),
            a.Fb(
              149,
              8568832,
              null,
              0,
              U.b,
              [a.m, a.h, k.h, a.F, [8, null], [2, U.a], [2, C.a]],
              null,
              { change: 'change' }
            ),
            a.ac(
              1024,
              null,
              t.n,
              function(l) {
                return [l];
              },
              [U.b]
            ),
            a.Fb(
              151,
              671744,
              null,
              0,
              t.s,
              [[8, null], [8, null], [8, null], [6, t.n]],
              { model: [0, 'model'] },
              null
            ),
            a.Xb(131072, _.b, [a.h]),
            a.ac(2048, null, t.o, null, [t.s]),
            a.Fb(154, 16384, null, 0, t.p, [[4, t.o]], null, null),
            (l()(), a.ec(-1, 0, [' Enable AI Extensions '])),
            (l()(),
            a.Gb(
              156,
              0,
              null,
              null,
              7,
              'mat-checkbox',
              [['class', 'mat-checkbox']],
              [
                [8, 'id', 0],
                [1, 'tabindex', 0],
                [2, 'mat-checkbox-indeterminate', null],
                [2, 'mat-checkbox-checked', null],
                [2, 'mat-checkbox-disabled', null],
                [2, 'mat-checkbox-label-before', null],
                [2, '_mat-animation-noopable', null],
                [2, 'ng-untouched', null],
                [2, 'ng-touched', null],
                [2, 'ng-pristine', null],
                [2, 'ng-dirty', null],
                [2, 'ng-valid', null],
                [2, 'ng-invalid', null],
                [2, 'ng-pending', null]
              ],
              [[null, 'change']],
              function(l, n, e) {
                var a = !0;
                return (
                  'change' === n &&
                    (a = !1 !== l.component.onTogglePsExtensions(e) && a),
                  a
                );
              },
              X.b,
              X.a
            )),
            a.Fb(
              157,
              8568832,
              null,
              0,
              U.b,
              [a.m, a.h, k.h, a.F, [8, null], [2, U.a], [2, C.a]],
              null,
              { change: 'change' }
            ),
            a.ac(
              1024,
              null,
              t.n,
              function(l) {
                return [l];
              },
              [U.b]
            ),
            a.Fb(
              159,
              671744,
              null,
              0,
              t.s,
              [[8, null], [8, null], [8, null], [6, t.n]],
              { model: [0, 'model'] },
              null
            ),
            a.Xb(131072, _.b, [a.h]),
            a.ac(2048, null, t.o, null, [t.s]),
            a.Fb(162, 16384, null, 0, t.p, [[4, t.o]], null, null),
            (l()(), a.ec(-1, 0, [' Enable Process Services Extensions ']))
          ],
          function(l, n) {
            var e = n.component,
              t = l(n, 7, 0, '/');
            l(n, 6, 0, t),
              l(n, 12, 0, 'true', 'flat'),
              l(n, 29, 0, e.form),
              l(n, 34, 0, 'outline'),
              l(n, 48, 0, 'ecmHost'),
              l(n, 51, 0, 'text'),
              l(n, 54, 0, e.form.get('ecmHost').hasError('pattern')),
              l(n, 56, 0, e.form.get('ecmHost').hasError('required')),
              l(n, 59, 0, 'outline'),
              l(n, 71, 0, 'authType'),
              l(n, 74, 0),
              l(n, 81, 0, 'BASIC'),
              l(n, 84, 0, 'OAUTH'),
              l(n, 88, 0, 'outline'),
              l(n, 102, 0, 'aisHost'),
              l(n, 105, 0, 'text'),
              l(n, 113, 0, !e.form.valid, 'primary'),
              l(
                n,
                131,
                0,
                a.fc(n, 131, 0, a.Sb(n, 132).transform(e.languagePicker$))
              ),
              l(
                n,
                151,
                0,
                a.fc(n, 151, 0, a.Sb(n, 152).transform(e.aiExtensions$))
              ),
              l(
                n,
                159,
                0,
                a.fc(n, 159, 0, a.Sb(n, 160).transform(e.psExtensions$))
              );
          },
          function(l, n) {
            var e = n.component;
            l(n, 0, 0, a.fc(n, 0, 0, a.Sb(n, 2).transform(e.headerColor$))),
              l(
                n,
                5,
                0,
                a.Jb(
                  1,
                  '',
                  a.fc(n, 5, 0, a.Sb(n, 8).transform(e.appName$)),
                  ''
                ),
                a.Sb(n, 6).target,
                a.Sb(n, 6).href
              ),
              l(
                n,
                9,
                0,
                e.logo,
                a.Jb(
                  1,
                  '',
                  a.fc(n, 9, 1, a.Sb(n, 10).transform(e.appName$)),
                  ''
                )
              ),
              l(
                n,
                15,
                0,
                a.Sb(n, 16).expanded,
                'NoopAnimations' === a.Sb(n, 16)._animationMode,
                a.Sb(n, 16)._hasSpacing()
              );
            var t = a.Sb(n, 20).panel._headerId,
              u = a.Sb(n, 20).disabled ? -1 : 0,
              b = a.Sb(n, 20)._getPanelId(),
              i = a.Sb(n, 20)._isExpanded(),
              o = a.Sb(n, 20).panel.disabled,
              d = a.Sb(n, 20)._isExpanded(),
              r = l(
                n,
                22,
                0,
                a.Sb(n, 20)._getExpandedState(),
                l(
                  n,
                  21,
                  0,
                  a.Sb(n, 20).collapsedHeight,
                  a.Sb(n, 20).expandedHeight
                )
              );
            l(n, 19, 0, t, u, b, i, o, d, r),
              l(
                n,
                25,
                0,
                a.fc(
                  n,
                  25,
                  0,
                  a.Sb(n, 26).transform('APP.SETTINGS.REPOSITORY-SETTINGS')
                )
              ),
              l(
                n,
                27,
                0,
                a.Sb(n, 31).ngClassUntouched,
                a.Sb(n, 31).ngClassTouched,
                a.Sb(n, 31).ngClassPristine,
                a.Sb(n, 31).ngClassDirty,
                a.Sb(n, 31).ngClassValid,
                a.Sb(n, 31).ngClassInvalid,
                a.Sb(n, 31).ngClassPending
              ),
              l(n, 33, 1, [
                'standard' == a.Sb(n, 34).appearance,
                'fill' == a.Sb(n, 34).appearance,
                'outline' == a.Sb(n, 34).appearance,
                'legacy' == a.Sb(n, 34).appearance,
                a.Sb(n, 34)._control.errorState,
                a.Sb(n, 34)._canLabelFloat,
                a.Sb(n, 34)._shouldLabelFloat(),
                a.Sb(n, 34)._hasFloatingLabel(),
                a.Sb(n, 34)._hideControlPlaceholder(),
                a.Sb(n, 34)._control.disabled,
                a.Sb(n, 34)._control.autofilled,
                a.Sb(n, 34)._control.focused,
                'accent' == a.Sb(n, 34).color,
                'warn' == a.Sb(n, 34).color,
                a.Sb(n, 34)._shouldForward('untouched'),
                a.Sb(n, 34)._shouldForward('touched'),
                a.Sb(n, 34)._shouldForward('pristine'),
                a.Sb(n, 34)._shouldForward('dirty'),
                a.Sb(n, 34)._shouldForward('valid'),
                a.Sb(n, 34)._shouldForward('invalid'),
                a.Sb(n, 34)._shouldForward('pending'),
                !a.Sb(n, 34)._animationsEnabled
              ]),
              l(n, 45, 1, [
                a.Sb(n, 50).ngClassUntouched,
                a.Sb(n, 50).ngClassTouched,
                a.Sb(n, 50).ngClassPristine,
                a.Sb(n, 50).ngClassDirty,
                a.Sb(n, 50).ngClassValid,
                a.Sb(n, 50).ngClassInvalid,
                a.Sb(n, 50).ngClassPending,
                a.Sb(n, 51)._isServer,
                a.Sb(n, 51).id,
                a.Sb(n, 51).placeholder,
                a.Sb(n, 51).disabled,
                a.Sb(n, 51).required,
                (a.Sb(n, 51).readonly && !a.Sb(n, 51)._isNativeSelect) || null,
                a.Sb(n, 51)._ariaDescribedby || null,
                a.Sb(n, 51).errorState,
                a.Sb(n, 51).required.toString()
              ]),
              l(n, 58, 1, [
                'standard' == a.Sb(n, 59).appearance,
                'fill' == a.Sb(n, 59).appearance,
                'outline' == a.Sb(n, 59).appearance,
                'legacy' == a.Sb(n, 59).appearance,
                a.Sb(n, 59)._control.errorState,
                a.Sb(n, 59)._canLabelFloat,
                a.Sb(n, 59)._shouldLabelFloat(),
                a.Sb(n, 59)._hasFloatingLabel(),
                a.Sb(n, 59)._hideControlPlaceholder(),
                a.Sb(n, 59)._control.disabled,
                a.Sb(n, 59)._control.autofilled,
                a.Sb(n, 59)._control.focused,
                'accent' == a.Sb(n, 59).color,
                'warn' == a.Sb(n, 59).color,
                a.Sb(n, 59)._shouldForward('untouched'),
                a.Sb(n, 59)._shouldForward('touched'),
                a.Sb(n, 59)._shouldForward('pristine'),
                a.Sb(n, 59)._shouldForward('dirty'),
                a.Sb(n, 59)._shouldForward('valid'),
                a.Sb(n, 59)._shouldForward('invalid'),
                a.Sb(n, 59)._shouldForward('pending'),
                !a.Sb(n, 59)._animationsEnabled
              ]),
              l(n, 70, 1, [
                a.Sb(n, 73).ngClassUntouched,
                a.Sb(n, 73).ngClassTouched,
                a.Sb(n, 73).ngClassPristine,
                a.Sb(n, 73).ngClassDirty,
                a.Sb(n, 73).ngClassValid,
                a.Sb(n, 73).ngClassInvalid,
                a.Sb(n, 73).ngClassPending,
                a.Sb(n, 74).id,
                a.Sb(n, 74).tabIndex,
                a.Sb(n, 74)._getAriaLabel(),
                a.Sb(n, 74)._getAriaLabelledby(),
                a.Sb(n, 74).required.toString(),
                a.Sb(n, 74).disabled.toString(),
                a.Sb(n, 74).errorState,
                a.Sb(n, 74).panelOpen ? a.Sb(n, 74)._optionIds : null,
                a.Sb(n, 74).multiple,
                a.Sb(n, 74)._ariaDescribedby || null,
                a.Sb(n, 74)._getAriaActiveDescendant(),
                a.Sb(n, 74).disabled,
                a.Sb(n, 74).errorState,
                a.Sb(n, 74).required,
                a.Sb(n, 74).empty
              ]),
              l(
                n,
                80,
                0,
                a.Sb(n, 81)._getTabIndex(),
                a.Sb(n, 81).selected,
                a.Sb(n, 81).multiple,
                a.Sb(n, 81).active,
                a.Sb(n, 81).id,
                a.Sb(n, 81)._getAriaSelected(),
                a.Sb(n, 81).disabled.toString(),
                a.Sb(n, 81).disabled
              ),
              l(
                n,
                83,
                0,
                a.Sb(n, 84)._getTabIndex(),
                a.Sb(n, 84).selected,
                a.Sb(n, 84).multiple,
                a.Sb(n, 84).active,
                a.Sb(n, 84).id,
                a.Sb(n, 84)._getAriaSelected(),
                a.Sb(n, 84).disabled.toString(),
                a.Sb(n, 84).disabled
              ),
              l(n, 87, 1, [
                'standard' == a.Sb(n, 88).appearance,
                'fill' == a.Sb(n, 88).appearance,
                'outline' == a.Sb(n, 88).appearance,
                'legacy' == a.Sb(n, 88).appearance,
                a.Sb(n, 88)._control.errorState,
                a.Sb(n, 88)._canLabelFloat,
                a.Sb(n, 88)._shouldLabelFloat(),
                a.Sb(n, 88)._hasFloatingLabel(),
                a.Sb(n, 88)._hideControlPlaceholder(),
                a.Sb(n, 88)._control.disabled,
                a.Sb(n, 88)._control.autofilled,
                a.Sb(n, 88)._control.focused,
                'accent' == a.Sb(n, 88).color,
                'warn' == a.Sb(n, 88).color,
                a.Sb(n, 88)._shouldForward('untouched'),
                a.Sb(n, 88)._shouldForward('touched'),
                a.Sb(n, 88)._shouldForward('pristine'),
                a.Sb(n, 88)._shouldForward('dirty'),
                a.Sb(n, 88)._shouldForward('valid'),
                a.Sb(n, 88)._shouldForward('invalid'),
                a.Sb(n, 88)._shouldForward('pending'),
                !a.Sb(n, 88)._animationsEnabled
              ]),
              l(n, 99, 1, [
                a.Sb(n, 104).ngClassUntouched,
                a.Sb(n, 104).ngClassTouched,
                a.Sb(n, 104).ngClassPristine,
                a.Sb(n, 104).ngClassDirty,
                a.Sb(n, 104).ngClassValid,
                a.Sb(n, 104).ngClassInvalid,
                a.Sb(n, 104).ngClassPending,
                a.Sb(n, 105)._isServer,
                a.Sb(n, 105).id,
                a.Sb(n, 105).placeholder,
                a.Sb(n, 105).disabled,
                a.Sb(n, 105).required,
                (a.Sb(n, 105).readonly && !a.Sb(n, 105)._isNativeSelect) ||
                  null,
                a.Sb(n, 105)._ariaDescribedby || null,
                a.Sb(n, 105).errorState,
                a.Sb(n, 105).required.toString()
              ]),
              l(
                n,
                108,
                0,
                a.Sb(n, 109).disabled || null,
                'NoopAnimations' === a.Sb(n, 109)._animationMode
              ),
              l(
                n,
                110,
                0,
                a.fc(n, 110, 0, a.Sb(n, 111).transform('APP.SETTINGS.RESET'))
              ),
              l(
                n,
                112,
                0,
                a.Sb(n, 113).disabled || null,
                'NoopAnimations' === a.Sb(n, 113)._animationMode
              ),
              l(
                n,
                114,
                0,
                a.fc(n, 114, 0, a.Sb(n, 115).transform('APP.SETTINGS.APPLY'))
              ),
              l(
                n,
                116,
                0,
                a.Sb(n, 117).expanded,
                'NoopAnimations' === a.Sb(n, 117)._animationMode,
                a.Sb(n, 117)._hasSpacing()
              );
            var c = a.Sb(n, 121).panel._headerId,
              s = a.Sb(n, 121).disabled ? -1 : 0,
              p = a.Sb(n, 121)._getPanelId(),
              m = a.Sb(n, 121)._isExpanded(),
              S = a.Sb(n, 121).panel.disabled,
              h = a.Sb(n, 121)._isExpanded(),
              g = l(
                n,
                123,
                0,
                a.Sb(n, 121)._getExpandedState(),
                l(
                  n,
                  122,
                  0,
                  a.Sb(n, 121).collapsedHeight,
                  a.Sb(n, 121).expandedHeight
                )
              );
            l(n, 120, 0, c, s, p, m, S, h, g),
              l(
                n,
                126,
                0,
                a.fc(
                  n,
                  126,
                  0,
                  a.Sb(n, 127).transform('APP.SETTINGS.APPLICATION-SETTINGS')
                )
              ),
              l(n, 128, 1, [
                a.Sb(n, 129).id,
                null,
                a.Sb(n, 129).indeterminate,
                a.Sb(n, 129).checked,
                a.Sb(n, 129).disabled,
                'before' == a.Sb(n, 129).labelPosition,
                'NoopAnimations' === a.Sb(n, 129)._animationMode,
                a.Sb(n, 134).ngClassUntouched,
                a.Sb(n, 134).ngClassTouched,
                a.Sb(n, 134).ngClassPristine,
                a.Sb(n, 134).ngClassDirty,
                a.Sb(n, 134).ngClassValid,
                a.Sb(n, 134).ngClassInvalid,
                a.Sb(n, 134).ngClassPending
              ]),
              l(
                n,
                136,
                0,
                a.Sb(n, 137).expanded,
                'NoopAnimations' === a.Sb(n, 137)._animationMode,
                a.Sb(n, 137)._hasSpacing()
              );
            var f = a.Sb(n, 141).panel._headerId,
              Q = a.Sb(n, 141).disabled ? -1 : 0,
              _ = a.Sb(n, 141)._getPanelId(),
              v = a.Sb(n, 141)._isExpanded(),
              y = a.Sb(n, 141).panel.disabled,
              x = a.Sb(n, 141)._isExpanded(),
              F = l(
                n,
                143,
                0,
                a.Sb(n, 141)._getExpandedState(),
                l(
                  n,
                  142,
                  0,
                  a.Sb(n, 141).collapsedHeight,
                  a.Sb(n, 141).expandedHeight
                )
              );
            l(n, 140, 0, f, Q, _, v, y, x, F),
              l(n, 148, 1, [
                a.Sb(n, 149).id,
                null,
                a.Sb(n, 149).indeterminate,
                a.Sb(n, 149).checked,
                a.Sb(n, 149).disabled,
                'before' == a.Sb(n, 149).labelPosition,
                'NoopAnimations' === a.Sb(n, 149)._animationMode,
                a.Sb(n, 154).ngClassUntouched,
                a.Sb(n, 154).ngClassTouched,
                a.Sb(n, 154).ngClassPristine,
                a.Sb(n, 154).ngClassDirty,
                a.Sb(n, 154).ngClassValid,
                a.Sb(n, 154).ngClassInvalid,
                a.Sb(n, 154).ngClassPending
              ]),
              l(n, 156, 1, [
                a.Sb(n, 157).id,
                null,
                a.Sb(n, 157).indeterminate,
                a.Sb(n, 157).checked,
                a.Sb(n, 157).disabled,
                'before' == a.Sb(n, 157).labelPosition,
                'NoopAnimations' === a.Sb(n, 157)._animationMode,
                a.Sb(n, 162).ngClassUntouched,
                a.Sb(n, 162).ngClassTouched,
                a.Sb(n, 162).ngClassPristine,
                a.Sb(n, 162).ngClassDirty,
                a.Sb(n, 162).ngClassValid,
                a.Sb(n, 162).ngClassInvalid,
                a.Sb(n, 162).ngClassPending
              ]);
          }
        );
      }
      function Y(l) {
        return a.gc(
          0,
          [
            (l()(),
            a.Gb(
              0,
              0,
              null,
              null,
              1,
              'aca-settings',
              [['class', 'aca-settings']],
              null,
              null,
              null,
              R,
              V
            )),
            a.Fb(1, 114688, null, 0, i, [M.l, Q.l, Q.zd, t.e], null, null)
          ],
          function(l, n) {
            l(n, 1, 0);
          },
          null
        );
      }
      var z = a.xb('aca-settings', i, Y, {}, {}, []),
        K = e('eDkP'),
        $ = e('4tE/'),
        J = e('M2Lx'),
        B = e('o3x0'),
        W = e('jQLj'),
        Z = e('ZYjt'),
        ll = e('mVsa'),
        nl = e('v9Dh'),
        el = e('UyM+'),
        al = e('SMsm'),
        tl = e('OzfB'),
        ul = e('t/Na'),
        bl = e('AHN1'),
        il = e('4c35'),
        ol = e('FVSy'),
        dl = e('/dO6'),
        rl = e('r43C'),
        cl = e('LC5p'),
        sl = e('0/Q6'),
        pl = e('Blfk'),
        ml = e('9It4'),
        Sl = e('kWGw'),
        hl = e('y4qS'),
        gl = e('BHnd'),
        fl = e('La40'),
        Ql = e('Z+uX'),
        _l = e('Nsh5'),
        vl = e('vARd'),
        yl = e('8mMr'),
        xl = e('YhbO'),
        Fl = e('21Lb'),
        Cl = e('hUWP'),
        kl = e('3pJQ'),
        wl = e('V9q+'),
        Il = e('YSh2');
      e.d(n, 'AppSettingsModuleNgFactory', function() {
        return Pl;
      });
      var Pl = a.zb(d, [], function(l) {
        return a.Pb([
          a.Qb(512, a.k, a.kb, [
            [
              8,
              [
                r.a,
                c.b,
                c.a,
                s.a,
                s.b,
                p.a,
                m.a,
                S.a,
                h.Nb,
                h.l,
                h.Ob,
                h.t,
                h.e,
                h.f,
                h.h,
                h.j,
                h.i,
                h.g,
                h.d,
                h.x,
                h.mb,
                h.ib,
                h.m,
                h.kb,
                h.F,
                h.k,
                h.E,
                h.v,
                h.A,
                h.H,
                h.r,
                h.nb,
                h.lb,
                h.z,
                h.G,
                h.q,
                h.b,
                h.w,
                h.n,
                h.u,
                h.c,
                h.jb,
                h.hb,
                h.y,
                h.s,
                h.p,
                h.o,
                h.B,
                h.a,
                h.C,
                h.D,
                z
              ]
            ],
            [3, a.k],
            a.D
          ]),
          a.Qb(4608, _.p, _.o, [a.z, [2, _.D]]),
          a.Qb(4608, K.c, K.c, [
            K.i,
            K.e,
            a.k,
            K.h,
            K.f,
            a.v,
            a.F,
            _.d,
            P.c,
            [2, _.j]
          ]),
          a.Qb(5120, K.j, K.k, [K.c]),
          a.Qb(5120, $.b, $.c, [K.c]),
          a.Qb(4608, J.c, J.c, []),
          a.Qb(4608, I.b, I.b, []),
          a.Qb(5120, B.c, B.d, [K.c]),
          a.Qb(135680, B.e, B.e, [
            K.c,
            a.v,
            [2, _.j],
            [2, B.b],
            B.c,
            [3, B.e],
            K.e
          ]),
          a.Qb(4608, W.i, W.i, []),
          a.Qb(5120, W.a, W.b, [K.c]),
          a.Qb(4608, I.a, I.x, [[2, I.f], G.a]),
          a.Qb(5120, H.a, H.b, [K.c]),
          a.Qb(4608, Z.f, I.c, [[2, I.g], [2, I.l]]),
          a.Qb(5120, ll.b, ll.g, [K.c]),
          a.Qb(5120, nl.b, nl.c, [K.c]),
          a.Qb(4608, el.a, el.n, [[2, I.f], I.a]),
          a.Qb(4608, f.g, f.f, []),
          a.Qb(4608, f.c, f.e, []),
          a.Qb(4608, f.i, f.d, []),
          a.Qb(4608, f.b, f.a, []),
          a.Qb(4608, f.k, f.k, [f.l, f.g, f.c, f.i, f.b, f.m, f.n]),
          a.Qb(4608, Q.Rb, Q.Rb, [Q.Md]),
          a.Qb(4608, Q.cc, Q.cc, [Q.dc]),
          a.Qb(135680, Q.Gd, Q.Gd, [Q.Xd, Q.l]),
          a.Qb(4608, Q.Fd, Q.Fd, [Q.f, al.d, Z.c]),
          a.Qb(4608, Q.Lc, Q.Lc, [Q.Fd]),
          a.Qb(4608, Q.sc, Q.sc, [Z.c]),
          a.Qb(4608, Q.Tc, Q.Tc, []),
          a.Qb(4608, Q.te, Q.te, []),
          a.Qb(4608, Q.ue, Q.ue, []),
          a.Qb(4608, Q.Nc, Q.Nc, []),
          a.Qb(135680, Q.yc, Q.yc, [Q.Xd, Q.l]),
          a.Qb(135680, Q.tb, Q.tb, [Q.Xd, Q.l]),
          a.Qb(4608, Q.P, Q.P, [_.d, Q.Bc, Q.Xc]),
          a.Qb(4608, t.z, t.z, []),
          a.Qb(4608, t.e, t.e, []),
          a.Qb(
            5120,
            a.b,
            function(l, n) {
              return [tl.j(l, n)];
            },
            [_.d, a.H]
          ),
          a.Qb(4608, ul.i, ul.o, [_.d, a.H, ul.m]),
          a.Qb(4608, ul.p, ul.p, [ul.i, ul.n]),
          a.Qb(
            5120,
            ul.a,
            function(l) {
              return [l];
            },
            [ul.p]
          ),
          a.Qb(4608, ul.l, ul.l, []),
          a.Qb(6144, ul.j, null, [ul.l]),
          a.Qb(4608, ul.h, ul.h, [ul.j]),
          a.Qb(6144, ul.b, null, [ul.h]),
          a.Qb(4608, ul.f, ul.k, [ul.b, a.v]),
          a.Qb(4608, ul.c, ul.c, [ul.f]),
          a.Qb(1073742336, _.c, _.c, []),
          a.Qb(1073742336, f.h, f.h, []),
          a.Qb(1073742336, bl.h, bl.h, []),
          a.Qb(1073742336, P.a, P.a, []),
          a.Qb(1073742336, I.l, I.l, [[2, I.d], [2, Z.g]]),
          a.Qb(1073742336, G.b, G.b, []),
          a.Qb(1073742336, I.w, I.w, []),
          a.Qb(1073742336, I.u, I.u, []),
          a.Qb(1073742336, I.r, I.r, []),
          a.Qb(1073742336, il.g, il.g, []),
          a.Qb(1073742336, N.c, N.c, []),
          a.Qb(1073742336, K.g, K.g, []),
          a.Qb(1073742336, $.e, $.e, []),
          a.Qb(1073742336, q.c, q.c, []),
          a.Qb(1073742336, ol.f, ol.f, []),
          a.Qb(1073742336, J.d, J.d, []),
          a.Qb(1073742336, U.c, U.c, []),
          a.Qb(1073742336, dl.e, dl.e, []),
          a.Qb(1073742336, B.k, B.k, []),
          a.Qb(1073742336, k.a, k.a, []),
          a.Qb(1073742336, W.j, W.j, []),
          a.Qb(1073742336, I.n, I.n, []),
          a.Qb(1073742336, rl.a, rl.a, []),
          a.Qb(1073742336, al.c, al.c, []),
          a.Qb(1073742336, A.c, A.c, []),
          a.Qb(1073742336, g.e, g.e, []),
          a.Qb(1073742336, T.c, T.c, []),
          a.Qb(1073742336, cl.b, cl.b, []),
          a.Qb(1073742336, sl.d, sl.d, []),
          a.Qb(1073742336, I.y, I.y, []),
          a.Qb(1073742336, I.o, I.o, []),
          a.Qb(1073742336, pl.c, pl.c, []),
          a.Qb(1073742336, ml.c, ml.c, []),
          a.Qb(1073742336, H.d, H.d, []),
          a.Qb(1073742336, Sl.c, Sl.c, []),
          a.Qb(1073742336, hl.p, hl.p, []),
          a.Qb(1073742336, gl.m, gl.m, []),
          a.Qb(1073742336, fl.k, fl.k, []),
          a.Qb(1073742336, ll.e, ll.e, []),
          a.Qb(1073742336, Ql.c, Ql.c, []),
          a.Qb(1073742336, _l.h, _l.h, []),
          a.Qb(1073742336, vl.e, vl.e, []),
          a.Qb(1073742336, yl.b, yl.b, []),
          a.Qb(1073742336, nl.e, nl.e, []),
          a.Qb(1073742336, el.i, el.i, []),
          a.Qb(1073742336, el.o, el.o, []),
          a.Qb(1073742336, el.m, el.m, []),
          a.Qb(1073742336, xl.c, xl.c, []),
          a.Qb(1073742336, y.d, y.d, []),
          a.Qb(1073742336, Q.pe, Q.pe, []),
          a.Qb(1073742336, v.u, v.u, [[2, v.B], [2, v.q]]),
          a.Qb(1073742336, Q.ab, Q.ab, []),
          a.Qb(1073742336, Q.kd, Q.kd, []),
          a.Qb(1073742336, Q.vb, Q.vb, []),
          a.Qb(1073742336, Q.O, Q.O, []),
          a.Qb(1073742336, Q.lb, Q.lb, []),
          a.Qb(1073742336, Q.hb, Q.hb, []),
          a.Qb(1073742336, Q.d, Q.d, []),
          a.Qb(1073742336, t.x, t.x, []),
          a.Qb(1073742336, t.l, t.l, []),
          a.Qb(1073742336, t.u, t.u, []),
          a.Qb(1073742336, Q.Jd, Q.Jd, []),
          a.Qb(1073742336, tl.c, tl.c, []),
          a.Qb(1073742336, Fl.e, Fl.e, []),
          a.Qb(1073742336, Cl.d, Cl.d, []),
          a.Qb(1073742336, kl.a, kl.a, []),
          a.Qb(1073742336, wl.a, wl.a, [[2, tl.g], a.H]),
          a.Qb(1073742336, Q.ae, Q.ae, []),
          a.Qb(1073742336, Q.vd, Q.vd, []),
          a.Qb(1073742336, Q.ub, Q.ub, []),
          a.Qb(1073742336, Q.fc, Q.fc, []),
          a.Qb(1073742336, Q.Vd, Q.Vd, []),
          a.Qb(1073742336, ul.e, ul.e, []),
          a.Qb(1073742336, ul.d, ul.d, []),
          a.Qb(1073742336, Q.j, Q.j, []),
          a.Qb(1073742336, Q.ed, Q.ed, []),
          a.Qb(1073742336, Q.G, Q.G, []),
          a.Qb(1073742336, Q.Kb, Q.Kb, []),
          a.Qb(1073742336, Q.Ub, Q.Ub, []),
          a.Qb(1073742336, Q.U, Q.U, []),
          a.Qb(1073742336, Q.Hc, Q.Hc, []),
          a.Qb(1073742336, Q.wc, Q.wc, []),
          a.Qb(1073742336, Q.pc, Q.pc, []),
          a.Qb(1073742336, Q.s, Q.s, []),
          a.Qb(1073742336, Q.Cd, Q.Cd, []),
          a.Qb(1073742336, Q.ic, Q.ic, []),
          a.Qb(1073742336, Q.yd, Q.yd, []),
          a.Qb(1073742336, Q.Wc, Q.Wc, []),
          a.Qb(1073742336, Q.sd, Q.sd, []),
          a.Qb(1073742336, Q.db, Q.db, [Q.Md]),
          a.Qb(1073742336, d, d, []),
          a.Qb(256, dl.a, { separatorKeyCodes: [Il.f] }, []),
          a.Qb(256, I.e, I.i, []),
          a.Qb(256, el.b, el.c, []),
          a.Qb(256, f.n, void 0, []),
          a.Qb(256, f.m, void 0, []),
          a.Qb(256, ul.m, 'XSRF-TOKEN', []),
          a.Qb(256, ul.n, 'X-XSRF-TOKEN', []),
          a.Qb(
            1024,
            v.o,
            function() {
              return [[{ path: '', component: i, data: o }]];
            },
            []
          )
        ]);
      });
    }
  }
]);
