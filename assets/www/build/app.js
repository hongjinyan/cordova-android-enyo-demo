
// minifier: path aliases

enyo.path.addPaths({layout: "/Users/phil/src/enyo/git/sampler/enyo/tools/../../lib/layout/", onyx: "/Users/phil/src/enyo/git/sampler/enyo/tools/../../lib/onyx/", onyx: "/Users/phil/src/enyo/git/sampler/enyo/tools/../../lib/onyx/source/", canvas: "/Users/phil/src/enyo/git/sampler/enyo/tools/../../lib/canvas/"});

// FittableLayout.js

enyo.kind({
name: "enyo.FittableLayout",
kind: "Layout",
calcFitIndex: function() {
for (var e = 0, t = this.container.children, n; n = t[e]; e++) if (n.fit && n.showing) return e;
},
getFitControl: function() {
var e = this.container.children, t = e[this.fitIndex];
return t && t.fit && t.showing || (this.fitIndex = this.calcFitIndex(), t = e[this.fitIndex]), t;
},
getLastControl: function() {
var e = this.container.children, t = e.length - 1, n = e[t];
while ((n = e[t]) && !n.showing) t--;
return n;
},
_reflow: function(e, t, n, r) {
this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
var i = this.getFitControl();
if (!i) return;
var s = 0, o = 0, u = 0, a, f = this.container.hasNode();
f && (a = enyo.dom.calcPaddingExtents(f), s = f[t] - (a[n] + a[r]));
var l = i.getBounds();
o = l[n] - (a && a[n] || 0);
var c = this.getLastControl();
if (c) {
var h = enyo.dom.getComputedBoxValue(c.hasNode(), "margin", r) || 0;
if (c != i) {
var p = c.getBounds(), d = l[n] + l[e], v = p[n] + p[e] + h;
u = v - d;
} else u = h;
}
var m = s - (o + u);
i.applyStyle(e, m + "px");
},
reflow: function() {
this.orient == "h" ? this._reflow("width", "clientWidth", "left", "right") : this._reflow("height", "clientHeight", "top", "bottom");
}
}), enyo.kind({
name: "enyo.FittableColumnsLayout",
kind: "FittableLayout",
orient: "h",
layoutClass: "enyo-fittable-columns-layout"
}), enyo.kind({
name: "enyo.FittableRowsLayout",
kind: "FittableLayout",
layoutClass: "enyo-fittable-rows-layout",
orient: "v"
});

// FittableRows.js

enyo.kind({
name: "enyo.FittableRows",
layoutKind: "FittableRowsLayout",
noStretch: !1
});

// FittableColumns.js

enyo.kind({
name: "enyo.FittableColumns",
layoutKind: "FittableColumnsLayout",
noStretch: !1
});

// FlyweightRepeater.js

enyo.kind({
name: "enyo.FlyweightRepeater",
published: {
count: 0,
multiSelect: !1,
toggleSelected: !1,
clientClasses: "",
clientStyle: ""
},
events: {
onSetupItem: ""
},
components: [ {
kind: "Selection",
onSelect: "selectDeselect",
onDeselect: "selectDeselect"
}, {
name: "client"
} ],
rowOffset: 0,
bottomUp: !1,
create: function() {
this.inherited(arguments), this.multiSelectChanged(), this.clientClassesChanged(), this.clientStyleChanged();
},
multiSelectChanged: function() {
this.$.selection.setMulti(this.multiSelect);
},
clientClassesChanged: function() {
this.$.client.setClasses(this.clientClasses);
},
clientStyleChanged: function() {
this.$.client.setStyle(this.clientStyle);
},
setupItem: function(e) {
this.doSetupItem({
index: e,
selected: this.isSelected(e)
});
},
generateChildHtml: function() {
var e = "";
this.index = null;
for (var t = 0, n = 0; t < this.count; t++) n = this.rowOffset + (this.bottomUp ? this.count - t - 1 : t), this.setupItem(n), this.$.client.setAttribute("index", n), e += this.inherited(arguments), this.$.client.teardownRender();
return e;
},
previewDomEvent: function(e) {
var t = this.index = this.rowForEvent(e);
e.rowIndex = e.index = t, e.flyweight = this;
},
decorateEvent: function(e, t, n) {
var r = t && t.index != null ? t.index : this.index;
t && r != null && (t.index = r, t.flyweight = this), this.inherited(arguments);
},
tap: function(e, t) {
this.toggleSelected ? this.$.selection.toggle(t.index) : this.$.selection.select(t.index);
},
selectDeselect: function(e, t) {
this.renderRow(t.key);
},
getSelection: function() {
return this.$.selection;
},
isSelected: function(e) {
return this.getSelection().isSelected(e);
},
renderRow: function(e) {
var t = this.fetchRowNode(e);
t && (this.setupItem(e), t.innerHTML = this.$.client.generateChildHtml(), this.$.client.teardownChildren());
},
fetchRowNode: function(e) {
if (this.hasNode()) {
var t = this.node.querySelectorAll('[index="' + e + '"]');
return t && t[0];
}
},
rowForEvent: function(e) {
var t = e.target, n = this.hasNode().id;
while (t && t.parentNode && t.id != n) {
var r = t.getAttribute && t.getAttribute("index");
if (r !== null) return Number(r);
t = t.parentNode;
}
return -1;
},
prepareRow: function(e) {
var t = this.fetchRowNode(e);
enyo.FlyweightRepeater.claimNode(this.$.client, t);
},
lockRow: function() {
this.$.client.teardownChildren();
},
performOnRow: function(e, t, n) {
t && (this.prepareRow(e), enyo.call(n || null, t), this.lockRow());
},
statics: {
claimNode: function(e, t) {
var n = t && t.querySelectorAll("#" + e.id);
n = n && n[0], e.generated = Boolean(n || !e.tag), e.node = n, e.node && e.rendered();
for (var r = 0, i = e.children, s; s = i[r]; r++) this.claimNode(s, t);
}
}
});

// List.js

enyo.kind({
name: "enyo.List",
kind: "Scroller",
classes: "enyo-list",
published: {
count: 0,
rowsPerPage: 50,
bottomUp: !1,
multiSelect: !1,
toggleSelected: !1,
fixedHeight: !1
},
events: {
onSetupItem: ""
},
handlers: {
onAnimateFinish: "animateFinish"
},
rowHeight: 0,
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
} ]
} ],
create: function() {
this.pageHeights = [], this.inherited(arguments), this.getStrategy().translateOptimized = !0, this.bottomUpChanged(), this.multiSelectChanged(), this.toggleSelectedChanged();
},
createStrategy: function() {
this.controlParentName = "strategy", this.inherited(arguments), this.createChrome(this.listTools), this.controlParentName = "client", this.discoverControlParent();
},
rendered: function() {
this.inherited(arguments), this.$.generator.node = this.$.port.hasNode(), this.$.generator.generated = !0, this.reset();
},
resizeHandler: function() {
this.inherited(arguments), this.refresh();
},
bottomUpChanged: function() {
this.$.generator.bottomUp = this.bottomUp, this.$.page0.applyStyle(this.pageBound, null), this.$.page1.applyStyle(this.pageBound, null), this.pageBound = this.bottomUp ? "bottom" : "top", this.hasNode() && this.reset();
},
multiSelectChanged: function() {
this.$.generator.setMultiSelect(this.multiSelect);
},
toggleSelectedChanged: function() {
this.$.generator.setToggleSelected(this.toggleSelected);
},
countChanged: function() {
this.hasNode() && this.updateMetrics();
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.portSize = 0;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
generatePage: function(e, t) {
this.page = e;
var n = this.$.generator.rowOffset = this.rowsPerPage * this.page, r = this.$.generator.count = Math.min(this.count - n, this.rowsPerPage), i = this.$.generator.generateChildHtml();
t.setContent(i);
var s = t.getBounds().height;
!this.rowHeight && s > 0 && (this.rowHeight = Math.floor(s / r), this.updateMetrics());
if (!this.fixedHeight) {
var o = this.getPageHeight(e);
o != s && s > 0 && (this.pageHeights[e] = s, this.portSize += s - o);
}
},
update: function(e) {
var t = !1, n = this.positionToPageInfo(e), r = n.pos + this.scrollerHeight / 2, i = Math.floor(r / Math.max(n.height, this.scrollerHeight) + .5) + n.no, s = i % 2 == 0 ? i : i - 1;
this.p0 != s && this.isPageInRange(s) && (this.generatePage(s, this.$.page0), this.positionPage(s, this.$.page0), this.p0 = s, t = !0), s = i % 2 == 0 ? Math.max(1, i - 1) : i, this.p1 != s && this.isPageInRange(s) && (this.generatePage(s, this.$.page1), this.positionPage(s, this.$.page1), this.p1 = s, t = !0), t && !this.fixedHeight && (this.adjustBottomPage(), this.adjustPortSize());
},
updateForPosition: function(e) {
this.update(this.calcPos(e));
},
calcPos: function(e) {
return this.bottomUp ? this.portSize - this.scrollerHeight - e : e;
},
adjustBottomPage: function() {
var e = this.p0 >= this.p1 ? this.$.page0 : this.$.page1;
this.positionPage(e.pageNo, e);
},
adjustPortSize: function() {
this.scrollerHeight = this.getBounds().height;
var e = Math.max(this.scrollerHeight, this.portSize);
this.$.port.applyStyle("height", e + "px");
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e);
t.applyStyle(this.pageBound, n + "px");
},
pageToPosition: function(e) {
var t = 0, n = e;
while (n > 0) n--, t += this.getPageHeight(n);
return t;
},
positionToPageInfo: function(e) {
var t = -1, n = this.calcPos(e), r = this.defaultPageHeight;
while (n >= 0) t++, r = this.getPageHeight(t), n -= r;
return {
no: t,
height: r,
pos: n + r
};
},
isPageInRange: function(e) {
return e == Math.max(0, Math.min(this.pageCount - 1, e));
},
getPageHeight: function(e) {
return this.pageHeights[e] || this.defaultPageHeight;
},
invalidatePages: function() {
this.p0 = this.p1 = null, this.$.page0.setContent(""), this.$.page1.setContent("");
},
invalidateMetrics: function() {
this.pageHeights = [], this.rowHeight = 0, this.updateMetrics();
},
scroll: function(e, t) {
var n = this.inherited(arguments);
return this.update(this.getScrollTop()), n;
},
scrollToBottom: function() {
this.update(this.getScrollBounds().maxTop), this.inherited(arguments);
},
setScrollTop: function(e) {
this.update(e), this.inherited(arguments), this.twiddle();
},
getScrollPosition: function() {
return this.calcPos(this.getScrollTop());
},
setScrollPosition: function(e) {
this.setScrollTop(this.calcPos(e));
},
scrollToRow: function(e) {
var t = Math.floor(e / this.rowsPerPage), n = e % this.rowsPerPage, r = this.pageToPosition(t);
this.updateForPosition(r), r = this.pageToPosition(t), this.setScrollPosition(r);
if (t == this.p0 || t == this.p1) {
var i = this.$.generator.fetchRowNode(e);
if (i) {
var s = i.offsetTop;
this.bottomUp && (s = this.getPageHeight(t) - i.offsetHeight - s);
var o = this.getScrollPosition() + s;
this.setScrollPosition(o);
}
}
},
scrollToStart: function() {
this[this.bottomUp ? "scrollToBottom" : "scrollToTop"]();
},
scrollToEnd: function() {
this[this.bottomUp ? "scrollToTop" : "scrollToBottom"]();
},
refresh: function() {
this.invalidatePages(), this.update(this.getScrollTop()), this.stabilize(), enyo.platform.android === 4 && this.twiddle();
},
reset: function() {
this.getSelection().clear(), this.invalidateMetrics(), this.invalidatePages(), this.stabilize(), this.scrollToStart();
},
getSelection: function() {
return this.$.generator.getSelection();
},
select: function(e, t) {
return this.getSelection().select(e, t);
},
isSelected: function(e) {
return this.$.generator.isSelected(e);
},
renderRow: function(e) {
this.$.generator.renderRow(e);
},
prepareRow: function(e) {
this.$.generator.prepareRow(e);
},
lockRow: function() {
this.$.generator.lockRow();
},
performOnRow: function(e, t, n) {
this.$.generator.performOnRow(e, t, n);
},
animateFinish: function(e) {
return this.twiddle(), !0;
},
twiddle: function() {
var e = this.getStrategy();
enyo.call(e, "twiddle");
}
});

// PulldownList.js

enyo.kind({
name: "enyo.PulldownList",
kind: "List",
touch: !0,
pully: null,
pulldownTools: [ {
name: "pulldown",
classes: "enyo-list-pulldown",
components: [ {
name: "puller",
kind: "Puller"
} ]
} ],
events: {
onPullStart: "",
onPullCancel: "",
onPull: "",
onPullRelease: "",
onPullComplete: ""
},
handlers: {
onScrollStart: "scrollStartHandler",
onScrollStop: "scrollStopHandler",
ondragfinish: "dragfinish"
},
pullingMessage: "Pull down to refresh...",
pulledMessage: "Release to refresh...",
loadingMessage: "Loading...",
pullingIconClass: "enyo-puller-arrow enyo-puller-arrow-down",
pulledIconClass: "enyo-puller-arrow enyo-puller-arrow-up",
loadingIconClass: "",
create: function() {
var e = {
kind: "Puller",
showing: !1,
text: this.loadingMessage,
iconClass: this.loadingIconClass,
onCreate: "setPully"
};
this.listTools.splice(0, 0, e), this.inherited(arguments), this.setPulling();
},
initComponents: function() {
this.createChrome(this.pulldownTools), this.accel = enyo.dom.canAccelerate(), this.translation = this.accel ? "translate3d" : "translate", this.inherited(arguments);
},
setPully: function(e, t) {
this.pully = t.originator;
},
scrollStartHandler: function() {
this.firedPullStart = !1, this.firedPull = !1, this.firedPullCancel = !1;
},
scroll: function(e, t) {
var n = this.inherited(arguments);
this.completingPull && this.pully.setShowing(!1);
var r = this.getStrategy().$.scrollMath, i = r.y;
return r.isInOverScroll() && i > 0 && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + i + "px" + (this.accel ? ",0" : "")), this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), i > this.pullHeight && !this.firedPull && (this.firedPull = !0, this.firedPullCancel = !1, this.pull()), this.firedPull && !this.firedPullCancel && i < this.pullHeight && (this.firedPullCancel = !0, this.firedPull = !1, this.pullCancel())), n;
},
scrollStopHandler: function() {
this.completingPull && (this.completingPull = !1, this.doPullComplete());
},
dragfinish: function() {
if (this.firedPull) {
var e = this.getStrategy().$.scrollMath;
e.setScrollY(e.y - this.pullHeight), this.pullRelease();
}
},
completePull: function() {
this.completingPull = !0, this.$.strategy.$.scrollMath.setScrollY(this.pullHeight), this.$.strategy.$.scrollMath.start();
},
pullStart: function() {
this.setPulling(), this.pully.setShowing(!1), this.$.puller.setShowing(!0), this.doPullStart();
},
pull: function() {
this.setPulled(), this.doPull();
},
pullCancel: function() {
this.setPulling(), this.doPullCancel();
},
pullRelease: function() {
this.$.puller.setShowing(!1), this.pully.setShowing(!0), this.doPullRelease();
},
setPulling: function() {
this.$.puller.setText(this.pullingMessage), this.$.puller.setIconClass(this.pullingIconClass);
},
setPulled: function() {
this.$.puller.setText(this.pulledMessage), this.$.puller.setIconClass(this.pulledIconClass);
}
}), enyo.kind({
name: "enyo.Puller",
classes: "enyo-puller",
published: {
text: "",
iconClass: ""
},
events: {
onCreate: ""
},
components: [ {
name: "icon"
}, {
name: "text",
tag: "span",
classes: "enyo-puller-text"
} ],
create: function() {
this.inherited(arguments), this.doCreate(), this.textChanged(), this.iconClassChanged();
},
textChanged: function() {
this.$.text.setContent(this.text);
},
iconClassChanged: function() {
this.$.icon.setClasses(this.iconClass);
}
});

// Slideable.js

enyo.kind({
name: "enyo.Slideable",
kind: "Control",
published: {
axis: "h",
value: 0,
unit: "px",
min: 0,
max: 0,
accelerated: "auto",
overMoving: !0,
draggable: !0
},
events: {
onAnimateFinish: "",
onChange: ""
},
preventDragPropagation: !1,
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
} ],
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
kDragScalar: 1,
dragEventProp: "dx",
unitModifier: !1,
canTransform: !1,
create: function() {
this.inherited(arguments), this.acceleratedChanged(), this.transformChanged(), this.axisChanged(), this.valueChanged(), this.addClass("enyo-slideable");
},
initComponents: function() {
this.createComponents(this.tools), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.canModifyUnit(), this.updateDragScalar();
},
resizeHandler: function() {
this.inherited(arguments), this.updateDragScalar();
},
canModifyUnit: function() {
if (!this.canTransform) {
var e = this.getInitialStyleValue(this.hasNode(), this.boundary);
e.match(/px/i) && this.unit === "%" && (this.unitModifier = this.getBounds()[this.dimension]);
}
},
getInitialStyleValue: function(e, t) {
var n = enyo.dom.getComputedStyle(e);
return n ? n.getPropertyValue(t) : e && e.currentStyle ? e.currentStyle[t] : "0";
},
updateBounds: function(e, t) {
var n = {};
n[this.boundary] = e, this.setBounds(n, this.unit), this.setInlineStyles(e, t);
},
updateDragScalar: function() {
if (this.unit == "%") {
var e = this.getBounds()[this.dimension];
this.kDragScalar = e ? 100 / e : 1, this.canTransform || this.updateBounds(this.value, 100);
}
},
transformChanged: function() {
this.canTransform = enyo.dom.canTransform();
},
acceleratedChanged: function() {
enyo.platform.android > 2 || enyo.dom.accelerate(this, this.accelerated);
},
axisChanged: function() {
var e = this.axis == "h";
this.dragMoveProp = e ? "dx" : "dy", this.shouldDragProp = e ? "horizontal" : "vertical", this.transform = e ? "translateX" : "translateY", this.dimension = e ? "width" : "height", this.boundary = e ? "left" : "top";
},
setInlineStyles: function(e, t) {
var n = {};
this.unitModifier ? (n[this.boundary] = this.percentToPixels(e, this.unitModifier), n[this.dimension] = this.unitModifier, this.setBounds(n)) : (t ? n[this.dimension] = t : n[this.boundary] = e, this.setBounds(n, this.unit));
},
valueChanged: function(e) {
var t = this.value;
this.isOob(t) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(t) : this.clampValue(t)), enyo.platform.android > 2 && (this.value ? (e === 0 || e === undefined) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), this.canTransform ? enyo.dom.transformValue(this, this.transform, this.value + this.unit) : this.setInlineStyles(this.value, !1), this.doChange();
},
getAnimator: function() {
return this.$.animator;
},
isAtMin: function() {
return this.value <= this.calcMin();
},
isAtMax: function() {
return this.value >= this.calcMax();
},
calcMin: function() {
return this.min;
},
calcMax: function() {
return this.max;
},
clampValue: function(e) {
var t = this.calcMin(), n = this.calcMax();
return Math.max(t, Math.min(e, n));
},
dampValue: function(e) {
return this.dampBound(this.dampBound(e, this.min, 1), this.max, -1);
},
dampBound: function(e, t, n) {
var r = e;
return r * n < t * n && (r = t + (r - t) / 4), r;
},
percentToPixels: function(e, t) {
return Math.floor(t / 100 * e);
},
pixelsToPercent: function(e) {
var t = this.unitModifier ? this.getBounds()[this.dimension] : this.container.getBounds()[this.dimension];
return e / t * 100;
},
shouldDrag: function(e) {
return this.draggable && e[this.shouldDragProp];
},
isOob: function(e) {
return e > this.calcMax() || e < this.calcMin();
},
dragstart: function(e, t) {
if (this.shouldDrag(t)) return t.preventDefault(), this.$.animator.stop(), t.dragInfo = {}, this.dragging = !0, this.drag0 = this.value, this.dragd0 = 0, this.preventDragPropagation;
},
drag: function(e, t) {
if (this.dragging) {
t.preventDefault();
var n = this.canTransform ? t[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(t[this.dragMoveProp]), r = this.drag0 + n, i = n - this.dragd0;
return this.dragd0 = n, i && (t.dragInfo.minimizing = i < 0), this.setValue(r), this.preventDragPropagation;
}
},
dragfinish: function(e, t) {
if (this.dragging) return this.dragging = !1, this.completeDrag(t), t.preventTap(), this.preventDragPropagation;
},
completeDrag: function(e) {
this.value !== this.calcMax() && this.value != this.calcMin() && this.animateToMinMax(e.dragInfo.minimizing);
},
isAnimating: function() {
return this.$.animator.isAnimating();
},
play: function(e, t) {
this.$.animator.play({
startValue: e,
endValue: t,
node: this.hasNode()
});
},
animateTo: function(e) {
this.play(this.value, e);
},
animateToMin: function() {
this.animateTo(this.calcMin());
},
animateToMax: function() {
this.animateTo(this.calcMax());
},
animateToMinMax: function(e) {
e ? this.animateToMin() : this.animateToMax();
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.doAnimateFinish(e), !0;
},
toggleMinMax: function() {
this.animateToMinMax(!this.isAtMin());
}
});

// Arranger.js

enyo.kind({
name: "enyo.Arranger",
kind: "Layout",
layoutClass: "enyo-arranger",
accelerated: "auto",
dragProp: "ddx",
dragDirectionProp: "xDirection",
canDragProp: "horizontal",
incrementalPoints: !1,
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n._arranger = null;
this.inherited(arguments);
},
arrange: function(e, t) {},
size: function() {},
start: function() {
var e = this.container.fromIndex, t = this.container.toIndex, n = this.container.transitionPoints = [ e ];
if (this.incrementalPoints) {
var r = Math.abs(t - e) - 2, i = e;
while (r >= 0) i += t < e ? -1 : 1, n.push(i), r--;
}
n.push(this.container.toIndex);
},
finish: function() {},
canDragEvent: function(e) {
return e[this.canDragProp];
},
calcDragDirection: function(e) {
return e[this.dragDirectionProp];
},
calcDrag: function(e) {
return e[this.dragProp];
},
drag: function(e, t, n, r, i) {
var s = this.measureArrangementDelta(-e, t, n, r, i);
return s;
},
measureArrangementDelta: function(e, t, n, r, i) {
var s = this.calcArrangementDifference(t, n, r, i), o = s ? e / Math.abs(s) : 0;
return o *= this.container.fromIndex > this.container.toIndex ? -1 : 1, o;
},
calcArrangementDifference: function(e, t, n, r) {},
_arrange: function(e) {
this.containerBounds || this.reflow();
var t = this.getOrderedControls(e);
this.arrange(t, e);
},
arrangeControl: function(e, t) {
e._arranger = enyo.mixin(e._arranger || {}, t);
},
flow: function() {
this.c$ = [].concat(this.container.getPanels()), this.controlsIndex = 0;
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) {
enyo.dom.accelerate(n, this.accelerated);
if (enyo.platform.safari) {
var r = n.children;
for (var i = 0, s; s = r[i]; i++) enyo.dom.accelerate(s, this.accelerated);
}
}
},
reflow: function() {
var e = this.container.hasNode();
this.containerBounds = e ? {
width: e.clientWidth,
height: e.clientHeight
} : {}, this.size();
},
flowArrangement: function() {
var e = this.container.arrangement;
if (e) for (var t = 0, n = this.container.getPanels(), r; r = n[t]; t++) this.flowControl(r, e[t]);
},
flowControl: function(e, t) {
enyo.Arranger.positionControl(e, t);
var n = t.opacity;
n != null && enyo.Arranger.opacifyControl(e, n);
},
getOrderedControls: function(e) {
var t = Math.floor(e), n = t - this.controlsIndex, r = n > 0, i = this.c$ || [];
for (var s = 0; s < Math.abs(n); s++) r ? i.push(i.shift()) : i.unshift(i.pop());
return this.controlsIndex = t, i;
},
statics: {
positionControl: function(e, t, n) {
var r = n || "px";
if (!this.updating) if (enyo.dom.canTransform() && !enyo.platform.android) {
var i = t.left, s = t.top, i = enyo.isString(i) ? i : i && i + r, s = enyo.isString(s) ? s : s && s + r;
enyo.dom.transform(e, {
translateX: i || null,
translateY: s || null
});
} else e.setBounds(t, n);
},
opacifyControl: function(e, t) {
var n = t;
n = n > .99 ? 1 : n < .01 ? 0 : n, enyo.platform.ie < 9 ? e.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + n * 100 + ")") : e.applyStyle("opacity", n);
}
}
});

