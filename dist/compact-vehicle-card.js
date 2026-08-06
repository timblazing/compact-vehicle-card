/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const q = globalThis, oe = q.ShadowRoot && (q.ShadyCSS === void 0 || q.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, se = Symbol(), ke = /* @__PURE__ */ new WeakMap();
let We = class {
  constructor(e, t, n) {
    if (this._$cssResult$ = !0, n !== se) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (oe && e === void 0) {
      const n = t !== void 0 && t.length === 1;
      n && (e = ke.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && ke.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Je = (o) => new We(typeof o == "string" ? o : o + "", void 0, se), je = (o, ...e) => {
  const t = o.length === 1 ? o[0] : e.reduce((n, i, s) => n + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + o[s + 1], o[0]);
  return new We(t, o, se);
}, Qe = (o, e) => {
  if (oe) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const n = document.createElement("style"), i = q.litNonce;
    i !== void 0 && n.setAttribute("nonce", i), n.textContent = t.cssText, o.appendChild(n);
  }
}, Ae = oe ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const n of e.cssRules) t += n.cssText;
  return Je(t);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: et, defineProperty: tt, getOwnPropertyDescriptor: nt, getOwnPropertyNames: it, getOwnPropertySymbols: ot, getPrototypeOf: st } = Object, b = globalThis, Ee = b.trustedTypes, rt = Ee ? Ee.emptyScript : "", Z = b.reactiveElementPolyfillSupport, N = (o, e) => o, K = { toAttribute(o, e) {
  switch (e) {
    case Boolean:
      o = o ? rt : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, e) {
  let t = o;
  switch (e) {
    case Boolean:
      t = o !== null;
      break;
    case Number:
      t = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(o);
      } catch {
        t = null;
      }
  }
  return t;
} }, re = (o, e) => !et(o, e), Se = { attribute: !0, type: String, converter: K, reflect: !1, useDefault: !1, hasChanged: re };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), b.litPropertyMetadata ?? (b.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let T = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Se) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const n = Symbol(), i = this.getPropertyDescriptor(e, n, t);
      i !== void 0 && tt(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, n) {
    const { get: i, set: s } = nt(this.prototype, e) ?? { get() {
      return this[t];
    }, set(r) {
      this[t] = r;
    } };
    return { get: i, set(r) {
      const a = i == null ? void 0 : i.call(this);
      s == null || s.call(this, r), this.requestUpdate(e, a, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Se;
  }
  static _$Ei() {
    if (this.hasOwnProperty(N("elementProperties"))) return;
    const e = st(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(N("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(N("properties"))) {
      const t = this.properties, n = [...it(t), ...ot(t)];
      for (const i of n) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [n, i] of t) this.elementProperties.set(n, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, n] of this.elementProperties) {
      const i = this._$Eu(t, n);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const n = new Set(e.flat(1 / 0).reverse());
      for (const i of n) t.unshift(Ae(i));
    } else e !== void 0 && t.push(Ae(e));
    return t;
  }
  static _$Eu(e, t) {
    const n = t.attribute;
    return n === !1 ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Qe(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var n;
      return (n = t.hostConnected) == null ? void 0 : n.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var n;
      return (n = t.hostDisconnected) == null ? void 0 : n.call(t);
    });
  }
  attributeChangedCallback(e, t, n) {
    this._$AK(e, n);
  }
  _$ET(e, t) {
    var s;
    const n = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, n);
    if (i !== void 0 && n.reflect === !0) {
      const r = (((s = n.converter) == null ? void 0 : s.toAttribute) !== void 0 ? n.converter : K).toAttribute(t, n.type);
      this._$Em = e, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var s, r;
    const n = this.constructor, i = n._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const a = n.getPropertyOptions(i), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((s = a.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? a.converter : K;
      this._$Em = i;
      const u = l.fromAttribute(t, a.type);
      this[i] = u ?? ((r = this._$Ej) == null ? void 0 : r.get(i)) ?? u, this._$Em = null;
    }
  }
  requestUpdate(e, t, n, i = !1, s) {
    var r;
    if (e !== void 0) {
      const a = this.constructor;
      if (i === !1 && (s = this[e]), n ?? (n = a.getPropertyOptions(e)), !((n.hasChanged ?? re)(s, t) || n.useDefault && n.reflect && s === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(a._$Eu(e, n)))) return;
      this.C(e, t, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: n, reflect: i, wrapped: s }, r) {
    n && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, r ?? t ?? this[e]), s !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var n;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [s, r] of this._$Ep) this[s] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, r] of i) {
        const { wrapped: a } = r, l = this[s];
        a !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, r, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (n = this._$EO) == null || n.forEach((i) => {
        var s;
        return (s = i.hostUpdate) == null ? void 0 : s.call(i);
      }), this.update(t)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((n) => {
      var i;
      return (i = n.hostUpdated) == null ? void 0 : i.call(n);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[N("elementProperties")] = /* @__PURE__ */ new Map(), T[N("finalized")] = /* @__PURE__ */ new Map(), Z == null || Z({ ReactiveElement: T }), (b.reactiveElementVersions ?? (b.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, Ce = (o) => o, G = H.trustedTypes, Te = G ? G.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, Ve = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, Be = "?" + $, at = `<${Be}>`, E = document, I = () => E.createComment(""), D = (o) => o === null || typeof o != "object" && typeof o != "function", ae = Array.isArray, lt = (o) => ae(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", J = `[ 	
\f\r]`, M = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Pe = /-->/g, Oe = />/g, x = RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ue = /'/g, Le = /"/g, Fe = /^(?:script|style|textarea|title)$/i, ct = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), y = ct(1), O = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), Re = /* @__PURE__ */ new WeakMap(), k = E.createTreeWalker(E, 129);
function qe(o, e) {
  if (!ae(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Te !== void 0 ? Te.createHTML(e) : e;
}
const dt = (o, e) => {
  const t = o.length - 1, n = [];
  let i, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = M;
  for (let a = 0; a < t; a++) {
    const l = o[a];
    let u, h, c = -1, p = 0;
    for (; p < l.length && (r.lastIndex = p, h = r.exec(l), h !== null); ) p = r.lastIndex, r === M ? h[1] === "!--" ? r = Pe : h[1] !== void 0 ? r = Oe : h[2] !== void 0 ? (Fe.test(h[2]) && (i = RegExp("</" + h[2], "g")), r = x) : h[3] !== void 0 && (r = x) : r === x ? h[0] === ">" ? (r = i ?? M, c = -1) : h[1] === void 0 ? c = -2 : (c = r.lastIndex - h[2].length, u = h[1], r = h[3] === void 0 ? x : h[3] === '"' ? Le : Ue) : r === Le || r === Ue ? r = x : r === Pe || r === Oe ? r = M : (r = x, i = void 0);
    const f = r === x && o[a + 1].startsWith("/>") ? " " : "";
    s += r === M ? l + at : c >= 0 ? (n.push(u), l.slice(0, c) + Ve + l.slice(c) + $ + f) : l + $ + (c === -2 ? a : f);
  }
  return [qe(o, s + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), n];
};
class z {
  constructor({ strings: e, _$litType$: t }, n) {
    let i;
    this.parts = [];
    let s = 0, r = 0;
    const a = e.length - 1, l = this.parts, [u, h] = dt(e, t);
    if (this.el = z.createElement(u, n), k.currentNode = this.el.content, t === 2 || t === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = k.nextNode()) !== null && l.length < a; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(Ve)) {
          const p = h[r++], f = i.getAttribute(c).split($), d = /([.?@])?(.*)/.exec(p);
          l.push({ type: 1, index: s, name: d[2], strings: f, ctor: d[1] === "." ? ht : d[1] === "?" ? _t : d[1] === "@" ? pt : X }), i.removeAttribute(c);
        } else c.startsWith($) && (l.push({ type: 6, index: s }), i.removeAttribute(c));
        if (Fe.test(i.tagName)) {
          const c = i.textContent.split($), p = c.length - 1;
          if (p > 0) {
            i.textContent = G ? G.emptyScript : "";
            for (let f = 0; f < p; f++) i.append(c[f], I()), k.nextNode(), l.push({ type: 2, index: ++s });
            i.append(c[p], I());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Be) l.push({ type: 2, index: s });
      else {
        let c = -1;
        for (; (c = i.data.indexOf($, c + 1)) !== -1; ) l.push({ type: 7, index: s }), c += $.length - 1;
      }
      s++;
    }
  }
  static createElement(e, t) {
    const n = E.createElement("template");
    return n.innerHTML = e, n;
  }
}
function U(o, e, t = o, n) {
  var r, a;
  if (e === O) return e;
  let i = n !== void 0 ? (r = t._$Co) == null ? void 0 : r[n] : t._$Cl;
  const s = D(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== s && ((a = i == null ? void 0 : i._$AO) == null || a.call(i, !1), s === void 0 ? i = void 0 : (i = new s(o), i._$AT(o, t, n)), n !== void 0 ? (t._$Co ?? (t._$Co = []))[n] = i : t._$Cl = i), i !== void 0 && (e = U(o, i._$AS(o, e.values), i, n)), e;
}
class ut {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: n } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? E).importNode(t, !0);
    k.currentNode = i;
    let s = k.nextNode(), r = 0, a = 0, l = n[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let u;
        l.type === 2 ? u = new W(s, s.nextSibling, this, e) : l.type === 1 ? u = new l.ctor(s, l.name, l.strings, this, e) : l.type === 6 && (u = new ft(s, this, e)), this._$AV.push(u), l = n[++a];
      }
      r !== (l == null ? void 0 : l.index) && (s = k.nextNode(), r++);
    }
    return k.currentNode = E, i;
  }
  p(e) {
    let t = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(e, n, t), t += n.strings.length - 2) : n._$AI(e[t])), t++;
  }
}
class W {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, n, i) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = U(this, e, t), D(e) ? e === _ || e == null || e === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : e !== this._$AH && e !== O && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : lt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== _ && D(this._$AH) ? this._$AA.nextSibling.data = e : this.T(E.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var s;
    const { values: t, _$litType$: n } = e, i = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = z.createElement(qe(n.h, n.h[0]), this.options)), n);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === i) this._$AH.p(t);
    else {
      const r = new ut(i, this), a = r.u(this.options);
      r.p(t), this.T(a), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = Re.get(e.strings);
    return t === void 0 && Re.set(e.strings, t = new z(e)), t;
  }
  k(e) {
    ae(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let n, i = 0;
    for (const s of e) i === t.length ? t.push(n = new W(this.O(I()), this.O(I()), this, this.options)) : n = t[i], n._$AI(s), i++;
    i < t.length && (this._$AR(n && n._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var n;
    for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, t); e !== this._$AB; ) {
      const i = Ce(e).nextSibling;
      Ce(e).remove(), e = i;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class X {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, n, i, s) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = s, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = _;
  }
  _$AI(e, t = this, n, i) {
    const s = this.strings;
    let r = !1;
    if (s === void 0) e = U(this, e, t, 0), r = !D(e) || e !== this._$AH && e !== O, r && (this._$AH = e);
    else {
      const a = e;
      let l, u;
      for (e = s[0], l = 0; l < s.length - 1; l++) u = U(this, a[n + l], t, l), u === O && (u = this._$AH[l]), r || (r = !D(u) || u !== this._$AH[l]), u === _ ? e = _ : e !== _ && (e += (u ?? "") + s[l + 1]), this._$AH[l] = u;
    }
    r && !i && this.j(e);
  }
  j(e) {
    e === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ht extends X {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === _ ? void 0 : e;
  }
}
class _t extends X {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== _);
  }
}
class pt extends X {
  constructor(e, t, n, i, s) {
    super(e, t, n, i, s), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = U(this, e, t, 0) ?? _) === O) return;
    const n = this._$AH, i = e === _ && n !== _ || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, s = e !== _ && (n === _ || i);
    i && this.element.removeEventListener(this.name, this, n), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ft {
  constructor(e, t, n) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    U(this, e);
  }
}
const Q = H.litHtmlPolyfillSupport;
Q == null || Q(z, W), (H.litHtmlVersions ?? (H.litHtmlVersions = [])).push("3.3.3");
const gt = (o, e, t) => {
  const n = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = n._$litPart$;
  if (i === void 0) {
    const s = (t == null ? void 0 : t.renderBefore) ?? null;
    n._$litPart$ = i = new W(e.insertBefore(I(), s), s, void 0, t ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A = globalThis;
class P extends T {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = gt(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return O;
  }
}
var ze;
P._$litElement$ = !0, P.finalized = !0, (ze = A.litElementHydrateSupport) == null || ze.call(A, { LitElement: P });
const ee = A.litElementPolyfillSupport;
ee == null || ee({ LitElement: P });
(A.litElementVersions ?? (A.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mt = { attribute: !0, type: String, converter: K, reflect: !1, hasChanged: re }, yt = (o = mt, e, t) => {
  const { kind: n, metadata: i } = t;
  let s = globalThis.litPropertyMetadata.get(i);
  if (s === void 0 && globalThis.litPropertyMetadata.set(i, s = /* @__PURE__ */ new Map()), n === "setter" && ((o = Object.create(o)).wrapped = !0), s.set(t.name, o), n === "accessor") {
    const { name: r } = t;
    return { set(a) {
      const l = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(r, l, o, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(r, void 0, o, a), a;
    } };
  }
  if (n === "setter") {
    const { name: r } = t;
    return function(a) {
      const l = this[r];
      e.call(this, a), this.requestUpdate(r, l, o, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function le(o) {
  return (e, t) => typeof t == "object" ? yt(o, e, t) : ((n, i, s) => {
    const r = i.hasOwnProperty(s);
    return i.constructor.createProperty(s, n), r ? Object.getOwnPropertyDescriptor(i, s) : void 0;
  })(o, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Y(o) {
  return le({ ...o, state: !0, attribute: !1 });
}
const ce = "compact-vehicle-card", Ke = "compact-vehicle-card-editor", vt = "mdi:car", wt = "Vehicle", de = "-", Ge = 15, $t = /* @__PURE__ */ new Set([
  "ok",
  "normal",
  "closed",
  "locked",
  "off",
  "false",
  "clear",
  "good",
  "full",
  "no",
  "none",
  "secured",
  "no_problem",
  "no problem",
  "not_running",
  "not running",
  "stopped",
  "parked"
]), j = /* @__PURE__ */ new Set(["unknown", "unavailable", "none", ""]), Xe = ["sensor", "binary_sensor", "lock", "cover", "switch"], bt = {
  engine: ["engine_status", "engine_state", "engine", "engine_running"],
  lock: ["lock", "door_lock", "locked", "central_lock"],
  odometer: ["odometer", "mileage", "odometer_value"],
  range: ["distance_to_empty_tank", "range", "distance_to_empty", "fuel_range"],
  fuel_level: ["fuel_level", "fuel_percentage", "fuel_percent", "tank_level"],
  fuel_amount: ["fuel_amount", "fuel_volume"],
  fuel_capacity: ["fuel_capacity", "fuel_tank_capacity", "tank_capacity"],
  sunroof: ["sunroof", "sun_roof", "moonroof"],
  tailgate: ["tailgate", "trunk", "boot", "liftgate"],
  hood: ["hood", "bonnet", "front_hood"],
  oil: ["oil_level", "engine_oil_level", "oil"],
  brake_fluid: ["brake_fluid", "brake_fluid_level"],
  coolant: ["coolant_level", "coolant", "engine_coolant_level"],
  washer_fluid: ["washer_fluid", "washer_fluid_level", "windshield_washer_fluid"]
}, xt = {
  doors: [
    "door_front_left",
    "door_front_right",
    "door_rear_left",
    "door_rear_right",
    "front_left_door",
    "front_right_door",
    "rear_left_door",
    "rear_right_door"
  ],
  windows: [
    "window_front_left",
    "window_front_right",
    "window_rear_left",
    "window_rear_right",
    "front_left_window",
    "front_right_window",
    "rear_left_window",
    "rear_right_window"
  ],
  tires: [
    "tire_front_left",
    "tire_front_right",
    "tire_rear_left",
    "tire_rear_right",
    "tyre_front_left",
    "tyre_front_right",
    "tyre_rear_left",
    "tyre_rear_right",
    "front_left_tire_pressure",
    "front_right_tire_pressure",
    "rear_left_tire_pressure",
    "rear_right_tire_pressure"
  ]
}, kt = {
  odometer: "mdi:counter",
  fuel: "mdi:gas-station",
  range: "mdi:map-marker-distance",
  doors: "mdi:car-door",
  windows: "mdi:car-door",
  sunroof: "mdi:car-select",
  tailgate: "mdi:car-back",
  hood: "mdi:car",
  tires: "mdi:car-tire-alert",
  oil: "mdi:oil-level",
  brake_fluid: "mdi:car-brake-fluid-level",
  coolant: "mdi:car-coolant-level",
  washer_fluid: "mdi:wiper-wash"
};
function ue(o, e = {}) {
  const t = At(o);
  return e.invert && t !== "unknown" ? t === "ok" ? "problem" : "ok" : t;
}
function At(o) {
  if (!o) return "unknown";
  const e = o.state;
  if (e == null || j.has(e.toLowerCase())) return "unknown";
  const t = o.entity_id.split(".")[0];
  return t === "binary_sensor" ? e === "on" ? "problem" : "ok" : t === "lock" ? e === "locked" ? "ok" : "problem" : $t.has(e.toLowerCase()) ? "ok" : "problem";
}
function Et(o) {
  return !o || j.has(o.state.toLowerCase());
}
function St(o) {
  return typeof o == "string" ? { entity: o } : o;
}
function Ct(o, e, t, n) {
  if (o.name) return o.name;
  const i = e[o.entity];
  let s = (i == null ? void 0 : i.attributes.friendly_name) ?? o.entity.split(".")[1] ?? o.entity;
  if (t && s.toLowerCase().startsWith(t.toLowerCase()) && (s = s.slice(t.length).trim()), n) {
    const r = n.toLowerCase(), a = s.toLowerCase();
    a.startsWith(r + " ") ? s = s.slice(r.length + 1) : a.endsWith(" " + r) && (s = s.slice(0, s.length - r.length - 1));
  }
  return s = s.replace(/_/g, " ").trim(), s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : o.entity;
}
function Tt(o, e, t, n) {
  var u, h;
  const i = t.unknownValue ?? de;
  if (o.length === 0)
    return { status: "unknown", text: "", offenders: [], targetEntity: null };
  const s = o.map((c, p) => ({
    ref: c,
    name: (n == null ? void 0 : n[p]) ?? c.name ?? c.entity,
    state: ue(e[c.entity], { invert: c.invert })
  })), r = s.filter((c) => c.state === "problem"), a = s.filter((c) => c.state === "unknown"), l = ((u = o[0]) == null ? void 0 : u.entity) ?? null;
  if (r.length > 0) {
    const c = r.map((f) => f.name);
    let p;
    if (r.length === 1)
      p = `${c[0]} ${t.problemVerb}`;
    else if (r.length <= 3) {
      const [f, ...d] = c;
      p = `${f}, ${d.map((w) => w.toLowerCase()).join(", ")} ${t.problemVerb}`;
    } else
      p = `${r.length} ${t.problemVerb}`;
    return {
      status: "problem",
      text: p,
      offenders: c,
      targetEntity: ((h = r[0]) == null ? void 0 : h.ref.entity) ?? l
    };
  }
  return a.length > 0 ? { status: "unknown", text: i, offenders: [], targetEntity: l } : { status: "ok", text: t.allOk, offenders: [], targetEntity: l };
}
function Pt(o, e, t, n) {
  if (e) {
    const i = te(o[e]);
    if (i !== null) return Me(i);
  }
  if (t && n) {
    const i = te(o[t]), s = te(o[n]);
    if (i !== null && s !== null && s > 0)
      return Me(i / s * 100);
  }
  return null;
}
function te(o) {
  if (!o || j.has(o.state.toLowerCase())) return null;
  const e = Number(o.state);
  return Number.isFinite(e) ? e : null;
}
function Me(o) {
  return Math.min(100, Math.max(0, Math.round(o)));
}
function Ne(o, e) {
  const t = (s) => s.filter(
    (r) => r.refs.some((a) => ue(e[a.entity], { invert: a.invert }) === "problem")
  ).map((r) => r.label), n = t(o.maintenance);
  if (n.length > 0) return { tier: "warning", items: n };
  const i = t(o.apertures);
  return i.length > 0 ? { tier: "attention", items: i } : { tier: null, items: [] };
}
function Ot(o, e, t) {
  for (const n of e)
    for (const i of Xe) {
      const s = `${i}.${o}_${n}`;
      if (s in t) return s;
    }
}
function Ut(o, e, t) {
  const n = [];
  for (const i of e)
    for (const s of Xe) {
      const r = `${s}.${o}_${i}`;
      if (r in t) {
        n.push({ entity: r });
        break;
      }
    }
  return n;
}
function Ye(o, e) {
  const t = o.prefix, n = (l, u) => {
    if (l) return l;
    if (!t) return;
    const h = bt[u];
    return h ? Ot(t, h, e) : void 0;
  }, i = (l, u) => {
    if (l && l.length > 0) return l.map(St);
    if (!t) return [];
    const h = xt[u];
    return h ? Ut(t, h, e) : [];
  }, s = o.overview ?? {}, r = o.maintenance ?? {}, a = s.fuel ?? {};
  return {
    engine: n(o.engine_entity, "engine"),
    lock: n(o.lock_entity, "lock"),
    odometer: n(s.odometer_entity, "odometer"),
    range: n(s.range_entity, "range"),
    fuel_level: n(a.level_entity, "fuel_level"),
    fuel_amount: n(a.amount_entity, "fuel_amount"),
    fuel_capacity: n(a.capacity_entity, "fuel_capacity"),
    doors: i(s.doors, "doors"),
    windows: i(s.windows, "windows"),
    sunroof: n(s.sunroof_entity, "sunroof"),
    tailgate: n(s.tailgate_entity, "tailgate"),
    hood: n(s.hood_entity, "hood"),
    tires: i(r.tires, "tires"),
    oil: n(r.oil_level_entity, "oil"),
    brake_fluid: n(r.brake_fluid_entity, "brake_fluid"),
    coolant: n(r.coolant_level_entity, "coolant"),
    washer_fluid: n(r.washer_fluid_entity, "washer_fluid")
  };
}
const He = { allOk: "All closed", problemVerb: "open" }, Lt = { allOk: "OK", problemVerb: "warning" };
function Ze(o, e) {
  if (!o || j.has(o.state.toLowerCase())) return e;
  const t = o.state.replace(/_/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}
function Ie(o, e) {
  if (!o || j.has(o.state.toLowerCase())) return e;
  const t = o.attributes.unit_of_measurement, n = Number(o.state), i = Number.isFinite(n) ? Math.trunc(n).toLocaleString("en-US") : o.state;
  return t ? `${i} ${t}` : i;
}
function Rt(o, e, t, n = {}) {
  const i = n.unknownValue ?? de, s = n.fuelWarnPercent ?? Ge, r = n.seen ?? /* @__PURE__ */ new Set(), a = [];
  if (o.odometer && a.push({
    key: "odometer",
    section: "overview",
    kind: "value",
    label: "Odometer",
    icon: t.odometer ?? "",
    value: Ie(e[o.odometer], i),
    status: "ok",
    targetEntity: o.odometer
  }), o.fuel_level !== void 0 || o.fuel_amount !== void 0 && o.fuel_capacity !== void 0) {
    const d = Pt(
      e,
      o.fuel_level,
      o.fuel_amount,
      o.fuel_capacity
    );
    a.push({
      key: "fuel",
      section: "overview",
      kind: "value",
      label: "Fuel level",
      icon: t.fuel ?? "",
      value: d === null ? i : `${d}%`,
      status: "ok",
      targetEntity: o.fuel_level ?? o.fuel_amount ?? null,
      warn: d !== null && d < s,
      fuelPercent: d
    });
  }
  o.range && a.push({
    key: "range",
    section: "overview",
    kind: "value",
    label: "Range",
    icon: t.range ?? "",
    value: Ie(e[o.range], i),
    status: "ok",
    targetEntity: o.range
  });
  const u = [
    {
      key: "doors",
      section: "overview",
      label: "Doors",
      icon: t.doors ?? "",
      refs: o.doors,
      labels: He,
      noun: "door"
    },
    {
      key: "windows",
      section: "overview",
      label: "Windows",
      icon: t.windows ?? "",
      refs: o.windows,
      labels: He,
      noun: "window"
    }
  ], h = [
    {
      key: "sunroof",
      section: "overview",
      label: "Sunroof",
      icon: t.sunroof ?? "",
      entity: o.sunroof,
      okText: "Closed",
      problemText: "Open"
    },
    {
      key: "tailgate",
      section: "overview",
      label: "Tailgate",
      icon: t.tailgate ?? "",
      entity: o.tailgate,
      okText: "Closed",
      problemText: "Open"
    },
    {
      key: "hood",
      section: "overview",
      label: "Hood",
      icon: t.hood ?? "",
      entity: o.hood,
      okText: "Closed",
      problemText: "Open"
    }
  ], c = (d) => {
    if (d.refs.length === 0) return;
    const w = d.refs.map((S) => Ct(S, e, n.vehicleName, d.noun)), g = Tt(d.refs, e, { ...d.labels, unknownValue: i }, w);
    a.push({
      key: d.key,
      section: d.section,
      kind: "aggregate",
      label: d.label,
      icon: d.icon,
      value: g.text,
      status: g.status,
      targetEntity: g.targetEntity,
      title: g.offenders.length > 0 ? g.offenders.join(", ") : void 0,
      warn: d.section === "overview" && g.status === "problem"
    });
  }, p = (d) => {
    if (!d.entity) return;
    const w = e[d.entity], g = ue(w), S = r.has(d.entity);
    if (g === "unknown" && !S) return;
    const V = d.entity.startsWith("binary_sensor."), B = g === "unknown" ? i : V ? g === "problem" ? d.problemText : d.okText : Ze(w, i);
    a.push({
      key: d.key,
      section: d.section,
      kind: "status",
      label: d.label,
      icon: d.icon,
      value: B,
      status: g,
      targetEntity: d.entity,
      warn: d.section === "overview" && g === "problem"
    });
  };
  for (const d of u) c(d);
  for (const d of h) p(d);
  c({
    key: "tires",
    section: "maintenance",
    label: "Tire pressure",
    icon: t.tires ?? "",
    refs: o.tires,
    labels: Lt,
    noun: "tire"
  });
  const f = [
    {
      key: "oil",
      section: "maintenance",
      label: "Oil level",
      icon: t.oil ?? "",
      entity: o.oil,
      okText: "OK",
      problemText: "Low"
    },
    {
      key: "brake_fluid",
      section: "maintenance",
      label: "Brake fluid",
      icon: t.brake_fluid ?? "",
      entity: o.brake_fluid,
      okText: "OK",
      problemText: "Low"
    },
    {
      key: "coolant",
      section: "maintenance",
      label: "Coolant level",
      icon: t.coolant ?? "",
      entity: o.coolant,
      okText: "OK",
      problemText: "Low"
    },
    {
      key: "washer_fluid",
      section: "maintenance",
      label: "Washer fluid",
      icon: t.washer_fluid ?? "",
      entity: o.washer_fluid,
      okText: "OK",
      problemText: "Low"
    }
  ];
  for (const d of f) p(d);
  return a;
}
function De(o) {
  const e = (t) => t ? [{ entity: t }] : [];
  return {
    apertures: [
      { label: "Doors", refs: o.doors },
      { label: "Windows", refs: o.windows },
      { label: "Sunroof", refs: e(o.sunroof) },
      { label: "Tailgate", refs: e(o.tailgate) },
      { label: "Hood", refs: e(o.hood) }
    ],
    maintenance: [
      { label: "Tire pressure", refs: o.tires },
      { label: "Oil level", refs: e(o.oil) },
      { label: "Brake fluid", refs: e(o.brake_fluid) },
      { label: "Coolant level", refs: e(o.coolant) },
      { label: "Washer fluid", refs: e(o.washer_fluid) }
    ]
  };
}
const Mt = {
  "badge.warning": "Warning",
  "badge.attention": "Attention",
  "section.overview": "Overview",
  "section.maintenance": "Maintenance",
  "state.not_running": "Not running",
  "state.running": "Running"
};
function C(o) {
  return Mt[o] ?? o;
}
const Nt = je`
  :host {
    display: block;
  }

  ha-card {
    overflow: hidden;
  }

  /* ---- Header (collapsed state) ---- */
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    min-height: 60px;
    box-sizing: border-box;
    cursor: pointer;
    outline: none;
  }
  .header.no-toggle {
    cursor: default;
  }
  .header:focus-visible {
    box-shadow: inset 0 0 0 2px var(--primary-color, #03a9f4);
    border-radius: var(--ha-card-border-radius, 12px);
  }

  .marque {
    flex: none;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
    color: var(--primary-text-color, #212121);
  }
  .marque ha-icon {
    --mdc-icon-size: 22px;
  }

  .titles {
    flex: 1;
    min-width: 0;
  }
  .title {
    font-size: 15px;
    font-weight: 600;
    color: var(--primary-text-color, #212121);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .subtitle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--secondary-text-color, #727272);
  }
  .badge {
    flex: none;
    display: flex;
    align-items: center;
    gap: 4px;
    height: 26px;
    padding: 0 10px;
    border-radius: 13px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }
  .badge ha-icon {
    --mdc-icon-size: 14px;
  }
  .badge.warning {
    color: var(--error-color, #db4437);
    background: color-mix(in srgb, var(--error-color, #db4437) 16%, transparent);
  }
  .badge.attention {
    color: var(--warning-color, #ffa600);
    background: color-mix(in srgb, var(--warning-color, #ffa600) 16%, transparent);
  }

  .lock-button {
    flex: none;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: var(--secondary-text-color, #727272);
    cursor: pointer;
    padding: 0;
  }
  .lock-button ha-icon {
    --mdc-icon-size: 20px;
  }
  .lock-button.unlocked {
    color: var(--warning-color, #ffa600);
  }
  .lock-button:hover,
  .lock-button:focus-visible {
    background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
    outline: none;
  }

  .chevron {
    flex: none;
    color: var(--secondary-text-color, #727272);
    transition: transform 0.28s ease;
  }
  .chevron ha-icon {
    --mdc-icon-size: 20px;
  }
  .chevron.open {
    transform: rotate(180deg);
  }
  @media (prefers-reduced-motion: reduce) {
    .chevron {
      transition: none;
    }
  }

  /* ---- Expand/collapse mechanics (§10) ---- */
  .body {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.28s ease;
  }
  .body.open {
    grid-template-rows: 1fr;
  }
  .body > .inner {
    overflow: hidden;
    min-height: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    .body {
      transition: none;
    }
  }

  .sections {
    padding: 0 14px 14px;
  }

  .section-heading {
    font-size: 14px;
    font-weight: 600;
    color: var(--primary-text-color, #212121);
    margin: 4px 0 6px;
  }

  .section {
    border-radius: 12px;
    background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.04);
    padding: 0 10px;
  }

  /* ---- Rows ---- */
  .row {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 38px;
    cursor: pointer;
    border-bottom: 1px solid var(--divider-color, #e0e0e0);
  }
  .row:last-child {
    border-bottom: none;
  }

  .row-icon {
    flex: none;
    color: var(--secondary-text-color, #727272);
    opacity: 0.7;
    display: flex;
  }
  .row-icon ha-icon {
    --mdc-icon-size: 18px;
  }

  .row-label {
    flex: none;
    font-size: 13px;
    color: var(--primary-text-color, #212121);
  }

  .row-value {
    flex: 1;
    min-width: 0;
    font-size: 13px;
    font-weight: 500;
    text-align: right;
    color: var(--secondary-text-color, #727272);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .row-value.warn {
    color: var(--warning-color, #ffa600);
  }
  .row-value.error {
    color: var(--error-color, #db4437);
    font-weight: 600;
  }
`;
var Ht = Object.defineProperty, he = (o, e, t, n) => {
  for (var i = void 0, s = o.length - 1, r; s >= 0; s--)
    (r = o[s]) && (i = r(e, t, i) || i);
  return i && Ht(e, t, i), i;
};
const v = ["sensor", "binary_sensor", "cover", "switch"], m = (o) => ({ entity: { domain: o } }), ne = (o) => ({ entity: { domain: o, multiple: !0 } }), It = [{ name: "prefix", selector: { text: {} } }], Dt = "Entity ID prefix (e.g. volvo_xc60). The card auto-discovers matching entities; anything set under Custom Entities always wins.", zt = [
  { name: "name", selector: { text: {} } },
  { name: "icon", selector: { icon: {} } },
  {
    name: "mode",
    required: !0,
    selector: {
      select: {
        mode: "dropdown",
        options: [
          { value: "expandable", label: "Expandable" },
          { value: "expanded", label: "Always expanded" },
          { value: "compact", label: "Compact (header only)" }
        ]
      }
    }
  }
], Wt = [
  { name: "engine_entity", selector: m(["binary_sensor", "sensor", "switch"]) },
  { name: "lock_entity", selector: m(["lock"]) },
  { name: "odometer_entity", selector: m(["sensor"]) },
  { name: "range_entity", selector: m(["sensor"]) },
  { name: "fuel_level_entity", selector: m(["sensor"]) },
  { name: "fuel_amount_entity", selector: m(["sensor"]) },
  { name: "fuel_capacity_entity", selector: m(["sensor"]) },
  { name: "doors", selector: ne(v) },
  { name: "windows", selector: ne(v) },
  { name: "sunroof_entity", selector: m(v) },
  { name: "tailgate_entity", selector: m(v) },
  { name: "hood_entity", selector: m(v) },
  { name: "tires", selector: ne(v) },
  { name: "oil_level_entity", selector: m(v) },
  { name: "brake_fluid_entity", selector: m(v) },
  { name: "coolant_level_entity", selector: m(v) },
  { name: "washer_fluid_entity", selector: m(v) }
], jt = [{ name: "auto_expand_maintenance", selector: { boolean: {} } }], Vt = [{ name: "show_section_icons", selector: { boolean: {} } }], Bt = [
  { name: "unknown_value", selector: { text: {} } },
  { name: "fuel_warn_percent", selector: { number: { min: 0, max: 100, mode: "box" } } }
], F = {
  general: "General",
  custom_entities: "Custom Entities",
  advanced: "Advanced",
  name: "Name",
  icon: "Icon",
  prefix: "Entity prefix",
  engine_entity: "Engine entity",
  lock_entity: "Lock entity",
  odometer_entity: "Odometer",
  range_entity: "Range",
  fuel_level_entity: "Fuel level (%)",
  fuel_amount_entity: "Fuel amount",
  fuel_capacity_entity: "Fuel capacity",
  doors: "Doors",
  windows: "Windows",
  sunroof_entity: "Sunroof",
  tailgate_entity: "Tailgate",
  hood_entity: "Hood",
  tires: "Tires",
  oil_level_entity: "Oil level",
  brake_fluid_entity: "Brake fluid",
  coolant_level_entity: "Coolant level",
  washer_fluid_entity: "Washer fluid",
  mode: "Display mode",
  auto_expand_maintenance: "Auto-expand on maintenance warning",
  show_section_icons: "Show row icons",
  unknown_value: "Unknown value text",
  fuel_warn_percent: "Low fuel threshold (%)"
}, Ft = {
  engine_entity: "engine",
  lock_entity: "lock",
  odometer_entity: "odometer",
  range_entity: "range",
  fuel_level_entity: "fuel_level",
  fuel_amount_entity: "fuel_amount",
  fuel_capacity_entity: "fuel_capacity",
  sunroof_entity: "sunroof",
  tailgate_entity: "tailgate",
  hood_entity: "hood",
  oil_level_entity: "oil",
  brake_fluid_entity: "brake_fluid",
  coolant_level_entity: "coolant",
  washer_fluid_entity: "washer_fluid",
  doors: "doors",
  windows: "windows",
  tires: "tires"
};
function ie(o) {
  return typeof o == "string" ? o : o.entity;
}
const pe = class pe extends P {
  constructor() {
    super(...arguments), this._open = {
      general: !0,
      custom_entities: !1,
      advanced: !1
    }, this._computeLabel = (e) => F[e.name] ?? e.name, this._computeHelper = (e) => {
      var a;
      if (!this.hass || !((a = this._config) != null && a.prefix)) return;
      const t = Ft[e.name];
      if (!t) return;
      const i = this._formData()[e.name];
      if (i !== void 0 && (!Array.isArray(i) || i.length > 0))
        return;
      const r = Ye(this._config, this.hass.states)[t];
      return Array.isArray(r) ? r.length > 0 ? `Auto-discovered: ${r.map((l) => l.entity).join(", ")}` : void 0 : r ? `Auto-discovered: ${r}` : void 0;
    };
  }
  setConfig(e) {
    this._config = e;
  }
  _formData() {
    var t, n, i, s, r, a, l, u, h, c, p, f, d, w, g, S, V, B, ge, me, ye, ve, we, $e, be, xe;
    const e = this._config;
    return e ? {
      name: e.name,
      icon: e.icon,
      prefix: e.prefix,
      engine_entity: e.engine_entity,
      lock_entity: e.lock_entity,
      odometer_entity: (t = e.overview) == null ? void 0 : t.odometer_entity,
      range_entity: (n = e.overview) == null ? void 0 : n.range_entity,
      fuel_level_entity: (s = (i = e.overview) == null ? void 0 : i.fuel) == null ? void 0 : s.level_entity,
      fuel_amount_entity: (a = (r = e.overview) == null ? void 0 : r.fuel) == null ? void 0 : a.amount_entity,
      fuel_capacity_entity: (u = (l = e.overview) == null ? void 0 : l.fuel) == null ? void 0 : u.capacity_entity,
      doors: (c = (h = e.overview) == null ? void 0 : h.doors) == null ? void 0 : c.map(ie),
      windows: (f = (p = e.overview) == null ? void 0 : p.windows) == null ? void 0 : f.map(ie),
      sunroof_entity: (d = e.overview) == null ? void 0 : d.sunroof_entity,
      tailgate_entity: (w = e.overview) == null ? void 0 : w.tailgate_entity,
      hood_entity: (g = e.overview) == null ? void 0 : g.hood_entity,
      tires: (V = (S = e.maintenance) == null ? void 0 : S.tires) == null ? void 0 : V.map(ie),
      oil_level_entity: (B = e.maintenance) == null ? void 0 : B.oil_level_entity,
      brake_fluid_entity: (ge = e.maintenance) == null ? void 0 : ge.brake_fluid_entity,
      coolant_level_entity: (me = e.maintenance) == null ? void 0 : me.coolant_level_entity,
      washer_fluid_entity: (ye = e.maintenance) == null ? void 0 : ye.washer_fluid_entity,
      // Display mode always shows a selection; 'expandable' is the card default.
      mode: ((ve = e.display) == null ? void 0 : ve.mode) ?? "expandable",
      auto_expand_maintenance: (we = e.display) == null ? void 0 : we.auto_expand_maintenance,
      show_section_icons: ($e = e.display) == null ? void 0 : $e.show_section_icons,
      unknown_value: (be = e.display) == null ? void 0 : be.unknown_value,
      fuel_warn_percent: (xe = e.display) == null ? void 0 : xe.fuel_warn_percent
    } : {};
  }
  _valueChanged(e) {
    if (e.stopPropagation(), !this._config) return;
    const t = e.detail.value, n = { ...t };
    for (const h of ["general", "custom_entities", "advanced"]) {
      const c = t[h];
      c && typeof c == "object" && !Array.isArray(c) && (Object.assign(n, c), delete n[h]);
    }
    const i = (h) => {
      const c = Object.entries(h).filter(
        ([, p]) => p !== void 0 && p !== "" && !(Array.isArray(p) && p.length === 0)
      );
      return c.length > 0 ? Object.fromEntries(c) : void 0;
    }, s = i({
      level_entity: n.fuel_level_entity,
      amount_entity: n.fuel_amount_entity,
      capacity_entity: n.fuel_capacity_entity
    }), r = i({
      odometer_entity: n.odometer_entity,
      range_entity: n.range_entity,
      fuel: s,
      doors: n.doors,
      windows: n.windows,
      sunroof_entity: n.sunroof_entity,
      tailgate_entity: n.tailgate_entity,
      hood_entity: n.hood_entity
    }), a = i({
      tires: n.tires,
      oil_level_entity: n.oil_level_entity,
      brake_fluid_entity: n.brake_fluid_entity,
      coolant_level_entity: n.coolant_level_entity,
      washer_fluid_entity: n.washer_fluid_entity
    }), l = {
      type: this._config.type,
      ...i({
        name: n.name,
        icon: n.icon,
        prefix: n.prefix,
        engine_entity: n.engine_entity,
        lock_entity: n.lock_entity
      }),
      ...r ? { overview: r } : {},
      ...a ? { maintenance: a } : {}
    }, u = i({
      mode: n.mode,
      auto_expand_maintenance: n.auto_expand_maintenance,
      show_section_icons: n.show_section_icons,
      unknown_value: n.unknown_value,
      fuel_warn_percent: n.fuel_warn_percent
    });
    u && (l.display = u), this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: l },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _panelToggled(e, t) {
    this._open = { ...this._open, [e]: t.detail.expanded };
  }
  /** One ha-form per block of fields, so gaps between blocks are ours to set. */
  _form(e, t, n = "") {
    return y`
      <ha-form
        class=${n}
        .hass=${this.hass}
        .data=${e}
        .schema=${t}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }
  render() {
    if (!this.hass || !this._config) return _;
    const e = this._formData();
    return y`
      <ha-expansion-panel
        outlined
        .header=${F.general}
        .expanded=${this._open.general}
        @expanded-changed=${(t) => this._panelToggled("general", t)}
      >
        <div class="content">
          ${this._form(e, It)}
          <p class="helper">${Dt}</p>
          ${this._form(e, zt, "gap-lg")}
        </div>
      </ha-expansion-panel>

      <ha-expansion-panel
        outlined
        .header=${F.custom_entities}
        .expanded=${this._open.custom_entities}
        @expanded-changed=${(t) => this._panelToggled("custom_entities", t)}
      >
        <div class="content">${this._form(e, Wt)}</div>
      </ha-expansion-panel>

      <ha-expansion-panel
        outlined
        .header=${F.advanced}
        .expanded=${this._open.advanced}
        @expanded-changed=${(t) => this._panelToggled("advanced", t)}
      >
        <div class="content">
          ${this._form(e, jt)} ${this._form(e, Vt, "gap-sm")}
          ${this._form(e, Bt, "gap-lg")}
        </div>
      </ha-expansion-panel>
    `;
  }
};
pe.styles = je`
    :host {
      display: block;
    }

    ha-expansion-panel {
      display: block;
      margin-bottom: 12px;
    }

    ha-expansion-panel:last-of-type {
      margin-bottom: 0;
    }

    .content {
      padding: 4px 12px 12px;
    }

    ha-form {
      display: block;
    }

    .gap-sm {
      margin-top: 8px;
    }

    .gap-lg {
      margin-top: 20px;
    }

    .helper {
      margin: 10px 0 0;
      padding: 0 16px;
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.5;
    }
  `;
let L = pe;
he([
  le({ attribute: !1 })
], L.prototype, "hass");
he([
  Y()
], L.prototype, "_config");
he([
  Y()
], L.prototype, "_open");
customElements.define(Ke, L);
var qt = Object.defineProperty, _e = (o, e, t, n) => {
  for (var i = void 0, s = o.length - 1, r; s >= 0; s--)
    (r = o[s]) && (i = r(e, t, i) || i);
  return i && qt(e, t, i), i;
};
const fe = class fe extends P {
  constructor() {
    super(...arguments), this._expanded = !1, this._resolvedStateCount = -1, this._seen = /* @__PURE__ */ new Set(), this._manuallyToggled = !1, this._lastBadgeTier = null;
  }
  static getConfigElement() {
    return document.createElement(Ke);
  }
  static getStubConfig(e) {
    const t = {
      type: `custom:${ce}`,
      display: { mode: "expandable" }
    };
    if (e) {
      const n = Object.keys(e.states).find((i) => i.startsWith("lock.")) ?? Object.keys(e.states).find(
        (i) => i.startsWith("binary_sensor.") && i.endsWith("_engine_status")
      );
      if (n) {
        const i = n.split(".")[1] ?? "";
        t.prefix = i.replace(/_(lock|engine_status)$/, "").replace(/_$/, "");
      }
    }
    return t;
  }
  setConfig(e) {
    var t;
    if (!e || typeof e != "object")
      throw new Error("Invalid configuration");
    this._config = e, this._resolved = void 0, this._resolvedStateCount = -1, ((t = e.display) == null ? void 0 : t.mode) === "expanded" && (this._expanded = !0);
  }
  getCardSize() {
    return this._expanded ? 8 : 2;
  }
  getGridOptions() {
    return {
      min_columns: 6,
      min_rows: this._expanded ? 6 : 2,
      rows: this._expanded ? 6 : 2
    };
  }
  get _mode() {
    var e, t;
    return ((t = (e = this._config) == null ? void 0 : e.display) == null ? void 0 : t.mode) ?? "expandable";
  }
  get _unknownValue() {
    var e, t;
    return ((t = (e = this._config) == null ? void 0 : e.display) == null ? void 0 : t.unknown_value) ?? de;
  }
  _resolve() {
    if (!this.hass || !this._config) return;
    const e = Object.keys(this.hass.states).length;
    return (!this._resolved || e !== this._resolvedStateCount) && (this._resolved = Ye(this._config, this.hass.states), this._resolvedStateCount = e), this._resolved;
  }
  _trackSeen(e) {
    if (!this.hass) return;
    const t = [
      e.sunroof,
      e.tailgate,
      e.hood,
      e.oil,
      e.brake_fluid,
      e.coolant,
      e.washer_fluid
    ];
    for (const n of t)
      n && !this._seen.has(n) && !Et(this.hass.states[n]) && this._seen.add(n);
  }
  willUpdate() {
    var s, r;
    const e = this._resolve();
    if (!e || !this.hass) return;
    this._trackSeen(e);
    const t = Ne(De(e), this.hass.states), n = this._lastBadgeTier === "warning", i = t.tier === "warning";
    (r = (s = this._config) == null ? void 0 : s.display) != null && r.auto_expand_maintenance && this._mode === "expandable" && !this._manuallyToggled && (i && !n ? this._setExpanded(!0) : !i && n && this._setExpanded(!1)), this._lastBadgeTier = t.tier;
  }
  _setExpanded(e) {
    this._expanded !== e && (this._expanded = e, this.updateComplete.then(() => {
      this.dispatchEvent(new Event("iron-resize", { bubbles: !0, composed: !0 }));
    }));
  }
  _toggle() {
    this._mode === "expandable" && (this._manuallyToggled = !0, this._setExpanded(!this._expanded));
  }
  _onHeaderKeydown(e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._toggle());
  }
  _moreInfo(e) {
    e && this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _onLockTap(e) {
    e.stopPropagation();
    const t = this._resolve();
    t != null && t.lock && this._moreInfo(t.lock);
  }
  render() {
    if (!this.hass || !this._config) return _;
    const e = this._resolve();
    if (!e) return _;
    const t = this.hass.states, n = this._config.name ?? wt, i = this._config.icon ?? vt, s = Ne(De(e), t), r = this._mode !== "compact", a = this._mode === "expandable", l = this._mode === "expanded" || a && this._expanded, u = e.engine ? t[e.engine] : void 0, h = u !== void 0 && (u.state === "on" || u.state.toLowerCase() === "running"), c = u ? u.entity_id.startsWith("binary_sensor.") ? C(h ? "state.running" : "state.not_running") : Ze(u, this._unknownValue) : void 0, p = e.lock ? t[e.lock] : void 0, f = p !== void 0 && p.state !== "locked";
    return y`
      <ha-card>
        <div
          class="header ${a ? "" : "no-toggle"}"
          role=${a ? "button" : _}
          tabindex=${a ? "0" : _}
          aria-expanded=${a ? String(l) : _}
          aria-label=${a ? `${n}, toggle details` : _}
          @click=${a ? this._toggle : _}
          @keydown=${a ? this._onHeaderKeydown : _}
        >
          <div class="marque"><ha-icon .icon=${i}></ha-icon></div>
          <div class="titles">
            <div class="title">${n}</div>
            ${c !== void 0 ? y`<div class="subtitle"><span>${c}</span></div>` : _}
          </div>
          ${s.tier ? y`<div
                  class="badge ${s.tier}"
                  title=${s.items.join(", ")}
                  @click=${(d) => {
      d.stopPropagation(), this._toggle();
    }}
                >
                  <ha-icon
                    .icon=${s.tier === "warning" ? "mdi:alert-circle" : "mdi:car-door"}
                  ></ha-icon>
                  <span
                    >${s.tier === "warning" ? C("badge.warning") : C("badge.attention")}</span
                  >
                </div>` : _}
          ${p ? y`<button
                  class="lock-button ${f ? "unlocked" : ""}"
                  aria-label=${f ? "Unlocked" : "Locked"}
                  @click=${this._onLockTap}
                >
                  <ha-icon .icon=${f ? "mdi:lock-open-variant" : "mdi:lock"}></ha-icon>
                </button>` : _}
          ${a ? y`<div class="chevron ${l ? "open" : ""}">
                  <ha-icon icon="mdi:chevron-down"></ha-icon>
                </div>` : _}
        </div>
        ${r ? y`<div class="body ${l ? "open" : ""}">
                <div class="inner">${this._renderSections(e)}</div>
              </div>` : _}
      </ha-card>
    `;
  }
  _renderSections(e) {
    var s;
    if (!this.hass || !this._config) return _;
    const t = Rt(e, this.hass.states, kt, {
      unknownValue: this._unknownValue,
      fuelWarnPercent: ((s = this._config.display) == null ? void 0 : s.fuel_warn_percent) ?? Ge,
      seen: this._seen,
      vehicleName: this._config.name
    }), n = t.filter((r) => r.section === "overview"), i = t.filter((r) => r.section === "maintenance");
    return y`
      <div class="sections">
        ${this._renderSection(C("section.overview"), n)}
        ${this._renderSection(C("section.maintenance"), i)}
      </div>
    `;
  }
  _renderSection(e, t) {
    return t.length === 0 ? _ : y`
      <div class="section-heading">${e}</div>
      <div class="section">${t.map((n) => this._renderRow(n))}</div>
    `;
  }
  _renderRow(e) {
    var s, r;
    const t = ((r = (s = this._config) == null ? void 0 : s.display) == null ? void 0 : r.show_section_icons) ?? !0, i = e.section === "maintenance" && e.status === "problem" ? "error" : e.warn ? "warn" : "";
    return y`
      <div
        class="row"
        title=${e.title ?? _}
        @click=${() => this._moreInfo(e.targetEntity)}
      >
        ${t ? y`<div class="row-icon"><ha-icon .icon=${e.icon}></ha-icon></div>` : _}
        <div class="row-label">${e.label}</div>
        <div class="row-value ${i}">${e.value}</div>
      </div>
    `;
  }
};
fe.styles = Nt;
let R = fe;
_e([
  le({ attribute: !1 })
], R.prototype, "hass");
_e([
  Y()
], R.prototype, "_config");
_e([
  Y()
], R.prototype, "_expanded");
customElements.define(ce, R);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: ce,
  name: "Compact Vehicle Card",
  description: "A slim, integration-agnostic vehicle card with expandable Overview and Maintenance sections.",
  preview: !1,
  documentationURL: "https://github.com/timblazing/compact-vehicle-card"
});
console.info(
  "%c COMPACT-VEHICLE-CARD %c v1.0.3 ",
  "color: white; background: #555; font-weight: 700;",
  "color: #555; background: #ddd; font-weight: 700;"
);
export {
  R as CompactVehicleCard
};
