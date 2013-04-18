/**
 * todo - write some docs
 * todo - write some tests
 */

var Adjet,
  doc = Y.config.doc,
  CB = 'contentBox',
  _getClassName = function() {
    return Array.prototype.slice.call(arguments).join('-');
  },
  EVT_EC = 'sectionElementChange',
  ELEMENT_TEMPLATE = '<div></div>';

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
    this._sections = this._getStaticSections();

    Y.before(this._renderSections, this, 'renderUI');

    Y.before(this._bindSections, this, 'bindUI');

    this.publish(EVT_EC, {
      emitFacade : true
    });

    this.on(EVT_EC, this._onSectionElementChangeFn, this);
  },
  _getStaticSections : function() {
    var classes = this._getClasses(),
      sections = {},
      i, p;

    for (i = classes.length - 1; i >= 0; i--) {
      p = classes[i].SECTIONS;
      if (p) {
        Y.mix(sections, p, true, null, 0, true);
      }
    }
    return sections;
  },
  _renderSections : function() {
    var cb = this.get(CB),
      sections = this.get('sections');

    if (sections !== true) {
      Y.Array.each(sections, function(name) {
        this._renderSection(name, cb);
      }, this);
    }
    else {
      Y.Object.each(this._sections, function(elements, name) {
        this._renderSection(name, cb);
      }, this);
    }
  },
  _renderSection : function(sName, target) {
    var section = this._sections[sName],
      sectionNode;

    if (section) {
      //we will create a node here
      sectionNode = section._node = Y.Node.create('<div></div>', doc);

      //do not add any css classes if cssName === false
      if (section.cssName !== false) {
        sectionNode.addClass(section.cssName || _getClassName('section', sName));
      }

      //render elements
      Y.Object.each(section.elements, function(element, eName) {
        var node,
          value,
          template;

        element._section = sName;

        value = element.value ? element.value : this.get(element.attribute || eName);

        value = this._elementFormatter(element, value);

        template = element.template || ELEMENT_TEMPLATE;

        node = element._node = Y.Node.create(template, doc);

        this.fire(EVT_EC, {
          element : element,
          value   : value
        });

        //do not add any css classes if cssName === false
        if (element.cssName !== false) {
          node.addClass(element.cssName || _getClassName('section', sName, eName));
        }

        sectionNode.append(node);
      }, this);

      target.append(sectionNode);
    }
  },
  _bindSections : function() {
    Y.Object.each(this._sections, function(section) {
      if (section._node) {
        Y.Object.each(section.elements, function(element, name) {
          if (!element.value && element.listen !== false) {
            this.after((element.attribute || name) + 'Change', this._elementValueChangedFn, this, element);
          }
        }, this);
      }
    }, this);
  },
  _elementValueChangedFn : function(e, element) {
    var value = e.newVal;

    if (element._node) {

      value = this._elementFormatter(element, value);

      this.fire(EVT_EC, {
        element : element,
        value   : value
      });
    }
  },
  _onSectionElementChangeFn : function(e) {
    var element = e.element,
      value = e.value,
      node;

    node = element.targetSelector ? element._node.one(element.targetSelector) : element._node;

    if (node) {
      if (!element.targetAttr && element.allowHTML) {
        node.setHTML(value);
      }
      else {
        node.set(element.targetAttr ? element.targetAttr : 'text', value);
      }
    }
  },
  _elementFormatter : function(element, value) {
    var _value;

    if (Y.Lang.isFunction(element.formatter)) {
      _value = element.formatter.call(this, value, element);
    }

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

Y.Adget = Adjet;