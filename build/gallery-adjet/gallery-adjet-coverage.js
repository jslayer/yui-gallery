if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/gallery-adjet/gallery-adjet.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-adjet/gallery-adjet.js",
    code: []
};
_yuitest_coverage["build/gallery-adjet/gallery-adjet.js"].code=["YUI.add('gallery-adjet', function (Y, NAME) {","","/**"," * todo - write some docs"," * todo - write some tests"," */","","var Adjet,","  doc = Y.config.doc,","  CB = 'contentBox',","  CHANGE = 'Change',","  _getClassName = function() {","    return Array.prototype.slice.call(arguments).join('-');","  },","  EVT_EC = 'sectionElementChange',","  ELEMENT_TEMPLATE = '<div></div>';","","function toUnderscore(value){","  return value.replace(/([A-Z])/g, function($1){return \"_\"+$1.toLowerCase();});","}","","Adjet = Y.Base.create('adjet', Y.Widget, [ ], {","  //todo - add elements attribute (to provide the list of elements & its order in section)","  //todo - implement getElement(sectionName,name)","  //todo - implement getSectionNode(sectionName)","  //todo - show how elements could be changed in inherited classes","  //todo - try to find the way of using nodes for section & elements from existing dom","  //todo - add element `drag` inside & outside the sections; i.e: moveElement(name, srcSection, targetSection, after)","  //todo - implement runtime addElement(section, name, elementData)","  //todo *** implement listen sectionsChange : destroy old sections & elements, create new sections & elements","  //todo - add global support of form elements","  //todo - implement complex attributes support","  //todo - implement attributes of Y.Model || Y.LazyModel support","  //todo - add some events fired when element's value changed ? bidirectional element <=> attr","  //todo - add destructors","  //todo - implement nested renderUI/bindUI/syncUI support (it looks like Y.Widgets do not allow this by default)","  initializer : function() {","    this._sections = this._getStaticSections();","","    Y.before(this._renderSections, this, 'renderUI');","","    Y.before(this._bindSections, this, 'bindUI');","","    //this.on('sectionsChange', this._defSectionsChangeFn, this);","","    this.publish(EVT_EC, {","      emitFacade : true","    });","","    this.on(EVT_EC, this._onSectionElementChangeFn, this);","  },","  _getStaticSections : function() {","    var classes = this._getClasses(),","      sections = {},","      i, p;","","    for (i = classes.length - 1; i >= 0; i--) {","      p = classes[i].SECTIONS;","      if (p) {","        Y.mix(sections, p, true, null, 0, true);","      }","    }","    return sections;","  },","  _renderSections : function() {","    var cb = this.get(CB),","      sections = this.get('sections');","","    if (sections !== true) {","      Y.Array.each(sections, function(name) {","        this._renderSection(name, cb);","      }, this);","    }","    else {","      Y.Object.each(this._sections, function(elements, name) {","        this._renderSection(name, cb);","      }, this);","    }","  },","  _renderSection : function(sName, target) {","    var section = this._sections[sName],","      sectionNode,","      sectionCssName;","","    if (section) {","      //we will create a node here","      sectionNode = section._node = Y.Node.create('<div></div>', doc);","","      //do not add any css classes if cssName === false","      sectionCssName = section.cssName || _getClassName('section', toUnderscore(sName));","","      if (section.cssName !== false) {","        sectionNode.addClass(sectionCssName);","      }","","      //render elements","      Y.Object.each(section.elements, function(element, eName) {","        var node,","          value,","          template;","","        element._section = sName;","","        value = element.value ? element.value : this.get(element.attribute || eName);","","        template = element.template || ELEMENT_TEMPLATE;","","        node = element._node = Y.Node.create(template, doc);","","        value = this._elementFormatter(element, value);","","        this.fire(EVT_EC, {","          element : element,","          value   : value","        });","","        //do not add any css classes if cssName === false","        if (element.cssName !== false) {","          node.addClass(element.cssName || _getClassName(sectionCssName, toUnderscore(eName)));","        }","","        sectionNode.append(node);","      }, this);","","      target.append(sectionNode);","    }","  },","  _bindSections : function() {","    Y.Object.each(this._sections, function(section) {","      if (section._node) {","        Y.Object.each(section.elements, function(element, name) {","          if (!element.value && element.listen !== false) {","            this.after((element.attribute || name) + CHANGE, this._elementValueChangedFn, this, element);","          }","        }, this);","      }","    }, this);","  },","  _elementValueChangedFn : function(e, element) {","    var value = e.newVal;","","    if (element._node) {","","      value = this._elementFormatter(element, value);","","      this.fire(EVT_EC, {","        element : element,","        value   : value","      });","    }","  },","  _onSectionElementChangeFn : function(e) {","    var element = e.element,","      value = e.value,","      node;","","    node = element.selector ? element._node.one(element.selector) : element._node;","","    if (node) {","      if (!element.targetAttr && element.allowHTML) {","        node.setHTML(value);","      }","      else {","        node.set(element.targetAttr ? element.targetAttr : 'text', value);","      }","    }","  },","  _elementFormatter : function(element, value) {","    var _value;","","    if (Y.Lang.isFunction(element.formatter)) {","      _value = element.formatter.call(this, value, element);","    }","","    return Y.Lang.isValue(_value) ? _value : value;","  },","  _defSectionsChangeFn : function(e) {","    console.log(e);","  }","}, {","  ATTRS : {","    sections : {","      value : true","    }","  },","  SECTIONS : {}","});","","Y.Adget = Adjet;","","","}, '@VERSION@', {\"requires\": [\"base-build\", \"widget\"]});"];
_yuitest_coverage["build/gallery-adjet/gallery-adjet.js"].lines = {"1":0,"8":0,"13":0,"18":0,"19":0,"22":0,"38":0,"40":0,"42":0,"46":0,"50":0,"53":0,"57":0,"58":0,"59":0,"60":0,"63":0,"66":0,"69":0,"70":0,"71":0,"75":0,"76":0,"81":0,"85":0,"87":0,"90":0,"92":0,"93":0,"97":0,"98":0,"102":0,"104":0,"106":0,"108":0,"110":0,"112":0,"118":0,"119":0,"122":0,"125":0,"129":0,"130":0,"131":0,"132":0,"133":0,"140":0,"142":0,"144":0,"146":0,"153":0,"157":0,"159":0,"160":0,"161":0,"164":0,"169":0,"171":0,"172":0,"175":0,"178":0,"189":0};
_yuitest_coverage["build/gallery-adjet/gallery-adjet.js"].functions = {"_getClassName:12":0,"(anonymous 2):19":0,"toUnderscore:18":0,"initializer:37":0,"_getStaticSections:52":0,"(anonymous 3):70":0,"(anonymous 4):75":0,"_renderSections:65":0,"(anonymous 5):97":0,"_renderSection:80":0,"(anonymous 7):131":0,"(anonymous 6):129":0,"_bindSections:128":0,"_elementValueChangedFn:139":0,"_onSectionElementChangeFn:152":0,"_elementFormatter:168":0,"_defSectionsChangeFn:177":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-adjet/gallery-adjet.js"].coveredLines = 62;
_yuitest_coverage["build/gallery-adjet/gallery-adjet.js"].coveredFunctions = 18;
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 1);
YUI.add('gallery-adjet', function (Y, NAME) {

/**
 * todo - write some docs
 * todo - write some tests
 */

_yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 8);
var Adjet,
  doc = Y.config.doc,
  CB = 'contentBox',
  CHANGE = 'Change',
  _getClassName = function() {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_getClassName", 12);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 13);
return Array.prototype.slice.call(arguments).join('-');
  },
  EVT_EC = 'sectionElementChange',
  ELEMENT_TEMPLATE = '<div></div>';

_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 18);
function toUnderscore(value){
  _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "toUnderscore", 18);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 19);
