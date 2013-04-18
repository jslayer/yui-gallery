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
_yuitest_coverage["build/gallery-adjet/gallery-adjet.js"].code=["YUI.add('gallery-adjet', function (Y, NAME) {","","/**"," * todo - write some docs"," * todo - write some tests"," */","","var Adjet,","  doc = Y.config.doc,","  CB = 'contentBox',","  CHANGE = 'Change',","  _getClassName = function() {","    return Array.prototype.slice.call(arguments).join('-');","  },","  EVT_EC = 'sectionElementChange',","  ELEMENT_TEMPLATE = '<div></div>',","  L = Y.Lang;","","function toUnderscore(value){","  return value.replace(/([A-Z])/g, function($1){return \"_\"+$1.toLowerCase();});","}","","Adjet = Y.Base.create('adjet', Y.Widget, [ ], {","  //todo - provide the way of setting up the section cssName prefix (per instance ?)","  //todo - add elements attribute (to provide the list of elements & its order in section)","  //todo - implement getElement(sectionName,name)","  //todo - implement getSectionNode(sectionName)","  //todo - show how elements could be changed in inherited classes","  //todo - try to find the way of using nodes for section & elements from existing dom","  //todo - add element `drag` inside & outside the sections; i.e: moveElement(name, srcSection, targetSection, after)","  //todo - implement runtime addElement(section, name, elementData)","  //todo *** implement listen sectionsChange : destroy old sections & elements, create new sections & elements","  //todo - add global support of form elements","  //todo - implement complex attributes support","  //todo - implement attributes of Y.Model || Y.LazyModel support","  //todo - add some events fired when element's value changed ? bidirectional element <=> attr","  //todo - add destructors","  //todo - implement nested renderUI/bindUI/syncUI support (it looks like Y.Widgets do not allow this by default)","  CSS_SECTION_PREFIX : 'section',","  initializer : function() {","    this._sections = this._getStaticSections();","","    Y.before(this._renderSections, this, 'renderUI');","","    Y.before(this._bindSections, this, 'bindUI');","","    this.on('sectionsChange', this._defSectionsChangeFn, this);","","    this.publish(EVT_EC, {","      emitFacade : true","    });","","    this.on(EVT_EC, this._onSectionElementChangeFn, this);","  },","  _getStaticSections : function() {","    var classes = this._getClasses(),","      sections = {},","      i, p;","","    for (i = classes.length - 1; i >= 0; i--) {","      p = classes[i].SECTIONS;","      if (p) {","        Y.mix(sections, p, true, null, 0, true);","      }","    }","    return sections;","  },","  _renderSections : function() {","    var cb = this.get(CB),","      sections = this.get('sections');","","    if (sections !== true) {","      Y.Array.each(sections, function(name) {","        this._renderSection(name, cb);","      }, this);","    }","    else {","      Y.Object.each(this._sections, function(elements, name) {","        this._renderSection(name, cb);","      }, this);","    }","  },","  /**","   *","   * @param sName","   * @param target","   * @param {String?} where","   * @private","   */","  _renderSection : function(sName, target, where) {","    var section = this._sections[sName],","      sectionNode,","      sectionCssName;","","    if (section) {","      //we will create a node here","      sectionNode = section._node = Y.Node.create('<div></div>', doc);","","      //do not add any css classes if cssName === false","      //todo - refactor it","      sectionCssName = section.cssName || _getClassName.apply(","        null,","        this.CSS_SECTION_PREFIX ? [this.CSS_SECTION_PREFIX, toUnderscore(sName)] : [toUnderscore(sName)]","      );","","      if (section.cssName !== false) {","        sectionNode.addClass(sectionCssName);","      }","","      //render elements","      Y.Object.each(section.elements, function(element, eName) {","        var node,","          value,","          template;","","        element._section = sName;","","        value = element.value ? element.value : this.get(element.attribute || eName);","","        template = element.template || ELEMENT_TEMPLATE;","","        node = element._node = Y.Node.create(template, doc);","","        value = this._elementFormatter(element, value);","","        this.fire(EVT_EC, {","          element : element,","          value   : value","        });","","        //do not add any css classes if cssName === false","        if (element.cssName !== false) {","          node.addClass(element.cssName || _getClassName(sectionCssName, toUnderscore(eName)));","        }","","        sectionNode.append(node);","      }, this);","","      //noinspection FallthroughInSwitchStatementJS","      switch(where) {","        case 'before':","        case 'after':","          target.insert(sectionNode, where);","          break;","        default:","          target.append(sectionNode);","      }","    }","  },","  _bindSections : function() {","    Y.Object.each(this._sections, this._bindSection, this);","  },","  _bindSection : function(section) {","    if (section._node) {","      Y.Object.each(section.elements, function(element, name) {","        if (!element.value && element.listen !== false) {","          this.after((element.attribute || name) + CHANGE, this._elementValueChangedFn, this, element);","        }","      }, this);","    }","  },","  _elementValueChangedFn : function(e, element) {","    var value = e.newVal;","","    if (element._node) {","","      value = this._elementFormatter(element, value);","","      this.fire(EVT_EC, {","        element : element,","        value   : value","      });","    }","  },","  _onSectionElementChangeFn : function(e) {","    var element = e.element,","      value = e.value,","      node;","","    node = element.selector ? element._node.one(element.selector) : element._node;","","    if (node) {","      if (!element.targetAttr && element.allowHTML) {","        node.setHTML(value);","      }","      else {","        node.set(element.targetAttr ? element.targetAttr : 'text', value);","      }","    }","  },","  _elementFormatter : function(element, value) {","    var _value;","","    if (L.isFunction(element.formatter)) {","      _value = element.formatter.call(this, value, element);","    }","","    return L.isValue(_value) ? _value : value;","  },","  _defSectionsChangeFn : function(e) {","    var current = e.newVal || [ ],","      cb = this.get(CB);","","    //go thought the sections; destroy those that are not it the list; and initiate newly added","    Y.Object.each(this._sections, function(section, sectionName) {","      var target, where, sectionIndex, iLeft, iRight/*, dLeft, dRight*/;","","      if (section._node && current.indexOf(sectionName) === -1) {","        /**","         * Destroy the section:","         * - destroy the nodes","         * - detach listeners","         */","        section._node.remove(true);","        //todo - detach listeners","        delete section._node;","      }","      else if (current.length && !section._node && current.indexOf(sectionName) > -1) {","","        target = cb;","","        /**","         * Create the section","         * We should find out where to pass the section","         */","        if (current.length === 1) {","          target = cb;","        }","        else {","          sectionIndex = current.indexOf(sectionName);","","          //find the nearest rendered sibling section","          Y.Array.each(current, function(name, index) {","            if (sectionName !== name && this._sections[name]._node) {","              if (index > sectionIndex) {","                iRight = L.isValue(iRight) ? Math.min(iRight, index) : index;","              }","              else {","                iLeft = L.isValue(iLeft) ? Math.max(iLeft, index) : index;","              }","            }","          }, this);","","          /*if (L.isValue(iLeft)) {","            dLeft = Math.abs(sectionIndex - iLeft);","          }","","          if (L.isValue(iRight)) {","            dRight = Math.abs(sectionIndex - iRight);","          }","","          if (dLeft > dRight) {","","          }*/","        }","","        this._renderSection(sectionName, target, where);","","        /**","         * Bind the section","         */","        this._bindSection(section);","      }","    }, this);","  }","}, {","  ATTRS : {","    sections : {","      value : true","    }","  },","  SECTIONS : {}","});","","Y.Adget = Adjet;","","","}, '1.0.0-dev', {\"requires\": [\"base-build\", \"widget\"]});"];
_yuitest_coverage["build/gallery-adjet/gallery-adjet.js"].lines = {"1":0,"8":0,"13":0,"19":0,"20":0,"23":0,"41":0,"43":0,"45":0,"47":0,"49":0,"53":0,"56":0,"60":0,"61":0,"62":0,"63":0,"66":0,"69":0,"72":0,"73":0,"74":0,"78":0,"79":0,"91":0,"95":0,"97":0,"101":0,"106":0,"107":0,"111":0,"112":0,"116":0,"118":0,"120":0,"122":0,"124":0,"126":0,"132":0,"133":0,"136":0,"140":0,"143":0,"144":0,"146":0,"151":0,"154":0,"155":0,"156":0,"157":0,"163":0,"165":0,"167":0,"169":0,"176":0,"180":0,"182":0,"183":0,"184":0,"187":0,"192":0,"194":0,"195":0,"198":0,"201":0,"205":0,"206":0,"208":0,"214":0,"216":0,"218":0,"220":0,"226":0,"227":0,"230":0,"233":0,"234":0,"235":0,"236":0,"239":0,"257":0,"262":0,"275":0};
_yuitest_coverage["build/gallery-adjet/gallery-adjet.js"].functions = {"_getClassName:12":0,"(anonymous 2):20":0,"toUnderscore:19":0,"initializer:40":0,"_getStaticSections:55":0,"(anonymous 3):73":0,"(anonymous 4):78":0,"_renderSections:68":0,"(anonymous 5):111":0,"_renderSection:90":0,"_bindSections:150":0,"(anonymous 6):155":0,"_bindSection:153":0,"_elementValueChangedFn:162":0,"_onSectionElementChangeFn:175":0,"_elementFormatter:191":0,"(anonymous 8):233":0,"(anonymous 7):205":0,"_defSectionsChangeFn:200":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-adjet/gallery-adjet.js"].coveredLines = 83;
_yuitest_coverage["build/gallery-adjet/gallery-adjet.js"].coveredFunctions = 20;
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
  ELEMENT_TEMPLATE = '<div></div>',
  L = Y.Lang;

_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 19);
function toUnderscore(value){
  _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "toUnderscore", 19);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 20);