// CardArranger.js

enyo.kind({
name: "enyo.CardArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(e, t, n, r) {
return this.containerBounds.width;
},
arrange: function(e, t) {
for (var n = 0, r, i, s; r = e[n]; n++) s = n == 0 ? 1 : 0, this.arrangeControl(r, {
opacity: s
});
},
start: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.opacifyControl(n, 1), n.showing || n.setShowing(!0);
this.inherited(arguments);
}
});

// CardSlideInArranger.js

enyo.kind({
name: "enyo.CardSlideInArranger",
kind: "CardArranger",
start: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
var i = this.container.fromIndex, t = this.container.toIndex;
this.container.transitionPoints = [ t + "." + i + ".s", t + "." + i + ".f" ];
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
arrange: function(e, t) {
var n = t.split("."), r = n[0], i = n[1], s = n[2] == "s", o = this.containerBounds.width;
for (var u = 0, a = this.container.getPanels(), f, l; f = a[u]; u++) l = o, i == u && (l = s ? 0 : -o), r == u && (l = s ? o : 0), i == u && i == r && (l = 0), this.arrangeControl(f, {
left: l
});
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null
});
this.inherited(arguments);
}
});

// CarouselArranger.js

enyo.kind({
name: "enyo.CarouselArranger",
kind: "Arranger",
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds;
n.height -= t.top + t.bottom, n.width -= t.left + t.right;
var r;
for (var i = 0, s = 0, o, u; u = e[i]; i++) o = enyo.dom.calcMarginExtents(u.hasNode()), u.width = u.getBounds().width, u.marginWidth = o.right + o.left, s += (u.fit ? 0 : u.width) + u.marginWidth, u.fit && (r = u);
if (r) {
var a = n.width - s;
r.width = a >= 0 ? a : r.width;
}
for (var i = 0, f = t.left, o, u; u = e[i]; i++) u.setBounds({
top: t.top,
bottom: t.bottom,
width: u.fit ? u.width : null
});
},
arrange: function(e, t) {
this.container.wrap ? this.arrangeWrap(e, t) : this.arrangeNoWrap(e, t);
},
arrangeNoWrap: function(e, t) {
var n = this.container.getPanels(), r = this.container.clamp(t), i = this.containerBounds.width;
for (var s = r, o = 0, u; u = n[s]; s++) {
o += u.width + u.marginWidth;
if (o > i) break;
}
var a = i - o, f = 0;
if (a > 0) {
var l = r;
for (var s = r - 1, c = 0, u; u = n[s]; s--) {
c += u.width + u.marginWidth;
if (a - c <= 0) {
f = a - c, r = s;
break;
}
}
}
for (var s = 0, h = this.containerPadding.left + f, p, u; u = n[s]; s++) p = u.width + u.marginWidth, s < r ? this.arrangeControl(u, {
left: -p
}) : (this.arrangeControl(u, {
left: Math.floor(h)
}), h += p);
},
arrangeWrap: function(e, t) {
for (var n = 0, r = this.containerPadding.left, i, s; s = e[n]; n++) this.arrangeControl(s, {
left: r
}), r += s.width + s.marginWidth;
},
calcArrangementDifference: function(e, t, n, r) {
var i = Math.abs(e % this.c$.length);
return t[i].left - r[i].left;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// CollapsingArranger.js

enyo.kind({
name: "enyo.CollapsingArranger",
kind: "CarouselArranger",
size: function() {
this.clearLastSize(), this.inherited(arguments);
},
clearLastSize: function() {
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) n._fit && e != t.length - 1 && (n.applyStyle("width", null), n._fit = null);
},
arrange: function(e, t) {
var n = this.container.getPanels();
for (var r = 0, i = this.containerPadding.left, s, o; o = n[r]; r++) this.arrangeControl(o, {
left: i
}), r >= t && (i += o.width + o.marginWidth), r == n.length - 1 && t < 0 && this.arrangeControl(o, {
left: i - t
});
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels().length - 1;
return Math.abs(r[i].left - t[i].left);
},
flowControl: function(e, t) {
this.inherited(arguments);
if (this.container.realtimeFit) {
var n = this.container.getPanels(), r = n.length - 1, i = n[r];
e == i && this.fitControl(e, t.left);
}
},
finish: function() {
this.inherited(arguments);
if (!this.container.realtimeFit && this.containerBounds) {
var e = this.container.getPanels(), t = this.container.arrangement, n = e.length - 1, r = e[n];
this.fitControl(r, t[n].left);
}
},
fitControl: function(e, t) {
e._fit = !0, e.applyStyle("width", this.containerBounds.width - t + "px"), e.resized();
}
});

// OtherArrangers.js

enyo.kind({
name: "enyo.LeftRightArranger",
kind: "Arranger",
margin: 40,
axisSize: "width",
offAxisSize: "height",
axisPosition: "left",
constructor: function() {
this.inherited(arguments), this.margin = this.container.margin != null ? this.container.margin : this.margin;
},
size: function() {
var e = this.container.getPanels(), t = this.containerBounds[this.axisSize], n = t - this.margin - this.margin;
for (var r = 0, i, s; s = e[r]; r++) i = {}, i[this.axisSize] = n, i[this.offAxisSize] = "100%", s.setBounds(i);
},
start: function() {
this.inherited(arguments);
var e = this.container.fromIndex, t = this.container.toIndex, n = this.getOrderedControls(t), r = Math.floor(n.length / 2);
for (var i = 0, s; s = n[i]; i++) e > t ? i == n.length - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1) : i == n.length - 1 - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1);
},
arrange: function(e, t) {
if (this.container.getPanels().length == 1) {
var n = {};
n[this.axisPosition] = this.margin, this.arrangeControl(this.container.getPanels()[0], n);
return;
}
var r = Math.floor(this.container.getPanels().length / 2), i = this.getOrderedControls(Math.floor(t) - r), s = this.containerBounds[this.axisSize] - this.margin - this.margin, o = this.margin - s * r;
for (var u = 0, a, n, f; a = i[u]; u++) n = {}, n[this.axisPosition] = o, this.arrangeControl(a, n), o += s;
},
calcArrangementDifference: function(e, t, n, r) {
if (this.container.getPanels().length == 1) return 0;
var i = Math.abs(e % this.c$.length);
return t[i][this.axisPosition] - r[i][this.axisPosition];
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), enyo.Arranger.opacifyControl(n, 1), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.TopBottomArranger",
kind: "LeftRightArranger",
dragProp: "ddy",
dragDirectionProp: "yDirection",
canDragProp: "vertical",
axisSize: "height",
offAxisSize: "width",
axisPosition: "top"
}), enyo.kind({
name: "enyo.SpiralArranger",
kind: "Arranger",
incrementalPoints: !0,
inc: 20,
size: function() {
var e = this.container.getPanels(), t = this.containerBounds, n = this.controlWidth = t.width / 3, r = this.controlHeight = t.height / 3;
for (var i = 0, s; s = e[i]; i++) s.setBounds({
width: n,
height: r
});
},
arrange: function(e, t) {
var n = this.inc;
for (var r = 0, i = e.length, s; s = e[r]; r++) {
var o = Math.cos(r / i * 2 * Math.PI) * r * n + this.controlWidth, u = Math.sin(r / i * 2 * Math.PI) * r * n + this.controlHeight;
this.arrangeControl(s, {
left: o,
top: u
});
}
},
start: function() {
this.inherited(arguments);
var e = this.getOrderedControls(this.container.toIndex);
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", e.length - t);
},
calcArrangementDifference: function(e, t, n, r) {
return this.controlWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", null), enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.GridArranger",
kind: "Arranger",
incrementalPoints: !0,
colWidth: 100,
colHeight: 100,
size: function() {
var e = this.container.getPanels(), t = this.colWidth, n = this.colHeight;
for (var r = 0, i; i = e[r]; r++) i.setBounds({
width: t,
height: n
});
},
arrange: function(e, t) {
var n = this.colWidth, r = this.colHeight, i = Math.max(1, Math.floor(this.containerBounds.width / n)), s;
for (var o = 0, u = 0; u < e.length; o++) for (var a = 0; a < i && (s = e[u]); a++, u++) this.arrangeControl(s, {
left: n * a,
top: r * o
});
},
flowControl: function(e, t) {
this.inherited(arguments), enyo.Arranger.opacifyControl(e, t.top % this.colHeight !== 0 ? .25 : 1);
},
calcArrangementDifference: function(e, t, n, r) {
return this.colWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// Panels.js

enyo.kind({
name: "enyo.Panels",
classes: "enyo-panels",
published: {
index: 0,
draggable: !0,
animate: !0,
wrap: !1,
arrangerKind: "CardArranger",
narrowFit: !0
},
events: {
onTransitionStart: "",
onTransitionFinish: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
tools: [ {
kind: "Animator",
onStep: "step",
onEnd: "completed"
} ],
fraction: 0,
create: function() {
this.transitionPoints = [], this.inherited(arguments), this.arrangerKindChanged(), this.narrowFitChanged(), this.indexChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
arrangerKindChanged: function() {
this.setLayoutKind(this.arrangerKind);
},
narrowFitChanged: function() {
this.addRemoveClass("enyo-panels-fit-narrow", this.narrowFit);
},
removeControl: function(e) {
this.inherited(arguments), this.controls.length > 1 && this.isPanel(e) && (this.setIndex(Math.max(this.index - 1, 0)), this.flow(), this.reflow());
},
isPanel: function() {
return !0;
},
flow: function() {
this.arrangements = [], this.inherited(arguments);
},
reflow: function() {
this.arrangements = [], this.inherited(arguments), this.refresh();
},
getPanels: function() {
var e = this.controlParent || this;
return e.children;
},
getActive: function() {
var e = this.getPanels();
return e[this.index];
},
getAnimator: function() {
return this.$.animator;
},
setIndex: function(e) {
this.setPropertyValue("index", e, "indexChanged");
},
setIndexDirect: function(e) {
this.setIndex(e), this.completed();
},
previous: function() {
this.setIndex(this.index - 1);
},
next: function() {
this.setIndex(this.index + 1);
},
clamp: function(e) {
var t = this.getPanels().length - 1;
return this.wrap ? e : Math.max(0, Math.min(e, t));
},
indexChanged: function(e) {
this.lastIndex = e, this.index = this.clamp(this.index), this.dragging || (this.$.animator.isAnimating() && this.completed(), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(), this.$.animator.play({
startValue: this.fraction
})) : this.refresh()));
},
step: function(e) {
this.fraction = e.value, this.stepTransition();
},
completed: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
dragstart: function(e, t) {
if (this.draggable && this.layout && this.layout.canDragEvent(t)) return t.preventDefault(), this.dragstartTransition(t), this.dragging = !0, this.$.animator.stop(), !0;
},
drag: function(e, t) {
this.dragging && (t.preventDefault(), this.dragTransition(t));
},
dragfinish: function(e, t) {
this.dragging && (this.dragging = !1, t.preventTap(), this.dragfinishTransition(t));
},
dragstartTransition: function(e) {
if (!this.$.animator.isAnimating()) {
var t = this.fromIndex = this.index;
this.toIndex = t - (this.layout ? this.layout.calcDragDirection(e) : 0);
} else this.verifyDragTransition(e);
this.fromIndex = this.clamp(this.fromIndex), this.toIndex = this.clamp(this.toIndex), this.fireTransitionStart(), this.layout && this.layout.start();
},
dragTransition: function(e) {
var t = this.layout ? this.layout.calcDrag(e) : 0, n = this.transitionPoints, r = n[0], i = n[n.length - 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i), u = this.layout ? this.layout.drag(t, r, s, i, o) : 0, a = t && !u;
a, this.fraction += u;
var f = this.fraction;
if (f > 1 || f < 0 || a) (f > 0 || a) && this.dragfinishTransition(e), this.dragstartTransition(e), this.fraction = 0;
this.stepTransition();
},
dragfinishTransition: function(e) {
this.verifyDragTransition(e), this.setIndex(this.toIndex), this.dragging && this.fireTransitionFinish();
},
verifyDragTransition: function(e) {
var t = this.layout ? this.layout.calcDragDirection(e) : 0, n = Math.min(this.fromIndex, this.toIndex), r = Math.max(this.fromIndex, this.toIndex);
if (t > 0) {
var i = n;
n = r, r = i;
}
n != this.fromIndex && (this.fraction = 1 - this.fraction), this.fromIndex = n, this.toIndex = r;
},
refresh: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.startTransition(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
startTransition: function() {
this.fromIndex = this.fromIndex != null ? this.fromIndex : this.lastIndex || 0, this.toIndex = this.toIndex != null ? this.toIndex : this.index, this.layout && this.layout.start(), this.fireTransitionStart();
},
finishTransition: function() {
this.layout && this.layout.finish(), this.transitionPoints = [], this.fraction = 0, this.fromIndex = this.toIndex = null, this.fireTransitionFinish();
},
fireTransitionStart: function() {
var e = this.startTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.fromIndex || e.toIndex != this.toIndex) && (this.startTransitionInfo = {
fromIndex: this.fromIndex,
toIndex: this.toIndex
}, this.doTransitionStart(enyo.clone(this.startTransitionInfo)));
},
fireTransitionFinish: function() {
var e = this.finishTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.lastIndex || e.toIndex != this.index) && (this.finishTransitionInfo = {
fromIndex: this.lastIndex,
toIndex: this.index
}, this.doTransitionFinish(enyo.clone(this.finishTransitionInfo))), this.lastIndex = this.index;
},
stepTransition: function() {
if (this.hasNode()) {
var e = this.transitionPoints, t = (this.fraction || 0) * (e.length - 1), n = Math.floor(t);
t -= n;
var r = e[n], i = e[n + 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i);
this.arrangement = s && o ? enyo.Panels.lerp(s, o, t) : s || o, this.arrangement && this.layout && this.layout.flowArrangement();
}
},
fetchArrangement: function(e) {
return e != null && !this.arrangements[e] && this.layout && (this.layout._arrange(e), this.arrangements[e] = this.readArrangement(this.getPanels())), this.arrangements[e];
},
readArrangement: function(e) {
var t = [];
for (var n = 0, r = e, i; i = r[n]; n++) t.push(enyo.clone(i._arranger));
return t;
},
statics: {
isScreenNarrow: function() {
return enyo.dom.getWindowWidth() <= 800;
},
lerp: function(e, t, n) {
var r = [];
for (var i = 0, s = enyo.keys(e), o; o = s[i]; i++) r.push(this.lerpObject(e[o], t[o], n));
return r;
},
lerpObject: function(e, t, n) {
var r = enyo.clone(e), i, s;
if (t) for (var o in e) i = e[o], s = t[o], i != s && (r[o] = i - (i - s) * n);
return r;
}
}
});

// Node.js

enyo.kind({
name: "enyo.Node",
published: {
expandable: !1,
expanded: !1,
icon: "",
onlyIconExpands: !1,
selected: !1
},
style: "padding: 0 0 0 16px;",
content: "Node",
defaultKind: "Node",
classes: "enyo-node",
components: [ {
name: "icon",
kind: "Image",
showing: !1
}, {
kind: "Control",
name: "caption",
Xtag: "span",
style: "display: inline-block; padding: 4px;",
allowHtml: !0
}, {
kind: "Control",
name: "extra",
tag: "span",
allowHtml: !0
} ],
childClient: [ {
kind: "Control",
name: "box",
classes: "enyo-node-box",
Xstyle: "border: 1px solid orange;",
components: [ {
kind: "Control",
name: "client",
classes: "enyo-node-client",
Xstyle: "border: 1px solid lightblue;"
} ]
} ],
handlers: {
ondblclick: "dblclick"
},
events: {
onNodeTap: "nodeTap",
onNodeDblClick: "nodeDblClick",
onExpand: "nodeExpand",
onDestroyed: "nodeDestroyed"
},
create: function() {
this.inherited(arguments), this.selectedChanged(), this.iconChanged();
},
destroy: function() {
this.doDestroyed(), this.inherited(arguments);
},
initComponents: function() {
this.expandable && (this.kindComponents = this.kindComponents.concat(this.childClient)), this.inherited(arguments);
},
contentChanged: function() {
this.$.caption.setContent(this.content);
},
iconChanged: function() {
this.$.icon.setSrc(this.icon), this.$.icon.setShowing(Boolean(this.icon));
},
selectedChanged: function() {
this.addRemoveClass("enyo-selected", this.selected);
},
rendered: function() {
this.inherited(arguments), this.expandable && !this.expanded && this.quickCollapse();
},
addNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent(n);
this.$.client.render();
},
addTextNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent({
content: n
});
this.$.client.render();
},
tap: function(e, t) {
return this.onlyIconExpands ? t.target == this.$.icon.hasNode() ? this.toggleExpanded() : this.doNodeTap() : (this.toggleExpanded(), this.doNodeTap()), !0;
},
dblclick: function(e, t) {
return this.doNodeDblClick(), !0;
},
toggleExpanded: function() {
this.setExpanded(!this.expanded);
},
quickCollapse: function() {
this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "0");
var e = this.$.client.getBounds().height;
this.$.client.setBounds({
top: -e
});
},
_expand: function() {
this.addClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), this.$.client.setBounds({
top: 0
}), setTimeout(enyo.bind(this, function() {
this.expanded && (this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "auto"));
}), 225);
},
_collapse: function() {
this.removeClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), setTimeout(enyo.bind(this, function() {
this.addClass("enyo-animate"), this.$.box.applyStyle("height", "0"), this.$.client.setBounds({
top: -e
});
}), 25);
},
expandedChanged: function(e) {
if (!this.expandable) this.expanded = !1; else {
var t = {
expanded: this.expanded
};
this.doExpand(t), t.wait || this.effectExpanded();
}
},
effectExpanded: function() {
this.$.client && (this.expanded ? this._expand() : this._collapse());
}
});

// Icon.js

enyo.kind({
name: "onyx.Icon",
published: {
src: "",
disabled: !1
},
classes: "onyx-icon",
create: function() {
this.inherited(arguments), this.src && this.srcChanged(), this.disabledChanged();
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
srcChanged: function() {
this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.src) + ")");
}
});

// Button.js

enyo.kind({
name: "onyx.Button",
kind: "enyo.Button",
classes: "onyx-button enyo-unselectable"
});

// IconButton.js

enyo.kind({
name: "onyx.IconButton",
kind: "onyx.Icon",
published: {
active: !1
},
classes: "onyx-icon-button",
rendered: function() {
this.inherited(arguments), this.activeChanged();
},
tap: function() {
if (this.disabled) return !0;
this.setActive(!0);
},
activeChanged: function() {
this.bubble("onActivate");
}
});

// Checkbox.js

enyo.kind({
name: "onyx.Checkbox",
classes: "onyx-checkbox",
kind: enyo.Checkbox,
tag: "div",
handlers: {
ondown: "downHandler",
onclick: ""
},
downHandler: function(e, t) {
return this.disabled || (this.setChecked(!this.getChecked()), this.bubble("onchange")), !0;
},
tap: function(e, t) {
return !this.disabled;
}
});

// Drawer.js

enyo.kind({
name: "onyx.Drawer",
published: {
open: !0,
orient: "v"
},
style: "overflow: hidden; position: relative;",
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorEnd"
}, {
name: "client",
style: "position: relative;",
classes: "enyo-border-box"
} ],
create: function() {
this.inherited(arguments), this.openChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
openChanged: function() {
this.$.client.show();
if (this.hasNode()) if (this.$.animator.isAnimating()) this.$.animator.reverse(); else {
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left";
this.applyStyle(t, null);
var r = this.hasNode()[e ? "scrollHeight" : "scrollWidth"];
this.$.animator.play({
startValue: this.open ? 0 : r,
endValue: this.open ? r : 0,
dimension: t,
position: n
});
} else this.$.client.setShowing(this.open);
},
animatorStep: function(e) {
if (this.hasNode()) {
var t = e.dimension;
this.node.style[t] = this.domStyles[t] = e.value + "px";
}
var n = this.$.client.hasNode();
if (n) {
var r = e.position, i = this.open ? e.endValue : e.startValue;
n.style[r] = this.$.client.domStyles[r] = e.value - i + "px";
}
this.container && this.container.resized();
},
animatorEnd: function() {
if (!this.open) this.$.client.hide(); else {
var e = this.orient == "v" ? "height" : "width", t = this.hasNode();
t && (t.style[e] = this.$.client.domStyles[e] = null);
}
this.container && this.container.resized();
}
});

// Grabber.js

enyo.kind({
name: "onyx.Grabber",
classes: "onyx-grabber"
});

// Groupbox.js

enyo.kind({
name: "onyx.Groupbox",
classes: "onyx-groupbox"
}), enyo.kind({
name: "onyx.GroupboxHeader",
classes: "onyx-groupbox-header"
});

// Input.js

enyo.kind({
name: "onyx.Input",
kind: "enyo.Input",
classes: "onyx-input"
});

// Popup.js

enyo.kind({
name: "onyx.Popup",
kind: "Popup",
classes: "onyx-popup",
published: {
scrimWhenModal: !0,
scrim: !1,
scrimClassName: ""
},
statics: {
count: 0
},
defaultZ: 120,
showingChanged: function() {
this.showing ? (onyx.Popup.count++, this.applyZIndex()) : onyx.Popup.count > 0 && onyx.Popup.count--, this.showHideScrim(this.showing), this.inherited(arguments);
},
showHideScrim: function(e) {
if (this.floating && (this.scrim || this.modal && this.scrimWhenModal)) {
var t = this.getScrim();
if (e) {
var n = this.getScrimZIndex();
this._scrimZ = n, t.showAtZIndex(n);
} else t.hideAtZIndex(this._scrimZ);
enyo.call(t, "addRemoveClass", [ this.scrimClassName, t.showing ]);
}
},
getScrimZIndex: function() {
return this.findZIndex() - 1;
},
getScrim: function() {
return this.modal && this.scrimWhenModal && !this.scrim ? onyx.scrimTransparent.make() : onyx.scrim.make();
},
applyZIndex: function() {
this._zIndex = onyx.Popup.count * 2 + this.findZIndex() + 1, this.applyStyle("z-index", this._zIndex);
},
findZIndex: function() {
var e = this.defaultZ;
return this._zIndex ? e = this._zIndex : this.hasNode() && (e = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || e), this._zIndex = e;
}
});

// TextArea.js

enyo.kind({
name: "onyx.TextArea",
kind: "enyo.TextArea",
classes: "onyx-textarea"
});

// RichText.js

enyo.kind({
name: "onyx.RichText",
kind: "enyo.RichText",
classes: "onyx-richtext"
});

// InputDecorator.js

