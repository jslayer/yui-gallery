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
_yuitest_coverage["build/gallery-adjet/gallery-adjet.js"].code=["YUI.add('gallery-adjet', function (Y, NAME) {","","/**"," * todo - write some docs"," * todo - write some tests"," */","","var Adjet,","  doc = Y.config.doc,","  CB = 'contentBox',","  _getClassName = function() {","    return Array.prototype.slice.call(arguments).join('-');","  },","  EVT_EC = 'sectionElementChange',","  ELEMENT_TEMPLATE = '<div></div>';","","Adjet = Y.Base.create('adjet', Y.Widget, [ ], {","  //todo - implement getElement(sectionName,name)","  //todo - implement getSectionNode(sectionName)","  //todo - show how elements could be changed in inherited classes","  //todo - try to find the way of using nodes for section & elements from existing dom","  //todo - add element `drag` inside & outside the sections; i.e: moveElement(name, srcSection, targetSection, after)","  //todo - implement runtime addElement(section, name, elementData)","  //todo - implement listen sectionsChange : destroy old sections & elements, create new sections & elements","  //todo - add global support of form elements","  //todo - implement complex attributes support","  //todo - implement attributes of Y.Model || Y.LazyModel support","  //todo - add some events fired when element's value changed ? bidirectional element <=> attr","  //todo - add destructors","  //todo - implement nested renderUI/bindUI/syncUI support (it looks like Y.Widgets do not allow this by default)","  initializer : function() {","    this._sections = this._getStaticSections();","","    Y.before(this._renderSections, this, 'renderUI');","","    Y.before(this._bindSections, this, 'bindUI');","","    this.publish(EVT_EC, {","      emitFacade : true","    });","","    this.on(EVT_EC, this._onSectionElementChangeFn, this);","  },","  _getStaticSections : function() {","    var classes = this._getClasses(),","      sections = {},","      i, p;","","    for (i = classes.length - 1; i >= 0; i--) {","      p = classes[i].SECTIONS;","      if (p) {","        Y.mix(sections, p, true, null, 0, true);","      }","    }","    return sections;","  },","  _renderSections : function() {","    var cb = this.get(CB),","      sections = this.get('sections');","","    if (sections !== true) {","      Y.Array.each(sections, function(name) {","        this._renderSection(name, cb);","      }, this);","    }","    else {","      Y.Object.each(this._sections, function(elements, name) {","        this._renderSection(name, cb);","      }, this);","    }","  },","  _renderSection : function(sName, target) {","    var section = this._sections[sName],","      sectionNode;","","    if (section) {","      //we will create a node here","      sectionNode = section._node = Y.Node.create('<div></div>', doc);","","      //do not add any css classes if cssName === false","      if (section.cssName !== false) {","        sectionNode.addClass(section.cssName || _getClassName('section', sName));","      }","","      //render elements","      Y.Object.each(section.elements, function(element, eName) {","        var node,","          value,","          template;","","        element._section = sName;","","        value = element.value ? element.value : this.get(element.attribute || eName);","","        value = this._elementFormatter(element, value);","","        template = element.template || ELEMENT_TEMPLATE;","","        node = element._node = Y.Node.create(template, doc);","","        this.fire(EVT_EC, {","          element : element,","          value   : value","        });","","        //do not add any css classes if cssName === false","        if (element.cssName !== false) {","          node.addClass(element.cssName || _getClassName('section', sName, eName));","        }","","        sectionNode.append(node);","      }, this);","","      target.append(sectionNode);","    }","  },","  _bindSections : function() {","    Y.Object.each(this._sections, function(section) {","      if (section._node) {","        Y.Object.each(section.elements, function(element, name) {","          if (!element.value && element.listen !== false) {","            this.after((element.attribute || name) + 'Change', this._elementValueChangedFn, this, element);","          }","        }, this);","      }","    }, this);","  },","  _elementValueChangedFn : function(e, element) {","    var value = e.newVal;","","    if (element._node) {","","      value = this._elementFormatter(element, value);","","      this.fire(EVT_EC, {","        element : element,","        value   : value","      });","    }","  },","  _onSectionElementChangeFn : function(e) {","    var element = e.element,","      value = e.value,","      node;","","    node = element.targetSelector ? element._node.one(element.targetSelector) : element._node;","","    if (node) {","      if (!element.targetAttr && element.allowHTML) {","        node.setHTML(value);","      }","      else {","        node.set(element.targetAttr ? element.targetAttr : 'text', value);","      }","    }","  },","  _elementFormatter : function(element, value) {","    var _value;","","    if (Y.Lang.isFunction(element.formatter)) {","      _value = element.formatter.call(this, value, element);","    }","","    return Y.Lang.isValue(_value) ? _value : value;","  }","}, {","  ATTRS : {","    sections : {","      value : true","    }","  },","  SECTIONS : {}","});","","Y.Adget = Adjet;","","}, '@VERSION@', {\"requires\": [\"base-build\", \"widget\"]});"];
_yuitest_coverage["build/gallery-adjet/gallery-adjet.js"].lines = {"1":0,"8":0,"12":0,"17":0,"32":0,"34":0,"36":0,"38":0,"42":0,"45":0,"49":0,"50":0,"51":0,"52":0,"55":0,"58":0,"61":0,"62":0,"63":0,"67":0,"68":0,"73":0,"76":0,"78":0,"81":0,"82":0,"86":0,"87":0,"91":0,"93":0,"95":0,"97":0,"99":0,"101":0,"107":0,"108":0,"111":0,"114":0,"118":0,"119":0,"120":0,"121":0,"122":0,"129":0,"131":0,"133":0,"135":0,"142":0,"146":0,"148":0,"149":0,"150":0,"153":0,"158":0,"160":0,"161":0,"164":0,"175":0};
_yuitest_coverage["build/gallery-adjet/gallery-adjet.js"].functions = {"_getClassName:11":0,"initializer:31":0,"_getStaticSections:44":0,"(anonymous 2):62":0,"(anonymous 3):67":0,"_renderSections:57":0,"(anonymous 4):86":0,"_renderSection:72":0,"(anonymous 6):120":0,"(anonymous 5):118":0,"_bindSections:117":0,"_elementValueChangedFn:128":0,"_onSectionElementChangeFn:141":0,"_elementFormatter:157":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-adjet/gallery-adjet.js"].coveredLines = 58;
_yuitest_coverage["build/gallery-adjet/gallery-adjet.js"].coveredFunctions = 15;
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
  _getClassName = function() {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_getClassName", 11);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 12);
return Array.prototype.slice.call(arguments).join('-');
  },
  EVT_EC = 'sectionElementChange',
  ELEMENT_TEMPLATE = '<div></div>';

_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 17);
Adjet = Y.Base.create('adjet', Y.Widget, [ ], {
  //todo - implement getElement(sectionName,name)
  //todo - implement getSectionNode(sectionName)
  //todo - show how elements could be changed in inherited classes
  //todo - try to find the way of using nodes for section & elements from existing dom
  //todo - add element `drag` inside & outside the sections; i.e: moveElement(name, srcSection, targetSection, after)
  //todo - implement runtime addElement(section, name, elementData)
  //todo - implement listen sectionsChange : destroy old sections & elements, create new sections & elements
  //todo - add global support of form elements
  //todo - implement complex attributes support
  //todo - implement attributes of Y.Model || Y.LazyModel support
  //todo - add some events fired when element's value changed ? bidirectional element <=> attr
  //todo - add destructors
  //todo - implement nested renderUI/bindUI/syncUI support (it looks like Y.Widgets do not allow this by default)
  initializer : function() {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "initializer", 31);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 32);
this._sections = this._getStaticSections();

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 34);
Y.before(this._renderSections, this, 'renderUI');

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 36);
Y.before(this._bindSections, this, 'bindUI');

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 38);
this.publish(EVT_EC, {
      emitFacade : true
    });

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 42);
this.on(EVT_EC, this._onSectionElementChangeFn, this);
  },
  _getStaticSections : function() {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_getStaticSections", 44);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 45);
var classes = this._getClasses(),
      sections = {},
      i, p;

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 49);
for (i = classes.length - 1; i >= 0; i--) {
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 50);
p = classes[i].SECTIONS;
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 51);
if (p) {
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 52);
Y.mix(sections, p, true, null, 0, true);
      }
    }
    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 55);