return value.replace(/([A-Z])/g, function($1){_yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 2)", 19);
return "_"+$1.toLowerCase();});
}

_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 22);
Adjet = Y.Base.create('adjet', Y.Widget, [ ], {
  //todo - add elements attribute (to provide the list of elements & its order in section)
  //todo - implement getElement(sectionName,name)
  //todo - implement getSectionNode(sectionName)
  //todo - show how elements could be changed in inherited classes
  //todo - try to find the way of using nodes for section & elements from existing dom
  //todo - add element `drag` inside & outside the sections; i.e: moveElement(name, srcSection, targetSection, after)
  //todo - implement runtime addElement(section, name, elementData)
  //todo *** implement listen sectionsChange : destroy old sections & elements, create new sections & elements
  //todo - add global support of form elements
  //todo - implement complex attributes support
  //todo - implement attributes of Y.Model || Y.LazyModel support
  //todo - add some events fired when element's value changed ? bidirectional element <=> attr
  //todo - add destructors
  //todo - implement nested renderUI/bindUI/syncUI support (it looks like Y.Widgets do not allow this by default)
  initializer : function() {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "initializer", 37);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 38);
this._sections = this._getStaticSections();

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 40);
Y.before(this._renderSections, this, 'renderUI');

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 42);
Y.before(this._bindSections, this, 'bindUI');

    //this.on('sectionsChange', this._defSectionsChangeFn, this);

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 46);
this.publish(EVT_EC, {
      emitFacade : true
    });

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 50);
this.on(EVT_EC, this._onSectionElementChangeFn, this);
  },
  _getStaticSections : function() {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_getStaticSections", 52);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 53);
var classes = this._getClasses(),
      sections = {},
      i, p;

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 57);
for (i = classes.length - 1; i >= 0; i--) {
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 58);
p = classes[i].SECTIONS;
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 59);
if (p) {
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 60);
Y.mix(sections, p, true, null, 0, true);
      }
    }
    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 63);