enyo.kind({
name: "onyx.InputDecorator",
kind: "enyo.ToolDecorator",
tag: "label",
classes: "onyx-input-decorator",
published: {
alwaysLooksFocused: !1
},
handlers: {
onDisabledChange: "disabledChange",
onfocus: "receiveFocus",
onblur: "receiveBlur"
},
create: function() {
this.inherited(arguments), this.updateFocus(!1);
},
alwaysLooksFocusedChanged: function(e) {
this.updateFocus(this.focus);
},
updateFocus: function(e) {
this.focused = e, this.addRemoveClass("onyx-focused", this.alwaysLooksFocused || this.focused);
},
receiveFocus: function() {
this.updateFocus(!0);
},
receiveBlur: function() {
this.updateFocus(!1);
},
disabledChange: function(e, t) {
this.addRemoveClass("onyx-disabled", t.originator.disabled);
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// MenuDecorator.js

enyo.kind({
name: "onyx.MenuDecorator",
kind: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator enyo-unselectable",
handlers: {
onActivate: "activated",
onHide: "menuHidden"
},
activated: function(e, t) {
this.requestHideTooltip(), t.originator.active && (this.menuActive = !0, this.activator = t.originator, this.activator.addClass("active"), this.requestShowMenu());
},
requestShowMenu: function() {
this.waterfallDown("onRequestShowMenu", {
activator: this.activator
});
},
requestHideMenu: function() {
this.waterfallDown("onRequestHideMenu");
},
menuHidden: function() {
this.menuActive = !1, this.activator && (this.activator.setActive(!1), this.activator.removeClass("active"));
},
enter: function(e) {
this.menuActive || this.inherited(arguments);
},
leave: function(e, t) {
this.menuActive || this.inherited(arguments);
}
});

// Menu.js

enyo.kind({
name: "onyx.Menu",
kind: "onyx.Popup",
modal: !0,
defaultKind: "onyx.MenuItem",
classes: "onyx-menu",
published: {
maxHeight: 200,
scrolling: !0
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestMenuShow",
onRequestHideMenu: "requestHide"
},
childComponents: [ {
name: "client",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy"
} ],
showOnTop: !1,
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged();
},
initComponents: function() {
this.scrolling ? this.createComponents(this.childComponents, {
isChrome: !0
}) : enyo.nop, this.inherited(arguments);
},
getScroller: function() {
return this.$[this.scrollerName];
},
maxHeightChanged: function() {
this.scrolling ? this.getScroller().setMaxHeight(this.maxHeight + "px") : enyo.nop;
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling ? this.getScroller().setShowing(this.showing) : enyo.nop, this.adjustPosition(!0);
},
requestMenuShow: function(e, t) {
if (this.floating) {
var n = t.activator.hasNode();
if (n) {
var r = this.activatorOffset = this.getPageOffset(n);
this.applyPosition({
top: r.top + (this.showOnTop ? 0 : r.height),
left: r.left,
width: r.width
});
}
}
return this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = e.getBoundingClientRect(), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.scrolling && !this.showOnTop ? this.getScroller().setMaxHeight(this.maxHeight + "px") : enyo.nop, this.removeClass("onyx-menu-up"), this.floating ? enyo.noop : this.applyPosition({
left: "auto"
});
var e = this.node.getBoundingClientRect(), t = e.height === undefined ? e.bottom - e.top : e.height, n = window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight, r = window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
this.menuUp = e.top + t > n && n - e.bottom < e.top - t, this.addRemoveClass("onyx-menu-up", this.menuUp);
if (this.floating) {
var i = this.activatorOffset;
this.menuUp ? this.applyPosition({
top: i.top - t + (this.showOnTop ? i.height : 0),
bottom: "auto"
}) : e.top < i.top && i.top + (this.showOnTop ? 0 : i.height) + t < n && this.applyPosition({
top: i.top + (this.showOnTop ? 0 : i.height),
bottom: "auto"
});
}
e.right > r && (this.floating ? this.applyPosition({
left: i.left - (e.left + e.width - r)
}) : this.applyPosition({
left: -(e.right - r)
})), e.left < 0 && (this.floating ? this.applyPosition({
left: 0,
right: "auto"
}) : this.getComputedStyleValue("right") == "auto" ? this.applyPosition({
left: -e.left
}) : this.applyPosition({
right: e.left
}));
if (this.scrolling && !this.showOnTop) {
e = this.node.getBoundingClientRect();
var s;
this.menuUp ? s = this.maxHeight < e.bottom ? this.maxHeight : e.bottom : s = e.top + this.maxHeight < n ? this.maxHeight : n - e.top, this.getScroller().setMaxHeight(s + "px");
}
}
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// MenuItem.js

enyo.kind({
name: "onyx.MenuItem",
kind: "enyo.Button",
tag: "div",
classes: "onyx-menu-item",
events: {
onSelect: ""
},
tap: function(e) {
this.inherited(arguments), this.bubble("onRequestHideMenu"), this.doSelect({
selected: this,
content: this.content
});
}
});

// PickerDecorator.js

enyo.kind({
name: "onyx.PickerDecorator",
kind: "onyx.MenuDecorator",
classes: "onyx-picker-decorator",
defaultKind: "onyx.PickerButton",
handlers: {
onChange: "change"
},
change: function(e, t) {
this.waterfallDown("onChange", t);
}
});

// PickerButton.js

enyo.kind({
name: "onyx.PickerButton",
kind: "onyx.Button",
handlers: {
onChange: "change"
},
change: function(e, t) {
this.setContent(t.content);
}
});

// Picker.js

enyo.kind({
name: "onyx.Picker",
kind: "onyx.Menu",
classes: "onyx-picker enyo-unselectable",
published: {
selected: null
},
events: {
onChange: ""
},
floating: !0,
showOnTop: !0,
initComponents: function() {
this.setScrolling(!0), this.inherited(arguments);
},
showingChanged: function() {
this.getScroller().setShowing(this.showing), this.inherited(arguments), this.showing && this.selected && this.scrollToSelected();
},
scrollToSelected: function() {
this.getScroller().scrollToControl(this.selected, !this.menuUp);
},
itemActivated: function(e, t) {
return this.processActivatedItem(t.originator), this.inherited(arguments);
},
processActivatedItem: function(e) {
e.active && this.setSelected(e);
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
}));
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
}
});

// FlyweightPicker.js

enyo.kind({
name: "onyx.FlyweightPicker",
kind: "onyx.Picker",
classes: "onyx-flyweight-picker",
published: {
count: 0
},
events: {
onSetupItem: "",
onSelect: ""
},
handlers: {
onSelect: "itemSelect"
},
components: [ {
name: "scroller",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy",
components: [ {
name: "flyweight",
kind: "FlyweightRepeater",
ontap: "itemTap"
} ]
} ],
scrollerName: "scroller",
initComponents: function() {
this.controlParentName = "flyweight", this.inherited(arguments);
},
create: function() {
this.inherited(arguments), this.countChanged();
},
rendered: function() {
this.inherited(arguments), this.selectedChanged();
},
scrollToSelected: function() {
var e = this.$.flyweight.fetchRowNode(this.selected);
this.getScroller().scrollToNode(e, !this.menuUp);
},
countChanged: function() {
this.$.flyweight.count = this.count;
},
processActivatedItem: function(e) {
this.item = e;
},
selectedChanged: function(e) {
if (!this.item) return;
e !== undefined && (this.item.removeClass("selected"), this.$.flyweight.renderRow(e)), this.item.addClass("selected"), this.$.flyweight.renderRow(this.selected), this.item.removeClass("selected");
var t = this.$.flyweight.fetchRowNode(this.selected);
this.doChange({
selected: this.selected,
content: t && t.textContent || this.item.content
});
},
itemTap: function(e, t) {
this.setSelected(t.rowIndex), this.doSelect({
selected: this.item,
content: this.item.content
});
},
itemSelect: function(e, t) {
if (t.originator != this) return !0;
}
});

// RadioButton.js

enyo.kind({
name: "onyx.RadioButton",
kind: "Button",
classes: "onyx-radiobutton"
});

// RadioGroup.js

enyo.kind({
name: "onyx.RadioGroup",
kind: "Group",
highlander: !0,
defaultKind: "onyx.RadioButton"
});

// ToggleButton.js

enyo.kind({
name: "onyx.ToggleButton",
classes: "onyx-toggle-button",
published: {
active: !1,
value: !1,
onContent: "On",
offContent: "Off",
disabled: !1
},
events: {
onChange: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
components: [ {
name: "contentOn",
classes: "onyx-toggle-content on"
}, {
name: "contentOff",
classes: "onyx-toggle-content off"
}, {
classes: "onyx-toggle-button-knob"
} ],
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active), this.onContentChanged(), this.offContentChanged(), this.disabledChanged();
},
rendered: function() {
this.inherited(arguments), this.valueChanged();
},
valueChanged: function() {
this.addRemoveClass("off", !this.value), this.$.contentOn.setShowing(this.value), this.$.contentOff.setShowing(!this.value), this.setActive(this.value), this.doChange({
value: this.value
});
},
activeChanged: function() {
this.setValue(this.active), this.bubble("onActivate");
},
onContentChanged: function() {
this.$.contentOn.setContent(this.onContent || ""), this.$.contentOn.addRemoveClass("empty", !this.onContent);
},
offContentChanged: function() {
this.$.contentOff.setContent(this.offContent || ""), this.$.contentOff.addRemoveClass("empty", !this.onContent);
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
updateValue: function(e) {
this.disabled || this.setValue(e);
},
tap: function() {
this.updateValue(!this.value);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, this.dragged = !1, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = t.dx;
return Math.abs(n) > 10 && (this.updateValue(n > 0), this.dragged = !0), !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, this.dragged && t.preventTap();
}
});

// Toolbar.js

enyo.kind({
name: "onyx.Toolbar",
classes: "onyx onyx-toolbar onyx-toolbar-inline",
create: function() {
this.inherited(arguments), this.hasClass("onyx-menu-toolbar") && enyo.platform.android >= 4 && this.applyStyle("position", "static");
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// ProgressBar.js

enyo.kind({
name: "onyx.ProgressBar",
classes: "onyx-progress-bar",
published: {
progress: 0,
min: 0,
max: 100,
barClasses: "",
showStripes: !0,
animateStripes: !0
},
events: {
onAnimateProgressFinish: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar"
} ],
create: function() {
this.inherited(arguments), this.progressChanged(), this.barClassesChanged(), this.showStripesChanged(), this.animateStripesChanged();
},
barClassesChanged: function(e) {
this.$.bar.removeClass(e), this.$.bar.addClass(this.barClasses);
},
showStripesChanged: function() {
this.$.bar.addRemoveClass("striped", this.showStripes);
},
animateStripesChanged: function() {
this.$.bar.addRemoveClass("animated", this.animateStripes);
},
progressChanged: function() {
this.progress = this.clampValue(this.min, this.max, this.progress);
var e = this.calcPercent(this.progress);
this.updateBarPosition(e);
},
clampValue: function(e, t, n) {
return Math.max(e, Math.min(n, t));
},
calcRatio: function(e) {
return (e - this.min) / (this.max - this.min);
},
calcPercent: function(e) {
return this.calcRatio(e) * 100;
},
updateBarPosition: function(e) {
this.$.bar.applyStyle("width", e + "%");
},
animateProgressTo: function(e) {
this.$.progressAnimator.play({
startValue: this.progress,
endValue: e,
node: this.hasNode()
});
},
progressAnimatorStep: function(e) {
return this.setProgress(e.value), !0;
},
progressAnimatorComplete: function(e) {
return this.doAnimateProgressFinish(e), !0;
}
});

// ProgressButton.js

enyo.kind({
name: "onyx.ProgressButton",
kind: "onyx.ProgressBar",
classes: "onyx-progress-button",
events: {
onCancel: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar onyx-progress-button-bar"
}, {
name: "client",
classes: "onyx-progress-button-client"
}, {
kind: "onyx.Icon",
src: "$lib/onyx/images/progress-button-cancel.png",
classes: "onyx-progress-button-icon",
ontap: "cancelTap"
} ],
cancelTap: function() {
this.doCancel();
}
});

// Scrim.js

enyo.kind({
name: "onyx.Scrim",
showing: !1,
classes: "onyx-scrim enyo-fit",
floating: !1,
create: function() {
this.inherited(arguments), this.zStack = [], this.floating && this.setParent(enyo.floatingLayer);
},
showingChanged: function() {
this.floating && this.showing && !this.hasNode() && this.render(), this.inherited(arguments);
},
addZIndex: function(e) {
enyo.indexOf(e, this.zStack) < 0 && this.zStack.push(e);
},
removeZIndex: function(e) {
enyo.remove(e, this.zStack);
},
showAtZIndex: function(e) {
this.addZIndex(e), e !== undefined && this.setZIndex(e), this.show();
},
hideAtZIndex: function(e) {
this.removeZIndex(e);
if (!this.zStack.length) this.hide(); else {
var t = this.zStack[this.zStack.length - 1];
this.setZIndex(t);
}
},
setZIndex: function(e) {
this.zIndex = e, this.applyStyle("z-index", e);
},
make: function() {
return this;
}
}), enyo.kind({
name: "onyx.scrimSingleton",
kind: null,
constructor: function(e, t) {
this.instanceName = e, enyo.setObject(this.instanceName, this), this.props = t || {};
},
make: function() {
var e = new onyx.Scrim(this.props);
return enyo.setObject(this.instanceName, e), e;
},
showAtZIndex: function(e) {
var t = this.make();
t.showAtZIndex(e);
},
hideAtZIndex: enyo.nop,
show: function() {
var e = this.make();
e.show();
}
}), new onyx.scrimSingleton("onyx.scrim", {
floating: !0,
classes: "onyx-scrim-translucent"
}), new onyx.scrimSingleton("onyx.scrimTransparent", {
floating: !0,
classes: "onyx-scrim-transparent"
});

// Slider.js

enyo.kind({
name: "onyx.Slider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
value: 0,
lockBar: !0,
tappable: !0
},
events: {
onChange: "",
onChanging: "",
onAnimateFinish: ""
},
showStripes: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
moreComponents: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
}, {
classes: "onyx-slider-taparea"
}, {
name: "knob",
classes: "onyx-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.valueChanged();
},
valueChanged: function() {
this.value = this.clampValue(this.min, this.max, this.value);
var e = this.calcPercent(this.value);
this.updateKnobPosition(e), this.lockBar && this.setProgress(this.value);
},
updateKnobPosition: function(e) {
this.$.knob.applyStyle("left", e + "%");
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t);
return this.setValue(n), this.doChanging({
value: this.value
}), !0;
}
},
dragfinish: function(e, t) {
return this.dragging = !1, t.preventTap(), this.doChange({
value: this.value
}), !0;
},
tap: function(e, t) {
if (this.tappable) {
var n = this.calcKnobPosition(t);
return this.tapped = !0, this.animateTo(n), !0;
}
},
animateTo: function(e) {
this.$.animator.play({
startValue: this.value,
endValue: e,
node: this.hasNode()
});
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.tapped && (this.tapped = !1, this.doChange({
value: this.value
})), this.doAnimateFinish(e), !0;
}
});

// Item.js

enyo.kind({
name: "onyx.Item",
classes: "onyx-item",
tapHighlight: !0,
handlers: {
onhold: "hold",
onrelease: "release"
},
hold: function(e, t) {
this.tapHighlight && onyx.Item.addFlyweightClass(this.controlParent || this, "onyx-highlight", t);
},
release: function(e, t) {
this.tapHighlight && onyx.Item.removeFlyweightClass(this.controlParent || this, "onyx-highlight", t);
},
statics: {
addFlyweightClass: function(e, t, n, r) {
var i = n.flyweight;
if (i) {
var s = r != undefined ? r : n.index;
i.performOnRow(s, function() {
e.hasClass(t) ? e.setClassAttribute(e.getClassAttribute()) : e.addClass(t);
}), e.removeClass(t);
}
},
removeFlyweightClass: function(e, t, n, r) {
var i = n.flyweight;
if (i) {
var s = r != undefined ? r : n.index;
i.performOnRow(s, function() {
e.hasClass(t) ? e.removeClass(t) : e.setClassAttribute(e.getClassAttribute());
});
}
}
}
});

// Spinner.js

enyo.kind({
name: "onyx.Spinner",
classes: "onyx-spinner",
stop: function() {
this.setShowing(!1);
},
start: function() {
this.setShowing(!0);
},
toggle: function() {
this.setShowing(!this.getShowing());
}
});

// MoreToolbar.js

enyo.kind({
name: "onyx.MoreToolbar",
classes: "onyx-toolbar onyx-more-toolbar",
menuClass: "",
movedClass: "",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
handlers: {
onHide: "reflow"
},
published: {
clientLayoutKind: "FittableColumnsLayout"
},
tools: [ {
name: "client",
fit: !0,
classes: "onyx-toolbar-inline"
}, {
name: "nard",
kind: "onyx.MenuDecorator",
showing: !1,
onActivate: "activated",
components: [ {
kind: "onyx.IconButton",
classes: "onyx-more-button"
}, {
name: "menu",
kind: "onyx.Menu",
scrolling: !1,
classes: "onyx-more-menu",
prepend: !0
} ]
} ],
initComponents: function() {
this.menuClass && this.menuClass.length > 0 && !this.$.menu.hasClass(this.menuClass) && this.$.menu.addClass(this.menuClass), this.createChrome(this.tools), this.inherited(arguments), this.$.client.setLayoutKind(this.clientLayoutKind);
},
clientLayoutKindChanged: function() {
this.$.client.setLayoutKind(this.clientLayoutKind);
},
reflow: function() {
this.inherited(arguments), this.isContentOverflowing() ? (this.$.nard.show(), this.popItem() && this.reflow()) : this.tryPushItem() ? this.reflow() : this.$.menu.children.length || (this.$.nard.hide(), this.$.menu.hide());
},
activated: function(e, t) {
this.addRemoveClass("active", t.originator.active);
},
popItem: function() {
var e = this.findCollapsibleItem();
if (e) {
this.movedClass && this.movedClass.length > 0 && !e.hasClass(this.movedClass) && e.addClass(this.movedClass), this.$.menu.addChild(e);
var t = this.$.menu.hasNode();
return t && e.hasNode() && e.insertNodeInParent(t), !0;
}
},
pushItem: function() {
var e = this.$.menu.children, t = e[0];
if (t) {
this.movedClass && this.movedClass.length > 0 && t.hasClass(this.movedClass) && t.removeClass(this.movedClass), this.$.client.addChild(t);
var n = this.$.client.hasNode();
if (n && t.hasNode()) {
var r = undefined, i;
for (var s = 0; s < this.$.client.children.length; s++) {
var o = this.$.client.children[s];
if (o.toolbarIndex != undefined && o.toolbarIndex != s) {
r = o, i = s;
break;
}
}
if (r && r.hasNode()) {
t.insertNodeInParent(n, r.node);
var u = this.$.client.children.pop();
this.$.client.children.splice(i, 0, u);
} else t.appendNodeToParent(n);
}
return !0;
}
},
tryPushItem: function() {
if (this.pushItem()) {
if (!this.isContentOverflowing()) return !0;
this.popItem();
}
},
isContentOverflowing: function() {
if (this.$.client.hasNode()) {
var e = this.$.client.children, t = e[e.length - 1].hasNode();
if (t) return this.$.client.reflow(), t.offsetLeft + t.offsetWidth > this.$.client.node.clientWidth;
}
},
findCollapsibleItem: function() {
var e = this.$.client.children;
for (var t = e.length - 1; c = e[t]; t--) {
if (!c.unmoveable) return c;
c.toolbarIndex == undefined && (c.toolbarIndex = t);
}
}
});

// FittableSample.js

enyo.kind({
name: "enyo.sample.FittableSample",
kind: "FittableRows",
classes: "fittable-sample-box enyo-fit",
components: [ {
content: "Foo<br>Foo",
allowHtml: !0,
classes: "fittable-sample-box fittable-sample-mtb"
}, {
content: "Foo<br>Foo",
allowHtml: !0,
classes: "fittable-sample-box fittable-sample-mtb"
}, {
kind: "FittableColumns",
fit: !0,
classes: "fittable-sample-box fittable-sample-mtb fittable-sample-o",
components: [ {
content: "Foo",
classes: "fittable-sample-box fittable-sample-mlr"
}, {
content: "Foo",
classes: "fittable-sample-box fittable-sample-mlr"
}, {
content: "Fits!",
fit: !0,
classes: "fittable-sample-box fittable-sample-mlr fittable-sample-o"
}, {
content: "Foo",
classes: "fittable-sample-box fittable-sample-mlr"
} ]
}, {
kind: "FittableColumns",
content: "Bat",
classes: "fittable-sample-box fittable-sample-mtb enyo-center",
components: [ {
content: "Centered",
classes: "fittable-sample-box fittable-sample-mlr"
}, {
content: "1",
classes: "fittable-sample-box fittable-sample-mlr"
}, {
content: "2",
classes: "fittable-sample-box fittable-sample-mlr"
}, {
content: "3",
classes: "fittable-sample-box fittable-sample-mlr"
}, {
content: "4",
classes: "fittable-sample-box fittable-sample-mlr"
} ]
} ]
});

// FittableAppLayout1.js

enyo.kind({
name: "enyo.sample.FittableAppLayout1",
kind: "FittableRows",
classes: "enyo-fit",
components: [ {
kind: "onyx.Toolbar",
components: [ {
content: "Header"
}, {
kind: "onyx.Button",
content: "Button"
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input"
} ]
} ]
}, {
kind: "FittableColumns",
fit: !0,
components: [ {
style: "width: 30%;"
}, {
kind: "FittableRows",
fit: !0,
classes: "fittable-sample-shadow",
components: [ {
classes: "fittable-sample-shadow2",
style: "height: 30%; position: relative; z-index: 1;"
}, {
fit: !0,
classes: "fittable-sample-fitting-color"
} ]
} ]
} ]
});

// FittableAppLayout2.js

enyo.kind({
name: "enyo.sample.FittableAppLayout2",
kind: "FittableColumns",
classes: "enyo-fit",
components: [ {
kind: "FittableRows",
style: "width: 20%;",
components: [ {
fit: !0
}, {
kind: "onyx.Toolbar",
components: [ {
kind: "onyx.Button",
content: "1"
} ]
} ]
}, {
kind: "FittableRows",
style: "width: 20%;",
classes: "fittable-sample-shadow",
components: [ {
fit: !0,
style: ""
}, {
kind: "onyx.Toolbar",
components: [ {
kind: "onyx.Button",
content: "2"
} ]
} ]
}, {
kind: "FittableRows",
fit: !0,
classes: "fittable-sample-shadow",
components: [ {
fit: !0,
classes: "fittable-sample-fitting-color"
}, {
kind: "onyx.Toolbar",
components: [ {
kind: "onyx.Button",
content: "3"
} ]
} ]
} ]
});

// FittableAppLayout3.js

enyo.kind({
name: "enyo.sample.FittableAppLayout3",
kind: "FittableColumns",
classes: "enyo-fit",
components: [ {
kind: "FittableRows",
fit: !0,
components: [ {
fit: !0,
classes: "fittable-sample-fitting-color"
}, {
classes: "fittable-sample-shadow3",
style: "height: 30%; position: relative;"
}, {
kind: "onyx.Toolbar",
components: [ {
kind: "onyx.Button",
content: "1"
} ]
} ]
}, {
kind: "FittableRows",
classes: "fittable-sample-shadow",
style: "width: 30%; position: relative;",
components: [ {
fit: !0
}, {
kind: "onyx.Toolbar",
components: [ {
kind: "onyx.Button",
content: "2"
} ]
} ]
} ]
});

// FittableAppLayout4.js

enyo.kind({
name: "enyo.sample.FittableAppLayout4",
kind: "FittableColumns",
classes: "enyo-fit",
components: [ {
kind: "FittableRows",
classes: "fittable-sample-shadow4",
style: "width: 30%; position: relative; z-index: 1;",
components: [ {
style: "height: 20%;"
}, {
style: "height: 20%;"
}, {
fit: !0
}, {
kind: "onyx.Toolbar",
style: "height: 57px;",
components: [ {
content: "Toolbar"
} ]
} ]
}, {
kind: "FittableRows",
fit: !0,
components: [ {
fit: !0,
classes: "fittable-sample-fitting-color"
}, {
kind: "onyx.Toolbar",
style: "height: 57px;",
components: [ {
kind: "onyx.Button",
content: "2"
} ]
} ]
} ]
});

// FittableDescription.js

enyo.kind({
name: "enyo.sample.FittableDescription",
style: "padding:10px;",
components: [ {
tag: "p",
allowHtml: !0,
content: "FittableColumns, no margin on boxes (all divs have some padding). By default, boxes 'stretch' to fit the container (which must have a height)."
}, {
kind: "FittableColumns",
classes: "fittable-sample-height fittable-sample-box fittable-sample-o fittable-sample-mlr fittable-sample-mtb",
components: [ {
content: "BoxA",
classes: "fittable-sample-box"
}, {
content: "Fitting BoxB",
fit: !0,
classes: "fittable-sample-box"
}, {
content: "BoxC",
classes: "fittable-sample-box"
} ]
}, {
tag: "p",
allowHtml: !0,
content: "Boxes with left/right margins. Note: top/bottom margin on column boxes is NOT supported."
}, {
kind: "FittableColumns",
classes: "fittable-sample-height fittable-sample-box fittable-sample-o fittable-sample-mlr fittable-sample-mtb",
components: [ {
content: "BoxA",
classes: "fittable-sample-box fittable-sample-mlr"
}, {
content: "Fitting BoxB",
fit: !0,
classes: "fittable-sample-box fittable-sample-mlr"
}, {
content: "BoxC",
classes: "fittable-sample-box fittable-sample-mlr"
} ]
}, {
tag: "p",
allowHtml: !0,
content: "With <code>noStretch: true</code>, boxes have natural height."
}, {
kind: "FittableColumns",
noStretch: !0,
classes: "fittable-sample-height fittable-sample-box fittable-sample-o fittable-sample-mlr fittable-sample-mtb",
components: [ {
content: "BoxA",
classes: "fittable-sample-box fittable-sample-mlr"
}, {
content: "Fitting BoxB<br><br>with natural height",
fit: !0,
allowHtml: !0,
classes: "fittable-sample-box fittable-sample-mlr"
}, {
content: "BoxC",
classes: "fittable-sample-box fittable-sample-mlr"
} ]
}, {
tag: "p",
allowHtml: !0,
content: "FittableRows, no margin on boxes (all divs have some padding)."
}, {
kind: "FittableRows",
classes: "fittable-sample-height fittable-sample-box fittable-sample-o fittable-sample-mlr fittable-sample-mtb",
components: [ {
content: "BoxA",
classes: "fittable-sample-box"
}, {
content: "Fitting BoxB",
fit: !0,
classes: "fittable-sample-box"
}, {
content: "BoxC",
classes: "fittable-sample-box"
} ]
}, {
tag: "p",
allowHtml: !0,
content: 'Row boxes may have margin in any dimension.<br><br> NOTE: Row boxes will collapse vertical margins according to css rules. If margin collapse is not desired, then "enyo-margin-expand" may be applied. Only in this case, left/right margin on row boxes is NOT supported.'
}, {
kind: "FittableRows",
classes: "fittable-sample-height fittable-sample-box fittable-sample-o fittable-sample-mlr fittable-sample-mtb",
components: [ {
content: "BoxA",
classes: "fittable-sample-box fittable-sample-mlr fittable-sample-mtb"
}, {
content: "Fitting BoxB",
fit: !0,
classes: "fittable-sample-box fittable-sample-mlr fittable-sample-mtb"
}, {
content: "BoxC",
classes: "fittable-sample-box fittable-sample-mlr fittable-sample-mtb"
} ]
}, {
tag: "p",
allowHtml: !0,
content: "With <code>noStretch: true</code>, boxes have natural width.<br><br> NOTE: margins will not collapse in this case."
}, {
kind: "FittableRows",
noStretch: !0,
classes: "fittable-sample-height fittable-sample-box fittable-sample-o fittable-sample-mtb",
components: [ {
content: "BoxA",
classes: "fittable-sample-box fittable-sample-mlr fittable-sample-mtb"
}, {
content: "Fitting BoxB",
fit: !0,
classes: "fittable-sample-box fittable-sample-mlr fittable-sample-mtb"
}, {
content: "BoxC",
classes: "fittable-sample-box fittable-sample-mlr fittable-sample-mtb"
} ]
} ]
});

