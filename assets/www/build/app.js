
// minifier: path aliases

enyo.path.addPaths({layout: "/Users/phil/src/cordova/EnyoSlidepaneSandbox/enyo/tools/../../lib/layout/", onyx: "/Users/phil/src/cordova/EnyoSlidepaneSandbox/enyo/tools/../../lib/onyx/", onyx: "/Users/phil/src/cordova/EnyoSlidepaneSandbox/enyo/tools/../../lib/onyx/source/", WebView: "/Users/phil/src/cordova/EnyoSlidepaneSandbox/enyo/tools/../../lib/WebView/"});

// FittableLayout.js

enyo.kind({
name: "enyo.FittableLayout",
kind: "Layout",
calcFitIndex: function() {
for (var a = 0, b = this.container.children, c; c = b[a]; a++) if (c.fit && c.showing) return a;
},
getFitControl: function() {
var a = this.container.children, b = a[this.fitIndex];
return b && b.fit && b.showing || (this.fitIndex = this.calcFitIndex(), b = a[this.fitIndex]), b;
},
getLastControl: function() {
var a = this.container.children, b = a.length - 1, c = a[b];
while ((c = a[b]) && !c.showing) b--;
return c;
},
_reflow: function(a, b, c, d) {
this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
var e = this.getFitControl();
if (!e) return;
var f = 0, g = 0, h = 0, i, j = this.container.hasNode();
j && (i = enyo.FittableLayout.calcPaddingExtents(j), f = j[b] - (i[c] + i[d]));
var k = e.getBounds();
g = k[c] - (i && i[c] || 0);
var l = this.getLastControl();
if (l) {
var m = enyo.FittableLayout.getComputedStyleValue(l.hasNode(), "margin", d) || 0;
if (l != e) {
var n = l.getBounds(), o = k[c] + k[a], p = n[c] + n[a] + m;
h = p - o;
} else h = m;
}
var q = f - (g + h);
e.applyStyle(a, q + "px");
},
reflow: function() {
this.orient == "h" ? this._reflow("width", "clientWidth", "left", "right") : this._reflow("height", "clientHeight", "top", "bottom");
},
statics: {
_ieCssToPixelValue: function(a, b) {
var c = b, d = a.style, e = d.left, f = a.runtimeStyle && a.runtimeStyle.left;
return f && (a.runtimeStyle.left = a.currentStyle.left), d.left = c, c = d.pixelLeft, d.left = e, f && (d.runtimeStyle.left = f), c;
},
_pxMatch: /px/i,
getComputedStyleValue: function(a, b, c, d) {
var e = d || enyo.dom.getComputedStyle(a);
if (e) return parseInt(e.getPropertyValue(b + "-" + c));
if (a && a.currentStyle) {
var f = a.currentStyle[b + enyo.cap(c)];
return f.match(this._pxMatch) || (f = this._ieCssToPixelValue(a, f)), parseInt(f);
}
return 0;
},
calcBoxExtents: function(a, b) {
var c = enyo.dom.getComputedStyle(a);
return {
top: this.getComputedStyleValue(a, b, "top", c),
right: this.getComputedStyleValue(a, b, "right", c),
bottom: this.getComputedStyleValue(a, b, "bottom", c),
left: this.getComputedStyleValue(a, b, "left", c)
};
},
calcPaddingExtents: function(a) {
return this.calcBoxExtents(a, "padding");
},
calcMarginExtents: function(a) {
return this.calcBoxExtents(a, "margin");
}
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
toggleSelected: !1
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
this.inherited(arguments), this.multiSelectChanged();
},
multiSelectChanged: function() {
this.$.selection.setMulti(this.multiSelect);
},
setupItem: function(a) {
this.doSetupItem({
index: a,
selected: this.isSelected(a)
});
},
generateChildHtml: function() {
var a = "";
this.index = null;
for (var b = 0, c = 0; b < this.count; b++) c = this.rowOffset + (this.bottomUp ? this.count - b - 1 : b), this.setupItem(c), this.$.client.setAttribute("index", c), a += this.inherited(arguments), this.$.client.teardownRender();
return a;
},
previewDomEvent: function(a) {
var b = this.index = this.rowForEvent(a);
a.rowIndex = a.index = b, a.flyweight = this;
},
decorateEvent: function(a, b, c) {
var d = b && b.index != null ? b.index : this.index;
b && d != null && (b.index = d, b.flyweight = this), this.inherited(arguments);
},
tap: function(a, b) {
this.toggleSelected ? this.$.selection.toggle(b.index) : this.$.selection.select(b.index);
},
selectDeselect: function(a, b) {
this.renderRow(b.key);
},
getSelection: function() {
return this.$.selection;
},
isSelected: function(a) {
return this.getSelection().isSelected(a);
},
renderRow: function(a) {
var b = this.fetchRowNode(a);
b && (this.setupItem(a), b.innerHTML = this.$.client.generateChildHtml(), this.$.client.teardownChildren());
},
fetchRowNode: function(a) {
if (this.hasNode()) {
var b = this.node.querySelectorAll('[index="' + a + '"]');
return b && b[0];
}
},
rowForEvent: function(a) {
var b = a.target, c = this.hasNode().id;
while (b && b.parentNode && b.id != c) {
var d = b.getAttribute && b.getAttribute("index");
if (d !== null) return Number(d);
b = b.parentNode;
}
return -1;
},
prepareRow: function(a) {
var b = this.fetchRowNode(a);
enyo.FlyweightRepeater.claimNode(this.$.client, b);
},
lockRow: function() {
this.$.client.teardownChildren();
},
performOnRow: function(a, b, c) {
b && (this.prepareRow(a), enyo.call(c || null, b), this.lockRow());
},
statics: {
claimNode: function(a, b) {
var c = b && b.querySelectorAll("#" + a.id);
c = c && c[0], a.generated = Boolean(c || !a.tag), a.node = c, a.node && a.rendered();
for (var d = 0, e = a.children, f; f = e[d]; d++) this.claimNode(f, b);
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
for (var a = 0; a < this.pageCount; a++) this.portSize += this.getPageHeight(a);
this.adjustPortSize();
},
generatePage: function(a, b) {
this.page = a;
var c = this.$.generator.rowOffset = this.rowsPerPage * this.page, d = this.$.generator.count = Math.min(this.count - c, this.rowsPerPage), e = this.$.generator.generateChildHtml();
b.setContent(e);
var f = b.getBounds().height;
!this.rowHeight && f > 0 && (this.rowHeight = Math.floor(f / d), this.updateMetrics());
if (!this.fixedHeight) {
var g = this.getPageHeight(a);
g != f && f > 0 && (this.pageHeights[a] = f, this.portSize += f - g);
}
},
update: function(a) {
var b = !1, c = this.positionToPageInfo(a), d = c.pos + this.scrollerHeight / 2, e = Math.floor(d / Math.max(c.height, this.scrollerHeight) + .5) + c.no, f = e % 2 == 0 ? e : e - 1;
this.p0 != f && this.isPageInRange(f) && (this.generatePage(f, this.$.page0), this.positionPage(f, this.$.page0), this.p0 = f, b = !0), f = e % 2 == 0 ? Math.max(1, e - 1) : e, this.p1 != f && this.isPageInRange(f) && (this.generatePage(f, this.$.page1), this.positionPage(f, this.$.page1), this.p1 = f, b = !0), b && !this.fixedHeight && (this.adjustBottomPage(), this.adjustPortSize());
},
updateForPosition: function(a) {
this.update(this.calcPos(a));
},
calcPos: function(a) {
return this.bottomUp ? this.portSize - this.scrollerHeight - a : a;
},
adjustBottomPage: function() {
var a = this.p0 >= this.p1 ? this.$.page0 : this.$.page1;
this.positionPage(a.pageNo, a);
},
adjustPortSize: function() {
this.scrollerHeight = this.getBounds().height;
var a = Math.max(this.scrollerHeight, this.portSize);
this.$.port.applyStyle("height", a + "px");
},
positionPage: function(a, b) {
b.pageNo = a;
var c = this.pageToPosition(a);
b.applyStyle(this.pageBound, c + "px");
},
pageToPosition: function(a) {
var b = 0, c = a;
while (c > 0) c--, b += this.getPageHeight(c);
return b;
},
positionToPageInfo: function(a) {
var b = -1, c = this.calcPos(a), d = this.defaultPageHeight;
while (c >= 0) b++, d = this.getPageHeight(b), c -= d;
return {
no: b,
height: d,
pos: c + d
};
},
isPageInRange: function(a) {
return a == Math.max(0, Math.min(this.pageCount - 1, a));
},
getPageHeight: function(a) {
return this.pageHeights[a] || this.defaultPageHeight;
},
invalidatePages: function() {
this.p0 = this.p1 = null, this.$.page0.setContent(""), this.$.page1.setContent("");
},
invalidateMetrics: function() {
this.pageHeights = [], this.rowHeight = 0, this.updateMetrics();
},
scroll: function(a, b) {
var c = this.inherited(arguments);
return this.update(this.getScrollTop()), c;
},
scrollToBottom: function() {
this.update(this.getScrollBounds().maxTop), this.inherited(arguments);
},
setScrollTop: function(a) {
this.update(a), this.inherited(arguments), this.twiddle();
},
getScrollPosition: function() {
return this.calcPos(this.getScrollTop());
},
setScrollPosition: function(a) {
this.setScrollTop(this.calcPos(a));
},
scrollToRow: function(a) {
var b = Math.floor(a / this.rowsPerPage), c = a % this.rowsPerPage, d = this.pageToPosition(b);
this.updateForPosition(d), d = this.pageToPosition(b), this.setScrollPosition(d);
if (b == this.p0 || b == this.p1) {
var e = this.$.generator.fetchRowNode(a);
if (e) {
var f = e.offsetTop;
this.bottomUp && (f = this.getPageHeight(b) - e.offsetHeight - f);
var g = this.getScrollPosition() + f;
this.setScrollPosition(g);
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
select: function(a, b) {
return this.getSelection().select(a, b);
},
isSelected: function(a) {
return this.$.generator.isSelected(a);
},
renderRow: function(a) {
this.$.generator.renderRow(a);
},
prepareRow: function(a) {
this.$.generator.prepareRow(a);
},
lockRow: function() {
this.$.generator.lockRow();
},
performOnRow: function(a, b, c) {
this.$.generator.performOnRow(a, b, c);
},
animateFinish: function(a) {
return this.twiddle(), !0;
},
twiddle: function() {
var a = this.getStrategy();
enyo.call(a, "twiddle");
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
onScroll: "scrollHandler",
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
var a = {
kind: "Puller",
showing: !1,
text: this.loadingMessage,
iconClass: this.loadingIconClass,
onCreate: "setPully"
};
this.listTools.splice(0, 0, a), this.inherited(arguments), this.setPulling();
},
initComponents: function() {
this.createChrome(this.pulldownTools), this.accel = enyo.dom.canAccelerate(), this.translation = this.accel ? "translate3d" : "translate", this.inherited(arguments);
},
setPully: function(a, b) {
this.pully = b.originator;
},
scrollStartHandler: function() {
this.firedPullStart = !1, this.firedPull = !1, this.firedPullCancel = !1;
},
scrollHandler: function(a) {
this.completingPull && this.pully.setShowing(!1);
var b = this.getStrategy().$.scrollMath, c = b.y;
b.isInOverScroll() && c > 0 && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + c + "px" + (this.accel ? ",0" : "")), this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), c > this.pullHeight && !this.firedPull && (this.firedPull = !0, this.firedPullCancel = !1, this.pull()), this.firedPull && !this.firedPullCancel && c < this.pullHeight && (this.firedPullCancel = !0, this.firedPull = !1, this.pullCancel()));
},
scrollStopHandler: function() {
this.completingPull && (this.completingPull = !1, this.doPullComplete());
},
dragfinish: function() {
if (this.firedPull) {
var a = this.getStrategy().$.scrollMath;
a.setScrollY(a.y - this.pullHeight), this.pullRelease();
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
var a = this.getInitialStyleValue(this.hasNode(), this.boundary);
a.match(/px/i) && this.unit === "%" && (this.unitModifier = this.getBounds()[this.dimension]);
}
},
getInitialStyleValue: function(a, b) {
var c = enyo.dom.getComputedStyle(a);
return c ? c.getPropertyValue(b) : a && a.currentStyle ? a.currentStyle[b] : "0";
},
updateBounds: function(a, b) {
var c = {};
c[this.boundary] = a, this.setBounds(c, this.unit), this.setInlineStyles(a, b);
},
updateDragScalar: function() {
if (this.unit == "%") {
var a = this.getBounds()[this.dimension];
this.kDragScalar = a ? 100 / a : 1, this.canTransform || this.updateBounds(this.value, 100);
}
},
transformChanged: function() {
this.canTransform = enyo.dom.canTransform();
},
acceleratedChanged: function() {
enyo.platform.android > 2 || enyo.dom.accelerate(this, this.accelerated);
},
axisChanged: function() {
var a = this.axis == "h";
this.dragMoveProp = a ? "dx" : "dy", this.shouldDragProp = a ? "horizontal" : "vertical", this.transform = a ? "translateX" : "translateY", this.dimension = a ? "width" : "height", this.boundary = a ? "left" : "top";
},
setInlineStyles: function(a, b) {
var c = {};
this.unitModifier ? (c[this.boundary] = this.percentToPixels(a, this.unitModifier), c[this.dimension] = this.unitModifier, this.setBounds(c)) : (b ? c[this.dimension] = b : c[this.boundary] = a, this.setBounds(c, this.unit));
},
valueChanged: function(a) {
var b = this.value;
this.isOob(b) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(b) : this.clampValue(b)), enyo.platform.android > 2 && (this.value ? (a === 0 || a === undefined) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), this.canTransform ? enyo.dom.transformValue(this, this.transform, this.value + this.unit) : this.setInlineStyles(this.value, !1), this.doChange();
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
clampValue: function(a) {
var b = this.calcMin(), c = this.calcMax();
return Math.max(b, Math.min(a, c));
},
dampValue: function(a) {
return this.dampBound(this.dampBound(a, this.min, 1), this.max, -1);
},
dampBound: function(a, b, c) {
var d = a;
return d * c < b * c && (d = b + (d - b) / 4), d;
},
percentToPixels: function(a, b) {
return Math.floor(b / 100 * a);
},
pixelsToPercent: function(a) {
var b = this.unitModifier ? this.getBounds()[this.dimension] : this.container.getBounds()[this.dimension];
return a / b * 100;
},
shouldDrag: function(a) {
return this.draggable && a[this.shouldDragProp];
},
isOob: function(a) {
return a > this.calcMax() || a < this.calcMin();
},
dragstart: function(a, b) {
if (this.shouldDrag(b)) return b.preventDefault(), this.$.animator.stop(), b.dragInfo = {}, this.dragging = !0, this.drag0 = this.value, this.dragd0 = 0, this.preventDragPropagation;
},
drag: function(a, b) {
if (this.dragging) {
b.preventDefault();
var c = this.canTransform ? b[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(b[this.dragMoveProp]), d = this.drag0 + c, e = c - this.dragd0;
return this.dragd0 = c, e && (b.dragInfo.minimizing = e < 0), this.setValue(d), this.preventDragPropagation;
}
},
dragfinish: function(a, b) {
if (this.dragging) return this.dragging = !1, this.completeDrag(b), b.preventTap(), this.preventDragPropagation;
},
completeDrag: function(a) {
this.value !== this.calcMax() && this.value != this.calcMin() && this.animateToMinMax(a.dragInfo.minimizing);
},
isAnimating: function() {
return this.$.animator.isAnimating();
},
play: function(a, b) {
this.$.animator.play({
startValue: a,
endValue: b,
node: this.hasNode()
});
},
animateTo: function(a) {
this.play(this.value, a);
},
animateToMin: function() {
this.animateTo(this.calcMin());
},
animateToMax: function() {
this.animateTo(this.calcMax());
},
animateToMinMax: function(a) {
a ? this.animateToMin() : this.animateToMax();
},
animatorStep: function(a) {
return this.setValue(a.value), !0;
},
animatorComplete: function(a) {
return this.doAnimateFinish(a), !0;
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
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) c._arranger = null;
this.inherited(arguments);
},
arrange: function(a, b) {},
size: function() {},
start: function() {
var a = this.container.fromIndex, b = this.container.toIndex, c = this.container.transitionPoints = [ a ];
if (this.incrementalPoints) {
var d = Math.abs(b - a) - 2, e = a;
while (d >= 0) e += b < a ? -1 : 1, c.push(e), d--;
}
c.push(this.container.toIndex);
},
finish: function() {},
canDragEvent: function(a) {
return a[this.canDragProp];
},
calcDragDirection: function(a) {
return a[this.dragDirectionProp];
},
calcDrag: function(a) {
return a[this.dragProp];
},
drag: function(a, b, c, d, e) {
var f = this.measureArrangementDelta(-a, b, c, d, e);
return f;
},
measureArrangementDelta: function(a, b, c, d, e) {
var f = this.calcArrangementDifference(b, c, d, e), g = f ? a / Math.abs(f) : 0;
return g *= this.container.fromIndex > this.container.toIndex ? -1 : 1, g;
},
calcArrangementDifference: function(a, b, c, d) {},
_arrange: function(a) {
var b = this.getOrderedControls(a);
this.arrange(b, a);
},
arrangeControl: function(a, b) {
a._arranger = enyo.mixin(a._arranger || {}, b);
},
flow: function() {
this.c$ = [].concat(this.container.getPanels()), this.controlsIndex = 0;
for (var a = 0, b = this.container.getPanels(), c; c = b[a]; a++) {
enyo.dom.accelerate(c, this.accelerated);
if (enyo.platform.safari) {
var d = c.children;
for (var e = 0, f; f = d[e]; e++) enyo.dom.accelerate(f, this.accelerated);
}
}
},
reflow: function() {
var a = this.container.hasNode();
this.containerBounds = a ? {
width: a.clientWidth,
height: a.clientHeight
} : {}, this.size();
},
flowArrangement: function() {
var a = this.container.arrangement;
if (a) for (var b = 0, c = this.container.getPanels(), d; d = c[b]; b++) this.flowControl(d, a[b]);
},
flowControl: function(a, b) {
enyo.Arranger.positionControl(a, b);
var c = b.opacity;
c != null && enyo.Arranger.opacifyControl(a, c);
},
getOrderedControls: function(a) {
var b = Math.floor(a), c = b - this.controlsIndex, d = c > 0, e = this.c$ || [];
for (var f = 0; f < Math.abs(c); f++) d ? e.push(e.shift()) : e.unshift(e.pop());
return this.controlsIndex = b, e;
},
statics: {
positionControl: function(a, b, c) {
var d = c || "px";
if (!this.updating) if (enyo.dom.canTransform() && !enyo.platform.android) {
var e = b.left, f = b.top, e = enyo.isString(e) ? e : e && e + d, f = enyo.isString(f) ? f : f && f + d;
enyo.dom.transform(a, {
translateX: e || null,
translateY: f || null
});
} else a.setBounds(b, c);
},
opacifyControl: function(a, b) {
var c = b;
c = c > .99 ? 1 : c < .01 ? 0 : c, enyo.platform.ie < 9 ? a.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + c * 100 + ")") : a.applyStyle("opacity", c);
}
}
});

