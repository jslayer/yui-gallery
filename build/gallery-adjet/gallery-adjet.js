YUI.add('gallery-adjet', function (Y, NAME) {

/**
 * todo - write some docs
 * todo - write some tests
 */

var Adjet,
  doc = Y.config.doc,
  CB = 'contentBox',
  CHANGE = 'Change',
  _getClassName = function() {
    return Array.prototype.slice.call(arguments).join('-');
  },
  EVT_EC = 'sectionElementChange',
  ELEMENT_TEMPLATE = '<div></div>',
  L = Y.Lang;

function toUnderscore(value){
  return value.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
}

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
    this._sections = this._getStaticSections();

    Y.before(this._renderSections, this, 'renderUI');

    Y.before(this._bindSections, this, 'bindUI');

    this.on('sectionsChange', this._defSectionsChangeFn, this);

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
  /**
   *
   * @param sName
   * @param target
   * @param {String?} where
   * @private
   */
  _renderSection : function(sName, target, where) {
    var section = this._sections[sName],
      sectionNode,
      sectionCssName;

    if (section) {
      //we will create a node here
      sectionNode = section._node = Y.Node.create('<div></div>', doc);

      //do not add any css classes if cssName === false
      //todo - refactor it
      sectionCssName = section.cssName || _getClassName.apply(
        null,
        this.CSS_SECTION_PREFIX ? [this.CSS_SECTION_PREFIX, toUnderscore(sName)] : [toUnderscore(sName)]
      );

      if (section.cssName !== false) {
        sectionNode.addClass(sectionCssName);
      }

      //render elements
      Y.Object.each(section.elements, function(element, eName) {
        var node,
          value,
          template;

        element._section = sName;

        value = element.value ? element.value : this.get(element.attribute || eName);

        template = element.template || ELEMENT_TEMPLATE;

        node = element._node = Y.Node.create(template, doc);

        value = this._elementFormatter(element, value);

        this.fire(EVT_EC, {
          element : element,
          value   : value
        });

        //do not add any css classes if cssName === false
        if (element.cssName !== false) {
          node.addClass(element.cssName || _getClassName(sectionCssName, toUnderscore(eName)));
        }

        sectionNode.append(node);
      }, this);

      //noinspection FallthroughInSwitchStatementJS
      switch(where) {
        case 'before':
        case 'after':
          target.insert(sectionNode, where);
          break;
        default:
          target.append(sectionNode);
      }
    }
  },
  _bindSections : function() {
    Y.Object.each(this._sections, this._bindSection, this);
  },
  _bindSection : function(section) {
    if (section._node) {
      Y.Object.each(section.elements, function(element, name) {
        if (!element.value && element.listen !== false) {
          this.after((element.attribute || name) + CHANGE, this._elementValueChangedFn, this, element);
        }
      }, this);
    }
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

    node = element.selector ? element._node.one(element.selector) : element._node;

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

    if (L.isFunction(element.formatter)) {
      _value = element.formatter.call(this, value, element);
    }

    return L.isValue(_value) ? _value : value;
  },
  _defSectionsChangeFn : function(e) {
    var current = e.newVal || [ ],
      cb = this.get(CB);

    //go thought the sections; destroy those that are not it the list; and initiate newly added
    Y.Object.each(this._sections, function(section, sectionName) {
      var target, where, sectionIndex, iLeft, iRight/*, dLeft, dRight*/;

      if (section._node && current.indexOf(sectionName) === -1) {
        /**
         * Destroy the section:
         * - destroy the nodes
         * - detach listeners
         */
        section._node.remove(true);
        //todo - detach listeners
        delete section._node;
      }
      else if (current.length && !section._node && current.indexOf(sectionName) > -1) {

        target = cb;

        /**
         * Create the section
         * We should find out where to pass the section
         */
        if (current.length === 1) {
          target = cb;
        }
        else {
          sectionIndex = current.indexOf(sectionName);

          //find the nearest rendered sibling section
          Y.Array.each(current, function(name, index) {
            if (sectionName !== name && this._sections[name]._node) {
              if (index > sectionIndex) {
                iRight = L.isValue(iRight) ? Math.min(iRight, index) : index;
              }
              else {
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

        this._renderSection(sectionName, target, where);

        /**
         * Bind the section
         */
        this._bindSection(section);
      }
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

Y.Adget = Adjet;


}, '1.0.0-dev', {"requires": ["base-build", "widget"]});