// PanelsSample.js

enyo.kind({
name: "enyo.sample.MyGridArranger",
kind: "GridArranger",
colHeight: "150",
colWidth: "150"
}), enyo.kind({
name: "enyo.sample.PanelsSample",
kind: "FittableRows",
classes: "enyo-fit",
components: [ {
kind: "FittableColumns",
noStretch: !0,
classes: "onyx-toolbar onyx-toolbar-inline",
components: [ {
kind: "Scroller",
thumb: !1,
fit: !0,
touch: !0,
vertical: "hidden",
style: "margin: 0;",
components: [ {
classes: "onyx-toolbar-inline",
style: "white-space: nowrap;",
components: [ {
kind: "onyx.MenuDecorator",
components: [ {
content: "Arranger"
}, {
name: "arrangerPicker",
kind: "onyx.Menu",
floating: !0,
onSelect: "arrangerSelected"
} ]
}, {
kind: "onyx.Button",
content: "Previous",
ontap: "prevPanel"
}, {
kind: "onyx.Button",
content: "Next",
ontap: "nextPanel"
}, {
kind: "onyx.InputDecorator",
style: "width: 60px;",
components: [ {
kind: "onyx.Input",
value: 0,
onchange: "gotoPanel"
} ]
}, {
kind: "onyx.Button",
content: "Go",
ontap: "gotoPanel"
}, {
kind: "onyx.Button",
content: "Add",
ontap: "addPanel"
}, {
kind: "onyx.Button",
content: "Delete",
ontap: "deletePanel"
} ]
} ]
} ]
}, {
kind: "Panels",
name: "samplePanels",
fit: !0,
realtimeFit: !0,
classes: "panels-sample-panels enyo-border-box",
components: [ {
content: 0,
style: "background:red;"
}, {
content: 1,
style: "background:orange;"
}, {
content: 2,
style: "background:yellow;"
}, {
content: 3,
style: "background:green;"
}, {
content: 4,
style: "background:blue;"
}, {
content: 5,
style: "background:indigo;"
}, {
content: 6,
style: "background:violet;"
} ]
} ],
panelArrangers: [ {
name: "CardArranger",
arrangerKind: "CardArranger"
}, {
name: "CardSlideInArranger",
arrangerKind: "CardSlideInArranger"
}, {
name: "CarouselArranger",
arrangerKind: "CarouselArranger",
classes: "panels-sample-wide"
}, {
name: "CollapsingArranger",
arrangerKind: "CollapsingArranger",
classes: "panels-sample-collapsible"
}, {
name: "LeftRightArranger",
arrangerKind: "LeftRightArranger"
}, {
name: "TopBottomArranger",
arrangerKind: "TopBottomArranger",
classes: "panels-sample-topbottom"
}, {
name: "SpiralArranger",
arrangerKind: "SpiralArranger",
classes: "panels-sample-spiral"
}, {
name: "GridArranger",
arrangerKind: "enyo.sample.MyGridArranger",
classes: "panels-sample-grid"
} ],
bgcolors: [ "red", "orange", "yellow", "green", "blue", "indigo", "violet" ],
create: function() {
this.inherited(arguments);
for (var e = 0; e < this.panelArrangers.length; e++) this.$.arrangerPicker.createComponent({
content: this.panelArrangers[e].name
});
this.panelCount = this.$.samplePanels.getPanels().length;
},
rendered: function() {
this.inherited(arguments);
},
arrangerSelected: function(e, t) {
var n = this.$.samplePanels, r = this.panelArrangers[t.originator.indexInContainer() - 1];
this.currentClass && n.removeClass(this.currentClass), r.classes && (n.addClass(r.classes), this.currentClass = r.classes), n.setArrangerKind(r.arrangerKind), enyo.Panels.isScreenNarrow() && this.setIndex(1);
},
prevPanel: function() {
this.$.samplePanels.previous(), this.$.input.setValue(this.$.samplePanels.index);
},
nextPanel: function() {
this.$.samplePanels.next(), this.$.input.setValue(this.$.samplePanels.index);
},
gotoPanel: function() {
this.$.samplePanels.setIndex(this.$.input.getValue());
},
panelCount: 0,
addPanel: function() {
var e = this.$.samplePanels, t = this.panelCount++, n = e.createComponent({
style: "background:" + this.bgcolors[t % this.bgcolors.length],
content: t
});
n.render(), e.reflow(), e.setIndex(t);
},
deletePanel: function() {
var e = this.$.samplePanels.getActive();
e && e.destroy();
}
});

// PanelsFlickrSample.js

enyo.kind({
name: "enyo.sample.PanelsFlickrSample",
kind: "Panels",
classes: "panels-sample-flickr-panels enyo-unselectable enyo-fit",
arrangerKind: "CollapsingArranger",
components: [ {
layoutKind: "FittableRowsLayout",
components: [ {
kind: "onyx.Toolbar",
components: [ {
kind: "onyx.InputDecorator",
style: "width: 90%;",
layoutKind: "FittableColumnsLayout",
components: [ {
name: "searchInput",
fit: !0,
kind: "onyx.Input",
value: "Japan",
onchange: "search"
}, {
kind: "Image",
src: "assets/search-input-search.png",
style: "width: 20px; height: 20px;"
} ]
}, {
name: "searchSpinner",
kind: "Image",
src: "assets/spinner.gif",
showing: !1
} ]
}, {
kind: "List",
fit: !0,
touch: !0,
onSetupItem: "setupItem",
components: [ {
name: "item",
style: "padding: 10px;",
classes: "panels-sample-flickr-item enyo-border-box",
ontap: "itemTap",
components: [ {
name: "thumbnail",
kind: "Image",
classes: "panels-sample-flickr-thumbnail"
}, {
name: "title",
classes: "panels-sample-flickr-title"
} ]
}, {
name: "more",
style: "background-color: #323232;",
components: [ {
kind: "onyx.Button",
content: "more photos",
classes: "onyx-dark panels-sample-flickr-more-button",
ontap: "more"
}, {
name: "moreSpinner",
kind: "Image",
src: "assets/spinner.gif",
classes: "panels-sample-flickr-more-spinner"
} ]
} ]
} ]
}, {
name: "pictureView",
fit: !0,
kind: "FittableRows",
classes: "enyo-fit panels-sample-flickr-main",
components: [ {
name: "backToolbar",
kind: "onyx.Toolbar",
showing: !1,
components: [ {
kind: "onyx.Button",
content: "Back",
ontap: "showList"
} ]
}, {
fit: !0,
style: "position: relative;",
components: [ {
name: "flickrImage",
kind: "Image",
classes: "enyo-fit panels-sample-flickr-center panels-sample-flickr-image",
showing: !1,
onload: "imageLoaded",
onerror: "imageLoaded"
}, {
name: "imageSpinner",
kind: "Image",
src: "assets/spinner-large.gif",
classes: "enyo-fit panels-sample-flickr-center",
showing: !1
} ]
} ]
}, {
kind: "FlickrSearch",
onResults: "searchResults"
} ],
rendered: function() {
this.inherited(arguments), this.search();
},
reflow: function() {
this.inherited(arguments);
var e = this.$.backToolbar.showing;
this.$.backToolbar.setShowing(enyo.Panels.isScreenNarrow()), this.$.backToolbar.showing != e && this.$.pictureView.resized();
},
search: function() {
this.searchText = this.$.searchInput.getValue(), this.page = 0, this.results = [], this.$.searchSpinner.show(), this.$.flickrSearch.search(this.searchText);
},
searchResults: function(e, t) {
this.$.searchSpinner.hide(), this.$.moreSpinner.hide(), this.results = this.results.concat(t), this.$.list.setCount(this.results.length), this.page == 0 ? this.$.list.reset() : this.$.list.refresh();
},
setupItem: function(e, t) {
var n = t.index, r = this.results[n];
this.$.item.addRemoveClass("onyx-selected", e.isSelected(t.index)), this.$.thumbnail.setSrc(r.thumbnail), this.$.title.setContent(r.title || "Untitled"), this.$.more.canGenerate = !this.results[n + 1];
},
more: function() {
this.page++, this.$.moreSpinner.show(), this.$.flickrSearch.search(this.searchText, this.page);
},
itemTap: function(e, t) {
enyo.Panels.isScreenNarrow() && this.setIndex(1), this.$.imageSpinner.show();
var n = this.results[t.index];
this.$.flickrImage.hide(), this.$.flickrImage.setSrc(n.original);
},
imageLoaded: function() {
this.$.flickrImage.show();
var e = this.$.flickrImage.getBounds();
this.$.flickrImage.addRemoveClass("tall", e.height > e.width), this.$.imageSpinner.hide();
},
showList: function() {
this.setIndex(0);
}
}), enyo.kind({
name: "FlickrSearch",
kind: "Component",
published: {
searchText: ""
},
events: {
onResults: ""
},
url: "http://api.flickr.com/services/rest/",
pageSize: 200,
api_key: "2a21b46e58d207e4888e1ece0cb149a5",
search: function(e, t) {
this.searchText = e || this.searchText;
var n = (t || 0) * this.pageSize, r = {
method: "flickr.photos.search",
format: "json",
api_key: this.api_key,
per_page: this.pageSize,
page: n,
text: this.searchText
};
return (new enyo.JsonpRequest({
url: this.url,
callbackName: "jsoncallback"
})).response(this, "processResponse").go(r);
},
processResponse: function(e, t) {
var n = t.photos ? t.photos.photo || [] : [];
for (var r = 0, i; i = n[r]; r++) {
var s = "http://farm" + i.farm + ".static.flickr.com/" + i.server + "/" + i.id + "_" + i.secret;
i.thumbnail = s + "_s.jpg", i.original = s + ".jpg";
}
return this.doResults(n), n;
}
});

// PanelsSlidingSample.js

enyo.kind({
name: "enyo.sample.PanelsSlidingSample",
kind: "FittableRows",
classes: "onyx enyo-fit",
components: [ {
kind: "onyx.Toolbar",
components: [ {
content: "Realtime"
}, {
kind: "onyx.Checkbox",
onchange: "checkboxChange"
} ]
}, {
kind: "Panels",
fit: !0,
classes: "panels-sample-sliding-panels",
arrangerKind: "CollapsingArranger",
wrap: !1,
components: [ {
name: "left",
components: [ {
kind: "List",
classes: "enyo-fit",
touch: !0,
count: 1e3,
onSetupItem: "setupItem",
item: "item1",
components: [ {
name: "item1",
classes: "panels-sample-sliding-item"
} ]
} ]
}, {
name: "middle",
components: [ {
kind: "List",
classes: "enyo-fit",
touch: !0,
count: 1e3,
onSetupItem: "setupItem",
item: "item2",
components: [ {
name: "item2",
classes: "panels-sample-sliding-item"
} ]
} ]
}, {
name: "body",
fit: !0,
components: [ {
kind: "Scroller",
classes: "enyo-fit",
touch: !0,
components: [ {
classes: "panels-sample-sliding-content",
content: "Broke, down dumb hospitality firewood chitlins. Has mud tired uncle everlastin' cold, out. Hauled thar, up thar tar heffer quarrel farmer fish water is. Simple gritts dogs soap give kickin'. Ain't shiney water range, preacher java rent thar go. Skinned wirey tin farm, trespassin' it, rodeo. Said roped caught creosote go simple. Buffalo butt, jig fried commencin' cipherin' maw, wash. Round-up barefoot jest bible rottgut sittin' trailer shed jezebel. Crop old over poker drinkin' dirt where tools skinned, city-slickers tools liniment mush tarnation. Truck lyin' snakeoil creosote, old a inbred pudneer, slap dirty cain't. Hairy, smokin', nothin' highway hootch pigs drinkin', barefoot bootleg hoosegow mule. Tax-collectors uncle wuz, maw watchin' had jumpin' got redblooded gimmie truck shootin' askin' hootch. No fat ails fire soap cabin jail, reckon if trespassin' fixin' rustle jest liniment. Ya huntin' catfish shot good bankrupt. Fishin' sherrif has, fat cooked shed old. Broke, down dumb hospitality firewood chitlins. Has mud tired uncle everlastin' cold, out. Hauled thar, up thar tar heffer quarrel farmer fish water is. Simple gritts dogs soap give kickin'. Ain't shiney water range, preacher java rent thar go. Skinned wirey tin farm, trespassin' it, rodeo. Said roped caught creosote go simple. Buffalo butt, jig fried commencin' cipherin' maw, wash. Round-up barefoot jest bible rottgut sittin' trailer shed jezebel. Crop old over poker drinkin' dirt where tools skinned, city-slickers tools liniment mush tarnation. Truck lyin' snakeoil creosote, old a inbred pudneer, slap dirty cain't. Hairy, smokin', nothin' highway hootch pigs drinkin', barefoot bootleg hoosegow mule. Tax-collectors uncle wuz, maw watchin' had jumpin' got redblooded gimmie truck shootin' askin' hootch. No fat ails fire soap cabin jail, reckon if trespassin' fixin' rustle jest liniment. Ya huntin' catfish shot good bankrupt. Fishin' sherrif has, fat cooked shed old. Broke, down dumb hospitality firewood chitlins. Has mud tired uncle everlastin' cold, out. Hauled thar, up thar tar heffer quarrel farmer fish water is. Simple gritts dogs soap give kickin'. Ain't shiney water range, preacher java rent thar go. Skinned wirey tin farm, trespassin' it, rodeo. Said roped caught creosote go simple. Buffalo butt, jig fried commencin' cipherin' maw, wash. Round-up barefoot jest bible rottgut sittin' trailer shed jezebel. Crop old over poker drinkin' dirt where tools skinned, city-slickers tools liniment mush tarnation. Truck lyin' snakeoil creosote, old a inbred pudneer, slap dirty cain't. Hairy, smokin', nothin' highway hootch pigs drinkin', barefoot bootleg hoosegow mule. Tax-collectors uncle wuz, maw watchin' had jumpin' got redblooded gimmie truck shootin' askin' hootch. No fat ails fire soap cabin jail, reckon if trespassin' fixin' rustle jest liniment. Ya huntin' catfish shot good bankrupt. Fishin' sherrif has, fat cooked shed old. Broke, down dumb hospitality firewood chitlins. Has mud tired uncle everlastin' cold, out. Hauled thar, up thar tar heffer quarrel farmer fish water is. Simple gritts dogs soap give kickin'. Ain't shiney water range, preacher java rent thar go. Skinned wirey tin farm, trespassin' it, rodeo. Said roped caught creosote go simple. Buffalo butt, jig fried commencin' cipherin' maw, wash. Round-up barefoot jest bible rottgut sittin' trailer shed jezebel. Crop old over poker drinkin' dirt where tools skinned, city-slickers tools liniment mush tarnation. Truck lyin' snakeoil creosote, old a inbred pudneer, slap dirty cain't. Hairy, smokin', nothin' highway hootch pigs drinkin', barefoot bootleg hoosegow mule. Tax-collectors uncle wuz, maw watchin' had jumpin' got redblooded gimmie truck shootin' askin' hootch. No fat ails fire soap cabin jail, reckon if trespassin' fixin' rustle jest liniment. Ya huntin' catfish shot good bankrupt. Fishin' sherrif has, fat cooked shed old."
} ]
} ]
} ]
} ],
setupItem: function(e, t) {
this.$[e.item].setContent("This is row number: " + t.index);
},
checkboxChange: function(e) {
this.log(), this.$.panels.realtimeFit = e.getValue();
}
});

// NameGenerator.js

function rnd(e, t) {
return t < e ? 0 : Math.floor(Math.random() * (t - e + 1)) + e;
}

function makeName(e, t, n, r) {
n = n || "", r = r || "";
var i = "aeiouyhaeiouaeiou", s = "bcdfghjklmnpqrstvwxzbcdfgjklmnprstvwbcdfgjklmnprst", o = i + s, u = rnd(e, t) - n.length - r.length;
u < 1 && (u = 1);
var a = 0;
if (n.length > 0) for (var f = 0; f < n.length; f++) a == 2 && (a = 0), s.indexOf(n[f]) != -1 && a++; else a = 1;
var l = n;
for (var f = 0; f < u; f++) a == 2 ? (touse = i, a = 0) : touse = o, c = touse.charAt(rnd(0, touse.length - 1)), l += c, s.indexOf(c) != -1 && a++;
return l = l.charAt(0).toUpperCase() + l.substring(1, l.length) + r, l;
}

// ListBasicSample.js

enyo.kind({
name: "enyo.sample.ListBasicSample",
classes: "list-sample enyo-fit",
components: [ {
name: "list",
kind: "List",
count: 2e4,
multiSelect: !1,
classes: "enyo-fit list-sample-list",
onSetupItem: "setupItem",
components: [ {
name: "item",
classes: "list-sample-item enyo-border-box",
components: [ {
name: "index",
classes: "list-sample-index"
}, {
name: "name"
} ]
} ]
} ],
names: [],
setupItem: function(e, t) {
var n = t.index;
this.names[n] || (this.names[n] = makeName(5, 10, "", ""));
var r = this.names[n], i = ("00000000" + n).slice(-7);
this.$.item.addRemoveClass("onyx-selected", e.isSelected(n)), this.$.name.setContent(r), this.$.index.setContent(i);
}
});

// ListContactsSample.js

enyo.kind({
name: "enyo.sample.ListContactsSample",
kind: "FittableRows",
classes: "list-sample-contacts enyo-fit",
components: [ {
kind: "onyx.MoreToolbar",
layoutKind: "FittableColumnsLayout",
style: "height: 55px;",
components: [ {
kind: "onyx.Button",
content: "setup",
ontap: "showSetupPopup"
}, {
kind: "onyx.InputDecorator",
components: [ {
name: "newContactInput",
kind: "onyx.Input",
value: "Frankie Fu"
} ]
}, {
kind: "onyx.Button",
content: "new contact",
ontap: "addItem"
}, {
fit: !0
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
placeholder: "Search...",
style: "width: 140px;",
oninput: "searchInputChange"
}, {
kind: "Image",
src: "assets/search-input-search.png",
style: "width: 20px;"
} ]
}, {
kind: "onyx.Button",
content: "remove selected",
ontap: "removeSelected"
} ]
}, {
kind: "List",
classes: "list-sample-contacts-list",
fit: !0,
multiSelect: !0,
onSetupItem: "setupItem",
components: [ {
name: "divider",
classes: "list-sample-contacts-divider"
}, {
name: "item",
kind: "ContactItem",
classes: "list-sample-contacts-item enyo-border-box",
onRemove: "removeTap"
} ]
}, {
name: "popup",
kind: "onyx.Popup",
modal: !0,
centered: !0,
classes: "list-sample-contacts-popup",
components: [ {
components: [ {
style: "display:inline-block",
components: [ {
content: "count:",
classes: "list-sample-contacts-label"
}, {
name: "countOutput",
style: "display:inline-block;",
content: "200"
} ]
}, {
kind: "onyx.Slider",
value: 4,
onChanging: "countSliderChanging"
} ]
}, {
components: [ {
content: "rowsPerPage:",
classes: "list-sample-contacts-label"
}, {
name: "rowsPerPageOutput",
style: "display:inline-block;",
content: "50"
}, {
kind: "onyx.Slider",
value: 10,
onChanging: "rowsSliderChanging"
} ]
}, {
components: [ {
content: "hide divider:",
classes: "list-sample-contacts-label"
}, {
name: "hideDividerCheckbox",
kind: "onyx.Checkbox"
} ]
}, {
components: [ {
kind: "onyx.Button",
content: "populate list",
classes: "list-sample-contacts-populate-button",
ontap: "populateList"
} ]
} ]
} ],
rendered: function() {
this.inherited(arguments), this.populateList();
},
setupItem: function(e, t) {
var n = t.index, r = this.filter ? this.filtered : this.db, i = r[n];
this.$.item.setContact(i), this.$.item.setSelected(e.isSelected(n));
if (!this.hideDivider) {
var s = i.name[0], o = r[n - 1], u = s != (o && o.name[0]);
this.$.divider.setContent(s), this.$.divider.canGenerate = u, this.$.item.applyStyle("border-top", u ? "none" : null);
}
},
refreshList: function() {
this.filter ? (this.filtered = this.generateFilteredData(this.filter), this.$.list.setCount(this.filtered.length)) : this.$.list.setCount(this.db.length), this.$.list.reset();
},
addItem: function() {
var e = this.generateItem(enyo.cap(this.$.newContactInput.getValue())), t = 0;
for (var n; n = this.db[t]; t++) if (n.name > e.name) {
this.db.splice(t, 0, e);
break;
}
n || this.db.push(e), this.refreshList(), this.$.list.scrollToRow(t);
},
removeItem: function(e) {
this._removeItem(e), this.refreshList(), this.$.list.getSelection().deselect(e);
},
_removeItem: function(e) {
var t = this.filter ? this.filtered[e].dbIndex : e;
this.db.splice(t, 1);
},
removeTap: function(e, t) {
return this.removeItem(t.index), !0;
},
removeSelected: function() {
for (var e in this.$.list.getSelection().getSelected()) this._removeItem(e);
this.$.list.getSelection().clear(), this.refreshList();
},
populateList: function() {
this.$.popup.hide(), this.createDb(~~this.$.countOutput.getContent()), this.$.list.setCount(this.db.length), this.$.list.setRowsPerPage(~~this.$.rowsPerPageOutput.getContent()), this.hideDivider = this.$.hideDividerCheckbox.getValue(), this.$.divider.canGenerate = !this.hideDivider, this.$.list.reset();
},
createDb: function(e) {
this.db = [];
for (var t = 0; t < e; t++) this.db.push(this.generateItem(makeName(4, 6) + " " + makeName(5, 10)));
this.sortDb();
},
generateItem: function(e) {
return {
name: e,
avatar: "assets/avatars/" + avatars[enyo.irand(avatars.length)],
title: titles[enyo.irand(titles.length)]
};
},
sortDb: function() {
this.db.sort(function(e, t) {
return e.name < t.name ? -1 : e.name > t.name ? 1 : 0;
});
},
showSetupPopup: function() {
this.$.popup.show();
},
searchInputChange: function(e) {
enyo.job(this.id + ":search", enyo.bind(this, "filterList", e.getValue()), 200);
},
filterList: function(e) {
e != this.filter && (this.filter = e, this.filtered = this.generateFilteredData(e), this.$.list.setCount(this.filtered.length), this.$.list.reset());
},
generateFilteredData: function(e) {
var t = new RegExp("^" + e, "i"), n = [];
for (var r = 0, i; i = this.db[r]; r++) i.name.match(t) && (i.dbIndex = r, n.push(i));
return n;
},
countSliderChanging: function(e, t) {
this.$.countOutput.setContent(Math.round(e.getValue()) * 50);
},
rowsSliderChanging: function(e, t) {
this.$.rowsPerPageOutput.setContent(Math.round(e.getValue()) * 5);
}
});