return value.replace(/([A-Z])/g, function($1){_yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 2)", 20);
return "_"+$1.toLowerCase();});
}

_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 23);
Adjet = Y.Base.create('adjet', Y.Widget, [ ], {
  //todo - provide the way of setting up the section cssName prefix (per instance ?)
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
  CSS_SECTION_PREFIX : 'section',
  initializer : function() {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "initializer", 40);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 41);
this._sections = this._getStaticSections();

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 43);
Y.before(this._renderSections, this, 'renderUI');

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 45);
Y.before(this._bindSections, this, 'bindUI');

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 47);
this.on('sectionsChange', this._defSectionsChangeFn, this);

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 49);
this.publish(EVT_EC, {
      emitFacade : true
    });

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 53);
this.on(EVT_EC, this._onSectionElementChangeFn, this);
  },
  _getStaticSections : function() {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_getStaticSections", 55);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 56);
var classes = this._getClasses(),
      sections = {},
      i, p;

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 60);
for (i = classes.length - 1; i >= 0; i--) {
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 61);
p = classes[i].SECTIONS;
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 62);
if (p) {
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 63);
Y.mix(sections, p, true, null, 0, true);
      }
    }
    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 66);
return sections;
  },
  _renderSections : function() {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_renderSections", 68);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 69);
var cb = this.get(CB),
      sections = this.get('sections');

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 72);
if (sections !== true) {
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 73);
Y.Array.each(sections, function(name) {
        _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 3)", 73);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 74);
this._renderSection(name, cb);
      }, this);
    }
    else {
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 78);
Y.Object.each(this._sections, function(elements, name) {
        _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 4)", 78);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 79);
this._renderSection(name, cb);
      }, this);
    }
  },
  /**
   *
   * @param sName
   * @param target
   * @param {String?} where
   * @private
   */
  _renderSection : function(sName, target, where) {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_renderSection", 90);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 91);
var section = this._sections[sName],
      sectionNode,
      sectionCssName;

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 95);
if (section) {
      //we will create a node here
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 97);
sectionNode = section._node = Y.Node.create('<div></div>', doc);

      //do not add any css classes if cssName === false
      //todo - refactor it
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 101);
sectionCssName = section.cssName || _getClassName.apply(
        null,
        this.CSS_SECTION_PREFIX ? [this.CSS_SECTION_PREFIX, toUnderscore(sName)] : [toUnderscore(sName)]
      );

      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 106);