return sections;
  },
  _renderSections : function() {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_renderSections", 57);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 58);
var cb = this.get(CB),
      sections = this.get('sections');

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 61);
if (sections !== true) {
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 62);
Y.Array.each(sections, function(name) {
        _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 2)", 62);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 63);
this._renderSection(name, cb);
      }, this);
    }
    else {
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 67);
Y.Object.each(this._sections, function(elements, name) {
        _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 3)", 67);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 68);
this._renderSection(name, cb);
      }, this);
    }
  },
  _renderSection : function(sName, target) {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_renderSection", 72);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 73);
var section = this._sections[sName],
      sectionNode;

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 76);
if (section) {
      //we will create a node here
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 78);
sectionNode = section._node = Y.Node.create('<div></div>', doc);

      //do not add any css classes if cssName === false
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 81);
if (section.cssName !== false) {
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 82);
sectionNode.addClass(section.cssName || _getClassName('section', sName));
      }

      //render elements
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 86);
Y.Object.each(section.elements, function(element, eName) {
        _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 4)", 86);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 87);
var node,
          value,
          template;

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 91);
element._section = sName;

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 93);
value = element.value ? element.value : this.get(element.attribute || eName);

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 95);
value = this._elementFormatter(element, value);

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 97);
template = element.template || ELEMENT_TEMPLATE;

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 99);
node = element._node = Y.Node.create(template, doc);

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 101);
this.fire(EVT_EC, {
          element : element,
          value   : value
        });

        //do not add any css classes if cssName === false
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 107);
if (element.cssName !== false) {
          _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 108);
