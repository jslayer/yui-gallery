YUI.add("gallery-adjet",function(e,t){function l(e){return e.replace(/([A-Z])/g,function(e){return"_"+e.toLowerCase()})}var n,r=e.config.doc,i="contentBox",s="Change",o=function(){return Array.prototype.slice.call(arguments).join("-")},u="sectionElementChange",a="<div></div>",f=e.Lang;n=e.Base.create("adjet",e.Widget,[],{CSS_SECTION_PREFIX:"section",initializer:function(){this._sections=this._getStaticSections(),e.before(this._renderSections,this,"renderUI"),e.before(this._bindSections,this,"bindUI"),this.on("sectionsChange",this._defSectionsChangeFn,this),this.publish(u,{emitFacade:!0}),this.on(u,this._onSectionElementChangeFn,this)},_getStaticSections:function(){var t=this._getClasses(),n={},r,i;for(r=t.length-1;r>=0;r--)i=t[r].SECTIONS,i&&e.mix(n,i,!0,null,0,!0);return n},_renderSections:function(){var t=this.get(i),n=this.get("sections");n!==!0?e.Array.each(n,function(e){this._renderSection(e,t)},this):e.Object.each(this._sections,function(e,n){this._renderSection(n,t)},this)},_renderSection:function(t,n,i){var s=this._sections[t],f,c;if(s){f=s._node=e.Node.create("<div></div>",r),c=s.cssName||o.apply(null,this.CSS_SECTION_PREFIX?[this.CSS_SECTION_PREFIX,l(t)]:[l(t)]),s.cssName!==!1&&f.addClass(c),e.Object.each(s.elements,function(n,i){var s,h,p;n._section=t,h=n.value?n.value:this.get(n.attribute||i),p=n.template||a,s=n._node=e.Node.create(p,r),h=this._elementFormatter(n,h),this.fire(u,{element:n,value:h}),n.cssName!==!1&&s.addClass(n.cssName||o(c,l(i))),f.append(s)},this);switch(i){case"before":case"after":n.insert(f,i);break;default:n.append(f)}}},_bindSections:function(){e.Object.each(this._sections,this._bindSection,this)},_bindSection:function(t){t._node&&e.Object.each(t.elements,function(e,t){!e.value&&e.listen!==!1&&this.after((e.attribute||t)+s,this._elementValueChangedFn,this,e)},this)},_elementValueChangedFn:function(e,t){var n=e.newVal;t._node&&(n=this._elementFormatter(t,n),this.fire(u,{element:t,value:n}))},_onSectionElementChangeFn:function(e){var t=e.element,n=e.value,r;r=t.selector?t._node.one(t.selector):t._node,r&&(!t.targetAttr&&t.allowHTML?r.setHTML(n):r.set(t.targetAttr?t.targetAttr:"text",n))},_elementFormatter:function(e,t){var n;return f.isFunction(e.formatter)&&(n=e.formatter.call(this,t,e)),f.isValue(n)?n:t},_defSectionsChangeFn:function(t){var n=t.newVal||[],r=this.get(i);e.Object.each(this._sections,function(t,i){var s,o,u,a,l;t._node&&n.indexOf(i)===-1?(t._node.remove(!0),delete t._node):n.length&&!t._node&&n.indexOf(i)>-1&&(s=r,n.length===1?s=r:(u=n.indexOf(i),e.Array.each(n,function(e,t){i!==e&&this._sections[e]._node&&(t>u?l=f.isValue(l)?Math.min(l,t):t:a=f.isValue(a)?Math.max(a,t):t)},this)),this._renderSection(i,s,o),this._bindSection(t))},this)}},{ATTRS:{sections:{value:!0}},SECTIONS:{}}),e.Adget=n},"1.0.0-dev",{requires:["base-build","widget"]});