var avatars = [ "angel.png", "astrologer.png", "athlete.png", "baby.png", "clown.png", "devil.png", "doctor.png", "dude.png", "dude2.png", "dude3.png", "dude4.png", "dude5.png", "dude6.png" ], titles = [ "Regional Data Producer", "Internal Markets Administrator", "Central Solutions Producer", "Dynamic Program Executive", "Direct Configuration Executive", "International Marketing Assistant", "District Research Consultant", "Lead Intranet Coordinator", "Central Accountability Director", "Product Web Assistant" ];

enyo.kind({
name: "ContactItem",
events: {
onRemove: ""
},
components: [ {
name: "avatar",
kind: "Image",
classes: "list-sample-contacts-avatar"
}, {
components: [ {
name: "name"
}, {
name: "title",
classes: "list-sample-contacts-description"
}, {
content: "(415) 711-1234",
classes: "list-sample-contacts-description"
} ]
}, {
name: "remove",
kind: "onyx.IconButton",
classes: "list-sample-contacts-remove-button",
src: "assets/remove-icon.png",
ontap: "removeTap"
} ],
setContact: function(e) {
this.$.name.setContent(e.name), this.$.avatar.setSrc(e.avatar), this.$.title.setContent(e.title);
},
setSelected: function(e) {
this.addRemoveClass("list-sample-contacts-item-selected", e), this.$.remove.applyStyle("display", e ? "inline-block" : "none");
},
removeTap: function(e, t) {
return this.doRemove(t), !0;
}
});

// ListPulldownSample.js

enyo.kind({
name: "enyo.sample.ListPulldownSample",
classes: "enyo-unselectable enyo-fit onyx",
kind: "FittableRows",
components: [ {
kind: "onyx.Toolbar",
components: [ {
kind: "onyx.InputDecorator",
components: [ {
name: "searchInput",
kind: "onyx.Input",
value: "enyojs",
placeholder: "Enter seach term"
}, {
kind: "Image",
src: "assets/search-input-search.png",
style: "width: 20px;"
} ]
}, {
kind: "onyx.Button",
content: "search",
ontap: "search"
} ]
}, {
name: "list",
kind: "PulldownList",
classes: "list-sample-pulldown-list",
fit: !0,
onSetupItem: "setupItem",
onPullRelease: "pullRelease",
onPullComplete: "pullComplete",
components: [ {
style: "padding: 10px;",
classes: "list-sample-pulldown-item enyo-border-box",
components: [ {
name: "icon",
kind: "Image",
style: "float: left; width: 48px; height: 48px; padding: 0 10px 10px 0;"
}, {
name: "name",
tag: "span",
style: "font-weight: bold;"
}, {
name: "handle",
tag: "span",
style: "color: lightgrey;"
}, {
name: "date",
tag: "span",
style: "float: right; color: lightgrey;"
}, {
tag: "br"
}, {
name: "text",
tag: "p",
style: "word-wrap: break-word;",
allowHtml: !0
} ]
} ]
} ],
rendered: function() {
this.inherited(arguments), this.search();
},
pullRelease: function() {
this.pulled = !0, setTimeout(enyo.bind(this, function() {
this.search();
}), 1e3);
},
pullComplete: function() {
this.pulled = !1, this.$.list.reset();
},
search: function() {
var e = this.$.searchInput.getValue().replace(/^\s+|\s+$/g, "");
if (e !== "") {
var t = new enyo.JsonpRequest({
url: "http://search.twitter.com/search.json",
callbackName: "callback"
});
t.response(enyo.bind(this, "processSearchResults")), t.go({
q: e,
rpp: 20
});
} else this.$.searchInput.setValue(e);
},
processSearchResults: function(e, t) {
this.results = t.results, this.$.list.setCount(this.results.length), this.pulled ? this.$.list.completePull() : this.$.list.reset();
},
setupItem: function(e, t) {
var n = t.index, r = this.results[n];
this.$.icon.setSrc(r.profile_image_url), this.$.name.setContent(r.from_user_name), this.$.handle.setContent(" @" + r.from_user), this.$.date.setContent(this.getRelativeDateString(r.created_at)), this.$.text.setContent(this.parseTweet(r.text));
},
getRelativeDateString: function(e) {
var t = new Date(e), n = new Date, r;
if (n.toLocaleDateString() == t.toLocaleDateString()) {
var i = n.getHours() - t.getHours(), s = n.getMinutes() - t.getMinutes();
r = i ? i + " hour" : s ? s + " minute" : n.getSeconds() - t.getSeconds() + " second";
} else {
var o = n.getMonth() - t.getMonth();
r = o ? o + " month" : n.getDate() - t.getDate() + " day";
}
return r.split(" ")[0] > 1 ? r + "s" : r;
},
parseTweet: function(e) {
var t = e;
return t = t.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(e) {
return "<a href='" + e + "'target='_blank'>" + e + "</a>";
}), t.replace(/[@]+[A-Za-z0-9-_]+/, function(e) {
var t = e.replace("@", "");
return "<a href='http://twitter.com/" + e + "'target='_blank'>@" + t + "</a>";
});
}
});

// Node.js

enyo.kind({
name: "enyo.Node",
published: {
expandable: !1,
expanded: !1,
icon: "",
onlyIconExpands: !1,
selected: !1
},
style: "padding: 0 0 0 16px;",
content: "Node",
defaultKind: "Node",
classes: "enyo-node",
components: [ {
name: "icon",
kind: "Image",
showing: !1
}, {
kind: "Control",
name: "caption",
Xtag: "span",
style: "display: inline-block; padding: 4px;",
allowHtml: !0
}, {
kind: "Control",
name: "extra",
tag: "span",
allowHtml: !0
} ],
childClient: [ {
kind: "Control",
name: "box",
classes: "enyo-node-box",
Xstyle: "border: 1px solid orange;",
components: [ {
kind: "Control",
name: "client",
classes: "enyo-node-client",
Xstyle: "border: 1px solid lightblue;"
} ]
} ],
handlers: {
ondblclick: "dblclick"
},
events: {
onNodeTap: "nodeTap",
onNodeDblClick: "nodeDblClick",
onExpand: "nodeExpand",
onDestroyed: "nodeDestroyed"
},
create: function() {
this.inherited(arguments), this.selectedChanged(), this.iconChanged();
},
destroy: function() {
this.doDestroyed(), this.inherited(arguments);
},
initComponents: function() {
this.expandable && (this.kindComponents = this.kindComponents.concat(this.childClient)), this.inherited(arguments);
},
contentChanged: function() {
this.$.caption.setContent(this.content);
},
iconChanged: function() {
this.$.icon.setSrc(this.icon), this.$.icon.setShowing(Boolean(this.icon));
},
selectedChanged: function() {
this.addRemoveClass("enyo-selected", this.selected);
},
rendered: function() {
this.inherited(arguments), this.expandable && !this.expanded && this.quickCollapse();
},
addNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent(n);
this.$.client.render();
},
addTextNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent({
content: n
});
this.$.client.render();
},
tap: function(e, t) {
return this.onlyIconExpands ? t.target == this.$.icon.hasNode() ? this.toggleExpanded() : this.doNodeTap() : (this.toggleExpanded(), this.doNodeTap()), !0;
},
dblclick: function(e, t) {
return this.doNodeDblClick(), !0;
},
toggleExpanded: function() {
this.setExpanded(!this.expanded);
},
quickCollapse: function() {
this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "0");
var e = this.$.client.getBounds().height;
this.$.client.setBounds({
top: -e
});
},
_expand: function() {
this.addClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), this.$.client.setBounds({
top: 0
}), setTimeout(enyo.bind(this, function() {
this.expanded && (this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "auto"));
}), 225);
},
_collapse: function() {
this.removeClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), setTimeout(enyo.bind(this, function() {
this.addClass("enyo-animate"), this.$.box.applyStyle("height", "0"), this.$.client.setBounds({
top: -e
});
}), 25);
},
expandedChanged: function(e) {
if (!this.expandable) this.expanded = !1; else {
var t = {
expanded: this.expanded
};
this.doExpand(t), t.wait || this.effectExpanded();
}
},
effectExpanded: function() {
this.$.client && (this.expanded ? this._expand() : this._collapse());
}
});

// TreeSample.js

enyo.kind({
name: "enyo.sample.TreeSample",
classes: "enyo-unselectable enyo-fit",
kind: "FittableRows",
fit: !0,
components: [ {
kind: "Selection",
onSelect: "select",
onDeselect: "deselect"
}, {
kind: "Scroller",
fit: !0,
components: [ {
kind: "Node",
icon: "assets/folder-open.png",
content: "Tree",
expandable: !0,
expanded: !0,
onExpand: "nodeExpand",
onNodeTap: "nodeTap",
components: [ {
icon: "assets/file.png",
content: "Alpha"
}, {
icon: "assets/folder-open.png",
content: "Bravo",
expandable: !0,
expanded: !0,
components: [ {
icon: "assets/file.png",
content: "Bravo-Alpha"
}, {
icon: "assets/file.png",
content: "Bravo-Bravo"
}, {
icon: "assets/file.png",
content: "Bravo-Charlie"
} ]
}, {
icon: "assets/folder.png",
content: "Charlie",
expandable: !0,
components: [ {
icon: "assets/file.png",
content: "Charlie-Alpha"
}, {
icon: "assets/file.png",
content: "Charlie-Bravo"
}, {
icon: "assets/file.png",
content: "Charlie-Charlie"
} ]
}, {
icon: "assets/folder-open.png",
content: "Delta",
expandable: !0,
expanded: !0,
components: [ {
icon: "assets/file.png",
content: "Delta-Alpha"
}, {
icon: "assets/file.png",
content: "Delta-Bravo"
}, {
icon: "assets/file.png",
content: "Delta-Charlie"
} ]
}, {
icon: "assets/file.png",
content: "Epsilon"
} ]
} ]
} ],
nodeExpand: function(e, t) {
e.setIcon("assets/" + (e.expanded ? "folder-open.png" : "folder.png"));
},
nodeTap: function(e, t) {
var n = t.originator;
this.$.selection.select(n.id, n);
},
select: function(e, t) {
t.data.$.caption.applyStyle("background-color", "lightblue");
},
deselect: function(e, t) {
t.data.$.caption.applyStyle("background-color", null);
}
});

// ButtonGroupSample.js

enyo.kind({
name: "onyx.sample.ButtonGroupSample",
classes: "onyx onyx-sample",
components: [ {
classes: "onyx-sample-divider",
content: "RadioGroup"
}, {
kind: "onyx.RadioGroup",
onActivate: "radioActivated",
components: [ {
content: "Alpha",
active: !0
}, {
content: "Beta"
}, {
content: "Gamma"
} ]
}, {
tag: "br"
}, {
classes: "onyx-sample-divider",
content: "TabGroup"
}, {
kind: "onyx.RadioGroup",
onActivate: "tabActivated",
controlClasses: "onyx-tabbutton",
components: [ {
content: "Alpha",
active: !0
}, {
content: "Beta"
} ]
}, {
tag: "br"
}, {
classes: "onyx-sample-divider",
content: "Button Group"
}, {
kind: "Group",
onActivate: "buttonActivated",
classes: "onyx-sample-tools group",
defaultKind: "onyx.Button",
highlander: !0,
components: [ {
content: "Button A",
active: !0,
classes: "onyx-affirmative"
}, {
content: "Button B",
classes: "onyx-negative"
}, {
content: "Button C",
classes: "onyx-blue"
} ]
}, {
tag: "br"
}, {
kind: "onyx.Groupbox",
classes: "onyx-sample-result-box",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Result"
}, {
name: "result",
classes: "onyx-sample-result",
content: "No button tapped yet."
} ]
} ],
radioActivated: function(e, t) {
t.originator.getActive() && this.$.result.setContent('The "' + t.originator.getContent() + '" radio button is selected.');
},
tabActivated: function(e, t) {
t.originator.getActive() && this.$.result.setContent('The "' + t.originator.getContent() + '" tab button is selected.');
},
buttonActivated: function(e, t) {
t.originator.getActive() && this.$.result.setContent('The "' + t.originator.getContent() + '" button is selected.');
}
});

// ButtonSample.js

enyo.kind({
name: "onyx.sample.ButtonSample",
classes: "onyx onyx-sample",
components: [ {
classes: "onyx-sample-divider",
content: "Buttons"
}, {
classes: "onyx-sample-tools",
components: [ {
kind: "onyx.Button",
content: "Button",
ontap: "buttonTapped"
} ]
}, {
classes: "onyx-sample-tools",
components: [ {
kind: "onyx.Button",
content: "Affirmative",
classes: "onyx-affirmative",
ontap: "buttonTapped"
}, {
kind: "onyx.Button",
content: "Negative",
classes: "onyx-negative",
ontap: "buttonTapped"
}, {
kind: "onyx.Button",
content: "Blue",
classes: "onyx-blue",
ontap: "buttonTapped"
}, {
kind: "onyx.Button",
content: "Dark",
classes: "onyx-dark",
ontap: "buttonTapped"
}, {
kind: "onyx.Button",
content: "Custom",
style: "background-color: purple; color: #F1F1F1;",
ontap: "buttonTapped"
} ]
}, {
classes: "onyx-sample-tools",
components: [ {
kind: "onyx.Button",
content: "Active",
classes: "active",
ontap: "buttonTapped"
}, {
kind: "onyx.Button",
content: "Disabled",
disabled: !0,
ontap: "buttonTapped"
}, {
kind: "onyx.Button",
content: "Active Disabled",
classes: "active",
disabled: !0,
ontap: "buttonTapped"
} ]
}, {
classes: "onyx-sample-tools",
components: [ {
kind: "onyx.Button",
content: "Tall Button",
style: "height: 70px;",
ontap: "buttonTapped"
} ]
}, {
classes: "onyx-sample-divider",
content: "Buttons with images"
}, {
classes: "onyx-sample-tools",
components: [ {
kind: "onyx.Button",
name: "Image Button",
ontap: "buttonTapped",
components: [ {
tag: "img",
attributes: {
src: "assets/favicon.ico"
}
}, {
content: "There is an image here"
} ]
}, {
kind: "onyx.Button",
name: "Fishbowl Button",
ontap: "buttonTapped",
components: [ {
kind: "onyx.Icon",
src: "assets/fish_bowl.png"
} ]
} ]
}, {
kind: "onyx.Groupbox",
classes: "onyx-sample-result-box",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Result"
}, {
name: "result",
classes: "onyx-sample-result",
content: "No button tapped yet."
} ]
} ],
buttonTapped: function(e, t) {
e.content ? this.$.result.setContent('The "' + e.getContent() + '" button was tapped') : this.$.result.setContent('The "' + e.getName() + '" button was tapped');
}
});

// CheckboxSample.js

enyo.kind({
name: "onyx.sample.CheckboxSample",
classes: "onyx onyx-sample",
components: [ {
classes: "onyx-sample-divider",
content: "Checkboxes"
}, {
classes: "onyx-sample-tools",
components: [ {
kind: "onyx.Checkbox",
onchange: "checkboxChanged"
}, {
kind: "onyx.Checkbox",
onchange: "checkboxChanged"
}, {
kind: "onyx.Checkbox",
onchange: "checkboxChanged",
checked: !0
} ]
}, {
tag: "br"
}, {
classes: "onyx-sample-divider",
content: "Checkboxes Group"
}, {
kind: "Group",
classes: "onyx-sample-tools group",
onActivate: "groupActivated",
highlander: !0,
components: [ {
kind: "onyx.Checkbox",
checked: !0
}, {
kind: "onyx.Checkbox"
}, {
kind: "onyx.Checkbox"
} ]
}, {
tag: "br"
}, {
kind: "onyx.Groupbox",
classes: "onyx-sample-result-box",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Result"
}, {
name: "result",
classes: "onyx-sample-result",
content: "No button tapped yet."
} ]
} ],
checkboxChanged: function(e, t) {
this.$.result.setContent(e.name + " was " + (e.getValue() ? " selected." : "deselected."));
},
ordinals: [ "1st", "2nd", "3rd" ],
groupActivated: function(e, t) {
if (t.originator.getActive()) {
var n = t.originator.indexInContainer();
this.$.result.setContent("The " + this.ordinals[n] + " checkbox in the group is selected.");
}
}
});

// GroupboxSample.js

enyo.kind({
name: "onyx.sample.GroupboxSample",
classes: "onyx onyx-sample",
components: [ {
classes: "onyx-sample-divider",
content: "Groupboxes"
}, {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Header"
}, {
content: "I'm a group item!",
style: "padding: 8px;"
}, {
content: "I'm a group item!",
style: "padding: 8px;"
} ]
}, {
tag: "br"
}, {
kind: "onyx.Groupbox",
components: [ {
content: "I'm a group item!",
style: "padding: 8px;"
} ]
}, {
tag: "br"
}, {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Header"
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
style: "width: 100%",
placeholder: "Enter text here"
} ]
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
style: "width: 100%",
value: "Middle"
} ]
}, {
kind: "onyx.InputDecorator",
style: "background: lightblue;",
components: [ {
kind: "onyx.Input",
style: "width: 100%;",
value: "Last"
} ]
} ]
}, {
tag: "br"
}, {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
style: "width: 100%",
placeholder: "Enter text here"
} ]
} ]
}, {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
type: "password",
style: "width: 100%",
placeholder: "Enter Password"
} ]
} ]
} ]
});

// IconButtonSample.js

enyo.kind({
name: "onyx.sample.IconButtonSample",
classes: "onyx onyx-sample",
components: [ {
classes: "onyx-sample-divider",
content: "Icon"
}, {
kind: "onyx.Icon",
src: "assets/menu-icon-bookmark.png"
}, {
tag: "br"
}, {
tag: "br"
}, {
classes: "onyx-sample-divider",
content: "Icon Button"
}, {
kind: "onyx.IconButton",
src: "assets/menu-icon-bookmark.png",
ontap: "iconTapped"
}, {
kind: "onyx.IconButton",
src: "assets/menu-icon-bookmark.png",
disabled: !0,
ontap: "iconTapped"
}, {
tag: "br"
}, {
tag: "br"
}, {
classes: "onyx-sample-divider",
content: "Grouped Icon Buttons"
}, {
kind: "Group",
onActivate: "iconGroupActivated",
components: [ {
kind: "onyx.IconButton",
active: !0,
src: "assets/menu-icon-bookmark.png"
}, {
kind: "onyx.IconButton",
src: "assets/menu-icon-bookmark.png"
}, {
kind: "onyx.IconButton",
src: "assets/menu-icon-bookmark.png"
} ]
}, {
tag: "br"
}, {
classes: "onyx-sample-divider",
content: "Icon Buttons in Toolbar"
}, {
kind: "onyx.Toolbar",
defaultKind: "onyx.IconButton",
components: [ {
src: "assets/menu-icon-bookmark.png",
ontap: "iconTapped"
}, {
src: "assets/menu-icon-bookmark.png",
ontap: "iconTapped"
}, {
src: "assets/menu-icon-bookmark.png",
ontap: "iconTapped"
}, {
kind: "Control"
}, {
kind: "Group",
tag: null,
onActivate: "iconGroupActivated",
defaultKind: "onyx.IconButton",
components: [ {
src: "assets/menu-icon-bookmark.png",
active: !0
}, {
src: "assets/menu-icon-bookmark.png"
}, {
src: "assets/menu-icon-bookmark.png"
} ]
} ]
}, {
tag: "br"
}, {
kind: "onyx.Groupbox",
classes: "onyx-sample-result-box",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Result"
}, {
name: "result",
classes: "onyx-sample-result",
content: "No button tapped yet."
} ]
} ],
iconTappedCounts: {},
iconTapped: function(e, t) {
this.iconTappedCounts[e.name] = this.iconTappedCounts[e.name] || 0, this.$.result.setContent("The icon button was tapped: " + ++this.iconTappedCounts[e.name]);
},
ordinals: [ "1st", "2nd", "3rd" ],
iconGroupActivated: function(e, t) {
if (t.originator.getActive()) {
var n = t.originator.indexInContainer();
this.$.result.setContent("The " + this.ordinals[n] + " icon button in the group is selected.");
}
}
});

// InputSample.js

enyo.kind({
name: "onyx.sample.InputSample",
classes: "onyx onyx-sample",
components: [ {
classes: "onyx-sample-divider",
content: "Inputs"
}, {
classes: "onyx-toolbar-inline",
components: [ {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
placeholder: "Enter text here",
onchange: "inputChanged"
} ]
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
placeholder: "Search term",
onchange: "inputChanged"
}, {
kind: "Image",
src: "assets/search-input-search.png"
} ]
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
type: "password",
placeholder: "Enter password",
onchange: "inputChanged"
} ]
}, {
kind: "onyx.InputDecorator",
components: [ {
content: "alwaysLookFocused:"
}, {
kind: "onyx.Checkbox",
onchange: "changeFocus"
} ]
} ]
}, {
classes: "onyx-toolbar-inline",
components: [ {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
disabled: !0,
value: "Disabled input"
} ]
}, {
kind: "onyx.InputDecorator",
components: [ {
content: "Left:"
}, {
kind: "onyx.Input",
value: "Input Area",
onchange: "inputChanged"
}, {
content: " :Right"
} ]
} ]
}, {
tag: "br"
}, {
classes: "onyx-sample-divider",
content: "RichTexts"
}, {
classes: "onyx-toolbar-inline",
components: [ {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.RichText",
style: "width: 200px;",
placeholder: "Enter text here",
onchange: "inputChanged"
} ]
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.RichText",
style: "width: 200px;",
placeholder: "Search term",
onchange: "inputChanged"
}, {
kind: "Image",
src: "assets/search-input-search.png"
} ]
} ]
}, {
tag: "br"
}, {
classes: "onyx-sample-divider",
content: "TextAreas"
}, {
classes: "onyx-toolbar-inline",
components: [ {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.TextArea",
placeholder: "Enter text here",
onchange: "inputChanged"
} ]
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.TextArea",
placeholder: "Search term",
onchange: "inputChanged"
}, {
kind: "Image",
src: "assets/search-input-search.png"
} ]
} ]
}, {
tag: "br"
}, {
kind: "onyx.Groupbox",
classes: "onyx-sample-result-box",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Result"
}, {
name: "result",
classes: "onyx-sample-result",
content: "No input entered yet."
} ]
} ],
inputChanged: function(e, t) {
this.$.result.setContent("Input: " + e.getValue());
},
changeFocus: function(e, t) {
this.$.inputDecorator.setAlwaysLooksFocused(e.getValue()), this.$.inputDecorator2.setAlwaysLooksFocused(e.getValue()), this.$.inputDecorator3.setAlwaysLooksFocused(e.getValue());
}
});

// PopupSample.js

enyo.kind({
name: "onyx.sample.PopupSample",
classes: "onyx onyx-sample",
components: [ {
classes: "onyx-sample-divider",
content: "Popups"
}, {
classes: "onyx-sample-tools",
components: [ {
kind: "onyx.Button",
content: "Basic Popup",
ontap: "showPopup",
popup: "basicPopup"
}, {
name: "basicPopup",
kind: "onyx.Popup",
centered: !0,
floating: !0,
classes: "onyx-sample-popup",
style: "padding: 10px;",
content: "Popup..."
}, {
tag: "br"
}, {
kind: "onyx.Button",
content: "Popup w/Spinner (Dark)",
ontap: "showPopup",
popup: "spinnerPopup"
}, {
name: "spinnerPopup",
classes: "onyx-sample-popup",
kind: "onyx.Popup",
centered: !0,
floating: !0,
onHide: "popupHidden",
scrim: !0,
components: [ {
kind: "onyx.Spinner"
}, {
content: "Popup"
} ]
}, {
tag: "br"
}, {
kind: "onyx.Button",
content: "Popup w/Spinner (Light)",
ontap: "showPopup",
popup: "lightPopup"
}, {
name: "lightPopup",
classes: "onyx-sample-popup",
style: "background: #eee;color: black;",
kind: "onyx.Popup",
centered: !0,
floating: !0,
onHide: "popupHidden",
scrim: !0,
components: [ {
kind: "onyx.Spinner",
classes: "onyx-light"
}, {
content: "Popup"
} ]
}, {
tag: "br"
}, {
kind: "onyx.Button",
content: "Modal Popup with Input",
ontap: "showPopup",
popup: "modalPopup"
}, {
name: "modalPopup",
classes: "onyx-sample-popup",
kind: "onyx.Popup",
centered: !0,
modal: !0,
floating: !0,
onShow: "popupShown",
onHide: "popupHidden",
components: [ {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input"
} ]
}, {
tag: "br"
}, {
kind: "onyx.Button",
content: "Close",
ontap: "closeModalPopup"
}, {
kind: "onyx.Button",
content: "Another!",
ontap: "showPopup",
popup: "lightPopup"
} ]
} ]
} ],
showPopup: function(e) {
var t = this.$[e.popup];
t && t.show();
},
popupHidden: function() {
document.activeElement.blur(), this.$.modalPopup.showing && enyo.job("focus", enyo.bind(this.$.input, "focus"), 500);
},
popupShown: function() {
this.$.input.focus(), enyo.job("focus", enyo.bind(this.$.input, "focus"), 500);
},
closeModalPopup: function() {
this.$.modalPopup.hide();
}
});