// CardArranger.js

enyo.kind({
name: "enyo.CardArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(a, b, c, d) {
return this.containerBounds.width;
},
arrange: function(a, b) {
for (var c = 0, d, e, f; d = a[c]; c++) f = c == 0 ? 1 : 0, this.arrangeControl(d, {
opacity: f
});
},
start: function() {
this.inherited(arguments);
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) {
var d = c.showing;
c.setShowing(b == this.container.fromIndex || b == this.container.toIndex), c.showing && !d && c.resized();
}
},
finish: function() {
this.inherited(arguments);
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) c.setShowing(b == this.container.toIndex);
},
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) enyo.Arranger.opacifyControl(c, 1), c.showing || c.setShowing(!0);
this.inherited(arguments);
}
});

// CardSlideInArranger.js

enyo.kind({
name: "enyo.CardSlideInArranger",
kind: "CardArranger",
start: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) {
var d = c.showing;
c.setShowing(b == this.container.fromIndex || b == this.container.toIndex), c.showing && !d && c.resized();
}
var e = this.container.fromIndex, b = this.container.toIndex;
this.container.transitionPoints = [ b + "." + e + ".s", b + "." + e + ".f" ];
},
finish: function() {
this.inherited(arguments);
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) c.setShowing(b == this.container.toIndex);
},
arrange: function(a, b) {
var c = b.split("."), d = c[0], e = c[1], f = c[2] == "s", g = this.containerBounds.width;
for (var h = 0, i = this.container.getPanels(), j, k; j = i[h]; h++) k = g, e == h && (k = f ? 0 : -g), d == h && (k = f ? g : 0), e == h && e == d && (k = 0), this.arrangeControl(j, {
left: k
});
},
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) enyo.Arranger.positionControl(c, {
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
var a = this.container.getPanels(), b = this.containerPadding = this.container.hasNode() ? enyo.FittableLayout.calcPaddingExtents(this.container.node) : {}, c = this.containerBounds;
c.height -= b.top + b.bottom, c.width -= b.left + b.right;
var d;
for (var e = 0, f = 0, g, h; h = a[e]; e++) g = enyo.FittableLayout.calcMarginExtents(h.hasNode()), h.width = h.getBounds().width, h.marginWidth = g.right + g.left, f += (h.fit ? 0 : h.width) + h.marginWidth, h.fit && (d = h);
if (d) {
var i = c.width - f;
d.width = i >= 0 ? i : d.width;
}
for (var e = 0, j = b.left, g, h; h = a[e]; e++) h.setBounds({
top: b.top,
bottom: b.bottom,
width: h.fit ? h.width : null
});
},
arrange: function(a, b) {
this.container.wrap ? this.arrangeWrap(a, b) : this.arrangeNoWrap(a, b);
},
arrangeNoWrap: function(a, b) {
var c = this.container.getPanels(), d = this.container.clamp(b), e = this.containerBounds.width;
for (var f = d, g = 0, h; h = c[f]; f++) {
g += h.width + h.marginWidth;
if (g > e) break;
}
var i = e - g, j = 0;
if (i > 0) {
var k = d;
for (var f = d - 1, l = 0, h; h = c[f]; f--) {
l += h.width + h.marginWidth;
if (i - l <= 0) {
j = i - l, d = f;
break;
}
}
}
for (var f = 0, m = this.containerPadding.left + j, n, h; h = c[f]; f++) n = h.width + h.marginWidth, f < d ? this.arrangeControl(h, {
left: -n
}) : (this.arrangeControl(h, {
left: Math.floor(m)
}), m += n);
},
arrangeWrap: function(a, b) {
for (var c = 0, d = this.containerPadding.left, e, f; f = a[c]; c++) this.arrangeControl(f, {
left: d
}), d += f.width + f.marginWidth;
},
calcArrangementDifference: function(a, b, c, d) {
var e = Math.abs(a % this.c$.length);
return b[e].left - d[e].left;
},
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) enyo.Arranger.positionControl(c, {
left: null,
top: null
}), c.applyStyle("top", null), c.applyStyle("bottom", null), c.applyStyle("left", null), c.applyStyle("width", null);
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
for (var a = 0, b = this.container.getPanels(), c; c = b[a]; a++) c._fit && a != b.length - 1 && (c.applyStyle("width", null), c._fit = null);
},
arrange: function(a, b) {
var c = this.container.getPanels();
for (var d = 0, e = this.containerPadding.left, f, g; g = c[d]; d++) this.arrangeControl(g, {
left: e
}), d >= b && (e += g.width + g.marginWidth), d == c.length - 1 && b < 0 && this.arrangeControl(g, {
left: e - b
});
},
calcArrangementDifference: function(a, b, c, d) {
var e = this.container.getPanels().length - 1;
return Math.abs(d[e].left - b[e].left);
},
flowControl: function(a, b) {
this.inherited(arguments);
if (this.container.realtimeFit) {
var c = this.container.getPanels(), d = c.length - 1, e = c[d];
a == e && this.fitControl(a, b.left);
}
},
finish: function() {
this.inherited(arguments);
if (!this.container.realtimeFit && this.containerBounds) {
var a = this.container.getPanels(), b = this.container.arrangement, c = a.length - 1, d = a[c];
this.fitControl(d, b[c].left);
}
},
fitControl: function(a, b) {
a._fit = !0, a.applyStyle("width", this.containerBounds.width - b + "px"), a.resized();
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
var a = this.container.getPanels(), b = this.containerBounds[this.axisSize], c = b - this.margin - this.margin;
for (var d = 0, e, f; f = a[d]; d++) e = {}, e[this.axisSize] = c, e[this.offAxisSize] = "100%", f.setBounds(e);
},
arrange: function(a, b) {
var c = Math.floor(this.container.getPanels().length / 2), d = this.getOrderedControls(Math.floor(b) - c), e = this.containerBounds[this.axisSize] - this.margin - this.margin, f = this.margin - e * c, g = (d.length - 1) / 2;
for (var h = 0, i, j, k; i = d[h]; h++) j = {}, j[this.axisPosition] = f, j.opacity = h == 0 || h == d.length - 1 ? 0 : 1, this.arrangeControl(i, j), f += e;
},
calcArrangementDifference: function(a, b, c, d) {
var e = Math.abs(a % this.c$.length);
return b[e][this.axisPosition] - d[e][this.axisPosition];
},
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) enyo.Arranger.positionControl(c, {
left: null,
top: null
}), enyo.Arranger.opacifyControl(c, 1), c.applyStyle("left", null), c.applyStyle("top", null), c.applyStyle("height", null), c.applyStyle("width", null);
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
var a = this.container.getPanels(), b = this.containerBounds, c = this.controlWidth = b.width / 3, d = this.controlHeight = b.height / 3;
for (var e = 0, f; f = a[e]; e++) f.setBounds({
width: c,
height: d
});
},
arrange: function(a, b) {
var c = this.inc;
for (var d = 0, e = a.length, f; f = a[d]; d++) {
var g = Math.cos(d / e * 2 * Math.PI) * d * c + this.controlWidth, h = Math.sin(d / e * 2 * Math.PI) * d * c + this.controlHeight;
this.arrangeControl(f, {
left: g,
top: h
});
}
},
start: function() {
this.inherited(arguments);
var a = this.getOrderedControls(this.container.toIndex);
for (var b = 0, c; c = a[b]; b++) c.applyStyle("z-index", a.length - b);
},
calcArrangementDifference: function(a, b, c, d) {
return this.controlWidth;
},
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) c.applyStyle("z-index", null), enyo.Arranger.positionControl(c, {
left: null,
top: null
}), c.applyStyle("left", null), c.applyStyle("top", null), c.applyStyle("height", null), c.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.GridArranger",
kind: "Arranger",
incrementalPoints: !0,
colWidth: 100,
colHeight: 100,
size: function() {
var a = this.container.getPanels(), b = this.colWidth, c = this.colHeight;
for (var d = 0, e; e = a[d]; d++) e.setBounds({
width: b,
height: c
});
},
arrange: function(a, b) {
var c = this.colWidth, d = this.colHeight, e = Math.floor(this.containerBounds.width / c), f;
for (var g = 0, h = 0; h < a.length; g++) for (var i = 0; i < e && (f = a[h]); i++, h++) this.arrangeControl(f, {
left: c * i,
top: d * g
});
},
flowControl: function(a, b) {
this.inherited(arguments), enyo.Arranger.opacifyControl(a, b.top % this.colHeight != 0 ? .25 : 1);
},
calcArrangementDifference: function(a, b, c, d) {
return this.colWidth;
},
destroy: function() {
var a = this.container.getPanels();
for (var b = 0, c; c = a[b]; b++) enyo.Arranger.positionControl(c, {
left: null,
top: null
}), c.applyStyle("left", null), c.applyStyle("top", null), c.applyStyle("height", null), c.applyStyle("width", null);
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
this.transitionPoints = [], this.inherited(arguments), this.arrangerKindChanged(), this.avoidFitChanged(), this.indexChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
arrangerKindChanged: function() {
this.setLayoutKind(this.arrangerKind);
},
avoidFitChanged: function() {
this.addRemoveClass("enyo-panels-fit-narrow", this.narrowFit);
},
removeControl: function(a) {
this.inherited(arguments), this.controls.length > 1 && this.isPanel(a) && (this.setIndex(Math.max(this.index - 1, 0)), this.flow(), this.reflow());
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
var a = this.controlParent || this;
return a.children;
},
getActive: function() {
var a = this.getPanels();
return a[this.index];
},
getAnimator: function() {
return this.$.animator;
},
setIndex: function(a) {
this.setPropertyValue("index", a, "indexChanged");
},
setIndexDirect: function(a) {
this.setIndex(a), this.completed();
},
previous: function() {
this.setIndex(this.index - 1);
},
next: function() {
this.setIndex(this.index + 1);
},
clamp: function(a) {
var b = this.getPanels().length - 1;
return this.wrap ? a : Math.max(0, Math.min(a, b));
},
indexChanged: function(a) {
this.lastIndex = a, this.index = this.clamp(this.index), this.dragging || (this.$.animator.isAnimating() && this.completed(), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(), this.$.animator.play({
startValue: this.fraction
})) : this.refresh()));
},
step: function(a) {
this.fraction = a.value, this.stepTransition();
},
completed: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
dragstart: function(a, b) {
if (this.draggable && this.layout && this.layout.canDragEvent(b)) return b.preventDefault(), this.dragstartTransition(b), this.dragging = !0, this.$.animator.stop(), !0;
},
drag: function(a, b) {
this.dragging && (b.preventDefault(), this.dragTransition(b));
},
dragfinish: function(a, b) {
this.dragging && (this.dragging = !1, b.preventTap(), this.dragfinishTransition(b));
},
dragstartTransition: function(a) {
if (!this.$.animator.isAnimating()) {
var b = this.fromIndex = this.index;
this.toIndex = b - (this.layout ? this.layout.calcDragDirection(a) : 0);
} else this.verifyDragTransition(a);
this.fromIndex = this.clamp(this.fromIndex), this.toIndex = this.clamp(this.toIndex), this.fireTransitionStart(), this.layout && this.layout.start();
},
dragTransition: function(a) {
var b = this.layout ? this.layout.calcDrag(a) : 0, c = this.transitionPoints, d = c[0], e = c[c.length - 1], f = this.fetchArrangement(d), g = this.fetchArrangement(e), h = this.layout ? this.layout.drag(b, d, f, e, g) : 0, i = b && !h;
!i, this.fraction += h;
var j = this.fraction;
if (j > 1 || j < 0 || i) (j > 0 || i) && this.dragfinishTransition(a), this.dragstartTransition(a), this.fraction = 0;
this.stepTransition();
},
dragfinishTransition: function(a) {
this.verifyDragTransition(a), this.setIndex(this.toIndex), this.dragging && this.fireTransitionFinish();
},
verifyDragTransition: function(a) {
var b = this.layout ? this.layout.calcDragDirection(a) : 0, c = Math.min(this.fromIndex, this.toIndex), d = Math.max(this.fromIndex, this.toIndex);
if (b > 0) {
var e = c;
c = d, d = e;
}
c != this.fromIndex && (this.fraction = 1 - this.fraction), this.fromIndex = c, this.toIndex = d;
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
var a = this.startTransitionInfo;
this.hasNode() && (!a || a.fromIndex != this.fromIndex || a.toIndex != this.toIndex) && (this.startTransitionInfo = {
fromIndex: this.fromIndex,
toIndex: this.toIndex
}, this.doTransitionStart(enyo.clone(this.startTransitionInfo)));
},
fireTransitionFinish: function() {
var a = this.finishTransitionInfo;
this.hasNode() && (!a || a.fromIndex != this.lastIndex || a.toIndex != this.index) && (this.finishTransitionInfo = {
fromIndex: this.lastIndex,
toIndex: this.index
}, this.doTransitionFinish(enyo.clone(this.finishTransitionInfo))), this.lastIndex = this.index;
},
stepTransition: function() {
if (this.hasNode()) {
var a = this.transitionPoints, b = (this.fraction || 0) * (a.length - 1), c = Math.floor(b);
b -= c;
var d = a[c], e = a[c + 1], f = this.fetchArrangement(d), g = this.fetchArrangement(e);
this.arrangement = f && g ? enyo.Panels.lerp(f, g, b) : f || g, this.arrangement && this.layout && this.layout.flowArrangement();
}
},
fetchArrangement: function(a) {
return a != null && !this.arrangements[a] && this.layout && (this.layout._arrange(a), this.arrangements[a] = this.readArrangement(this.getPanels())), this.arrangements[a];
},
readArrangement: function(a) {
var b = [];
for (var c = 0, d = a, e; e = d[c]; c++) b.push(enyo.clone(e._arranger));
return b;
},
statics: {
isScreenNarrow: function() {
return enyo.dom.getWindowWidth() <= 800;
},
lerp: function(a, b, c) {
var d = [];
for (var e = 0, f = enyo.keys(a), g; g = f[e]; e++) d.push(this.lerpObject(a[g], b[g], c));
return d;
},
lerpObject: function(a, b, c) {
var d = enyo.clone(a), e, f;
if (b) for (var g in a) e = a[g], f = b[g], e != f && (d[g] = e - (e - f) * c);
return d;
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
addNodes: function(a) {
this.destroyClientControls();
for (var b = 0, c; c = a[b]; b++) this.createComponent(c);
this.$.client.render();
},
addTextNodes: function(a) {
this.destroyClientControls();
for (var b = 0, c; c = a[b]; b++) this.createComponent({
content: c
});
this.$.client.render();
},
tap: function(a, b) {
return this.onlyIconExpands ? b.target == this.$.icon.hasNode() ? this.toggleExpanded() : this.doNodeTap() : (this.toggleExpanded(), this.doNodeTap()), !0;
},
dblclick: function(a, b) {
return this.doNodeDblClick(), !0;
},
toggleExpanded: function() {
this.setExpanded(!this.expanded);
},
quickCollapse: function() {
this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "0");
var a = this.$.client.getBounds().height;
this.$.client.setBounds({
top: -a
});
},
_expand: function() {
this.addClass("enyo-animate");
var a = this.$.client.getBounds().height;
this.$.box.setBounds({
height: a
}), this.$.client.setBounds({
top: 0
}), setTimeout(enyo.bind(this, function() {
this.expanded && (this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "auto"));
}), 225);
},
_collapse: function() {
this.removeClass("enyo-animate");
var a = this.$.client.getBounds().height;
this.$.box.setBounds({
height: a
}), setTimeout(enyo.bind(this, function() {
this.addClass("enyo-animate"), this.$.box.applyStyle("height", "0"), this.$.client.setBounds({
top: -a
});
}), 25);
},
expandedChanged: function(a) {
if (!this.expandable) this.expanded = !1; else {
var b = {
expanded: this.expanded
};
this.doExpand(b), b.wait || this.effectExpanded();
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
src: ""
},
classes: "onyx-icon",
create: function() {
this.inherited(arguments), this.src && this.srcChanged();
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
downHandler: function(a, b) {
return this.disabled || (this.setChecked(!this.getChecked()), this.bubble("onchange")), !0;
},
tap: function(a, b) {
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
var a = this.orient == "v", b = a ? "height" : "width", c = a ? "top" : "left";
this.applyStyle(b, null);
var d = this.hasNode()[a ? "scrollHeight" : "scrollWidth"];
this.$.animator.play({
startValue: this.open ? 0 : d,
endValue: this.open ? d : 0,
dimension: b,
position: c
});
} else this.$.client.setShowing(this.open);
},
animatorStep: function(a) {
if (this.hasNode()) {
var b = a.dimension;
this.node.style[b] = this.domStyles[b] = a.value + "px";
}
var c = this.$.client.hasNode();
if (c) {
var d = a.position, e = this.open ? a.endValue : a.startValue;
c.style[d] = this.$.client.domStyles[d] = a.value - e + "px";
}
this.container && this.container.resized();
},
animatorEnd: function() {
this.open || this.$.client.hide(), this.container && this.container.resized();
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
showHideScrim: function(a) {
if (this.floating && (this.scrim || this.modal && this.scrimWhenModal)) {
var b = this.getScrim();
if (a) {
var c = this.getScrimZIndex();
this._scrimZ = c, b.showAtZIndex(c);
} else b.hideAtZIndex(this._scrimZ);
enyo.call(b, "addRemoveClass", [ this.scrimClassName, b.showing ]);
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
var a = this.defaultZ;
return this._zIndex ? a = this._zIndex : this.hasNode() && (a = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || a), this._zIndex = a;
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
handlers: {
onDisabledChange: "disabledChange",
onfocus: "receiveFocus",
onblur: "receiveBlur"
},
receiveFocus: function() {
this.addClass("onyx-focused");
},
receiveBlur: function() {
this.removeClass("onyx-focused");
},
disabledChange: function(a, b) {
this.addRemoveClass("onyx-disabled", b.originator.disabled);
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
applyPosition: function(a) {
var b = "";
for (n in a) b += n + ":" + a[n] + (isNaN(a[n]) ? "; " : "px; ");
this.addStyles(b);
},
adjustPosition: function(a) {
if (this.showing && this.hasNode()) {
var b = this.node.getBoundingClientRect();
b.top + b.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), b.left + b.width > window.innerWidth && (this.applyPosition({
"margin-left": -b.width,
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
activated: function(a, b) {
this.requestHideTooltip(), b.originator.active && (this.menuActive = !0, this.activator = b.originator, this.activator.addClass("active"), this.requestShowMenu());
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
enter: function(a) {
this.menuActive || this.inherited(arguments);
},
leave: function(a, b) {
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
showOnTop: !1,
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestMenuShow",
onRequestHideMenu: "requestHide"
},
itemActivated: function(a, b) {
return b.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.adjustPosition(!0);
},
requestMenuShow: function(a, b) {
if (this.floating) {
var c = b.activator.hasNode();
if (c) {
var d = this.activatorOffset = this.getPageOffset(c);
this.applyPosition({
top: d.top + (this.showOnTop ? 0 : d.height),
left: d.left,
width: d.width
});
}
}
return this.show(), !0;
},
applyPosition: function(a) {
var b = "";
for (n in a) b += n + ":" + a[n] + (isNaN(a[n]) ? "; " : "px; ");
this.addStyles(b);
},
getPageOffset: function(a) {
var b = a.getBoundingClientRect(), c = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, d = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, e = b.height === undefined ? b.bottom - b.top : b.height, f = b.width === undefined ? b.right - b.left : b.width;
return {
top: b.top + c,
left: b.left + d,
height: e,
width: f
};
},
adjustPosition: function(a) {
if (this.showing && this.hasNode()) {
this.removeClass("onyx-menu-up"), this.floating ? enyo.noop : this.applyPosition({
left: "auto"
});
var b = this.node.getBoundingClientRect(), c = b.height === undefined ? b.bottom - b.top : b.height, d = window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight, e = window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
this.menuUp = b.top + c > d && d - b.bottom < b.top - c, this.addRemoveClass("onyx-menu-up", this.menuUp);
if (this.floating) {
var f = this.activatorOffset;
this.menuUp ? this.applyPosition({
top: f.top - c + (this.showOnTop ? f.height : 0),
bottom: "auto"
}) : b.top < f.top && f.top + (a ? f.height : 0) + c < d && this.applyPosition({
top: f.top + (this.showOnTop ? 0 : f.height),
bottom: "auto"
});
}
b.right > e && (this.floating ? this.applyPosition({
left: f.left - (b.left + b.width - e)
}) : this.applyPosition({
left: -(b.right - e)
}));
}
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition(!0);
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
tap: function(a) {
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
change: function(a, b) {
this.waterfallDown("onChange", b);
}
});

// PickerButton.js

enyo.kind({
name: "onyx.PickerButton",
kind: "onyx.Button",
handlers: {
onChange: "change"
},
change: function(a, b) {
this.setContent(b.content);
}
});

// Picker.js

enyo.kind({
name: "onyx.Picker",
kind: "onyx.Menu",
classes: "onyx-picker enyo-unselectable",
published: {
selected: null,
maxHeight: "200px"
},
events: {
onChange: ""
},
components: [ {
name: "client",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy"
} ],
floating: !0,
showOnTop: !0,
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged();
},
getScroller: function() {
return this.$[this.scrollerName];
},
maxHeightChanged: function() {
this.getScroller().setMaxHeight(this.maxHeight);
},
showingChanged: function() {
this.getScroller().setShowing(this.showing), this.inherited(arguments), this.showing && this.selected && this.scrollToSelected();
},
scrollToSelected: function() {
this.getScroller().scrollToControl(this.selected, !this.menuUp);
},
itemActivated: function(a, b) {
return this.processActivatedItem(b.originator), this.inherited(arguments);
},
processActivatedItem: function(a) {
a.active && this.setSelected(a);
},
selectedChanged: function(a) {
a && a.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
}));
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition(!1);
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
name: "client",
kind: "FlyweightRepeater",
ontap: "itemTap"
} ]
} ],
scrollerName: "scroller",
create: function() {
this.inherited(arguments), this.countChanged();
},
rendered: function() {
this.inherited(arguments), this.selectedChanged();
},
scrollToSelected: function() {
var a = this.$.client.fetchRowNode(this.selected);
this.getScroller().scrollToNode(a, !this.menuUp);
},
countChanged: function() {
this.$.client.count = this.count;
},
processActivatedItem: function(a) {
this.item = a;
},
selectedChanged: function(a) {
if (!this.item) return;
a !== undefined && (this.item.removeClass("selected"), this.$.client.renderRow(a)), this.item.addClass("selected"), this.$.client.renderRow(this.selected), this.item.removeClass("selected");
var b = this.$.client.fetchRowNode(this.selected);
this.doChange({
selected: this.selected,
content: b && b.textContent || this.item.content
});
},
itemTap: function(a, b) {
this.setSelected(b.rowIndex), this.doSelect({
selected: this.item,
content: this.item.content
});
},
itemSelect: function(a, b) {
if (b.originator != this) return !0;
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
this.addRemoveClass("off", !this.value), this.$.contentOn.setShowing(this.value), this.$.contentOff.setShowing(!this.value), this.setActive(this.value);
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
updateValue: function(a) {
this.disabled || (this.setValue(a), this.doChange({
value: this.value
}));
},
tap: function() {
this.updateValue(!this.value);
},
dragstart: function(a, b) {
if (b.horizontal) return b.preventDefault(), this.dragging = !0, this.dragged = !1, !0;
},
drag: function(a, b) {
if (this.dragging) {
var c = b.dx;
return Math.abs(c) > 10 && (this.updateValue(c > 0), this.dragged = !0), !0;
}
},
dragfinish: function(a, b) {
this.dragging = !1, this.dragged && b.preventTap();
}
});

// Toolbar.js

enyo.kind({
name: "onyx.Toolbar",
classes: "onyx onyx-toolbar onyx-toolbar-inline",
handlers: {
onHide: "render"
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
applyPosition: function(a) {
var b = "";
for (n in a) b += n + ":" + a[n] + (isNaN(a[n]) ? "; " : "px; ");
this.addStyles(b);
},
adjustPosition: function(a) {
if (this.showing && this.hasNode()) {
var b = this.node.getBoundingClientRect();
b.top + b.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), b.left + b.width > window.innerWidth && (this.applyPosition({
"margin-left": -b.width,
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
barClassesChanged: function(a) {
this.$.bar.removeClass(a), this.$.bar.addClass(this.barClasses);
},
showStripesChanged: function() {
this.$.bar.addRemoveClass("striped", this.showStripes);
},
animateStripesChanged: function() {
this.$.bar.addRemoveClass("animated", this.animateStripes);
},
progressChanged: function() {
this.progress = this.clampValue(this.min, this.max, this.progress);
var a = this.calcPercent(this.progress);
this.updateBarPosition(a);
},
clampValue: function(a, b, c) {
return Math.max(a, Math.min(c, b));
},
calcRatio: function(a) {
return (a - this.min) / (this.max - this.min);
},
calcPercent: function(a) {
return this.calcRatio(a) * 100;
},
updateBarPosition: function(a) {
this.$.bar.applyStyle("width", a + "%");
},
animateProgressTo: function(a) {
this.$.progressAnimator.play({
startValue: this.progress,
endValue: a,
node: this.hasNode()
});
},
progressAnimatorStep: function(a) {
return this.setProgress(a.value), !0;
},
progressAnimatorComplete: function(a) {
return this.doAnimateProgressFinish(a), !0;
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
addZIndex: function(a) {
enyo.indexOf(a, this.zStack) < 0 && this.zStack.push(a);
},
removeZIndex: function(a) {
enyo.remove(a, this.zStack);
},
showAtZIndex: function(a) {
this.addZIndex(a), a !== undefined && this.setZIndex(a), this.show();
},
hideAtZIndex: function(a) {
this.removeZIndex(a);
if (!this.zStack.length) this.hide(); else {
var b = this.zStack[this.zStack.length - 1];
this.setZIndex(b);
}
},
setZIndex: function(a) {
this.zIndex = a, this.applyStyle("z-index", a);
},
make: function() {
return this;
}
}), enyo.kind({
name: "onyx.scrimSingleton",
kind: null,
constructor: function(a, b) {
this.instanceName = a, enyo.setObject(this.instanceName, this), this.props = b || {};
},
make: function() {
var a = new onyx.Scrim(this.props);
return enyo.setObject(this.instanceName, a), a;
},
showAtZIndex: function(a) {
var b = this.make();
b.showAtZIndex(a);
},
hideAtZIndex: enyo.nop,
show: function() {
var a = this.make();
a.show();
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
var a = this.calcPercent(this.value);
this.updateKnobPosition(a), this.lockBar && this.setProgress(this.value);
},
updateKnobPosition: function(a) {
this.$.knob.applyStyle("left", a + "%");
},
calcKnobPosition: function(a) {
var b = a.clientX - this.hasNode().getBoundingClientRect().left;
return b / this.getBounds().width * (this.max - this.min) + this.min;
},
dragstart: function(a, b) {
if (b.horizontal) return b.preventDefault(), this.dragging = !0, !0;
},
drag: function(a, b) {
if (this.dragging) {
var c = this.calcKnobPosition(b);
return this.setValue(c), this.doChanging({
value: this.value
}), !0;
}
},
dragfinish: function(a, b) {
return this.dragging = !1, b.preventTap(), this.doChange({
value: this.value
}), !0;
},
tap: function(a, b) {
if (this.tappable) {
var c = this.calcKnobPosition(b);
return this.tapped = !0, this.animateTo(c), !0;
}
},
animateTo: function(a) {
this.$.animator.play({
startValue: this.value,
endValue: a,
node: this.hasNode()
});
},
animatorStep: function(a) {
return this.setValue(a.value), !0;
},
animatorComplete: function(a) {
return this.tapped && (this.tapped = !1, this.doChange({
value: this.value
})), this.doAnimateFinish(a), !0;
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
hold: function(a, b) {
this.tapHighlight && onyx.Item.addFlyweightClass(this.controlParent || this, "onyx-highlight", b);
},
release: function(a, b) {
this.tapHighlight && onyx.Item.removeFlyweightClass(this.controlParent || this, "onyx-highlight", b);
},
statics: {
addFlyweightClass: function(a, b, c, d) {
var e = c.flyweight;
if (e) {
var f = d != undefined ? d : c.index;
e.performOnRow(f, function() {
a.hasClass(b) ? a.setClassAttribute(a.getClassAttribute()) : a.addClass(b);
}), a.removeClass(b);
}
},
removeFlyweightClass: function(a, b, c, d) {
var e = c.flyweight;
if (e) {
var f = d != undefined ? d : c.index;
e.performOnRow(f, function() {
a.hasClass(b) ? a.removeClass(b) : a.setClassAttribute(a.getClassAttribute());
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
classes: "onyx-more-menu",
prepend: !0
} ]
} ],
initComponents: function() {
this.menuClass && this.menuClass.length > 0 && !this.$.menu.hasClass(this.menuClass) && this.$.menu.addClass(this.menuClass), this.createChrome(this.tools), this.inherited(arguments);
},
reflow: function() {
this.inherited(arguments), this.isContentOverflowing() ? (this.$.nard.show(), this.popItem() && this.reflow()) : this.tryPushItem() ? this.reflow() : this.$.menu.children.length || (this.$.nard.hide(), this.$.menu.hide());
},
activated: function(a, b) {
this.addRemoveClass("active", b.originator.active);
},
popItem: function() {
var a = this.findCollapsibleItem();
if (a) {
this.movedClass && this.movedClass.length > 0 && !a.hasClass(this.movedClass) && a.addClass(this.movedClass), this.$.menu.addChild(a);
var b = this.$.menu.hasNode();
return b && a.hasNode() && a.insertNodeInParent(b), !0;
}
},
pushItem: function() {
var a = this.$.menu.children, b = a[0];
if (b) {
this.movedClass && this.movedClass.length > 0 && b.hasClass(this.movedClass) && b.removeClass(this.movedClass), this.$.client.addChild(b);
var c = this.$.client.hasNode();
if (c && b.hasNode()) {
var d = undefined, e;
for (var f = 0; f < this.$.client.children.length; f++) {
var g = this.$.client.children[f];
if (g.toolbarIndex != undefined && g.toolbarIndex != f) {
d = g, e = f;
break;
}
}
if (d && d.hasNode()) {
b.insertNodeInParent(c, d.node);
var h = this.$.client.children.pop();
this.$.client.children.splice(e, 0, h);
} else b.appendNodeToParent(c);
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
var a = this.$.client.children, b = a[a.length - 1].hasNode();
if (b) return b.offsetLeft + b.offsetWidth > this.$.client.node.clientWidth;
}
},
findCollapsibleItem: function() {
var a = this.$.client.children;
for (var b = a.length - 1; c = a[b]; b--) {
if (!c.unmoveable) return c;
c.toolbarIndex == undefined && (c.toolbarIndex = b);
}
}
});

// webview.js

enyo.kind({
name: "AjaxWebView",
kind: "Control",
components: [ {
kind: "onyx.Scrim",
name: "scrim2",
classes: "onyx-scrim enyo-fit",
floating: !1,
showing: !1,
components: [ {
kind: "onyx.Spinner"
} ]
}, {
kind: "onyx.Button",
classes: "floating-menu",
name: "backb",
content: "Back",
disabled: !0,
onclick: "goPrevious"
}, {
kind: "onyx.Button",
classes: "floating-menu-right",
content: "Forward",
name: "forb",
disabled: !0,
onclick: "goNext"
}, {
kind: "Scroller",
classes: "enyo-fit",
components: [ {
name: "content",
onclick: "catchtap",
content: "",
allowHtml: !0
} ]
} ],
create: function() {
this.inherited(arguments), this.pages = [], this.base = "", this.method = "GET", this.postBody = "", this.currentPage = 0, this.setupMenu = !1, this.loadit();
},
goPrevious: function() {
return this.currentPage--, this.loadit(), !0;
},
goNext: function() {
return this.currentPage++, this.loadit(), !0;
},
loadit: function() {
this.currentPage <= 0 ? this.$.backb.setDisabled(!0) : this.$.backb.setDisabled(!1), this.currentPage + 1 >= this.pages.length ? this.$.forb.setDisabled(!0) : this.$.forb.setDisabled(!1);
if (this.pages[this.currentPage]) {
var a = this.pages[this.currentPage].src;
this.base = this.pages[this.currentPage].src.slice(0, this.pages[this.currentPage].src.indexOf("/", 8) + 1), this.base == "" && (this.base = a + "/"), this.$.scrim2.showAtZIndex(10), (new enyo.Ajax({
cacheBust: !1,
method: this.method,
postBody: this.postBody,
url: "" + a,
handleAs: "text"
})).response(this, function(a, b) {
var c = 0;
this.method = "GET", this.postBody = "", this.$.scrim2.hideAtZIndex(10);
var d = b.replace(/href=\"\//g, 'href="' + this.base);
d = d.replace(/src=\"\//g, 'src="' + this.base), this.$.content.setContent(d), this.$.content.render(), this.processChapter();
}).error(this, function(a, b) {
console.log("error " + b), this.method = "GET", this.postBody = "", this.$.scrim2.hideAtZIndex(10);
}).go();
}
},
call: function(a, b) {
this.secondbase = b, this.$.forb.disabled === !1 ? (this.currentPage++, this.pages[this.currentPage] = {
src: a
}, this.pages.length > this.currentPage + 1 && this.pages.splice(this.currentPage + 1, this.pages.length - this.currentPage)) : (this.currentPage = this.pages.length, this.pages[this.pages.length] = {
src: a
}), this.loadit();
},
processChapter: function() {
if (this.$.content.hasNode()) {
var node = this.$.content.node, nodes = node.children;
for (i = 0; i < nodes.length; i++) {
if (nodes[i].nodeName == "SCRIPT") {
console.log("found script");
try {
eval(nodes[i].innerText);
} catch (e) {
console.log(e);
}
}
nodes[i].baseURI = this.base;
}
}
this.$.content.render();
},
catchtap: function(a, b) {
if (b.target.form && b.target.type == "submit") {
this.method = b.target.form.method;
if (this.method == "post") {
b.target.form.action.match("http") ? c = b.target.form.action : c = this.pages[this.currentPage].src, this.postBody = "";
for (i = 0; i < b.target.form.length - 1; i++) this.postBody = this.postBody + b.target.form[i].name + "=" + b.target.form[i].value, b.target.form.length - 1 != i + 1 && (this.postBody = this.postBody + "&");
} else {
b.target.form.action.match("http") ? c = b.target.form.action + "?" : c = this.pages[this.currentPage].src + "?";
for (i = 0; i < b.target.form.length - 1; i++) c = c + b.target.form[i].name + "=" + b.target.form[i].value, b.target.form.length - 1 != i + 1 && (c += "&");
}
console.log(c), console.log(this.postBody);
} else if (b.target.href) if (b.target.href.match(/file:/g)) c = this.secondbase + b.target.innerHTML, this.secondbase = c; else var c = b.target.href; else if (b.target.parentNode.href) var c = b.target.parentNode.href;
return console.log("tapped"), b.preventDefault(), c != "" && this.call(c, this.secondbase), !0;
},
catchhold: function(a, b) {
var c = "";
b.target.href.match(/file:/g) ? c = this.secondbase + b.target.innerHTML : c = b.target.href, this.doSendHold({
link: c
});
}
});

// App.js

var QuickRef = QuickRef || {};

enyo.kind({
name: "CategoriesToolbar",
kind: "onyx.Toolbar",
components: [ {
content: "Categories"
} ]
}), enyo.kind({
name: "CategoriesListItem",
ontap: "categoriesListItemTap",
classes: "enyo-item enyo-border-box",
style: "padding: 2px;border-top:1px white solid;border-bottom:1px lightgray solid;",
components: [ {
name: "name",
style: "padding: 8px;"
} ],
ontap: "categoriesTapped"
}), QuickRef.categories = [ {
category: "Frameworks",
articles: []
}, {
category: "Mobile developpement",
articles: [ {
subject: "",
url: ""
} ]
}, {
category: "vim",
articles: [ {
subject: "the Vundle package manager",
url: "https://github.com/gmarik/vundle/"
}, {
subject: "Using vimgrep",
url: "http://mwop.net/blog/194-Vimgrep-and-Vim-Project.html"
}, {
subject: "The quickfix window",
url: "http://vimdoc.sourceforge.net/htmldoc/quickfix.html#quickfix-window"
}, {
subject: "Using xdebug in vim",
url: "https://github.com/vim-scripts/Xdebug"
} ]
}, {
category: "git",
articles: [ {
subject: "Diff on a whole git tree",
content: "git diff-tree -u de5503198ffa325a4a65fbc34d396bd0f2bfbec4",
url: "http://www.kernel.org/pub/software/scm/git/docs/git-diff-tree.html"
}, {
subject: "An introduction to git",
url: "https://github.com/codeforamerica/skillshares/tree/master/git_basics"
}, {
subject: "git submodules",
url: "http://git-scm.com/book/en/Git-Tools-Submodules"
} ]
}, {
category: "Mobile",
articles: []
}, {
category: "Deploiment",
articles: []
} ], QuickRef.currentCategory = QuickRef.categories[0], enyo.kind({
name: "CategoriesList",
kind: "List",
fit: !0,
touch: !0,
onSetupItem: "categoriesListSetupItem",
components: [ {
kind: "CategoriesListItem"
} ],
categoriesTapped: function(a, b) {
console.log("A\u00efeeeee! " + b.index + " - " + window.innerWidth), window.QuickRef.currentCategory = window.QuickRef.categories[b.index], this.container.container.$.stuffPane.$.stuffList.setCount(QuickRef.currentCategory.articles.length), this.container.container.$.stuffPane.$.stuffList.refresh(), window.innerWidth < 800 && this.container.container.next();
}
}), enyo.kind({
name: "CategoriesLeftpane",
style: "width: 320px; background-color: #eeeeee;",
kind: "FittableRows",
components: [ {
kind: "CategoriesToolbar"
}, {
kind: "CategoriesList"
} ],
categoriesListSetupItem: function(a, b) {
return this.$.categoriesList.$.categoriesListItem.$.name.setContent(QuickRef.categories[b.index].category), !0;
}
}), enyo.kind({
name: "StuffToolbar",
kind: onyx.Toolbar,
components: [ {
kind: "onyx.Grabber",
ontap: "stuffGrabberTapped"
}, {
content: "Stuff"
} ],
stuffGrabberTapped: function(a, b) {
a.container.container.container.previous();
}
}), enyo.kind({
name: "StuffListItem",
ontap: "stuffListItemTap",
classes: "enyo-item enyo-border-box",
style: "padding: 2px;border-top:1px white solid;border-bottom:1px lightgray solid;",
components: [ {
name: "name",
style: "padding: 8px;"
} ]
}), enyo.kind({
name: "StuffList",
kind: "List",
fit: !0,
touch: !0,
onSetupItem: "stuffListSetupItem",
components: [ {
kind: "StuffListItem"
} ]
}), enyo.kind({
name: "StuffPane",
kind: "FittableRows",
style: "background-color: #eeeeee; border-left: 1px lightgray solid",
components: [ {
kind: "StuffToolbar"
}, {
kind: "StuffList"
} ],
stuffListSetupItem: function(a, b) {
this.$.stuffList.$.stuffListItem.$.name.setContent(QuickRef.currentCategory.articles[b.index].subject);
}
}), enyo.kind({
name: "App",
realtimeFit: !0,
kind: "Panels",
arrangerKind: "CollapsingArranger",
components: [ {
kind: "CategoriesLeftpane"
}, {
kind: "StuffPane"
} ],
create: function() {
this.inherited(arguments), this.$.categoriesLeftpane.$.categoriesList.setCount(QuickRef.categories.length), this.$.stuffPane.$.stuffList.setCount(QuickRef.currentCategory.articles.length);
},
rendered: function() {
this.inherited(arguments), this.$.categoriesLeftpane.$.categoriesList.select(0), this.$.stuffPane.$.stuffList.select(0);
}
});