if (section.cssName !== false) {
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 107);
sectionNode.addClass(sectionCssName);
      }

      //render elements
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 111);
Y.Object.each(section.elements, function(element, eName) {
        _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 5)", 111);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 112);
var node,
          value,
          template;

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 116);
element._section = sName;

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 118);
value = element.value ? element.value : this.get(element.attribute || eName);

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 120);
template = element.template || ELEMENT_TEMPLATE;

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 122);
node = element._node = Y.Node.create(template, doc);

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 124);
value = this._elementFormatter(element, value);

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 126);
this.fire(EVT_EC, {
          element : element,
          value   : value
        });

        //do not add any css classes if cssName === false
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 132);
if (element.cssName !== false) {
          _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 133);
node.addClass(element.cssName || _getClassName(sectionCssName, toUnderscore(eName)));
        }

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 136);
sectionNode.append(node);
      }, this);

      //noinspection FallthroughInSwitchStatementJS
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 140);
switch(where) {
        case 'before':
        case 'after':
          _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 143);
target.insert(sectionNode, where);
          _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 144);
break;
        default:
          _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 146);
target.append(sectionNode);
      }
    }
  },
  _bindSections : function() {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_bindSections", 150);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 151);
Y.Object.each(this._sections, this._bindSection, this);
  },
  _bindSection : function(section) {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_bindSection", 153);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 154);
if (section._node) {
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 155);
Y.Object.each(section.elements, function(element, name) {
        _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 6)", 155);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 156);
if (!element.value && element.listen !== false) {
          _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 157);
this.after((element.attribute || name) + CHANGE, this._elementValueChangedFn, this, element);
        }
      }, this);
    }
  },
  _elementValueChangedFn : function(e, element) {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_elementValueChangedFn", 162);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 163);
var value = e.newVal;

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 165);
if (element._node) {

      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 167);