// ProgressSample.js

enyo.kind({
name: "onyx.sample.ProgressSample",
classes: "onyx onyx-sample",
components: [ {
classes: "onyx-sample-divider",
content: "Progress Bars"
}, {
kind: "onyx.ProgressBar",
progress: 25
}, {
kind: "onyx.ProgressBar",
animateStripes: !1,
progress: 25
}, {
kind: "onyx.ProgressBar",
progress: 25,
barClasses: "onyx-green"
}, {
kind: "onyx.ProgressBar",
progress: 25,
barClasses: "onyx-red"
}, {
kind: "onyx.ProgressBar",
progress: 25,
barClasses: "onyx-dark"
}, {
kind: "onyx.ProgressBar",
animateStripes: !1,
barClasses: "onyx-light",
progress: 50
}, {
kind: "onyx.ProgressBar",
showStripes: !1,
progress: 75
}, {
tag: "br"
}, {
classes: "onyx-sample-divider",
content: "Progress Buttons"
}, {
kind: "onyx.ProgressButton",
progress: 25,
onCancel: "clearValue",
components: [ {
content: "0"
}, {
content: "100",
style: "float: right;"
} ]
}, {
kind: "onyx.ProgressButton",
animateStripes: !1,
barClasses: "onyx-dark",
progress: 50,
onCancel: "clearValue"
}, {
kind: "onyx.ProgressButton",
showStripes: !1,
progress: 75,
onCancel: "clearValue"
}, {
tag: "br"
}, {
kind: "onyx.InputDecorator",
style: "margin-right:10px;",
components: [ {
kind: "onyx.Input",
placeholder: "Value",
style: "width:50px;"
} ]
}, {
kind: "onyx.Button",
content: "Set",
classes: "onyx-sample-spaced-button",
ontap: "changeValue"
}, {
kind: "onyx.Button",
content: "-",
classes: "onyx-sample-spaced-button",
ontap: "decValue"
}, {
kind: "onyx.Button",
content: "+",
classes: "onyx-sample-spaced-button",
ontap: "incValue"
}, {
tag: "br"
}, {
tag: "br"
}, {
kind: "onyx.Checkbox",
name: "animateSetting",
checked: !0
}, {
content: "Animated",
classes: "enyo-inline onyx-sample-animate-label"
}, {
tag: "br"
}, {
tag: "br"
}, {
classes: "onyx-sample-divider",
content: "Sliders"
}, {
kind: "onyx.Slider",
min: 10,
max: 50,
value: 30
}, {
tag: "br"
}, {
kind: "onyx.Slider",
lockBar: !1,
progress: 20,
value: 75
}, {
tag: "br"
}, {
name: "progressSlider",
kind: "onyx.Slider",
lockBar: !1,
value: 75
}, {
kind: "onyx.Button",
content: "Toggle Progress",
ontap: "toggleProgress"
} ],
changeValue: function(e, t) {
for (var n in this.$) if (this.$[n].kind == "onyx.ProgressBar" || this.$[n].kind == "onyx.ProgressButton") this.$.animateSetting.getValue() ? this.$[n].animateProgressTo(this.$.input.getValue()) : this.$[n].setProgress(this.$.input.getValue());
},
incValue: function() {
this.$.input.setValue(Math.min(parseInt(this.$.input.getValue() || 0) + 10, 100)), this.changeValue();
},
decValue: function() {
this.$.input.setValue(Math.max(parseInt(this.$.input.getValue() || 0) - 10, 0)), this.changeValue();
},
clearValue: function(e, t) {
e.setProgress(0);
},
toggleProgress: function() {
this._progressing = !this._progressing, this.nextProgress();
},
nextProgress: function() {
this._progressing && enyo.requestAnimationFrame(enyo.bind(this, function() {
this.incrementProgress(), setTimeout(enyo.bind(this, "nextProgress"), 500);
}), this.hasNode());
},
incrementProgress: function() {
var e = this.$.progressSlider, t = e.min + (e.progress - e.min + 5) % (e.max - e.min + 1);
e.animateProgressTo(t);
}
});

// SliderSample.js

enyo.kind({
name: "onyx.sample.SliderSample",
classes: "onyx onyx-sample",
components: [ {
classes: "onyx-sample-divider",
content: "Sliders"
}, {
kind: "onyx.Slider",
value: 50,
onChanging: "sliderChanging",
onChange: "sliderChanged"
}, {
tag: "br"
}, {
kind: "onyx.Slider",
lockBar: !1,
value: 50,
onChanging: "sliderChanging",
onChange: "sliderChanged"
}, {
tag: "br"
}, {
kind: "onyx.InputDecorator",
style: "margin-right:10px;",
components: [ {
kind: "onyx.Input",
placeholder: "Value",
style: "width:50px;"
} ]
}, {
kind: "onyx.Button",
content: "Set",
classes: "onyx-sample-spaced-button",
ontap: "changeValue"
}, {
kind: "onyx.Button",
content: "-",
classes: "onyx-sample-spaced-button",
ontap: "decValue"
}, {
kind: "onyx.Button",
content: "+",
classes: "onyx-sample-spaced-button",
ontap: "incValue"
}, {
tag: "br"
}, {
tag: "br"
}, {
kind: "onyx.Checkbox",
name: "animateSetting",
value: !0
}, {
content: "Animated",
classes: "enyo-inline onyx-sample-animate-label"
}, {
tag: "br"
}, {
tag: "br"
}, {
kind: "onyx.Groupbox",
classes: "onyx-sample-result-box",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Result"
}, {
name: "result",
classes: "onyx-sample-result",
content: "No slider moved yet."
} ]
} ],
changeValue: function(e, t) {
for (var n in this.$) this.$[n].kind == "onyx.Slider" && (this.$.animateSetting.getValue() ? this.$[n].animateTo(this.$.input.getValue()) : this.$[n].setValue(this.$.input.getValue()));
},
incValue: function() {
this.$.input.setValue(Math.min(parseInt(this.$.input.getValue() || 0) + 10, 100)), this.changeValue();
},
decValue: function() {
this.$.input.setValue(Math.max(parseInt(this.$.input.getValue() || 0) - 10, 0)), this.changeValue();
},
sliderChanging: function(e, t) {
this.$.result.setContent(e.name + " changing: " + Math.round(e.getValue()));
},
sliderChanged: function(e, t) {
this.$.result.setContent(e.name + " changed to " + Math.round(e.getValue()) + ".");
}
});

// ToggleButtonSample.js

enyo.kind({
name: "onyx.sample.ToggleButtonSample",
classes: "onyx onyx-sample",
components: [ {
classes: "onyx-sample-divider",
content: "Toggle Buttons"
}, {
classes: "onyx-sample-tools",
components: [ {
kind: "onyx.ToggleButton",
onChange: "toggleChanged",
value: !0
}, {
kind: "onyx.ToggleButton",
onChange: "toggleChanged"
}, {
kind: "onyx.ToggleButton",
onChange: "toggleChanged"
}, {
kind: "onyx.ToggleButton",
onChange: "toggleChanged",
value: !0,
disabled: !0
} ]
}, {
tag: "br"
}, {
classes: "onyx-sample-divider",
content: "Toggle Buttons Group"
}, {
kind: "Group",
classes: "onyx-sample-tools group",
onActivate: "groupActivated",
highlander: !0,
components: [ {
kind: "onyx.ToggleButton"
}, {
kind: "onyx.ToggleButton",
value: !0
}, {
kind: "onyx.ToggleButton"
} ]
}, {
tag: "br"
}, {
kind: "onyx.Groupbox",
classes: "onyx-sample-result-box",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Result"
}, {
name: "result",
classes: "onyx-sample-result",
content: "No button tapped yet."
} ]
} ],
toggleChanged: function(e, t) {
this.$.result.setContent(e.name + " was " + (e.getValue() ? " selected." : "deselected."));
},
ordinals: [ "1st", "2nd", "3rd" ],
groupActivated: function(e, t) {
if (t.originator.getActive()) {
var n = t.originator.indexInContainer();
this.$.result.setContent("The " + this.ordinals[n] + " toggle button in the group is selected.");
}
}
});

// ToolbarSample.js

enyo.kind({
name: "onyx.sample.ToolbarSample",
classes: "onyx onyx-sample",
components: [ {
classes: "onyx-sample-divider",
content: "ToolBar"
}, {
kind: "onyx.Toolbar",
components: [ {
kind: "onyx.Grabber"
}, {
content: "Header"
}, {
kind: "onyx.Button",
content: "Button"
}, {
kind: "onyx.Button",
content: "Down",
classes: "active"
}, {
kind: "onyx.Button",
content: "Button"
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
placeholder: "Input"
} ]
}, {
kind: "onyx.Button",
content: "Right"
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
placeholder: "Right Input"
} ]
}, {
kind: "onyx.Button",
content: "More Right"
}, {
content: "There's more"
}, {
kind: "onyx.Button",
content: "Far Right"
} ]
}, {
tag: "br"
}, {
classes: "onyx-sample-divider",
content: "Scrolling ToolBar"
}, {
kind: "Scroller",
classes: "onyx-toolbar",
touchOverscroll: !1,
touch: !0,
vertical: "hidden",
style: "margin:0px;",
thumb: !1,
components: [ {
classes: "onyx-toolbar-inline",
style: "white-space: nowrap;",
components: [ {
kind: "onyx.Grabber"
}, {
content: "Header"
}, {
kind: "onyx.Button",
content: "Button"
}, {
kind: "onyx.Button",
content: "Down",
classes: "active"
}, {
kind: "onyx.Button",
content: "Button"
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
placeholder: "Input"
} ]
}, {
kind: "onyx.Button",
content: "Right"
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
placeholder: "Right Input"
} ]
}, {
kind: "onyx.Button",
content: "More Right"
}, {
content: "There's more"
}, {
kind: "onyx.Button",
content: "Far Right"
} ]
} ]
}, {
tag: "br"
}, {
classes: "onyx-sample-divider",
content: "More ToolBar"
}, {
kind: "onyx.MoreToolbar",
components: [ {
kind: "onyx.Grabber"
}, {
content: "Header"
}, {
kind: "onyx.Button",
content: "Button"
}, {
kind: "onyx.Button",
content: "Down",
classes: "active"
}, {
kind: "onyx.Button",
content: "Button"
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
placeholder: "Input"
} ]
}, {
kind: "onyx.Button",
content: "Right"
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
placeholder: "Right Input"
} ]
}, {
kind: "onyx.Button",
content: "More Right"
}, {
content: "There's more"
}, {
kind: "onyx.Button",
content: "Far Right"
} ]
} ]
});

// DrawerSample.js

enyo.kind({
name: "onyx.sample.DrawerSample",
classes: "onyx drawer-sample",
components: [ {
content: "Drawers",
classes: "drawer-sample-divider"
}, {
content: "Activate (V)",
classes: "drawer-sample-box drawer-sample-mtb",
ontap: "activateDrawer"
}, {
name: "drawer",
kind: "onyx.Drawer",
components: [ {
content: "Vertical Drawer<br>Vertical Drawer<br>Vertical Drawer<br>Vertical Drawer",
allowHtml: !0,
classes: "drawer-sample-box drawer-sample-mtb"
}, {
content: "Activate (V)",
classes: "drawer-sample-box drawer-sample-mtb",
ontap: "activateDrawer2"
}, {
name: "drawer2",
kind: "onyx.Drawer",
components: [ {
content: "Vertical Drawer<br>Vertical Drawer<br>Vertical Drawer<br>Vertical Drawer",
allowHtml: !0,
classes: "drawer-sample-box drawer-sample-mtb"
} ]
}, {
content: "Vertical Drawer<br>Vertical Drawer<br>Vertical Drawer<br>Vertical Drawer",
allowHtml: !0,
classes: "drawer-sample-box drawer-sample-mtb"
} ]
}, {
content: "Foo<br>Foo",
allowHtml: !0,
classes: "drawer-sample-box drawer-sample-mtb"
}, {
kind: "FittableColumns",
fit: !0,
ontap: "activateColumnsDrawer",
classes: "drawer-sample-box drawer-sample-mtb drawer-sample-o",
components: [ {
content: "Activate (H)",
classes: "drawer-sample-box drawer-sample-mlr"
}, {
name: "columnsDrawer",
orient: "h",
kind: "onyx.Drawer",
open: !1,
components: [ {
content: "H-Drawer",
classes: "drawer-sample-box drawer-sample-mlr"
} ]
}, {
content: "Foo",
fit: !0,
classes: "drawer-sample-box drawer-sample-mlr drawer-sample-o"
}, {
content: "Foo",
classes: "drawer-sample-box drawer-sample-mlr"
} ]
}, {
content: "Foo",
classes: "drawer-sample-box drawer-sample-mtb"
} ],
activateDrawer: function() {
this.$.drawer.setOpen(!this.$.drawer.open);
},
activateDrawer2: function() {
this.$.drawer2.setOpen(!this.$.drawer2.open);
},
activateColumnsDrawer: function() {
return this.$.columnsDrawer.setOpen(!this.$.columnsDrawer.open), !0;
}
});

// MenuSample.js

enyo.kind({
name: "onyx.sample.MenuSample",
classes: "onyx onyx-sample",
components: [ {
classes: "onyx-sample-divider",
content: "Menus in Toolbars"
}, {
kind: "onyx.Toolbar",
classes: "onyx-menu-toolbar",
components: [ {
kind: "onyx.MenuDecorator",
onSelect: "itemSelected",
components: [ {
kind: "onyx.IconButton",
src: "assets/menu-icon-bookmark.png"
}, {
kind: "onyx.Menu",
components: [ {
components: [ {
kind: "onyx.IconButton",
src: "assets/menu-icon-bookmark.png"
}, {
content: "Bookmarks"
} ]
}, {
content: "Favorites"
}, {
classes: "onyx-menu-divider"
}, {
content: "Recents"
} ]
} ]
}, {
kind: "onyx.MenuDecorator",
onSelect: "itemSelected",
components: [ {
content: "Bookmarks menu"
}, {
kind: "onyx.Menu",
components: [ {
components: [ {
kind: "onyx.IconButton",
src: "assets/menu-icon-bookmark.png"
}, {
content: "Bookmarks"
} ]
}, {
content: "Favorites"
}, {
classes: "onyx-menu-divider"
}, {
content: "Recents"
} ]
} ]
} ]
}, {
tag: "br"
}, {
classes: "onyx-sample-divider",
content: "Menus from Buttons"
}, {
kind: "onyx.MenuDecorator",
onSelect: "itemSelected",
components: [ {
content: "Popup menu (floating)"
}, {
kind: "onyx.Menu",
floating: !0,
components: [ {
content: "1"
}, {
content: "2"
}, {
classes: "onyx-menu-divider"
}, {
content: "3"
} ]
} ]
}, {
tag: "br"
}, {
kind: "onyx.MenuDecorator",
onSelect: "itemSelected",
components: [ {
content: "Scrolling Popup menu"
}, {
kind: "onyx.Menu",
components: [ {
name: "menuScroller",
kind: "enyo.Scroller",
defaultKind: "onyx.MenuItem",
vertical: "auto",
classes: "enyo-unselectable",
maxHeight: "200px",
strategyKind: "TouchScrollStrategy",
components: [ {
content: "1"
}, {
content: "2"
}, {
classes: "onyx-menu-divider"
}, {
content: "3"
}, {
content: "4"
}, {
content: "5"
}, {
classes: "onyx-menu-divider"
}, {
content: "6"
}, {
content: "7"
} ]
} ]
} ]
}, {
tag: "br"
}, {
kind: "onyx.MenuDecorator",
onSelect: "itemSelected",
components: [ {
content: "Split Popup menu",
kind: "onyx.Button",
onActivate: "preventMenuActivate",
style: "border-radius: 3px 0 0 3px;"
}, {
content: "v",
allowHtml: !0,
style: "border-radius: 0 3px 3px 0;"
}, {
kind: "onyx.Menu",
components: [ {
content: "1"
}, {
content: "2"
}, {
classes: "onyx-menu-divider"
}, {
content: "3"
} ]
} ]
}, {
tag: "br"
}, {
kind: "onyx.Groupbox",
classes: "onyx-sample-result-box",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Result"
}, {
name: "menuSelection",
classes: "onyx-sample-result",
content: "No menu selection yet."
} ]
} ],
create: function() {
this.inherited(arguments);
},
showPopup: function(e) {
var t = this.$[e.popup];
t && t.show();
},
preventMenuActivate: function() {
return !0;
},
itemSelected: function(e, t) {
t.originator.content ? this.$.menuSelection.setContent(t.originator.content + " Selected") : t.selected && this.$.menuSelection.setContent(t.selected.controlAtIndex(1).content + " Selected");
}
});

// TooltipSample.js

enyo.kind({
name: "onyx.sample.TooltipSample",
classes: "onyx onyx-sample",
handlers: {
onSelect: "itemSelected"
},
components: [ {
classes: "onyx-sample-divider",
content: "Tooltips on Toolbar"
}, {
kind: "onyx.Toolbar",
classes: "onyx-menu-toolbar",
components: [ {
kind: "onyx.TooltipDecorator",
components: [ {
kind: "onyx.Button",
content: "Tooltip"
}, {
kind: "onyx.Tooltip",
content: "I'm a tooltip for a button."
} ]
}, {
kind: "onyx.TooltipDecorator",
components: [ {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
style: "width:130px;",
placholder: "Just an input..."
} ]
}, {
kind: "onyx.Tooltip",
content: "I'm a tooltip for an input."
} ]
} ]
}, {
tag: "br"
}, {
kind: "onyx.Toolbar",
classes: "onyx-menu-toolbar",
components: [ {
kind: "onyx.MenuDecorator",
components: [ {
kind: "onyx.IconButton",
src: "assets/menu-icon-bookmark.png"
}, {
kind: "onyx.Tooltip",
content: "Bookmarks menu"
}, {
kind: "onyx.Menu",
components: [ {
components: [ {
kind: "onyx.IconButton",
src: "assets/menu-icon-bookmark.png"
}, {
content: "Bookmarks"
} ]
}, {
content: "Favorites"
}, {
classes: "onyx-menu-divider"
}, {
content: "Recents"
} ]
} ]
}, {
kind: "onyx.MenuDecorator",
components: [ {
content: "Bookmarks menu"
}, {
kind: "onyx.Tooltip",
content: "Tap to open..."
}, {
kind: "onyx.Menu",
components: [ {
components: [ {
kind: "onyx.IconButton",
src: "assets/menu-icon-bookmark.png"
}, {
content: "Bookmarks"
} ]
}, {
content: "Favorites"
}, {
classes: "onyx-menu-divider"
}, {
content: "Recents"
} ]
} ]
} ]
}, {
tag: "br"
}, {
classes: "onyx-sample-divider",
content: "Tooltips on items"
}, {
kind: "onyx.TooltipDecorator",
components: [ {
kind: "onyx.Button",
content: "Tooltip"
}, {
kind: "onyx.Tooltip",
content: "I'm a tooltip for a button."
} ]
}, {
tag: "br"
}, {
kind: "onyx.TooltipDecorator",
components: [ {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
style: "width:130px;",
placholder: "Just an input..."
} ]
}, {
kind: "onyx.Tooltip",
content: "I'm a tooltip for an input."
} ]
}, {
tag: "br"
}, {
kind: "onyx.MenuDecorator",
components: [ {
kind: "onyx.IconButton",
src: "assets/menu-icon-bookmark.png"
}, {
kind: "onyx.Tooltip",
content: "Bookmarks menu"
}, {
kind: "onyx.Menu",
components: [ {
components: [ {
kind: "onyx.IconButton",
src: "assets/menu-icon-bookmark.png"
}, {
content: "Bookmarks"
} ]
}, {
content: "Favorites"
}, {
classes: "onyx-menu-divider"
}, {
content: "Recents"
} ]
} ]
}, {
tag: "br"
}, {
kind: "onyx.MenuDecorator",
components: [ {
content: "Bookmarks menu"
}, {
kind: "onyx.Tooltip",
content: "Tap to open..."
}, {
kind: "onyx.Menu",
components: [ {
components: [ {
kind: "onyx.IconButton",
src: "assets/menu-icon-bookmark.png"
}, {
content: "Bookmarks"
} ]
}, {
content: "Favorites"
}, {
classes: "onyx-menu-divider"
}, {
content: "Recents"
} ]
} ]
} ]
});

// SpinnerSample.js

enyo.kind({
name: "onyx.sample.SpinnerSample",
classes: "onyx onyx-sample",
handlers: {
onSelect: "itemSelected"
},
components: [ {
classes: "onyx-sample-divider",
content: "Light Spinner"
}, {
style: "background:black; border-radius:5px; padding:15px",
components: [ {
kind: "onyx.Spinner"
} ]
}, {
tag: "br"
}, {
classes: "onyx-sample-divider",
content: "Dark Spinner"
}, {
style: "background:white; border-radius:5px; padding:15px",
components: [ {
kind: "onyx.Spinner",
classes: "onyx-light"
} ]
} ]
});

// PickerSample.js

enyo.kind({
name: "onyx.sample.PickerSample",
kind: "FittableRows",
classes: "onyx onyx-sample",
handlers: {
onSelect: "itemSelected"
},
components: [ {
content: "Default Picker",
classes: "onyx-sample-divider"
}, {
kind: "onyx.PickerDecorator",
components: [ {}, {
kind: "onyx.Picker",
components: [ {
content: "Gmail",
active: !0
}, {
content: "Yahoo"
}, {
content: "Outlook"
}, {
content: "Hotmail"
} ]
} ]
}, {
tag: "br"
}, {
content: "Picker with Static Button",
classes: "onyx-sample-divider"
}, {
kind: "onyx.PickerDecorator",
components: [ {
kind: "onyx.Button",
content: "Pick One...",
style: "width: 200px"
}, {
kind: "onyx.Picker",
components: [ {
content: "Hello!"
}, {
content: "I am busy."
}, {
content: "Good Bye."
} ]
} ]
}, {
tag: "br"
}, {
content: "Other Pickers",
classes: "onyx-sample-divider"
}, {
classes: "onyx-toolbar-inline",
components: [ {
content: "Integer",
classes: "onyx-sample-label"
}, {
kind: "onyx.PickerDecorator",
components: [ {
style: "min-width: 60px;"
}, {
name: "integerPicker",
kind: "onyx.Picker"
} ]
} ]
}, {
tag: "br"
}, {
classes: "onyx-toolbar-inline",
components: [ {
content: "Date",
classes: "onyx-sample-label"
}, {
kind: "onyx.PickerDecorator",
components: [ {}, {
name: "monthPicker",
kind: "onyx.Picker"
} ]
}, {
kind: "onyx.PickerDecorator",
components: [ {
style: "min-width: 60px;"
}, {
name: "dayPicker",
kind: "onyx.Picker"
} ]
}, {
content: "Year",
classes: "onyx-sample-label"
}, {
kind: "onyx.PickerDecorator",
components: [ {
style: "min-width: 80px;"
}, {
name: "yearPicker",
kind: "onyx.FlyweightPicker",
count: 200,
onSetupItem: "setupYear",
components: [ {
name: "year"
} ]
} ]
} ]
}, {
tag: "br"
}, {
classes: "onyx-toolbar-inline",
components: [ {
kind: "onyx.PickerDecorator",
components: [ {}, {
kind: "onyx.Picker",
components: [ {
content: "Gmail"
}, {
content: "Yahoo"
}, {
content: "Outlook"
}, {
content: "Hotmail",
active: !0
} ]
} ]
} ]
}, {
tag: "br"
}, {
kind: "onyx.Groupbox",
classes: "onyx-sample-result-box",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Selection"
}, {
name: "pickerSelection",
classes: "onyx-sample-result",
content: "Nothing picked yet."
} ]
} ],
create: function() {
this.inherited(arguments);
for (var e = 0; e < 10; e++) this.$.integerPicker.createComponent({
content: e,
active: !e
});
var t = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ], n = new Date;
for (var e = 0, r; r = t[e]; e++) this.$.monthPicker.createComponent({
content: r,
active: e == n.getMonth()
});
for (var e = 0; e < 30; e++) this.$.dayPicker.createComponent({
content: e + 1,
active: e == n.getDate() - 1
});
var i = n.getYear();
this.$.yearPicker.setSelected(i), this.$.year.setContent(1900 + i);
},
setupYear: function(e, t) {
this.$.year.setContent(1900 + t.index);
},
itemSelected: function(e, t) {
this.$.pickerSelection.setContent(t.selected.content);
}
});