return sections;
  },
  _renderSections : function() {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_renderSections", 65);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 66);
var cb = this.get(CB),
      sections = this.get('sections');

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 69);
if (sections !== true) {
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 70);
Y.Array.each(sections, function(name) {
        _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 3)", 70);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 71);
this._renderSection(name, cb);
      }, this);
    }
    else {
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 75);
Y.Object.each(this._sections, function(elements, name) {
        _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 4)", 75);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 76);
this._renderSection(name, cb);
      }, this);
    }
  },
  _renderSection : function(sName, target) {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_renderSection", 80);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 81);
var section = this._sections[sName],
      sectionNode,
      sectionCssName;

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 85);
if (section) {
      //we will create a node here
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 87);
sectionNode = section._node = Y.Node.create('<div></div>', doc);

      //do not add any css classes if cssName === false
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 90);
sectionCssName = section.cssName || _getClassName('section', toUnderscore(sName));

      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 92);
if (section.cssName !== false) {
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 93);
sectionNode.addClass(sectionCssName);
      }

      //render elements
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 97);
Y.Object.each(section.elements, function(element, eName) {
        _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 5)", 97);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 98);
var node,
          value,
          template;

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 102);
element._section = sName;

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 104);
value = element.value ? element.value : this.get(element.attribute || eName);

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 106);
template = element.template || ELEMENT_TEMPLATE;

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 108);
node = element._node = Y.Node.create(template, doc);

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 110);
value = this._elementFormatter(element, value);

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 112);
this.fire(EVT_EC, {
          element : element,
          value   : value
        });

        //do not add any css classes if cssName === false
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 118);
if (element.cssName !== false) {
          _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 119);
node.addClass(element.cssName || _getClassName(sectionCssName, toUnderscore(eName)));
        }

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 122);
sectionNode.append(node);
      }, this);

      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 125);
target.append(sectionNode);
    }
  },
  _bindSections : function() {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_bindSections", 128);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 129);
Y.Object.each(this._sections, function(section) {
      _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 6)", 129);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 130);
if (section._node) {
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 131);
Y.Object.each(section.elements, function(element, name) {
          _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 7)", 131);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 132);
if (!element.value && element.listen !== false) {
            _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 133);
this.after((element.attribute || name) + CHANGE, this._elementValueChangedFn, this, element);
          }
        }, this);
      }
    }, this);
  },
  _elementValueChangedFn : function(e, element) {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_elementValueChangedFn", 139);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 140);
var value = e.newVal;

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 142);
if (element._node) {

      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 144);
value = this._elementFormatter(element, value);

      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 146);
this.fire(EVT_EC, {
        element : element,
        value   : value
      });
    }
  },
  _onSectionElementChangeFn : function(e) {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_onSectionElementChangeFn", 152);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 153);
var element = e.element,
      value = e.value,
      node;

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 157);
node = element.selector ? element._node.one(element.selector) : element._node;

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 159);
if (node) {
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 160);
if (!element.targetAttr && element.allowHTML) {
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 161);
node.setHTML(value);
      }
      else {
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 164);
node.set(element.targetAttr ? element.targetAttr : 'text', value);
      }
    }
  },
  _elementFormatter : function(element, value) {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_elementFormatter", 168);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 169);
var _value;

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 171);
if (Y.Lang.isFunction(element.formatter)) {
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 172);
_value = element.formatter.call(this, value, element);
    }

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 175);
return Y.Lang.isValue(_value) ? _value : value;
  },
  _defSectionsChangeFn : function(e) {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_defSectionsChangeFn", 177);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 178);
console.log(e);
  }
}, {
  ATTRS : {
    sections : {
      value : true
    }
  },
  SECTIONS : {}
});

_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 189);
Y.Adget = Adjet;


}, '@VERSION@', {"requires": ["base-build", "widget"]});