value = this._elementFormatter(element, value);

      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 169);
this.fire(EVT_EC, {
        element : element,
        value   : value
      });
    }
  },
  _onSectionElementChangeFn : function(e) {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_onSectionElementChangeFn", 175);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 176);
var element = e.element,
      value = e.value,
      node;

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 180);
node = element.selector ? element._node.one(element.selector) : element._node;

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 182);
if (node) {
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 183);
if (!element.targetAttr && element.allowHTML) {
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 184);
node.setHTML(value);
      }
      else {
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 187);
node.set(element.targetAttr ? element.targetAttr : 'text', value);
      }
    }
  },
  _elementFormatter : function(element, value) {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_elementFormatter", 191);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 192);
var _value;

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 194);
if (L.isFunction(element.formatter)) {
      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 195);
_value = element.formatter.call(this, value, element);
    }

    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 198);
return L.isValue(_value) ? _value : value;
  },
  _defSectionsChangeFn : function(e) {
    _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "_defSectionsChangeFn", 200);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 201);
var current = e.newVal || [ ],
      cb = this.get(CB);

    //go thought the sections; destroy those that are not it the list; and initiate newly added
    _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 205);
Y.Object.each(this._sections, function(section, sectionName) {
      _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 7)", 205);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 206);
var target, where, sectionIndex, iLeft, iRight/*, dLeft, dRight*/;

      _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 208);
if (section._node && current.indexOf(sectionName) === -1) {
        /**
         * Destroy the section:
         * - destroy the nodes
         * - detach listeners
         */
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 214);
section._node.remove(true);
        //todo - detach listeners
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 216);
delete section._node;
      }
      else {_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 218);
if (current.length && !section._node && current.indexOf(sectionName) > -1) {

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 220);
target = cb;

        /**
         * Create the section
         * We should find out where to pass the section
         */
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 226);
if (current.length === 1) {
          _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 227);
target = cb;
        }
        else {
          _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 230);
sectionIndex = current.indexOf(sectionName);

          //find the nearest rendered sibling section
          _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 233);
Y.Array.each(current, function(name, index) {
            _yuitest_coverfunc("build/gallery-adjet/gallery-adjet.js", "(anonymous 8)", 233);
_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 234);
if (sectionName !== name && this._sections[name]._node) {
              _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 235);
if (index > sectionIndex) {
                _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 236);
iRight = L.isValue(iRight) ? Math.min(iRight, index) : index;
              }
              else {
                _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 239);
iLeft = L.isValue(iLeft) ? Math.max(iLeft, index) : index;
              }
            }
          }, this);

          /*if (L.isValue(iLeft)) {
            dLeft = Math.abs(sectionIndex - iLeft);
          }

          if (L.isValue(iRight)) {
            dRight = Math.abs(sectionIndex - iRight);
          }

          if (dLeft > dRight) {

          }*/
        }

        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 257);
this._renderSection(sectionName, target, where);

        /**
         * Bind the section
         */
        _yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 262);
this._bindSection(section);
      }}
    }, this);
  }
}, {
  ATTRS : {
    sections : {
      value : true
    }
  },
  SECTIONS : {}
});

_yuitest_coverline("build/gallery-adjet/gallery-adjet.js", 275);
Y.Adget = Adjet;


}, '1.0.0-dev', {"requires": ["base-build", "widget"]});