// Canvas.js

enyo.kind({
name: "enyo.Canvas",
kind: enyo.Control,
tag: "canvas",
attributes: {
width: 500,
height: 500
},
defaultKind: "enyo.canvas.Control",
generateInnerHtml: function() {
return "";
},
teardownChildren: function() {},
rendered: function() {
this.renderChildren();
},
addChild: function() {
enyo.UiComponent.prototype.addChild.apply(this, arguments);
},
removeChild: function() {
enyo.UiComponent.prototype.removeChild.apply(this, arguments);
},
renderChildren: function(e) {
var t = e, n = this.hasNode();
t || n.getContext && (t = n.getContext("2d"));
if (t) for (var r = 0, i; i = this.children[r]; r++) i.render(t);
},
update: function() {
var e = this.hasNode();
if (e.getContext) {
var t = e.getContext("2d"), n = this.getBounds();
t.clearRect(0, 0, n.width, n.height), this.renderChildren(t);
}
}
});

// CanvasControl.js

enyo.kind({
name: "enyo.canvas.Control",
kind: enyo.UiComponent,
defaultKind: "enyo.canvas.Control",
published: {
bounds: null
},
events: {
onRender: ""
},
constructor: function() {
this.bounds = {
l: enyo.irand(400),
t: enyo.irand(400),
w: enyo.irand(100),
h: enyo.irand(100)
}, this.inherited(arguments);
},
importProps: function(e) {
this.inherited(arguments), e.bounds && (enyo.mixin(this.bounds, e.bounds), delete e.bounds);
},
renderSelf: function(e) {
this.doRender({
context: e
});
},
render: function(e) {
this.children.length ? this.renderChildren(e) : this.renderSelf(e);
},
renderChildren: function(e) {
for (var t = 0, n; n = this.children[t]; t++) n.render(e);
}
});

// Shape.js

enyo.kind({
name: "enyo.canvas.Shape",
kind: enyo.canvas.Control,
published: {
color: "red",
outlineColor: ""
},
fill: function(e) {
e.fill();
},
outline: function(e) {
e.stroke();
},
draw: function(e) {
this.color && (e.fillStyle = this.color, this.fill(e)), this.outlineColor && (e.strokeStyle = this.outlineColor, this.outline(e));
}
});

// Circle.js

enyo.kind({
name: "enyo.canvas.Circle",
kind: enyo.canvas.Shape,
renderSelf: function(e) {
e.beginPath(), e.arc(this.bounds.l, this.bounds.t, this.bounds.w, 0, Math.PI * 2), this.draw(e);
}
});

// Rectangle.js

enyo.kind({
name: "enyo.canvas.Rectangle",
kind: enyo.canvas.Shape,
published: {
clear: !1
},
renderSelf: function(e) {
this.clear ? e.clearRect(this.bounds.l, this.bounds.t, this.bounds.w, this.bounds.h) : this.draw(e);
},
fill: function(e) {
e.fillRect(this.bounds.l, this.bounds.t, this.bounds.w, this.bounds.h);
},
outline: function(e) {
e.strokeRect(this.bounds.l, this.bounds.t, this.bounds.w, this.bounds.h);
}
});

// Text.js

enyo.kind({
name: "enyo.canvas.Text",
kind: enyo.canvas.Shape,
published: {
text: "",
font: "12pt Arial",
align: "left"
},
renderSelf: function(e) {
e.textAlign = this.align, e.font = this.font, this.draw(e);
},
fill: function(e) {
e.fillText(this.text, this.bounds.l, this.bounds.t);
},
outline: function(e) {
e.strokeText(this.text, this.bounds.l, this.bounds.t);
}
});

// Image.js

enyo.kind({
name: "enyo.canvas.Image",
kind: enyo.canvas.Control,
published: {
src: ""
},
create: function() {
this.image = new Image, this.inherited(arguments), this.srcChanged();
},
srcChanged: function() {
this.src && (this.image.src = this.src);
},
renderSelf: function(e) {
e.drawImage(this.image, this.bounds.l, this.bounds.t);
}
});

// CanvasPrimitivesSample.js

enyo.kind({
name: "enyo.sample.CanvasPrimitivesSample",
classes: "enyo-unselectable onyx",
components: [ {
kind: "enyo.Canvas",
components: [ {
kind: "enyo.canvas.Circle",
bounds: {
t: 60,
l: 60,
w: 30
},
color: "lightcoral",
outlineColor: "red"
}, {
kind: "enyo.canvas.Rectangle",
bounds: {
t: 110,
l: 30,
w: 100,
h: 50
},
color: "lightblue",
outlineColor: "blue"
}, {
kind: "enyo.canvas.Text",
bounds: {
t: 200,
l: 30,
h: 40,
w: 200
},
color: "green",
text: "enyo.js",
font: "20pt Cooper Black"
}, {
kind: "enyo.canvas.Image",
bounds: {
t: 230,
l: 30,
h: 32,
w: 32
},
src: "assets/astrologer.png"
}, {
kind: "enyo.sample.BlinkyTriangle",
bounds: {
t: 290,
l: 30,
w: 60,
h: 60
},
color: "gold",
outlineColor: "orange",
src: "assets/astrologer.png"
} ]
} ],
create: function() {
this.inherited(arguments);
var e = new Image;
e.src = this.$.image.src, e.onload = enyo.bind(this, function() {
this.$.canvas.update();
});
}
}), enyo.kind({
name: "enyo.sample.BlinkyTriangle",
kind: "enyo.canvas.Shape",
published: {
highlightColor: "yellow"
},
renderSelf: function(e) {
e.beginPath(), e.moveTo(this.bounds.l + this.bounds.w / 2, this.bounds.t), e.lineTo(this.bounds.l, this.bounds.t + this.bounds.h), e.lineTo(this.bounds.l + this.bounds.w, this.bounds.t + this.bounds.h), e.lineTo(this.bounds.l + this.bounds.w / 2, this.bounds.t), this.draw(e);
},
create: function() {
this.inherited(arguments), this.jobName = "blinkMe_" + this.id, this.blinkMe();
},
destroy: function() {
enyo.job.stop(this.jobName), this.inherited(arguments);
},
blinkMe: function() {
var e = this.color;
this.color = this.highlightColor, this.highlightColor = e, this.container.update(), enyo.job(this.jobName, enyo.bind(this, "blinkMe"), 500);
}
});

// CanvasBallsSample.js

enyo.kind({
name: "enyo.sample.CanvasBallsSample",
kind: "Control",
style: "padding:15px;",
components: [ {
kind: "Canvas",
style: "border: 1px solid black;",
attributes: {
width: 280,
height: 300
},
components: [ {
name: "ballpit",
kind: "canvas.Control"
}, {
kind: "canvas.Rectangle",
bounds: {
l: 0,
t: 290,
w: 300,
h: 10
}
}, {
name: "fpsCounter",
kind: "canvas.Text",
bounds: {
l: 0,
t: 15
},
color: "black"
} ]
}, {
tag: "br"
}, {
tag: "button",
content: "Reset",
ontap: "reset"
}, {
tag: "br"
}, {
tag: "span",
content: "Balls: "
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.Input",
name: "balls",
value: "10",
placeholder: "Number of Balls"
} ]
} ],
published: {
accel: 9.8,
balls: 10
},
setupBalls: function() {
this.cancel && enyo.cancelRequestAnimationFrame(this.cancel), this.loopStart = Date.now(), this.frame = 0, this.start = Date.now(), this.$.ballpit.destroyClientControls();
var e = [ "green", "blue", "black", "brown", "red", "orange" ], t, n, r, i;
for (var s = 0; s < this.balls; s++) t = (enyo.irand(69) + 30) / 100, n = e[enyo.irand(e.length)], r = enyo.irand(375), i = 10 + enyo.irand(27) * 10, this.$.ballpit.createComponent({
kind: "canvas.Circle",
bounds: {
l: i,
t: r,
w: 10
},
color: n,
bounce: t,
vel: 0,
owner: this
});
enyo.asyncMethod(this, "loop");
},
rendered: function() {
this.setupBalls();
},
destroy: function() {
this.cancel && enyo.cancelRequestAnimationFrame(this.cancel), this.inherited(arguments);
},
loop: function() {
this.frame++;
for (var e = 0, t; t = this.$.ballpit.children[e]; e++) t.bounds.t + t.bounds.w > this.$.rectangle.bounds.t ? (t.vel = -t.vel * t.bounce, t.bounds.t = this.$.rectangle.bounds.t - t.bounds.w) : t.bounds.t < t.bounds.w && (t.bounds.t = t.bounds.w, t.vel = 0), t.vel += this.accel * (Date.now() - this.start), t.bounds.t += t.vel / 1e4;
this.$.canvas.update(), this.start = Date.now(), this.cancel = enyo.requestAnimationFrame(enyo.bind(this, "loop")), this.$.fpsCounter.setText(Math.floor(this.frame / ((Date.now() - this.loopStart) / 1e3)));
},
reset: function() {
var e = this.$.balls.hasNode(), t = e ? parseInt(e.value, 0) : this.balls;
if (isFinite(t) && t >= 0 && t != this.balls) this.setBalls(t); else for (var n = 0, r; r = this.$.ballpit.children[n]; n++) r.bounds.t = enyo.irand(375), r.vel = 0;
},
ballsChanged: function(e) {
this.setupBalls();
}
});

// CodeEditor.js

enyo.kind({
name: "CodeEditor",
kind: "Control",
tag: "textarea",
published: {
url: "",
value: ""
},
events: {
onLoad: ""
},
create: function() {
this.inherited(arguments), this.valueChanged(), this.urlChanged();
},
urlChanged: function() {
this.url && (new enyo.Ajax({
url: this.url,
handleAs: "text"
})).response(this, "receive").go();
},
receive: function(e, t) {
this.setValue(t), this.doLoad({
code: t
});
},
valueChanged: function() {
this.setAttribute("value", this.value), this.hasNode() && (this.hasNode().value = this.value);
},
getValue: function() {
return this.hasNode() ? this.node.value : this.getAttribute("value");
}
});

// CodePlayer.js

enyo.kind({
name: "CodePlayer",
kind: "Control",
evalCode: function(inCode) {
eval(inCode);
},
go: function(e) {
this.destroyClientControls();
try {
this.evalCode(e), this.createComponent({
kind: "Sample"
}), this.hasNode() && this.render();
} catch (t) {
console.error("Error creating code: " + t);
}
}
});

// Exampler.js

enyo.kind({
name: "Exampler",
kind: "Control",
style: "background: #ABABAB",
published: {
url: ""
},
components: [ {
classes: "enyo-fit",
classes: "tabbar",
style: "overflow: hidden; height: 40px;",
components: [ {
name: "outputTab",
classes: "active tab",
content: "Output",
ontap: "outputTap"
}, {
name: "codeTab",
classes: "tab",
content: "Code",
ontap: "editorTap"
} ]
}, {
kind: "CodePlayer",
classes: "enyo-fit",
style: "top: 40px;"
}, {
kind: "CodeEditor",
classes: "enyo-fit",
style: "top: 40px;",
onLoad: "go",
showing: !1
} ],
create: function() {
this.inherited(arguments), this.addClass("theme-fu"), this.urlChanged();
},
urlChanged: function() {
this.$.codeEditor.setUrl(this.url);
},
go: function() {
this.$.codePlayer.go(this.$.codeEditor.getValue());
},
editorTap: function() {
this.showHideEditor(!0);
},
outputTap: function() {
this.go(), this.showHideEditor(!1);
},
showHideEditor: function(e) {
this.$.codeEditor.setShowing(e), this.$.codePlayer.setShowing(!e), this.$.codeTab.addRemoveClass("active", e), this.$.outputTab.addRemoveClass("active", !e);
}
});

// Playground.js

enyo.kind({
name: "enyo.sample.Playground",
kind: "Panels",
classes: "enyo-fit onyx playground-sample-panels",
arrangerKind: "CollapsingArranger",
components: [ {
kind: "FittableRows",
style: "width:50%;",
components: [ {
kind: "onyx.Toolbar",
name: "toolbar",
layoutKind: "FittableColumnsLayout",
components: [ {
content: "Enyo Playground",
fit: !0
}, {
kind: "onyx.PickerDecorator",
components: [ {}, {
kind: "onyx.Picker",
floating: !0,
onChange: "sampleChanged",
components: [ {
content: "Sample1",
active: !0
}, {
content: "Sample2"
}, {
content: "Sample3"
}, {
content: "Sample4"
} ]
} ]
} ]
}, {
fit: !0,
style: "padding:15px;",
components: [ {
kind: "CodeEditor",
fit: !0,
classes: "playground-sample-source"
} ]
}, {
kind: "FittableColumns",
style: "margin:0px 15px 15px 15px",
components: [ {
fit: !0
}, {
kind: "onyx.Button",
content: "Render Kind",
ontap: "go"
} ]
} ]
}, {
kind: "FittableRows",
classes: "onyx",
components: [ {
kind: "onyx.Toolbar",
components: [ {
kind: "onyx.Grabber"
}, {
content: "Result"
} ]
}, {
kind: "Scroller",
fit: !0,
components: [ {
kind: "CodePlayer",
fit: !0,
classes: "playground-sample-player"
} ]
} ]
} ],
create: function() {
this.inherited(arguments);
},
sampleChanged: function(e, t) {
this.loadSample(t.selected.content), this.$.toolbar.resized();
},
loadSample: function(e) {
this.$.codeEditor.setUrl("assets/" + e + ".js");
},
go: function() {
this.$.codePlayer.go(this.$.codeEditor.getValue()), enyo.Panels.isScreenNarrow() && this.next();
}
});

// AjaxSample.js

enyo.kind({
name: "enyo.sample.AjaxSample",
kind: "FittableRows",
classes: "enyo-fit ajax-sample",
components: [ {
kind: "FittableColumns",
classes: "onyx-toolbar-inline",
components: [ {
content: "YQL: "
}, {
kind: "onyx.Input",
name: "query",
fit: !0,
value: 'select * from upcoming.events where woeid in (select woeid from geo.places where text="Sunnyvale, CA")'
}, {
kind: "onyx.Button",
content: "Fetch",
ontap: "fetch"
} ]
}, {
kind: "FittableColumns",
classes: "onyx-toolbar-inline",
components: [ {
content: "URL: "
}, {
kind: "onyx.Input",
name: "baseUrl",
fit: !0,
value: "http://query.yahooapis.com/v1/public/yql?format=json"
} ]
}, {
kind: "onyx.TextArea",
fit: !0,
classes: "ajax-sample-source"
} ],
fetch: function() {
var e = new enyo.Ajax({
url: this.$.baseUrl.getValue()
});
e.go({
q: this.$.query.getValue()
}), e.response(this, "processResponse"), e.error(this, "processError");
},
processResponse: function(e, t) {
this.$.textArea.setValue(JSON.stringify(t, null, 2));
},
processError: function(e, t) {
alert("Error!");
}
});

// JsonpSample.js

enyo.kind({
name: "enyo.sample.JsonpSample",
kind: "FittableRows",
classes: "enyo-fit jsonp-sample",
components: [ {
kind: "FittableColumns",
classes: "onyx-toolbar-inline",
components: [ {
content: "YQL: "
}, {
kind: "onyx.Input",
name: "query",
fit: !0,
value: 'select * from upcoming.events where woeid in (select woeid from geo.places where text="Sunnyvale, CA")'
}, {
kind: "onyx.Button",
content: "Fetch",
ontap: "fetch"
} ]
}, {
kind: "onyx.TextArea",
fit: !0,
classes: "jsonp-sample-source"
} ],
fetch: function() {
var e = new enyo.JsonpRequest({
url: "http://query.yahooapis.com/v1/public/yql?format=json",
callbackName: "callback"
});
e.go({
q: this.$.query.getValue()
}), e.response(this, "processResponse");
},
processResponse: function(e, t) {
this.$.textArea.setValue(JSON.stringify(t, null, 2));
}
});

// WebServiceSample.js

enyo.kind({
name: "enyo.sample.WebServiceSample",
kind: "FittableRows",
classes: "enyo-fit webservice-sample",
components: [ {
kind: "WebService",
name: "yql",
url: "http://query.yahooapis.com/v1/public/yql?format=json",
onResponse: "processResponse",
callbackName: "callback"
}, {
kind: "FittableColumns",
classes: "onyx-toolbar-inline",
components: [ {
content: "YQL: "
}, {
kind: "onyx.Input",
name: "query",
fit: !0,
value: 'select * from upcoming.events where woeid in (select woeid from geo.places where text="Sunnyvale, CA")'
}, {
kind: "onyx.PickerDecorator",
components: [ {
content: "Choose Scroller",
style: "width:100px;"
}, {
kind: "onyx.Picker",
floating: !0,
components: [ {
content: "AJAX",
active: !0
}, {
content: "JSON-P"
} ]
} ]
}, {
kind: "onyx.Button",
content: "Fetch",
ontap: "fetch"
} ]
}, {
kind: "onyx.TextArea",
fit: !0,
classes: "webservice-sample-source"
} ],
fetch: function() {
this.$.yql.send({
q: this.$.query.getValue(),
jsonp: this.$.picker.getSelected().indexInContainer() == 2
});
},
processResponse: function(e, t) {
this.$.textArea.setValue(JSON.stringify(t.data, null, 2));
}
});

// RepeaterSample.js

enyo.kind({
name: "enyo.sample.RepeaterSample",
classes: "enyo-fit repeater-sample",
components: [ {
kind: "Repeater",
onSetupItem: "setupItem",
components: [ {
name: "item",
classes: "repeater-sample-item",
components: [ {
tag: "span",
name: "personNumber"
}, {
tag: "span",
name: "personName"
} ]
} ]
} ],
create: function() {
this.inherited(arguments), this.$.repeater.setCount(this.people.length);
},
setupItem: function(e, t) {
var n = t.index, r = t.item, i = this.people[n];
r.$.personNumber.setContent(n + 1 + ". "), r.$.personName.setContent(i.name), r.$.personName.applyStyle("color", i.sex == "male" ? "dodgerblue" : "deeppink");
},
people: [ {
name: "Andrew",
sex: "male"
}, {
name: "Betty",
sex: "female"
}, {
name: "Christopher",
sex: "male"
}, {
name: "Donna",
sex: "female"
}, {
name: "Ephraim",
sex: "male"
}, {
name: "Frankie",
sex: "male"
}, {
name: "Gerald",
sex: "male"
}, {
name: "Heather",
sex: "female"
}, {
name: "Ingred",
sex: "female"
}, {
name: "Jack",
sex: "male"
}, {
name: "Kevin",
sex: "male"
}, {
name: "Lucy",
sex: "female"
}, {
name: "Matthew",
sex: "male"
}, {
name: "Noreen",
sex: "female"
}, {
name: "Oscar",
sex: "male"
}, {
name: "Pedro",
sex: "male"
}, {
name: "Quentin",
sex: "male"
}, {
name: "Ralph",
sex: "male"
}, {
name: "Steven",
sex: "male"
}, {
name: "Tracy",
sex: "female"
}, {
name: "Uma",
sex: "female"
}, {
name: "Victor",
sex: "male"
}, {
name: "Wendy",
sex: "female"
}, {
name: "Xin",
sex: "male"
}, {
name: "Yulia",
sex: "female"
}, {
name: "Zoltan"
} ]
});

// ScrollerSample.js

enyo.kind({
name: "enyo.sample.ScrollerSample",
kind: "FittableRows",
classes: "enyo-fit  enyo-unselectable",
components: [ {
kind: "onyx.Toolbar",
components: [ {
kind: "onyx.PickerDecorator",
components: [ {
content: "Choose Scroller",
style: "width:180px;"
}, {
kind: "onyx.Picker",
floating: !0,
onSelect: "sampleChanged",
components: [ {
content: "Default scroller",
active: !0
}, {
content: "Force touch scroller"
}, {
content: "Horizontal only"
}, {
content: "Vertical only"
} ]
} ]
} ]
}, {
kind: "Panels",
fit: !0,
draggable: !1,
classes: "scroller-sample-panels",
components: [ {
kind: "Scroller",
classes: "scroller-sample-scroller enyo-fit"
}, {
kind: "Scroller",
touch: !0,
classes: "scroller-sample-scroller enyo-fit"
}, {
kind: "Scroller",
vertical: "hidden",
classes: "scroller-sample-scroller enyo-fit"
}, {
kind: "Scroller",
horizontal: "hidden",
classes: "scroller-sample-scroller enyo-fit",
onmousedown: "mouseDown",
ondragstart: "dragStart"
} ]
} ],
create: function() {
this.inherited(arguments);
var e = this.$.panels.getPanels();
for (var t in e) e[t].createComponent({
allowHtml: !0,
content: this.text,
classes: "scroller-sample-content"
});
},
sampleChanged: function(e, t) {
this.$.panels.setIndex(t.selected.indexInContainer() - 1);
},
text: "Foo<br>Bar<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. <br>Foo<br>Bar<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. <br>Foo<br>Bar<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. <br>Foo<br>Bar<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow<br>Foo<br>Bar<br>Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. Boom boom pow. <br>",
mouseDown: function(e, t) {
t.preventDefault();
},
dragStart: function(e, t) {
if (t.horizontal) return !0;
}
});

// App.js

