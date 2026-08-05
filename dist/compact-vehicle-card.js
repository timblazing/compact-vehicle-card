/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = globalThis, Q = j.ShadowRoot && (j.ShadyCSS === void 0 || j.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ee = Symbol(), $e = /* @__PURE__ */ new WeakMap();
let Ie = class {
  constructor(e, t, n) {
    if (this._$cssResult$ = !0, n !== ee) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Q && e === void 0) {
      const n = t !== void 0 && t.length === 1;
      n && (e = $e.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && $e.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ze = (o) => new Ie(typeof o == "string" ? o : o + "", void 0, ee), Je = (o, ...e) => {
  const t = o.length === 1 ? o[0] : e.reduce((n, i, r) => n + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + o[r + 1], o[0]);
  return new Ie(t, o, ee);
}, Xe = (o, e) => {
  if (Q) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const n = document.createElement("style"), i = j.litNonce;
    i !== void 0 && n.setAttribute("nonce", i), n.textContent = t.cssText, o.appendChild(n);
  }
}, xe = Q ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const n of e.cssRules) t += n.cssText;
  return Ze(t);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Qe, defineProperty: et, getOwnPropertyDescriptor: tt, getOwnPropertyNames: nt, getOwnPropertySymbols: it, getPrototypeOf: ot } = Object, $ = globalThis, ke = $.trustedTypes, rt = ke ? ke.emptyScript : "", K = $.reactiveElementPolyfillSupport, M = (o, e) => o, V = { toAttribute(o, e) {
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
} }, te = (o, e) => !Qe(o, e), Ae = { attribute: !0, type: String, converter: V, reflect: !1, useDefault: !1, hasChanged: te };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), $.litPropertyMetadata ?? ($.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let P = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Ae) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const n = Symbol(), i = this.getPropertyDescriptor(e, n, t);
      i !== void 0 && et(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, n) {
    const { get: i, set: r } = tt(this.prototype, e) ?? { get() {
      return this[t];
    }, set(s) {
      this[t] = s;
    } };
    return { get: i, set(s) {
      const a = i == null ? void 0 : i.call(this);
      r == null || r.call(this, s), this.requestUpdate(e, a, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ae;
  }
  static _$Ei() {
    if (this.hasOwnProperty(M("elementProperties"))) return;
    const e = ot(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(M("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(M("properties"))) {
      const t = this.properties, n = [...nt(t), ...it(t)];
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
      for (const i of n) t.unshift(xe(i));
    } else e !== void 0 && t.push(xe(e));
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
    return Xe(e, this.constructor.elementStyles), e;
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
    var r;
    const n = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, n);
    if (i !== void 0 && n.reflect === !0) {
      const s = (((r = n.converter) == null ? void 0 : r.toAttribute) !== void 0 ? n.converter : V).toAttribute(t, n.type);
      this._$Em = e, s == null ? this.removeAttribute(i) : this.setAttribute(i, s), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var r, s;
    const n = this.constructor, i = n._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const a = n.getPropertyOptions(i), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((r = a.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? a.converter : V;
      this._$Em = i;
      const u = l.fromAttribute(t, a.type);
      this[i] = u ?? ((s = this._$Ej) == null ? void 0 : s.get(i)) ?? u, this._$Em = null;
    }
  }
  requestUpdate(e, t, n, i = !1, r) {
    var s;
    if (e !== void 0) {
      const a = this.constructor;
      if (i === !1 && (r = this[e]), n ?? (n = a.getPropertyOptions(e)), !((n.hasChanged ?? te)(r, t) || n.useDefault && n.reflect && r === ((s = this._$Ej) == null ? void 0 : s.get(e)) && !this.hasAttribute(a._$Eu(e, n)))) return;
      this.C(e, t, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: n, reflect: i, wrapped: r }, s) {
    n && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, s ?? t ?? this[e]), r !== !0 || s !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [r, s] of this._$Ep) this[r] = s;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, s] of i) {
        const { wrapped: a } = s, l = this[r];
        a !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, s, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (n = this._$EO) == null || n.forEach((i) => {
        var r;
        return (r = i.hostUpdate) == null ? void 0 : r.call(i);
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
P.elementStyles = [], P.shadowRootOptions = { mode: "open" }, P[M("elementProperties")] = /* @__PURE__ */ new Map(), P[M("finalized")] = /* @__PURE__ */ new Map(), K == null || K({ ReactiveElement: P }), ($.reactiveElementVersions ?? ($.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis, Ee = (o) => o, B = N.trustedTypes, Se = B ? B.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, ze = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, We = "?" + b, st = `<${We}>`, E = document, H = () => E.createComment(""), D = (o) => o === null || typeof o != "object" && typeof o != "function", ne = Array.isArray, at = (o) => ne(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", q = `[ 	
\f\r]`, L = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ce = /-->/g, Pe = />/g, x = RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Te = /'/g, Oe = /"/g, je = /^(?:script|style|textarea|title)$/i, lt = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), y = lt(1), O = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), Ue = /* @__PURE__ */ new WeakMap(), k = E.createTreeWalker(E, 129);
function Ve(o, e) {
  if (!ne(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Se !== void 0 ? Se.createHTML(e) : e;
}
const ct = (o, e) => {
  const t = o.length - 1, n = [];
  let i, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", s = L;
  for (let a = 0; a < t; a++) {
    const l = o[a];
    let u, h, c = -1, f = 0;
    for (; f < l.length && (s.lastIndex = f, h = s.exec(l), h !== null); ) f = s.lastIndex, s === L ? h[1] === "!--" ? s = Ce : h[1] !== void 0 ? s = Pe : h[2] !== void 0 ? (je.test(h[2]) && (i = RegExp("</" + h[2], "g")), s = x) : h[3] !== void 0 && (s = x) : s === x ? h[0] === ">" ? (s = i ?? L, c = -1) : h[1] === void 0 ? c = -2 : (c = s.lastIndex - h[2].length, u = h[1], s = h[3] === void 0 ? x : h[3] === '"' ? Oe : Te) : s === Oe || s === Te ? s = x : s === Ce || s === Pe ? s = L : (s = x, i = void 0);
    const p = s === x && o[a + 1].startsWith("/>") ? " " : "";
    r += s === L ? l + st : c >= 0 ? (n.push(u), l.slice(0, c) + ze + l.slice(c) + b + p) : l + b + (c === -2 ? a : p);
  }
  return [Ve(o, r + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), n];
};
class I {
  constructor({ strings: e, _$litType$: t }, n) {
    let i;
    this.parts = [];
    let r = 0, s = 0;
    const a = e.length - 1, l = this.parts, [u, h] = ct(e, t);
    if (this.el = I.createElement(u, n), k.currentNode = this.el.content, t === 2 || t === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = k.nextNode()) !== null && l.length < a; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(ze)) {
          const f = h[s++], p = i.getAttribute(c).split(b), d = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: r, name: d[2], strings: p, ctor: d[1] === "." ? ut : d[1] === "?" ? ht : d[1] === "@" ? _t : F }), i.removeAttribute(c);
        } else c.startsWith(b) && (l.push({ type: 6, index: r }), i.removeAttribute(c));
        if (je.test(i.tagName)) {
          const c = i.textContent.split(b), f = c.length - 1;
          if (f > 0) {
            i.textContent = B ? B.emptyScript : "";
            for (let p = 0; p < f; p++) i.append(c[p], H()), k.nextNode(), l.push({ type: 2, index: ++r });
            i.append(c[f], H());
          }
        }
      } else if (i.nodeType === 8) if (i.data === We) l.push({ type: 2, index: r });
      else {
        let c = -1;
        for (; (c = i.data.indexOf(b, c + 1)) !== -1; ) l.push({ type: 7, index: r }), c += b.length - 1;
      }
      r++;
    }
  }
  static createElement(e, t) {
    const n = E.createElement("template");
    return n.innerHTML = e, n;
  }
}
function U(o, e, t = o, n) {
  var s, a;
  if (e === O) return e;
  let i = n !== void 0 ? (s = t._$Co) == null ? void 0 : s[n] : t._$Cl;
  const r = D(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== r && ((a = i == null ? void 0 : i._$AO) == null || a.call(i, !1), r === void 0 ? i = void 0 : (i = new r(o), i._$AT(o, t, n)), n !== void 0 ? (t._$Co ?? (t._$Co = []))[n] = i : t._$Cl = i), i !== void 0 && (e = U(o, i._$AS(o, e.values), i, n)), e;
}
class dt {
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
    let r = k.nextNode(), s = 0, a = 0, l = n[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let u;
        l.type === 2 ? u = new z(r, r.nextSibling, this, e) : l.type === 1 ? u = new l.ctor(r, l.name, l.strings, this, e) : l.type === 6 && (u = new ft(r, this, e)), this._$AV.push(u), l = n[++a];
      }
      s !== (l == null ? void 0 : l.index) && (r = k.nextNode(), s++);
    }
    return k.currentNode = E, i;
  }
  p(e) {
    let t = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(e, n, t), t += n.strings.length - 2) : n._$AI(e[t])), t++;
  }
}
class z {
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
    e = U(this, e, t), D(e) ? e === _ || e == null || e === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : e !== this._$AH && e !== O && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : at(e) ? this.k(e) : this._(e);
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
    var r;
    const { values: t, _$litType$: n } = e, i = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = I.createElement(Ve(n.h, n.h[0]), this.options)), n);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === i) this._$AH.p(t);
    else {
      const s = new dt(i, this), a = s.u(this.options);
      s.p(t), this.T(a), this._$AH = s;
    }
  }
  _$AC(e) {
    let t = Ue.get(e.strings);
    return t === void 0 && Ue.set(e.strings, t = new I(e)), t;
  }
  k(e) {
    ne(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let n, i = 0;
    for (const r of e) i === t.length ? t.push(n = new z(this.O(H()), this.O(H()), this, this.options)) : n = t[i], n._$AI(r), i++;
    i < t.length && (this._$AR(n && n._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var n;
    for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, t); e !== this._$AB; ) {
      const i = Ee(e).nextSibling;
      Ee(e).remove(), e = i;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class F {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, n, i, r) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = r, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = _;
  }
  _$AI(e, t = this, n, i) {
    const r = this.strings;
    let s = !1;
    if (r === void 0) e = U(this, e, t, 0), s = !D(e) || e !== this._$AH && e !== O, s && (this._$AH = e);
    else {
      const a = e;
      let l, u;
      for (e = r[0], l = 0; l < r.length - 1; l++) u = U(this, a[n + l], t, l), u === O && (u = this._$AH[l]), s || (s = !D(u) || u !== this._$AH[l]), u === _ ? e = _ : e !== _ && (e += (u ?? "") + r[l + 1]), this._$AH[l] = u;
    }
    s && !i && this.j(e);
  }
  j(e) {
    e === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ut extends F {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === _ ? void 0 : e;
  }
}
class ht extends F {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== _);
  }
}
class _t extends F {
  constructor(e, t, n, i, r) {
    super(e, t, n, i, r), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = U(this, e, t, 0) ?? _) === O) return;
    const n = this._$AH, i = e === _ && n !== _ || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, r = e !== _ && (n === _ || i);
    i && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
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
const G = N.litHtmlPolyfillSupport;
G == null || G(I, z), (N.litHtmlVersions ?? (N.litHtmlVersions = [])).push("3.3.3");
const pt = (o, e, t) => {
  const n = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = n._$litPart$;
  if (i === void 0) {
    const r = (t == null ? void 0 : t.renderBefore) ?? null;
    n._$litPart$ = i = new z(e.insertBefore(H(), r), r, void 0, t ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A = globalThis;
class T extends P {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = pt(t, this.renderRoot, this.renderOptions);
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
var De;
T._$litElement$ = !0, T.finalized = !0, (De = A.litElementHydrateSupport) == null || De.call(A, { LitElement: T });
const Y = A.litElementPolyfillSupport;
Y == null || Y({ LitElement: T });
(A.litElementVersions ?? (A.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gt = { attribute: !0, type: String, converter: V, reflect: !1, hasChanged: te }, mt = (o = gt, e, t) => {
  const { kind: n, metadata: i } = t;
  let r = globalThis.litPropertyMetadata.get(i);
  if (r === void 0 && globalThis.litPropertyMetadata.set(i, r = /* @__PURE__ */ new Map()), n === "setter" && ((o = Object.create(o)).wrapped = !0), r.set(t.name, o), n === "accessor") {
    const { name: s } = t;
    return { set(a) {
      const l = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(s, l, o, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(s, void 0, o, a), a;
    } };
  }
  if (n === "setter") {
    const { name: s } = t;
    return function(a) {
      const l = this[s];
      e.call(this, a), this.requestUpdate(s, l, o, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function ie(o) {
  return (e, t) => typeof t == "object" ? mt(o, e, t) : ((n, i, r) => {
    const s = i.hasOwnProperty(r);
    return i.constructor.createProperty(r, n), s ? Object.getOwnPropertyDescriptor(i, r) : void 0;
  })(o, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function oe(o) {
  return ie({ ...o, state: !0, attribute: !1 });
}
const re = "compact-vehicle-card", Be = "compact-vehicle-card-editor", yt = "mdi:car", vt = "Vehicle", se = "-", Fe = 15, wt = /* @__PURE__ */ new Set([
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
]), W = /* @__PURE__ */ new Set(["unknown", "unavailable", "none", ""]), Ke = ["sensor", "binary_sensor", "lock", "cover", "switch"], bt = {
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
}, $t = {
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
}, xt = {
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
function ae(o, e = {}) {
  const t = kt(o);
  return e.invert && t !== "unknown" ? t === "ok" ? "problem" : "ok" : t;
}
function kt(o) {
  if (!o) return "unknown";
  const e = o.state;
  if (e == null || W.has(e.toLowerCase())) return "unknown";
  const t = o.entity_id.split(".")[0];
  return t === "binary_sensor" ? e === "on" ? "problem" : "ok" : t === "lock" ? e === "locked" ? "ok" : "problem" : wt.has(e.toLowerCase()) ? "ok" : "problem";
}
function At(o) {
  return !o || W.has(o.state.toLowerCase());
}
function Et(o) {
  return typeof o == "string" ? { entity: o } : o;
}
function St(o, e, t, n) {
  if (o.name) return o.name;
  const i = e[o.entity];
  let r = (i == null ? void 0 : i.attributes.friendly_name) ?? o.entity.split(".")[1] ?? o.entity;
  if (t && r.toLowerCase().startsWith(t.toLowerCase()) && (r = r.slice(t.length).trim()), n) {
    const s = n.toLowerCase(), a = r.toLowerCase();
    a.startsWith(s + " ") ? r = r.slice(s.length + 1) : a.endsWith(" " + s) && (r = r.slice(0, r.length - s.length - 1));
  }
  return r = r.replace(/_/g, " ").trim(), r ? r.charAt(0).toUpperCase() + r.slice(1).toLowerCase() : o.entity;
}
function Ct(o, e, t, n) {
  var u, h;
  const i = t.unknownValue ?? se;
  if (o.length === 0)
    return { status: "unknown", text: "", offenders: [], targetEntity: null };
  const r = o.map((c, f) => ({
    ref: c,
    name: (n == null ? void 0 : n[f]) ?? c.name ?? c.entity,
    state: ae(e[c.entity], { invert: c.invert })
  })), s = r.filter((c) => c.state === "problem"), a = r.filter((c) => c.state === "unknown"), l = ((u = o[0]) == null ? void 0 : u.entity) ?? null;
  if (s.length > 0) {
    const c = s.map((p) => p.name);
    let f;
    if (s.length === 1)
      f = `${c[0]} ${t.problemVerb}`;
    else if (s.length <= 3) {
      const [p, ...d] = c;
      f = `${p}, ${d.map((w) => w.toLowerCase()).join(", ")} ${t.problemVerb}`;
    } else
      f = `${s.length} ${t.problemVerb}`;
    return {
      status: "problem",
      text: f,
      offenders: c,
      targetEntity: ((h = s[0]) == null ? void 0 : h.ref.entity) ?? l
    };
  }
  return a.length > 0 ? { status: "unknown", text: i, offenders: [], targetEntity: l } : { status: "ok", text: t.allOk, offenders: [], targetEntity: l };
}
function Pt(o, e, t, n) {
  if (e) {
    const i = Z(o[e]);
    if (i !== null) return Re(i);
  }
  if (t && n) {
    const i = Z(o[t]), r = Z(o[n]);
    if (i !== null && r !== null && r > 0)
      return Re(i / r * 100);
  }
  return null;
}
function Z(o) {
  if (!o || W.has(o.state.toLowerCase())) return null;
  const e = Number(o.state);
  return Number.isFinite(e) ? e : null;
}
function Re(o) {
  return Math.min(100, Math.max(0, Math.round(o)));
}
function Le(o, e) {
  const t = (r) => r.filter(
    (s) => s.refs.some((a) => ae(e[a.entity], { invert: a.invert }) === "problem")
  ).map((s) => s.label), n = t(o.maintenance);
  if (n.length > 0) return { tier: "warning", items: n };
  const i = t(o.apertures);
  return i.length > 0 ? { tier: "attention", items: i } : { tier: null, items: [] };
}
function Tt(o, e, t) {
  for (const n of e)
    for (const i of Ke) {
      const r = `${i}.${o}_${n}`;
      if (r in t) return r;
    }
}
function Ot(o, e, t) {
  const n = [];
  for (const i of e)
    for (const r of Ke) {
      const s = `${r}.${o}_${i}`;
      if (s in t) {
        n.push({ entity: s });
        break;
      }
    }
  return n;
}
function qe(o, e) {
  const t = o.prefix, n = (l, u) => {
    if (l) return l;
    if (!t) return;
    const h = bt[u];
    return h ? Tt(t, h, e) : void 0;
  }, i = (l, u) => {
    if (l && l.length > 0) return l.map(Et);
    if (!t) return [];
    const h = $t[u];
    return h ? Ot(t, h, e) : [];
  }, r = o.overview ?? {}, s = o.maintenance ?? {}, a = r.fuel ?? {};
  return {
    engine: n(o.engine_entity, "engine"),
    lock: n(o.lock_entity, "lock"),
    odometer: n(r.odometer_entity, "odometer"),
    range: n(r.range_entity, "range"),
    fuel_level: n(a.level_entity, "fuel_level"),
    fuel_amount: n(a.amount_entity, "fuel_amount"),
    fuel_capacity: n(a.capacity_entity, "fuel_capacity"),
    doors: i(r.doors, "doors"),
    windows: i(r.windows, "windows"),
    sunroof: n(r.sunroof_entity, "sunroof"),
    tailgate: n(r.tailgate_entity, "tailgate"),
    hood: n(r.hood_entity, "hood"),
    tires: i(s.tires, "tires"),
    oil: n(s.oil_level_entity, "oil"),
    brake_fluid: n(s.brake_fluid_entity, "brake_fluid"),
    coolant: n(s.coolant_level_entity, "coolant"),
    washer_fluid: n(s.washer_fluid_entity, "washer_fluid")
  };
}
const Me = { allOk: "All closed", problemVerb: "open" }, Ut = { allOk: "OK", problemVerb: "warning" };
function Ge(o, e) {
  if (!o || W.has(o.state.toLowerCase())) return e;
  const t = o.state.replace(/_/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}
function Ne(o, e) {
  if (!o || W.has(o.state.toLowerCase())) return e;
  const t = o.attributes.unit_of_measurement, n = Number(o.state), i = Number.isFinite(n) ? n.toLocaleString("en-US") : o.state;
  return t ? `${i} ${t}` : i;
}
function Rt(o, e, t, n = {}) {
  const i = n.unknownValue ?? se, r = n.fuelWarnPercent ?? Fe, s = n.seen ?? /* @__PURE__ */ new Set(), a = [];
  if (o.odometer && a.push({
    key: "odometer",
    section: "overview",
    kind: "value",
    label: "Odometer",
    icon: t.odometer ?? "",
    value: Ne(e[o.odometer], i),
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
      warn: d !== null && d < r,
      fuelPercent: d
    });
  }
  o.range && a.push({
    key: "range",
    section: "overview",
    kind: "value",
    label: "Range",
    icon: t.range ?? "",
    value: Ne(e[o.range], i),
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
      labels: Me,
      noun: "door"
    },
    {
      key: "windows",
      section: "overview",
      label: "Windows",
      icon: t.windows ?? "",
      refs: o.windows,
      labels: Me,
      noun: "window"
    }
  ], h = [
    {
      key: "sunroof",
      section: "overview",
      label: "Sunroof",
      icon: t.sunroof ?? "",
      entity: o.sunroof,
      okText: "Closed"
    },
    {
      key: "tailgate",
      section: "overview",
      label: "Tailgate",
      icon: t.tailgate ?? "",
      entity: o.tailgate,
      okText: "Closed"
    },
    {
      key: "hood",
      section: "overview",
      label: "Hood",
      icon: t.hood ?? "",
      entity: o.hood,
      okText: "Closed"
    }
  ], c = (d) => {
    if (d.refs.length === 0) return;
    const w = d.refs.map((S) => St(S, e, n.vehicleName, d.noun)), g = Ct(d.refs, e, { ...d.labels, unknownValue: i }, w);
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
  }, f = (d) => {
    if (!d.entity) return;
    const w = e[d.entity], g = ae(w), S = s.has(d.entity);
    g === "unknown" && !S || a.push({
      key: d.key,
      section: d.section,
      kind: "status",
      label: d.label,
      icon: d.icon,
      value: g === "unknown" ? i : Ge(w, i),
      status: g,
      targetEntity: d.entity,
      warn: d.section === "overview" && g === "problem"
    });
  };
  for (const d of u) c(d);
  for (const d of h) f(d);
  c({
    key: "tires",
    section: "maintenance",
    label: "Tire pressure",
    icon: t.tires ?? "",
    refs: o.tires,
    labels: Ut,
    noun: "tire"
  });
  const p = [
    {
      key: "oil",
      section: "maintenance",
      label: "Oil level",
      icon: t.oil ?? "",
      entity: o.oil,
      okText: "OK"
    },
    {
      key: "brake_fluid",
      section: "maintenance",
      label: "Brake fluid",
      icon: t.brake_fluid ?? "",
      entity: o.brake_fluid,
      okText: "OK"
    },
    {
      key: "coolant",
      section: "maintenance",
      label: "Coolant level",
      icon: t.coolant ?? "",
      entity: o.coolant,
      okText: "OK"
    },
    {
      key: "washer_fluid",
      section: "maintenance",
      label: "Washer fluid",
      icon: t.washer_fluid ?? "",
      entity: o.washer_fluid,
      okText: "OK"
    }
  ];
  for (const d of p) f(d);
  return a;
}
function He(o) {
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
const Lt = {
  "badge.warning": "Warning",
  "badge.attention": "Attention",
  "section.overview": "Overview",
  "section.maintenance": "Maintenance",
  "state.not_running": "Not running",
  "state.running": "Running"
};
function C(o) {
  return Lt[o] ?? o;
}
const Mt = Je`
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
  .status-dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--disabled-text-color, #bdbdbd);
  }
  .status-dot.running {
    background: var(--success-color, #4caf50);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .status-dot.running {
      animation: none;
    }
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
  .row:last-child,
  .row.no-divider {
    border-bottom: none;
  }
  .section.no-dividers .row {
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

  /* ---- Fuel bar ---- */
  .fuel-bar {
    height: 4px;
    border-radius: 2px;
    background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08);
    margin: 2px 0 8px;
    overflow: hidden;
  }
  .fuel-bar-fill {
    height: 100%;
    border-radius: 2px;
    background: var(--primary-color, #03a9f4);
    transition: width 0.4s ease;
  }
  .fuel-bar-fill.warn {
    background: var(--warning-color, #ffa600);
  }
  @media (prefers-reduced-motion: reduce) {
    .fuel-bar-fill {
      transition: none;
    }
  }
`;
var Nt = Object.defineProperty, Ye = (o, e, t, n) => {
  for (var i = void 0, r = o.length - 1, s; r >= 0; r--)
    (s = o[r]) && (i = s(e, t, i) || i);
  return i && Nt(e, t, i), i;
};
const v = ["sensor", "binary_sensor", "cover", "switch"], m = (o) => ({ entity: { domain: o } }), J = (o) => ({ entity: { domain: o, multiple: !0 } }), Ht = [
  {
    name: "general",
    type: "expandable",
    flatten: !0,
    expanded: !0,
    schema: [
      { name: "name", selector: { text: {} } },
      { name: "icon", selector: { icon: {} } },
      { name: "prefix", selector: { text: {} } },
      { name: "engine_entity", selector: m(["binary_sensor", "sensor", "switch"]) },
      { name: "lock_entity", selector: m(["lock"]) }
    ]
  },
  {
    name: "overview",
    type: "expandable",
    flatten: !0,
    schema: [
      { name: "odometer_entity", selector: m(["sensor"]) },
      { name: "range_entity", selector: m(["sensor"]) },
      { name: "fuel_level_entity", selector: m(["sensor"]) },
      { name: "fuel_amount_entity", selector: m(["sensor"]) },
      { name: "fuel_capacity_entity", selector: m(["sensor"]) },
      { name: "doors", selector: J(v) },
      { name: "windows", selector: J(v) },
      { name: "sunroof_entity", selector: m(v) },
      { name: "tailgate_entity", selector: m(v) },
      { name: "hood_entity", selector: m(v) }
    ]
  },
  {
    name: "maintenance",
    type: "expandable",
    flatten: !0,
    schema: [
      { name: "tires", selector: J(v) },
      { name: "oil_level_entity", selector: m(v) },
      { name: "brake_fluid_entity", selector: m(v) },
      { name: "coolant_level_entity", selector: m(v) },
      { name: "washer_fluid_entity", selector: m(v) }
    ]
  },
  {
    name: "display",
    type: "expandable",
    flatten: !0,
    schema: [
      {
        name: "mode",
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
      },
      { name: "auto_expand_maintenance", selector: { boolean: {} } },
      { name: "show_section_icons", selector: { boolean: {} } },
      { name: "show_dividers", selector: { boolean: {} } },
      { name: "unknown_value", selector: { text: {} } },
      { name: "fuel_warn_percent", selector: { number: { min: 0, max: 100, mode: "box" } } }
    ]
  }
], Dt = {
  general: "General",
  overview: "Overview",
  maintenance: "Maintenance",
  display: "Display",
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
  mode: "Mode",
  auto_expand_maintenance: "Auto-expand on maintenance warning",
  show_section_icons: "Show row icons",
  show_dividers: "Show row dividers",
  unknown_value: "Unknown value text",
  fuel_warn_percent: "Low fuel threshold (%)"
}, It = {
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
function X(o) {
  return typeof o == "string" ? o : o.entity;
}
class le extends T {
  constructor() {
    super(...arguments), this._computeLabel = (e) => Dt[e.name] ?? e.name, this._computeHelper = (e) => {
      var a;
      if (e.name === "prefix")
        return "Entity ID prefix (e.g. volvo_xc60). The card auto-discovers matching entities; explicit fields below always win.";
      if (!this.hass || !((a = this._config) != null && a.prefix)) return;
      const t = It[e.name];
      if (!t) return;
      const i = this._formData()[e.name];
      if (i !== void 0 && (!Array.isArray(i) || i.length > 0))
        return;
      const s = qe(this._config, this.hass.states)[t];
      return Array.isArray(s) ? s.length > 0 ? `Auto-discovered: ${s.map((l) => l.entity).join(", ")}` : void 0 : s ? `Auto-discovered: ${s}` : void 0;
    };
  }
  setConfig(e) {
    this._config = e;
  }
  _formData() {
    var t, n, i, r, s, a, l, u, h, c, f, p, d, w, g, S, ue, he, _e, fe, pe, ge, me, ye, ve, we, be;
    const e = this._config;
    return e ? {
      name: e.name,
      icon: e.icon,
      prefix: e.prefix,
      engine_entity: e.engine_entity,
      lock_entity: e.lock_entity,
      odometer_entity: (t = e.overview) == null ? void 0 : t.odometer_entity,
      range_entity: (n = e.overview) == null ? void 0 : n.range_entity,
      fuel_level_entity: (r = (i = e.overview) == null ? void 0 : i.fuel) == null ? void 0 : r.level_entity,
      fuel_amount_entity: (a = (s = e.overview) == null ? void 0 : s.fuel) == null ? void 0 : a.amount_entity,
      fuel_capacity_entity: (u = (l = e.overview) == null ? void 0 : l.fuel) == null ? void 0 : u.capacity_entity,
      doors: (c = (h = e.overview) == null ? void 0 : h.doors) == null ? void 0 : c.map(X),
      windows: (p = (f = e.overview) == null ? void 0 : f.windows) == null ? void 0 : p.map(X),
      sunroof_entity: (d = e.overview) == null ? void 0 : d.sunroof_entity,
      tailgate_entity: (w = e.overview) == null ? void 0 : w.tailgate_entity,
      hood_entity: (g = e.overview) == null ? void 0 : g.hood_entity,
      tires: (ue = (S = e.maintenance) == null ? void 0 : S.tires) == null ? void 0 : ue.map(X),
      oil_level_entity: (he = e.maintenance) == null ? void 0 : he.oil_level_entity,
      brake_fluid_entity: (_e = e.maintenance) == null ? void 0 : _e.brake_fluid_entity,
      coolant_level_entity: (fe = e.maintenance) == null ? void 0 : fe.coolant_level_entity,
      washer_fluid_entity: (pe = e.maintenance) == null ? void 0 : pe.washer_fluid_entity,
      mode: (ge = e.display) == null ? void 0 : ge.mode,
      auto_expand_maintenance: (me = e.display) == null ? void 0 : me.auto_expand_maintenance,
      show_section_icons: (ye = e.display) == null ? void 0 : ye.show_section_icons,
      show_dividers: (ve = e.display) == null ? void 0 : ve.show_dividers,
      unknown_value: (we = e.display) == null ? void 0 : we.unknown_value,
      fuel_warn_percent: (be = e.display) == null ? void 0 : be.fuel_warn_percent
    } : {};
  }
  _valueChanged(e) {
    if (e.stopPropagation(), !this._config) return;
    const t = e.detail.value, n = { ...t };
    for (const h of ["general", "overview", "maintenance", "display"]) {
      const c = t[h];
      c && typeof c == "object" && !Array.isArray(c) && (Object.assign(n, c), delete n[h]);
    }
    const i = (h) => {
      const c = Object.entries(h).filter(
        ([, f]) => f !== void 0 && f !== "" && !(Array.isArray(f) && f.length === 0)
      );
      return c.length > 0 ? Object.fromEntries(c) : void 0;
    }, r = i({
      level_entity: n.fuel_level_entity,
      amount_entity: n.fuel_amount_entity,
      capacity_entity: n.fuel_capacity_entity
    }), s = i({
      odometer_entity: n.odometer_entity,
      range_entity: n.range_entity,
      fuel: r,
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
      ...s ? { overview: s } : {},
      ...a ? { maintenance: a } : {}
    }, u = i({
      mode: n.mode,
      auto_expand_maintenance: n.auto_expand_maintenance,
      show_section_icons: n.show_section_icons,
      show_dividers: n.show_dividers,
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
  render() {
    return !this.hass || !this._config ? _ : y`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${Ht}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }
}
Ye([
  ie({ attribute: !1 })
], le.prototype, "hass");
Ye([
  oe()
], le.prototype, "_config");
customElements.define(Be, le);
var zt = Object.defineProperty, ce = (o, e, t, n) => {
  for (var i = void 0, r = o.length - 1, s; r >= 0; r--)
    (s = o[r]) && (i = s(e, t, i) || i);
  return i && zt(e, t, i), i;
};
const de = class de extends T {
  constructor() {
    super(...arguments), this._expanded = !1, this._resolvedStateCount = -1, this._seen = /* @__PURE__ */ new Set(), this._manuallyToggled = !1, this._lastBadgeTier = null;
  }
  static getConfigElement() {
    return document.createElement(Be);
  }
  static getStubConfig(e) {
    const t = { type: `custom:${re}` };
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
    return ((t = (e = this._config) == null ? void 0 : e.display) == null ? void 0 : t.unknown_value) ?? se;
  }
  _resolve() {
    if (!this.hass || !this._config) return;
    const e = Object.keys(this.hass.states).length;
    return (!this._resolved || e !== this._resolvedStateCount) && (this._resolved = qe(this._config, this.hass.states), this._resolvedStateCount = e), this._resolved;
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
      n && !this._seen.has(n) && !At(this.hass.states[n]) && this._seen.add(n);
  }
  willUpdate() {
    var r, s;
    const e = this._resolve();
    if (!e || !this.hass) return;
    this._trackSeen(e);
    const t = Le(He(e), this.hass.states), n = this._lastBadgeTier === "warning", i = t.tier === "warning";
    (s = (r = this._config) == null ? void 0 : r.display) != null && s.auto_expand_maintenance && this._mode === "expandable" && !this._manuallyToggled && (i && !n ? this._setExpanded(!0) : !i && n && this._setExpanded(!1)), this._lastBadgeTier = t.tier;
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
    const t = this.hass.states, n = this._config.name ?? vt, i = this._config.icon ?? yt, r = Le(He(e), t), s = this._mode !== "compact", a = this._mode === "expandable", l = this._mode === "expanded" || a && this._expanded, u = e.engine ? t[e.engine] : void 0, h = u !== void 0 && (u.state === "on" || u.state.toLowerCase() === "running"), c = u ? u.entity_id.startsWith("binary_sensor.") ? C(h ? "state.running" : "state.not_running") : Ge(u, this._unknownValue) : void 0, f = e.lock ? t[e.lock] : void 0, p = f !== void 0 && f.state !== "locked";
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
            ${c !== void 0 ? y`<div class="subtitle">
                    <span class="status-dot ${h ? "running" : ""}"></span>
                    <span>${c}</span>
                  </div>` : _}
          </div>
          ${r.tier ? y`<div
                  class="badge ${r.tier}"
                  title=${r.items.join(", ")}
                  @click=${(d) => {
      d.stopPropagation(), this._toggle();
    }}
                >
                  <ha-icon
                    .icon=${r.tier === "warning" ? "mdi:alert-circle" : "mdi:car-door"}
                  ></ha-icon>
                  <span
                    >${r.tier === "warning" ? C("badge.warning") : C("badge.attention")}</span
                  >
                </div>` : _}
          ${f ? y`<button
                  class="lock-button ${p ? "unlocked" : ""}"
                  aria-label=${p ? "Unlocked" : "Locked"}
                  @click=${this._onLockTap}
                >
                  <ha-icon .icon=${p ? "mdi:lock-open-variant" : "mdi:lock"}></ha-icon>
                </button>` : _}
          ${a ? y`<div class="chevron ${l ? "open" : ""}">
                  <ha-icon icon="mdi:chevron-down"></ha-icon>
                </div>` : _}
        </div>
        ${s ? y`<div class="body ${l ? "open" : ""}">
                <div class="inner">${this._renderSections(e)}</div>
              </div>` : _}
      </ha-card>
    `;
  }
  _renderSections(e) {
    var r;
    if (!this.hass || !this._config) return _;
    const t = Rt(e, this.hass.states, xt, {
      unknownValue: this._unknownValue,
      fuelWarnPercent: ((r = this._config.display) == null ? void 0 : r.fuel_warn_percent) ?? Fe,
      seen: this._seen,
      vehicleName: this._config.name
    }), n = t.filter((s) => s.section === "overview"), i = t.filter((s) => s.section === "maintenance");
    return y`
      <div class="sections">
        ${this._renderSection(C("section.overview"), n)}
        ${this._renderSection(C("section.maintenance"), i)}
      </div>
    `;
  }
  _renderSection(e, t) {
    var i, r;
    if (t.length === 0) return _;
    const n = ((r = (i = this._config) == null ? void 0 : i.display) == null ? void 0 : r.show_dividers) ?? !0;
    return y`
      <div class="section-heading">${e}</div>
      <div class="section ${n ? "" : "no-dividers"}">
        ${t.map((s) => this._renderRow(s))}
      </div>
    `;
  }
  _renderRow(e) {
    var r, s;
    const t = ((s = (r = this._config) == null ? void 0 : r.display) == null ? void 0 : s.show_section_icons) ?? !0, i = e.section === "maintenance" && e.status === "problem" ? "error" : e.warn ? "warn" : "";
    return y`
      <div
        class="row ${e.key === "fuel" && e.fuelPercent !== null ? "no-divider" : ""}"
        title=${e.title ?? _}
        @click=${() => this._moreInfo(e.targetEntity)}
      >
        ${t ? y`<div class="row-icon"><ha-icon .icon=${e.icon}></ha-icon></div>` : _}
        <div class="row-label">${e.label}</div>
        <div class="row-value ${i}">${e.value}</div>
      </div>
      ${e.key === "fuel" && e.fuelPercent !== null && e.fuelPercent !== void 0 ? y`<div class="fuel-bar">
              <div
                class="fuel-bar-fill ${e.warn ? "warn" : ""}"
                style="width: ${e.fuelPercent}%"
              ></div>
            </div>` : _}
    `;
  }
};
de.styles = Mt;
let R = de;
ce([
  ie({ attribute: !1 })
], R.prototype, "hass");
ce([
  oe()
], R.prototype, "_config");
ce([
  oe()
], R.prototype, "_expanded");
customElements.define(re, R);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: re,
  name: "Compact Vehicle Card",
  description: "A slim, integration-agnostic vehicle card with expandable Overview and Maintenance sections.",
  preview: !1,
  documentationURL: "https://github.com/timblazing/compact-vehicle-card"
});
console.info(
  "%c COMPACT-VEHICLE-CARD %c v1.0.1 ",
  "color: white; background: #555; font-weight: 700;",
  "color: #555; background: #ddd; font-weight: 700;"
);
export {
  R as CompactVehicleCard
};