node.addClass(element.cssName || _getClassName('section', sName, eName));
        }

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 111);
sectionNode.append(node);
      }, this);

      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 114);
target.append(sectionNode);
    }
  },
  _bindSections : function() {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_bindSections", 117);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 118);
Y.Object.each(this._sections, function(section) {
      _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 5)", 118);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 119);
if (section._node) {
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 120);
Y.Object.each(section.elements, function(element, name) {
          _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 6)", 120);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 121);
if (!element.value && element.listen !== false) {
            _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 122);
this.after((element.attribute || name) + 'Change', this._elementValueChangedFn, this, element);
          }
        }, this);
      }
    }, this);
  },
  _elementValueChangedFn : function(e, element) {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_elementValueChangedFn", 128);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 129);
var value = e.newVal;

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 131);
if (element._node) {

      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 133);
value = this._elementFormatter(element, value);

      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 135);
this.fire(EVT_EC, {
        element : element,
        value   : value
      });
    }
  },
  _onSectionElementChangeFn : function(e) {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_onSectionElementChangeFn", 141);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 142);
var element = e.element,
      value = e.value,
      node;

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 146);
node = element.targetSelector ? element._node.one(element.targetSelector) : element._node;

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 148);
if (node) {
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 149);
if (!element.targetAttr && element.allowHTML) {
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 150);
node.setHTML(value);
      }
      else {
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 153);
node.set(element.targetAttr ? element.targetAttr : 'text', value);
      }
    }
  },
  _elementFormatter : function(element, value) {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_elementFormatter", 157);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 158);
var _value;

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 160);
if (Y.Lang.isFunction(element.formatter)) {
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 161);
_value = element.formatter.call(this, value, element);
    }

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 164);
return Y.Lang.isValue(_value) ? _value : value;
  }
}, {
  ATTRS : {
    sections : {
      value : true
    }
  },
  SECTIONS : {}
});

_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 175);
Y.Adget = Adjet;

}, '@VERSION@', {"requires": ["base-build", "widget"]});