enyo.kind({
name: "App",
classes: "app onyx font-lato enyo-unselectable",
samples: [],
handlers: {
onresize: "resized"
},
browserScopeTestKey: "agt1YS1wcm9maWxlcnINCxIEVGVzdBjU2-gRDA",
components: [ {
kind: "Panels",
name: "mainPanels",
classes: "panels enyo-fit",
arrangerKind: "CollapsingArranger",
components: [ {
kind: "ViewStack",
name: "navPanels",
onTransitionFinish: "navChanged",
classes: "enyo-fit"
}, {
kind: "Panels",
name: "contentPanels",
arrangerKind: "CollapsingArranger",
draggable: !1,
classes: "panels enyo-fit",
components: [ {
kind: "FittableRows",
classes: "wide",
components: [ {
kind: "Scroller",
name: "sampleContent",
horizontal: "hidden",
fit: !0,
classes: "onyx enyo-unselectable",
components: []
}, {
kind: "FittableColumns",
name: "viewSourceToolbar",
noStretch: !0,
classes: "onyx-toolbar onyx-toolbar-inline footer-toolbar",
components: [ {
kind: "onyx.Grabber",
ontap: "toggleFullScreen"
}, {
fit: !0
}, {
kind: "onyx.Button",
name: "viewSource",
content: "View Source",
ontap: "viewSource",
showing: !1
}, {
kind: "onyx.Button",
name: "openExternal",
content: "Open",
ontap: "openExternal",
showing: !1
} ]
} ]
}, {
kind: "FittableRows",
classes: "wide onyx",
components: [ {
kind: "Panels",
name: "sourcePanels",
fit: !0,
draggable: !1,
components: [ {
kind: "Scroller",
classes: "enyo-fit scroller",
components: [ {
kind: "SourceView",
name: "sourceContent"
} ]
}, {
kind: "Scroller",
classes: "enyo-fit scroller",
components: [ {
kind: "SourceView",
name: "cssContent"
} ]
} ]
}, {
kind: "onyx.Toolbar",
layoutKind: "FittableColumnsLayout",
classes: "footer-toolbar",
noStretch: !0,
components: [ {
kind: "onyx.Button",
name: "srcCancelButton",
content: "Close",
ontap: "hideSource"
}, {
kind: "onyx.IconButton",
name: "srcCancelIcon",
src: "assets/cancel.png",
ontap: "hideSource"
}, {
fit: !0,
style: "text-align:center;",
components: [ {
kind: "onyx.RadioGroup",
onActivate: "sourceChanged",
components: [ {
content: "JS",
classes: "source-tabs",
active: !0
}, {
content: "CSS",
classes: "source-tabs"
} ]
} ]
}, {
components: [ {
kind: "onyx.Checkbox",
onchange: "wrapChanged"
}, {
content: "Wrap",
classes: "enyo-inline wrap-label"
} ]
} ]
} ]
} ]
} ]
} ],
create: function() {
this.inherited(arguments), this.parseQueryString(), window.onhashchange = enyo.bind(this, "hashChange"), this.loadSamples(), this.resized();
},
loadSamples: function() {
this.$.navPanels.popAll(), (new enyo.Ajax({
url: "assets/manifest.json"
})).response(this, function(e, t) {
this.samples = t, this.samples.isTop = !0;
var n = this.sourcePath || localStorage.getItem("sourcePath") || this.samples.sourcePath;
n && (enyo.path.addPath("lib", n + "/lib"), enyo.path.addPath("enyo", n + "/enyo")), (this.sourcePath || localStorage.getItem("sourcePath")) && this.loadSamplePackages(t), this.addSamples = enyo.json.parse(localStorage.getItem("addSamples")), this.loadAddSamples();
}).go();
},
loadAddSamples: function() {
if (this.addSamples && this.addSamples.length) {
var e = this.addSamples.shift();
(new enyo.Ajax({
url: e
})).response(this, function(t, n) {
var r = e.substring(0, e.lastIndexOf("/") + 1);
this.aliasSamplePaths(n, r + n.sourcePath), this.samples.samples.push(n), this.loadSamplePackages(n), this.loadAddSamples();
}).error(this, function() {
this.loadAddSamples();
}).go();
} else this.pushSampleList(this.samples);
},
aliasSamplePaths: function(e, t) {
e.path && (e.path = e.path.replace(/\$lib/g, t + "/lib"), e.path = e.path.replace(/\$enyo/g, t + "/enyo")), e.loadPackages && (e.loadPackages = e.loadPackages.replace(/\$lib/g, t + "/lib"), e.loadPackages = e.loadPackages.replace(/\$enyo/g, t + "/enyo"));
if (e.samples) for (var n in e.samples) this.aliasSamplePaths(e.samples[n], t);
},
loadSamplePackages: function(e) {
if (e.loadPackages) {
var t = e.loadPackages.split(" ");
enyo.log("Loading " + t), enyo.load(t);
}
if (e.samples) for (var n in e.samples) this.loadSamplePackages(e.samples[n]);
},
parseQueryString: function() {
var e = {}, t = function(e) {
return decodeURIComponent(e.replace(/\+/g, " "));
}, n = location.search.substring(1);
if (!n.length) return;
var r = n.split("&");
for (var i in r) {
var s = r[i].split("=");
s.length > 1 && (e[t(s[0])] = t(s[1]));
}
e.addSamples && localStorage.setItem("addSamples", enyo.json.stringify(e.addSamples.split(","))), e.jiraCollectorId && localStorage.setItem("jiraCollectorId", e.jiraCollectorId), e.sourcePath && localStorage.setItem("sourcePath", e.sourcePath), (e.extras || localStorage.getItem("addSamples") || localStorage.getItem("jiraCollectorId") || localStorage.getItem("sourcePath")) && localStorage.setItem("extras", "true"), e.reset && (localStorage.setItem("addSamples", ""), localStorage.setItem("jiraCollectorId", ""), localStorage.setItem("sourcePath", ""), localStorage.setItem("extras", "")), e.debug || (window.location = window.location.pathname);
},
rendered: function() {
this.inherited(arguments);
},
pushSampleList: function(e) {
this.$.navPanels.pushView({
kind: "NavigationList",
samples: e,
onNavTap: "navTap",
onNavBack: "navBack",
onMenuAction: "handleMenuAction",
version: this.versionContent
}, {
owner: this
});
},
toggleFullScreen: function() {
this.$.mainPanels.setIndex(this.$.mainPanels.index ? 0 : 1);
},
navTap: function(e, t) {
var n = e.samples.samples[t.index];
n.samples && this.pushSampleList(n), n.path && this.renderSample(n), !n.samples && !n.path && (this.$.sampleContent.createComponent({
content: 'Sorry, no sample yet for "' + n.name + '".'
}), this.$.sampleContent.render(), enyo.Panels.isScreenNarrow() && this.$.mainPanels.next());
},
renderSample: function(e) {
this.resetSample();
var t = e.path.substring(e.path.lastIndexOf("/") + 1), n = e.ns || this.currNamespace, r = e.path.substring(0, e.path.lastIndexOf("/") + 1), i = this.$.sampleContent.createComponent({
kind: n + "." + t
});
window.sample = i, this.$.sampleContent.render(), this.$.sampleContent.resized(), this.externalURL = enyo.path.rewrite(e.path + ".html"), this.externalURL.indexOf("http") != 0 || this.externalURL.indexOf(window.location.origin) == 0 ? ((new enyo.Ajax({
url: enyo.path.rewrite(e.path + ".js"),
handleAs: "text"
})).response(this, function(e, t) {
this.$.sourceContent.setContent(t);
}).go(), (new enyo.Ajax({
url: enyo.path.rewrite(r + (e.css || t) + ".css"),
handleAs: "text"
})).response(this, function(e, t) {
this.$.cssContent.setContent(t);
}).go()) : (this.$.sourceContent.setContent("Sorry, the source for this sample is on a separate server and cannot be displayed due to cross-origin restrictions."), this.$.cssContent.setContent("Sorry, the source for this sample is on a separate server and cannot be displayed due to cross-origin restrictions.")), enyo.Panels.isScreenNarrow() && this.$.mainPanels.next(), this.$.viewSource.show(), this.$.openExternal.show(), this.$.viewSourceToolbar.resized();
},
navChanged: function() {
var e = this.$.navPanels.getActive();
e && e.samples && e.samples.ns && (this.currNamespace = e.samples.ns);
},
navBack: function() {
this.$.navPanels.popView(), this.$.navPanels.getActive().clearSelection(), this.resetSample();
},
resetSample: function() {
this.$.sampleContent.destroyClientControls(), this.$.sourceContent.setContent(""), this.$.cssContent.setContent(""), this.$.viewSource.hide(), this.$.openExternal.hide(), window.sample = undefined;
},
viewSource: function() {
this.$.contentPanels.setIndex(1);
},
openExternal: function() {
window.open(this.externalURL, "_blank");
},
hideSource: function() {
this.$.contentPanels.setIndex(0);
},
resized: function() {
this.$.srcCancelButton.setShowing(!enyo.Panels.isScreenNarrow()), this.$.srcCancelIcon.setShowing(enyo.Panels.isScreenNarrow());
},
sourceChanged: function(e, t) {
t.originator.active && this.$.sourcePanels.setIndex(t.originator.indexInContainer());
},
wrapChanged: function(e, t) {
this.$.sourceContent.setWrap(e.getValue()), this.$.cssContent.setWrap(e.getValue());
},
getHashComponentName: function() {
return window.location.hash.slice(1);
},
setHashComponentName: function(e) {
window.location.hash = e;
},
hashChange: function() {
var e = this.getHashComponentName();
},
handleMenuAction: function(e, t) {
if (t.action == "startTest") this.$.navPanels.pushView({
kind: "TestController",
onQuit: "quitTest",
onRenderSample: "renderTest",
samples: this.samples,
browserScopeTestKey: this.browserScopeTestKey
}, {
owner: this
}); else if (t.action == "browserscope") {
this.resetSample();
var n = "http://www.browserscope.org/user/tests/table/" + this.browserScopeTestKey + "?o=html&v=1", r = "width:100%; height:100%; border:0px;";
this.$.sampleContent.createComponent({
tag: "iframe",
src: n,
style: r
}), this.$.sampleContent.render(), this.$.sampleContent.resized();
} else t.action == "switchNightly" ? (this.sourcePath = "http://nightly.enyojs.com/enyo-nightly-" + t.version, this.versionContent = t.content, this.loadSamples()) : t.action == "settings" && this.$.navPanels.pushView({
kind: "SettingsView",
onQuit: "quitTest"
}, {
owner: this
});
},
renderTest: function(e, t) {
this.renderSample(t.sample);
},
quitTest: function() {
this.resetSample(), this.$.navPanels.popView();
}
}), enyo.kind({
name: "SourceView",
kind: "Control",
tag: "pre",
classes: "source enyo-selectable",
published: {
wrap: !1
},
create: function() {
this.inherited(arguments), this.wrapChanged();
},
contentChanged: function(e) {
var t = this.hasNode();
if (t) {
while (t.hasChildNodes()) t.removeChild(t.firstChild);
t.appendChild(document.createTextNode(this.content));
}
},
wrapChanged: function(e) {
this.addRemoveClass("nowrap", !this.wrap);
}
}), enyo.kind({
name: "ViewStack",
kind: "Panels",
arrangerKind: "CarouselArranger",
draggable: !1,
handlers: {
onTransitionFinish: "transitionFinish"
},
currView: -1,
transitionFinish: function() {
if (this.suppressFinish) return !0;
var e = this.getPanels().length - 1;
if (e > this.currView) {
this.suppressFinish = !0, this.saveAnimate = this.getAnimate(), this.setAnimate(!1);
while (e > this.currView) {
var t = this.getPanels()[e];
t.destroy(), e--;
}
this.setIndexDirect(this.currView), this.setAnimate(this.saveAnimate), this.suppressFinish = !1;
}
},
pushView: function(e, t) {
this.currView++;
var n = this.createComponent(e, t);
return n.render(), this.reflow(), this.next(), n;
},
popView: function() {
this.currView--, this.previous();
},
popToRootView: function(e) {
this.currView = 0, e ? this.setIndexDirect(0) : this.setIndex(0);
},
popAll: function() {
this.saveAnimate = this.getAnimate(), this.setAnimate(!1), this.suppressFinish = !0;
var e = this.getPanels().length - 1;
while (e > -1) {
var t = this.getPanels()[e];
t.destroy(), e--;
}
this.setAnimate(this.saveAnimate), this.suppressFinish = !1;
}
}), enyo.kind({
name: "NavigationList",
kind: "FittableRows",
classes: "enyo-fit enyo-unselectable",
published: {
samples: ""
},
events: {
onNavTap: "",
onNavBack: "",
onMenuAction: ""
},
components: [ {
kind: "onyx.Toolbar",
style: "background-color:#555;"
}, {
kind: "List",
classes: "list",
touch: !0,
fit: !0,
onSetupItem: "setupItem",
components: [ {
name: "item",
classes: "item enyo-border-box",
ontap: "navTap"
} ]
}, {
kind: "onyx.Toolbar",
layoutKind: "FittableColumnsLayout",
classes: "footer-toolbar",
components: [ {
kind: "onyx.Button",
name: "back",
content: "Back",
ontap: "doNavBack"
}, {
fit: !0
}, {
kind: "onyx.MenuDecorator",
name: "extrasMenu",
showing: !1,
components: [ {
kind: "onyx.Button",
content: "Extras"
}, {
kind: "onyx.Menu",
onSelect: "menuAction",
floating: !0,
components: [ {
content: "Start Test Mode",
action: "startTest"
}, {
content: "Browserscope Results",
action: "browserscope"
}, {
kind: "onyx.PickerDecorator",
components: [ {
kind: "onyx.MenuItem",
content: "Switch to Nightly (experimental)"
}, {
kind: "onyx.Picker",
name: "nightlyPicker",
modal: !1,
onSelect: "nightlyAction",
floating: !0
} ]
}, {
content: "Settings",
action: "settings"
} ]
} ]
} ]
} ],
create: function() {
this.inherited(arguments), this.samplesChanged(), localStorage.getItem("extras") == "true" && this.$.extrasMenu.setShowing(!0);
var e = new Date;
for (var t = 0; t < 20; t++) {
var n = e.getFullYear(), r = e.getMonth() + 1;
r = r < 10 ? "0" + r : r;
var i = e.getDate();
i = i < 10 ? "0" + i : i;
var s = n + "/" + r + "/" + i, o = n + "" + r + "" + i;
this.$.nightlyPicker.createComponent({
content: s,
version: o
}), e = new Date(e.getTime() - 864e5);
}
},
menuAction: function(e, t) {
t.originator.action && this.doMenuAction({
action: t.originator.action
});
},
nightlyAction: function(e, t) {
return this.doMenuAction({
action: "switchNightly",
version: t.originator.version,
content: t.originator.content
}), !0;
},
samplesChanged: function() {
this.$.toolbar.setContent(this.samples.name + (this.version ? " (" + this.version + ")" : "")), this.$.back.setShowing(!this.samples.isTop), this.$.list.setCount(this.samples.samples.length);
},
setupItem: function(e, t) {
var n = e.getClientControls()[0];
n.setContent(this.samples.samples[t.index].name), n.addRemoveClass("onyx-selected", e.isSelected(t.index));
},
clearSelection: function() {
this.selected !== undefined && this.$.list.getSelection().deselect(this.selected);
},
navTap: function(e, t) {
this.selected = t.index, this.doNavTap(t);
},
startTest: function(e, t) {
this.doStartTest(t);
}
}), enyo.kind({
name: "SettingsView",
kind: "FittableRows",
events: {
onQuit: ""
},
classes: "enyo-fit enyo-unselectable onyx",
components: [ {
kind: "onyx.Toolbar",
style: "background-color:#555;",
content: "Settings"
}, {
kind: "Scroller",
fit: !0,
components: [ {
classes: "test-tools",
components: [ {
kind: "onyx.Groupbox",
name: "addSamplesGroup",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Additional Samples"
}, {
kind: "Repeater",
style: "background:white;",
name: "addSamplesList",
onSetupItem: "setupManifest",
components: [ {
kind: "onyx.InputDecorator",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
components: [ {
kind: "onyx.Input",
name: "manifestURL",
onchange: "manifestChanged",
fit: !0
}, {
kind: "onyx.IconButton",
style: "width:32px;",
src: "assets/remove-icon.png",
ontap: "removeManifest"
} ]
} ]
} ]
}, {
kind: "onyx.Button",
content: "Add Samples",
ontap: "addManifest",
style: "margin-bottom:10px;"
}, {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "JIRA Collector ID"
}, {
kind: "onyx.InputDecorator",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
components: [ {
kind: "onyx.Input",
name: "jiraCollectorId",
fit: !0
} ]
} ]
}, {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Alternate Source Path"
}, {
kind: "onyx.InputDecorator",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
components: [ {
kind: "onyx.Input",
placeholder: "(experimental)",
name: "sourcePath",
key: "sourcePath",
fit: !0
} ]
} ]
} ]
} ]
}, {
kind: "onyx.Toolbar",
layoutKind: "FittableColumnsLayout",
classes: "footer-toolbar",
components: [ {
kind: "onyx.Button",
content: "Cancel",
ontap: "doQuit"
}, {
kind: "onyx.Button",
content: "Save and Apply",
ontap: "save"
} ]
} ],
create: function() {
this.inherited(arguments), this.addSamples = enyo.json.parse(localStorage.getItem("addSamples")) || [], this.$.addSamplesList.setCount(this.addSamples.length), this.$.addSamplesGroup.setShowing(this.addSamples.length), this.$.sourcePath.setValue(localStorage.getItem("sourcePath")), this.$.jiraCollectorId.setValue(localStorage.getItem("jiraCollectorId"));
},
setupManifest: function(e, t) {
t.item.$.manifestURL.setValue(this.addSamples[t.index]);
},
removeManifest: function(e, t) {
this.addSamples.splice(t.index, 1), this.$.addSamplesList.setCount(this.addSamples.length), this.$.addSamplesGroup.setShowing(this.addSamples.length);
},
addManifest: function() {
this.addSamples.push(""), this.$.addSamplesList.setCount(this.addSamples.length), this.$.addSamplesGroup.setShowing(this.addSamples.length);
},
manifestChanged: function(e, t) {
this.addSamples[t.index] = t.originator.getValue();
},
save: function() {
localStorage.setItem("addSamples", enyo.json.stringify(this.addSamples)), localStorage.setItem("sourcePath", this.$.sourcePath.getValue()), localStorage.setItem("jiraCollectorId", this.$.jiraCollectorId.getValue()), window.location = window.location.pathname;
}
}), enyo.kind({
name: "TestController",
kind: "FittableRows",
events: {
onQuit: "",
onRenderSample: ""
},
classes: "enyo-fit enyo-unselectable onyx",
components: [ {
kind: "onyx.Toolbar",
style: "background-color:#555;",
content: "Sampler Test Mode"
}, {
kind: "Scroller",
fit: !0,
components: [ {
classes: "test-tools",
components: [ {
components: [ {
kind: "onyx.Button",
name: "prevBtn",
classes: "test-button-left",
content: "< Previous",
ontap: "prevTest"
}, {
kind: "onyx.Button",
name: "nextBtn",
classes: "test-button-right",
content: "Next >",
ontap: "nextTest"
} ]
}, {
kind: "onyx.Groupbox",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Sample"
}, {
kind: "onyx.PickerDecorator",
name: "samplePickerDec",
onSelect: "sampleChanged",
components: [ {
name: "sampleName",
style: "padding:10px; background:white; width:100%; text-align:left;",
content: "Sample Name"
}, {
name: "samplePicker",
style: "width:100%",
kind: "onyx.FlyweightPicker",
onSetupItem: "setupPicker",
components: [ {
name: "pickerItem",
style: "text-align:left;"
} ]
} ]
} ]
}, {
components: [ {
kind: "onyx.Button",
name: "failBtn",
content: "Fail",
classes: "onyx-negative test-button-left",
ontap: "failTest"
}, {
kind: "onyx.Button",
name: "passBtn",
content: "Pass",
classes: "onyx-affirmative test-button-right",
ontap: "passTest"
} ]
}, {
kind: "onyx.Groupbox",
name: "resultGroup",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Test Result"
}, {
name: "resultValue",
style: "padding:10px; background:white;",
content: "Pass"
} ]
}, {
kind: "onyx.Groupbox",
name: "descGroup",
components: [ {
kind: "onyx.GroupboxHeader",
content: "Fail Description"
}, {
kind: "onyx.InputDecorator",
components: [ {
kind: "onyx.TextArea",
name: "descText",
style: "width: 100%;",
oninput: "descChanged"
} ]
} ]
}, {
components: [ {
kind: "onyx.Button",
name: "cancelBtn",
content: "Cancel",
classes: "test-button-left",
ontap: "cancelFail"
}, {
kind: "onyx.Button",
name: "confirmBtn",
content: "Confirm Failure",
classes: "onyx-negative test-button-right",
ontap: "confirmFail"
} ]
}, {
kind: "onyx.Groupbox",
name: "knownIssues",
showing: !1,
components: [ {
kind: "onyx.GroupboxHeader",
content: "Known Issues"
}, {
kind: "Repeater",
style: "background:white;",
name: "knownIssuesList",
onSetupItem: "setupKnownIssues",
components: [ {
name: "item",
style: "padding:10px; font-size:12px;",
components: [ {
tag: "a",
name: "issueKey",
style: "width:75px; padding-right:10px; color:blue;"
}, {
tag: "span",
name: "issueSummary"
} ]
} ]
} ]
} ]
} ]
}, {
kind: "onyx.Toolbar",
classes: "footer-toolbar",
components: [ {
kind: "onyx.Button",
name: "back",
content: "Done",
ontap: "doneTapped"
} ]
}, {
name: "donePopup",
style: "width:250px;padding:10px;",
kind: "onyx.Popup",
centered: !0,
modal: !0,
floating: !0,
scrim: !0,
components: [ {
style: "padding-bottom:10px;",
content: "Would you like to report your test results to Browserscope?"
}, {
kind: "onyx.Button",
name: "discardBtn",
classes: "onyx-negative",
content: "No, Discard",
ontap: "dismissDone"
}, {
kind: "onyx.Button",
name: "reportBtn",
classes: "onyx-affirmative",
content: "Yes, Report",
ontap: "dismissDone"
} ]
} ],
create: function() {
this.inherited(arguments), this.results = [], this.resultsChanged = !1, this.sampleList = [], this.currSample = -1, this.populateSampleList(this.samples.samples), this.$.samplePicker.setCount(this.sampleList.length), this.jiraCollectorId = localStorage.getItem("jiraCollectorId"), this.jiraCollectorId && this.loadJIRACollector(this.jiraCollectorId), this.nextTest();
},
loadJIRACollector: function(e) {
if (!document.getElementById("_jira_collector")) {
var t = document.createElement("script");
t.id = "_jira_collector", firstScript = document.getElementsByTagName("script")[0], t.src = "https://enyojs.atlassian.net/s/en_USx1agvx-418945332/801/41/1.1/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?collectorId=" + e, firstScript.parentNode.insertBefore(t, firstScript);
}
},
populateSampleList: function(e, t) {
for (var n in e) {
var r = e[n];
r.samples ? this.populateSampleList(r.samples, r.ns || t) : r.path && (r.ns = t, this.sampleList.push(r));
}
},
pickerNameForSample: function(e) {
var t = this.sampleList[e];
return e + 1 + "/" + this.sampleList.length + ": " + t.name;
},
setupPicker: function(e, t) {
this.$.pickerItem.setContent(this.pickerNameForSample(t.index));
},
sampleChanged: function(e, t) {
this.currSample = t ? t.originator.selected : 0, this.selectSample(this.sampleList[this.currSample]);
},
nextTest: function() {
this.currSample < this.sampleList.length - 1 && (this.currSample++, this.$.samplePicker.setSelected(this.currSample), this.selectSample(this.sampleList[this.currSample]));
},
prevTest: function() {
this.currSample > 0 && (this.currSample--, this.$.samplePicker.setSelected(this.currSample), this.selectSample(this.sampleList[this.currSample]));
},
selectSample: function(e) {
this.$.descGroup.hide(), this.$.cancelBtn.hide(), this.$.confirmBtn.hide(), this.$.knownIssues.hide();
var t = this.results[this.currSample];
this.$.resultGroup.setShowing(t), this.$.resultValue.setContent(t ? t.result ? "Pass" : "Fail" : ""), this.$.descGroup.setShowing(t && t.failDesc), this.$.descText.setValue(t ? t.failDesc : ""), this.$.pickerItem.setContent(this.pickerNameForSample(this.currSample)), this.$.sampleName.setContent(this.pickerNameForSample(this.currSample)), this.doRenderSample({
sample: e
}), this.$.nextBtn.setDisabled(this.currSample == this.sampleList.length - 1), this.$.prevBtn.setDisabled(this.currSample == 0);
var n = e.name.match("ENYO-[0-9]+");
n = n && n.length ? " OR ((id=" + n.join(") OR (id=") + "))" : "";
var r = "+" + e.name.replace(/ /g, " +").replace(":", ""), i = '(summary ~ "' + r + '" and status in ("Open", "In Progress"))' + n, s = new enyo.JsonpRequest({
url: "https://enyojs.atlassian.net/rest/api/latest/search",
callbackName: "jsonp-callback"
});
s.go({
jql: i
}), s.response(this, "processKnownIssues");
},
processKnownIssues: function(e, t) {
this.knownIssues = t.issues, this.$.knownIssues.setShowing(this.knownIssues.length), this.$.knownIssuesList.setCount(this.knownIssues.length);
},
setupKnownIssues: function(e, t) {
var n = t.item, r = this.knownIssues[t.index];
n.$.issueKey.setContent(r.key), n.$.issueKey.setAttributes({
href: "https://enyojs.atlassian.net/browse/" + r.key,
target: "_top"
}), n.$.issueSummary.setContent(r.fields.summary);
},
descChanged: function() {
this.$.confirmBtn.setDisabled(this.$.descText.getValue().length == 0);
},
passTest: function() {
this.results[this.currSample] = {
result: 1
}, this.resultsChanged = !0, this.$.resultGroup.setShowing(!0), this.$.resultValue.setContent("Pass"), this.nextTest();
},
failTest: function() {
this.jiraCollectorId && window._jira_collector_trigger(), this.confirmFail();
},
cancelFail: function() {
this.$.descGroup.hide(), this.$.cancelBtn.hide(), this.$.confirmBtn.hide();
},
confirmFail: function() {
this.results[this.currSample] = {
result: 0,
failDesc: this.$.descText.getValue()
}, this.resultsChanged = !0, this.$.resultGroup.setShowing(!0), this.$.resultValue.setContent("Fail");
},
doneTapped: function() {
this.resultsChanged ? this.$.donePopup.show() : this.doQuit();
},
dismissDone: function(e) {
e == this.$.reportBtn && this.reportResults(), this.$.donePopup.hide(), this.doQuit();
},
reportResults: function() {
window._bTestResults = {};
for (var e in this.results) if (this.results[e]) {
var t = this.sampleList[e].name;
window._bTestResults[t] = this.results[e].result;
}
var n = "", r = document.createElement("script"), i = document.getElementsByTagName("script")[0];
r.src = "http://www.browserscope.org/user/beacon/" + this.browserScopeTestKey, n && (r.src += "?sandboxid=" + n), i.parentNode.insertBefore(r, i);
}
});
