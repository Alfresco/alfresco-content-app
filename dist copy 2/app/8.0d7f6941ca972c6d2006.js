(window.webpackJsonp = window.webpackJsonp || []).push([
  [8],
  {
    'Z03/': function(b, n, l) {
      'use strict';
      l.r(n);
      var c = l('CcnG'),
        a = l('30XK'),
        Q = l('VNr4'),
        e = l('0/uQ'),
        u = l('F/XL'),
        i = l('psW0'),
        t = l('9Z1F'),
        o = l('ZGJ8'),
        d = (function() {
          function b(b, n, l, c) {
            (this.route = b),
              (this.store = n),
              (this.extensions = l),
              (this.alfrescoApiService = c),
              (this.sharedLinkId = null),
              (this.viewerToolbarActions = []);
          }
          return (
            (b.prototype.ngOnInit = function() {
              var b = this;
              this.route.params
                .pipe(
                  Object(i.a)(function(n) {
                    return Object(Q.a)(
                      Object(e.a)(
                        b.alfrescoApiService.sharedLinksApi.getSharedLink(n.id)
                      ),
                      Object(u.a)(n.id)
                    ).pipe(
                      Object(t.a)(function() {
                        return Object(u.a)([null, n.id]);
                      })
                    );
                  })
                )
                .subscribe(function(n) {
                  var l = n[0],
                    c = n[1];
                  l && b.store.dispatch(new a.z([l])), (b.sharedLinkId = c);
                }),
                this.store.select(a.R).subscribe(function(n) {
                  n.isEmpty ||
                    (b.viewerToolbarActions = b.extensions.getSharedLinkViewerToolbarActions());
                });
            }),
            (b.prototype.trackByActionId = function(b, n) {
              return n.id;
            }),
            b
          );
        })(),
        r = { title: 'APP.PREVIEW.TITLE' },
        s = (function() {
          return function() {};
        })(),
        p = l('t68o'),
        f = l('zbXB'),
        h = l('xYTU'),
        k = l('NcP4'),
        v = l('X8zA'),
        w = l('pMnS'),
        g = l('r+ED'),
        m = l('svO3'),
        y = l('imyJ'),
        F = l('uz5q'),
        j = l('lvTT'),
        L = l('51Df'),
        G = l('Yu7m'),
        O = l('GBPc'),
        I = l('NqzU'),
        T = l('jIHR'),
        A = l('D4Cx'),
        B = l('6y8O'),
        S = l('XElP'),
        z = l('x8au'),
        x = l('FL8s'),
        P = l('j77G'),
        U = l('160I'),
        X = l('JRp+'),
        E = l('THUI'),
        J = l('/V+7'),
        N = l('c2Vd'),
        R = l('zUUG'),
        V = l('reJ9'),
        D = l('qbwy'),
        H = l('ph/j'),
        W = l('AHN1'),
        q = l('Ip0R'),
        C = l('ZYCi'),
        K = l('yGQT'),
        M = c.Eb({
          encapsulation: 2,
          styles: [
            [
              '.app-shared-link-view{width:100%;height:100%}.app-shared-link-view .adf-viewer-toolbar .adf-toolbar-divider{display:none}'
            ]
          ],
          data: {}
        });
      function Y(b) {
        return c.gc(
          0,
          [
            (b()(),
            c.Gb(
              0,
              0,
              null,
              null,
              2,
              null,
              null,
              null,
              null,
              null,
              null,
              null
            )),
            (b()(),
            c.Gb(
              1,
              0,
              null,
              null,
              1,
              'aca-toolbar-action',
              [['class', 'aca-toolbar-action']],
              null,
              null,
              null,
              T.c,
              T.a
            )),
            c.Fb(
              2,
              311296,
              null,
              0,
              D.a,
              [c.h],
              { actionRef: [0, 'actionRef'] },
              null
            )
          ],
          function(b, n) {
            b(n, 2, 0, n.context.$implicit);
          },
          null
        );
      }
      function Z(b) {
        return c.gc(
          0,
          [
            (b()(),
            c.Gb(
              0,
              0,
              null,
              null,
              10,
              null,
              null,
              null,
              null,
              null,
              null,
              null
            )),
            (b()(),
            c.Gb(
              1,
              0,
              null,
              null,
              9,
              'adf-viewer',
              [['class', 'adf-viewer']],
              null,
              [['document', 'keyup']],
              function(b, n, l) {
                var a = !0;
                return (
                  'document:keyup' === n &&
                    (a = !1 !== c.Sb(b, 2).handleKeyboardEvent(l) && a),
                  a
                );
              },
              g.Ib,
              g.cb
            )),
            c.Fb(
              2,
              770048,
              null,
              4,
              H.Zd,
              [H.f, H.Yd, H.Bc, W.a, c.m],
              {
                sharedLinkId: [0, 'sharedLinkId'],
                allowGoBack: [1, 'allowGoBack'],
                allowDownload: [2, 'allowDownload'],
                allowPrint: [3, 'allowPrint'],
                allowFullScreen: [4, 'allowFullScreen']
              },
              null
            ),
            c.bc(335544320, 1, { toolbar: 0 }),
            c.bc(335544320, 2, { sidebar: 0 }),
            c.bc(335544320, 3, { mnuOpenWith: 0 }),
            c.bc(335544320, 4, { mnuMoreActions: 0 }),
            (b()(),
            c.Gb(
              7,
              0,
              null,
              1,
              3,
              'adf-viewer-toolbar-actions',
              [['class', 'adf-viewer-toolbar-actions']],
              null,
              null,
              null,
              g.Lb,
              g.fb
            )),
            c.Fb(8, 49152, null, 0, H.ee, [], null, null),
            (b()(), c.sb(16777216, null, 0, 1, null, Y)),
            c.Fb(
              10,
              278528,
              null,
              0,
              q.m,
              [c.W, c.T, c.x],
              { ngForOf: [0, 'ngForOf'], ngForTrackBy: [1, 'ngForTrackBy'] },
              null
            )
          ],
          function(b, n) {
            var l = n.component;
            b(n, 2, 0, l.sharedLinkId, !1, !1, !1, !1),
              b(n, 10, 0, l.viewerToolbarActions, l.trackByActionId);
          },
          null
        );
      }
      function $(b) {
        return c.gc(
          0,
          [
            (b()(), c.sb(16777216, null, null, 1, null, Z)),
            c.Fb(
              1,
              16384,
              null,
              0,
              q.n,
              [c.W, c.T],
              { ngIf: [0, 'ngIf'] },
              null
            )
          ],
          function(b, n) {
            b(n, 1, 0, n.component.sharedLinkId);
          },
          null
        );
      }
      function _(b) {
        return c.gc(
          0,
          [
            (b()(),
            c.Gb(
              0,
              0,
              null,
              null,
              1,
              'app-shared-link-view',
              [['class', 'app-shared-link-view']],
              null,
              null,
              null,
              $,
              M
            )),
            c.Fb(1, 114688, null, 0, d, [C.a, K.l, o.a, H.f], null, null)
          ],
          function(b, n) {
            b(n, 1, 0);
          },
          null
        );
      }
      var bb = c.xb('app-shared-link-view', d, _, {}, {}, []),
        nb = l('eDkP'),
        lb = l('Fzqc'),
        cb = l('4tE/'),
        ab = l('M2Lx'),
        Qb = l('Wf4p'),
        eb = l('o3x0'),
        ub = l('jQLj'),
        ib = l('dWZg'),
        tb = l('uGex'),
        ob = l('ZYjt'),
        db = l('mVsa'),
        rb = l('v9Dh'),
        sb = l('UyM+'),
        pb = l('A7o+'),
        fb = l('SMsm'),
        hb = l('gIcY'),
        kb = l('OzfB'),
        vb = l('t/Na'),
        wb = l('lLAP'),
        gb = l('OBdK'),
        mb = l('4c35'),
        yb = l('qAlS'),
        Fb = l('UodH'),
        jb = l('FVSy'),
        Lb = l('de3e'),
        Gb = l('/dO6'),
        Ob = l('r43C'),
        Ib = l('/VYK'),
        Tb = l('seP3'),
        Ab = l('b716'),
        Bb = l('LC5p'),
        Sb = l('0/Q6'),
        zb = l('Blfk'),
        xb = l('9It4'),
        Pb = l('kWGw'),
        Ub = l('y4qS'),
        Xb = l('BHnd'),
        Eb = l('La40'),
        Jb = l('Z+uX'),
        Nb = l('Nsh5'),
        Rb = l('vARd'),
        Vb = l('8mMr'),
        Db = l('YhbO'),
        Hb = l('jlZm'),
        Wb = l('21Lb'),
        qb = l('hUWP'),
        Cb = l('3pJQ'),
        Kb = l('V9q+'),
        Mb = l('FUS3'),
        Yb = l('bXg9'),
        Zb = l('0ppU'),
        $b = l('zzB2'),
        _b = l('aU+q'),
        bn = l('vvyD'),
        nn = l('w+lc'),
        ln = l('J12g'),
        cn = l('c1yi'),
        an = l('zsjv'),
        Qn = l('YSh2');
      l.d(n, 'AppSharedLinkViewModuleNgFactory', function() {
        return en;
      });
      var en = c.zb(s, [], function(b) {
        return c.Pb([
          c.Qb(512, c.k, c.kb, [
            [
              8,
              [
                p.a,
                f.b,
                f.a,
                h.a,
                h.b,
                k.a,
                v.a,
                w.a,
                g.Nb,
                g.l,
                g.Ob,
                g.t,
                g.e,
                g.f,
                g.h,
                g.j,
                g.i,
                g.g,
                g.d,
                g.x,
                g.mb,
                g.ib,
                g.m,
                g.kb,
                g.F,
                g.k,
                g.E,
                g.v,
                g.A,
                g.H,
                g.r,
                g.nb,
                g.lb,
                g.z,
                g.G,
                g.q,
                g.b,
                g.w,
                g.n,
                g.u,
                g.c,
                g.jb,
                g.hb,
                g.y,
                g.s,
                g.p,
                g.o,
                g.B,
                g.a,
                g.C,
                g.D,
                m.a,
                y.a,
                F.a,
                j.a,
                L.a,
                G.a,
                O.a,
                I.b,
                T.b,
                A.b,
                B.b,
                S.a,
                z.a,
                x.a,
                P.a,
                U.a,
                X.a,
                E.a,
                J.a,
                N.a,
                R.a,
                V.a,
                bb
              ]
            ],
            [3, c.k],
            c.D
          ]),
          c.Qb(4608, q.p, q.o, [c.z, [2, q.D]]),
          c.Qb(4608, nb.c, nb.c, [
            nb.i,
            nb.e,
            c.k,
            nb.h,
            nb.f,
            c.v,
            c.F,
            q.d,
            lb.c,
            [2, q.j]
          ]),
          c.Qb(5120, nb.j, nb.k, [nb.c]),
          c.Qb(5120, cb.b, cb.c, [nb.c]),
          c.Qb(4608, ab.c, ab.c, []),
          c.Qb(4608, Qb.b, Qb.b, []),
          c.Qb(5120, eb.c, eb.d, [nb.c]),
          c.Qb(135680, eb.e, eb.e, [
            nb.c,
            c.v,
            [2, q.j],
            [2, eb.b],
            eb.c,
            [3, eb.e],
            nb.e
          ]),
          c.Qb(4608, ub.i, ub.i, []),
          c.Qb(5120, ub.a, ub.b, [nb.c]),
          c.Qb(4608, Qb.a, Qb.x, [[2, Qb.f], ib.a]),
          c.Qb(5120, tb.a, tb.b, [nb.c]),
          c.Qb(4608, ob.f, Qb.c, [[2, Qb.g], [2, Qb.l]]),
          c.Qb(5120, db.b, db.g, [nb.c]),
          c.Qb(5120, rb.b, rb.c, [nb.c]),
          c.Qb(4608, sb.a, sb.n, [[2, Qb.f], Qb.a]),
          c.Qb(4608, pb.g, pb.f, []),
          c.Qb(4608, pb.c, pb.e, []),
          c.Qb(4608, pb.i, pb.d, []),
          c.Qb(4608, pb.b, pb.a, []),
          c.Qb(4608, pb.k, pb.k, [pb.l, pb.g, pb.c, pb.i, pb.b, pb.m, pb.n]),
          c.Qb(4608, H.Rb, H.Rb, [H.Md]),
          c.Qb(4608, H.cc, H.cc, [H.dc]),
          c.Qb(135680, H.Gd, H.Gd, [H.Xd, H.l]),
          c.Qb(4608, H.Fd, H.Fd, [H.f, fb.d, ob.c]),
          c.Qb(4608, H.Lc, H.Lc, [H.Fd]),
          c.Qb(4608, H.sc, H.sc, [ob.c]),
          c.Qb(4608, H.Tc, H.Tc, []),
          c.Qb(4608, H.te, H.te, []),
          c.Qb(4608, H.ue, H.ue, []),
          c.Qb(4608, H.Nc, H.Nc, []),
          c.Qb(135680, H.yc, H.yc, [H.Xd, H.l]),
          c.Qb(135680, H.tb, H.tb, [H.Xd, H.l]),
          c.Qb(4608, H.P, H.P, [q.d, H.Bc, H.Xc]),
          c.Qb(4608, hb.z, hb.z, []),
          c.Qb(4608, hb.e, hb.e, []),
          c.Qb(
            5120,
            c.b,
            function(b, n) {
              return [kb.j(b, n)];
            },
            [q.d, c.H]
          ),
          c.Qb(4608, vb.i, vb.o, [q.d, c.H, vb.m]),
          c.Qb(4608, vb.p, vb.p, [vb.i, vb.n]),
          c.Qb(
            5120,
            vb.a,
            function(b) {
              return [b];
            },
            [vb.p]
          ),
          c.Qb(4608, vb.l, vb.l, []),
          c.Qb(6144, vb.j, null, [vb.l]),
          c.Qb(4608, vb.h, vb.h, [vb.j]),
          c.Qb(6144, vb.b, null, [vb.h]),
          c.Qb(4608, vb.f, vb.k, [vb.b, c.v]),
          c.Qb(4608, vb.c, vb.c, [vb.f]),
          c.Qb(135680, wb.h, wb.h, [c.F, ib.a]),
          c.Qb(4608, gb.f, gb.f, [c.T]),
          c.Qb(1073742336, q.c, q.c, []),
          c.Qb(1073742336, pb.h, pb.h, []),
          c.Qb(1073742336, W.h, W.h, []),
          c.Qb(1073742336, lb.a, lb.a, []),
          c.Qb(1073742336, Qb.l, Qb.l, [[2, Qb.d], [2, ob.g]]),
          c.Qb(1073742336, ib.b, ib.b, []),
          c.Qb(1073742336, Qb.w, Qb.w, []),
          c.Qb(1073742336, Qb.u, Qb.u, []),
          c.Qb(1073742336, Qb.r, Qb.r, []),
          c.Qb(1073742336, mb.g, mb.g, []),
          c.Qb(1073742336, yb.c, yb.c, []),
          c.Qb(1073742336, nb.g, nb.g, []),
          c.Qb(1073742336, cb.e, cb.e, []),
          c.Qb(1073742336, Fb.c, Fb.c, []),
          c.Qb(1073742336, jb.f, jb.f, []),
          c.Qb(1073742336, ab.d, ab.d, []),
          c.Qb(1073742336, Lb.c, Lb.c, []),
          c.Qb(1073742336, Gb.e, Gb.e, []),
          c.Qb(1073742336, eb.k, eb.k, []),
          c.Qb(1073742336, wb.a, wb.a, []),
          c.Qb(1073742336, ub.j, ub.j, []),
          c.Qb(1073742336, Qb.n, Qb.n, []),
          c.Qb(1073742336, Ob.a, Ob.a, []),
          c.Qb(1073742336, fb.c, fb.c, []),
          c.Qb(1073742336, Ib.c, Ib.c, []),
          c.Qb(1073742336, Tb.e, Tb.e, []),
          c.Qb(1073742336, Ab.c, Ab.c, []),
          c.Qb(1073742336, Bb.b, Bb.b, []),
          c.Qb(1073742336, Sb.d, Sb.d, []),
          c.Qb(1073742336, Qb.y, Qb.y, []),
          c.Qb(1073742336, Qb.o, Qb.o, []),
          c.Qb(1073742336, zb.c, zb.c, []),
          c.Qb(1073742336, xb.c, xb.c, []),
          c.Qb(1073742336, tb.d, tb.d, []),
          c.Qb(1073742336, Pb.c, Pb.c, []),
          c.Qb(1073742336, Ub.p, Ub.p, []),
          c.Qb(1073742336, Xb.m, Xb.m, []),
          c.Qb(1073742336, Eb.k, Eb.k, []),
          c.Qb(1073742336, db.e, db.e, []),
          c.Qb(1073742336, Jb.c, Jb.c, []),
          c.Qb(1073742336, Nb.h, Nb.h, []),
          c.Qb(1073742336, Rb.e, Rb.e, []),
          c.Qb(1073742336, Vb.b, Vb.b, []),
          c.Qb(1073742336, rb.e, rb.e, []),
          c.Qb(1073742336, sb.i, sb.i, []),
          c.Qb(1073742336, sb.o, sb.o, []),
          c.Qb(1073742336, sb.m, sb.m, []),
          c.Qb(1073742336, Db.c, Db.c, []),
          c.Qb(1073742336, Hb.d, Hb.d, []),
          c.Qb(1073742336, H.pe, H.pe, []),
          c.Qb(1073742336, C.u, C.u, [[2, C.B], [2, C.q]]),
          c.Qb(1073742336, H.ab, H.ab, []),
          c.Qb(1073742336, H.kd, H.kd, []),
          c.Qb(1073742336, H.vb, H.vb, []),
          c.Qb(1073742336, H.O, H.O, []),
          c.Qb(1073742336, H.lb, H.lb, []),
          c.Qb(1073742336, H.hb, H.hb, []),
          c.Qb(1073742336, H.d, H.d, []),
          c.Qb(1073742336, hb.x, hb.x, []),
          c.Qb(1073742336, hb.l, hb.l, []),
          c.Qb(1073742336, hb.u, hb.u, []),
          c.Qb(1073742336, H.Jd, H.Jd, []),
          c.Qb(1073742336, kb.c, kb.c, []),
          c.Qb(1073742336, Wb.e, Wb.e, []),
          c.Qb(1073742336, qb.d, qb.d, []),
          c.Qb(1073742336, Cb.a, Cb.a, []),
          c.Qb(1073742336, Kb.a, Kb.a, [[2, kb.g], c.H]),
          c.Qb(1073742336, H.ae, H.ae, []),
          c.Qb(1073742336, H.vd, H.vd, []),
          c.Qb(1073742336, H.ub, H.ub, []),
          c.Qb(1073742336, H.fc, H.fc, []),
          c.Qb(1073742336, H.Vd, H.Vd, []),
          c.Qb(1073742336, vb.e, vb.e, []),
          c.Qb(1073742336, vb.d, vb.d, []),
          c.Qb(1073742336, H.j, H.j, []),
          c.Qb(1073742336, H.ed, H.ed, []),
          c.Qb(1073742336, H.G, H.G, []),
          c.Qb(1073742336, H.Kb, H.Kb, []),
          c.Qb(1073742336, H.Ub, H.Ub, []),
          c.Qb(1073742336, H.U, H.U, []),
          c.Qb(1073742336, H.Hc, H.Hc, []),
          c.Qb(1073742336, H.wc, H.wc, []),
          c.Qb(1073742336, H.pc, H.pc, []),
          c.Qb(1073742336, H.s, H.s, []),
          c.Qb(1073742336, H.Cd, H.Cd, []),
          c.Qb(1073742336, H.ic, H.ic, []),
          c.Qb(1073742336, H.yd, H.yd, []),
          c.Qb(1073742336, H.Wc, H.Wc, []),
          c.Qb(1073742336, H.sd, H.sd, []),
          c.Qb(1073742336, H.db, H.db, [H.Md]),
          c.Qb(1073742336, Mb.a, Mb.a, []),
          c.Qb(1073742336, Yb.a, Yb.a, []),
          c.Qb(1073742336, Zb.a, Zb.a, []),
          c.Qb(1073742336, $b.a, $b.a, []),
          c.Qb(1073742336, _b.a, _b.a, [W.g]),
          c.Qb(1073742336, bn.a, bn.a, []),
          c.Qb(1073742336, nn.b, nn.b, []),
          c.Qb(1073742336, gb.d, gb.d, []),
          c.Qb(1073742336, ln.b, ln.b, []),
          c.Qb(1073742336, cn.Jb, cn.Jb, []),
          c.Qb(1073742336, cn.m, cn.m, []),
          c.Qb(1073742336, cn.Bb, cn.Bb, []),
          c.Qb(1073742336, cn.Fb, cn.Fb, []),
          c.Qb(1073742336, an.a, an.a, []),
          c.Qb(1073742336, s, s, []),
          c.Qb(256, Gb.a, { separatorKeyCodes: [Qn.f] }, []),
          c.Qb(256, eb.b, bn.b, []),
          c.Qb(256, Qb.e, Qb.i, []),
          c.Qb(256, sb.b, sb.c, []),
          c.Qb(256, pb.n, void 0, []),
          c.Qb(256, pb.m, void 0, []),
          c.Qb(256, vb.m, 'XSRF-TOKEN', []),
          c.Qb(256, vb.n, 'X-XSRF-TOKEN', []),
          c.Qb(
            1024,
            C.o,
            function() {
              return [[{ path: '', component: d, data: r }]];
            },
            []
          )
        ]);
      });
    }
  }
]);
