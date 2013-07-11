YUI.add('a2', function (Y, NAME) {
    var A = Y.Array,
        O = Y.Object,
        L = Y.Lang,
        EMPTY = '',
        EMPTY_RE = /^\s*$/,
        A2;

    //todo - add expression support ?
    //todo - add filters/modificators support
    //todo - add nested (x.y.z) values rendering
    //todo - add nested (x.y.z) model support of NodeModel
    //todo - !!!all the main features should be provided inside the core
    //todo - add string translation support (based on Y.Intl)
    //todo - data-model should create a local scope for children
    //todo - NodeAttribute should use prefixes
    //todo - add even/odd classes to repeat
    //todo - NodeModel - x.y should mean - y prop of x object (native/model/lazyModel)
    //todo - add readOnly support
    //todo - add selected property for <select>
    //todo - add switch..on="modelName" support (when, default)
    //todo - add radio support
    //todo - add generic form support (formName, errors, patterns for elements)

    A2 = function A2() {
        A2.superclass.constructor.apply(this, arguments);
    };

    A2.NAME = 'A2';

    Y.extend(A2, Y.Base, {
        initializer : function() {
            this.publish('pre', {
                emitFacade: true
            });

            this.publish('main', {
                emitFacade: true
            });

            //todo - move plugins loading into separate method
            //todo - make good skeleton for plugins
            this.plug(PluginNodeClick);
            this.plug(PluginTextModel);
            this.plug(PluginNodeModel);
            this.plug(PluginNodeRepeat);
            this.plug(PluginNodeShow);
            this.plug(PluginNodeAttributes);

            var src = this.get('srcNode').getDOMNode();

            this.onceAfter('initializedChange', function() {
                console.time('tree');
                //todo - join processTre & parse method ?
                this.processTree(
                    this.parse(src)
                );
                console.timeEnd('tree');
            });

            //todo - move the process into separate (render) method ?

            src.style.visibility = 'visible';
            //todo - use some good way of visibility change
        },
        parse : function(node, parent) {
            var tree = {};

            var element = {
                node   : node,
                parent : parent || false
            };

            var dive;

            dive = this.fire('pre', {
                element : element
            });

            if (dive && node.childNodes && node.childNodes.length > 0) {
                element.children = [];

                A.each(node.childNodes, function(child) {
                    var go = false, parsed;

                    switch(child.nodeType) {
                        case 1://ELEMENT_NODE
                            go = true;
                            break;
                        case 3://TEXT_NODE
                            if (!EMPTY_RE.test(child.textContent)) {//todo - probably should use `new RegExp` here
                                go = true;
                            }
                            break;
                    }

                    if (go) {
                        element.children.push(
                            this.parse(child, element)
                        );
                    }
                }, this);
            }

            return element;
        },
        processTree : function(tree, data) {
            this.fire('main', {
                element : tree,
                data    : data
            });
            if (tree.children) {
                A.each(tree.children, function(child) {
                    this.processTree(child, data);
                }, this);
            }
        },
        processString : function(string, e, element) {
            var value, name, type,parts;

            type = A2.TYPES.GLOBAL;
            parts = string.match(A2.EXPR.PARSE);
            name = parts[2];

            switch(parts[1]) {
                case '&.':
                    type = A2.TYPES.LOCAL;

                    if (e.data && e.data[name]) {
                        value = e.data[name];
                    }
                    break;
                default:
                    value = this.get(name);
            }

            return {
                value : value || EMPTY,
                type  : type,
                name  : name
            };
        }
    }, {
        NAME : 'A2',
        ATTRS : {
            srcNode : {
                setter : function(v) {
                    return L.type(v) ? Y.one(v) : v;
                }
            }
        },
        EXPR : {
            SPLIT : /({{\s*[&.a-zA-Z0-9]+\s*}})/g,
            PARSE : /(&.)?(\w+)/,
            TEST  : /^{{\s*[&.a-zA-Z0-9]+\s*}}$/g
        },
        TYPES : {
            GLOBAL : 'global',
            LOCAL  : 'local'
        }
    });

    function PluginTextModel(cfg){
        this.host = cfg.host;
        PluginTextModel.superclass.constructor.apply(this, arguments);
    }

    Y.extend(PluginTextModel, Y.Plugin.Base, {
        initializer : function() {
            this.onHostEvent('main', function(e) {
                if (e.element.node.nodeType === 3) {
                    this.main(e.element, e);
                }
            });
        },
        main : function(element, e) {
            var text = L.trim(element.node.wholeText);

            var frag = document.createDocumentFragment();

            A.each(text.split(A2.EXPR.SPLIT), function(item) {
                var node;

                if (item) {
                    if (new RegExp(A2.EXPR.TEST).test(item)) {//note - should create new regExpr
                        var stringProcessResult = this.host.processString(item, e, element);

                        if (stringProcessResult.type === A2.TYPES.GLOBAL) {
                            this.afterHostEvent(stringProcessResult.name + 'Change', function(e) {
                                node.nodeValue = e.newVal || EMPTY;
                            });
                        }

                        node = document.createTextNode(stringProcessResult.value);
                    }
                    else {
                        node = document.createTextNode(item);
                    }

                    if (node) {
                        frag.appendChild(node);
                    }
                }
            }, this);


            element.node.parentNode.replaceChild(frag, element.node);
        }
    }, {
        NS : 'PluginTextModel'
    });

    function PluginNodeModel(cfg) {
        this.host = cfg.host;
        PluginNodeModel.superclass.constructor.apply(this, arguments);
    }

    Y.extend(PluginNodeModel, Y.Plugin.Base, {
        initializer : function() {
            this.onHostEvent('main', function(e) {
                if (e.element.node.nodeType === 1) {
                    this.main(e.element, e);
                }
            });
        },
        main : function(element, e) {
            var node = element.node,
                rawModel = node.getAttribute('data-model');

            if (rawModel) {
                if (!element.data) {
                    element.data = {};
                }
                element.data.nodeModel = rawModel;

                switch(node.nodeName) {
                    case 'INPUT':
                        switch(node.type) {
                            case 'text':
                                node.value = this.host.get(rawModel);

                                //from input
                                (new Y.Node(node)).after(['keyup', 'change'], function(e) {
                                    if (node.value !== this.host.get(rawModel)) {
                                        this.host.set(rawModel, node.value);
                                    }
                                }, this);

                                //from model
                                this.host.after(rawModel + 'Change', function(e) {
                                    if (e.newVal !== node.value) {
                                        node.value = e.newVal;
                                    }
                                });
                                break;
                            case 'checkbox':
                                var current = this.host.get(rawModel);

                                if (L.isUndefined(current)) {
                                    this.host.set(rawModel, node.checked && node.value);
                                }
                                else {
                                    node.checked = !!current;
                                }

                                (new Y.Node(node)).after('change', function(e) {
                                    if (node.checked !== !!this.host.get(rawModel)) {
                                        this.host.set(rawModel, node.checked && node.value);
                                    }
                                }, this);

                                this.afterHostEvent(rawModel + 'Change', function(e) {
                                    if (!!e.newVal !== node.checked) {
                                        node.checked = !!e.newVal;
                                    }
                                });
                                break;
                        }

                        break;
                    //todo - add support of other form elements: textarea, select etc
                }
            }
        }
    }, {
        NS : 'PluginNodeModel'
    });

    function PluginNodeRepeat(cfg) {
        this.host = cfg.host;
        PluginNodeRepeat.superclass.constructor.apply(this, arguments);
    }

    Y.extend(PluginNodeRepeat, Y.Plugin.Base, {
        initializer : function() {
            this.onHostEvent('pre', function(e) {
                if (e.element.node.nodeType === 1 && e.element.node.getAttribute('data-repeat')) {
                    this.pre(e.element, e);
                    e.halt(true);
                }
            });
        },
        pre : function(element, e) {
            var rptString = element.node.getAttribute('data-repeat');

            var parts = rptString.match(PluginNodeRepeat.EXPR.PARSE);

            //console.log(parts.length);

            if (parts.length === 6) {

                if (!element.data) {
                    element.data = {};
                }

                element.data.NodeRepeat = {
                    modelName : parts[5],
                    localName : parts[4],
                    indexName : parts[3] || false,
                    template  : L.trim(element.node.innerHTML)
                };

                this.process(element);

                this.afterHostEvent(parts[5] + 'Change', function(e) {
                    this.process(element);
                }, this);
            }
        },
        process : function(element) {
            var data, frag, wrapper;

            data = element.data.NodeRepeat;

            frag = document.createDocumentFragment();

            wrapper = document.createElement('div');

            O.each(this.host.get(data.modelName), function(item, index) {
                var local, tree;

                local = {};

                wrapper.innerHTML = data.template;

                if (data.indexName) {
                    local[data.indexName] = index;
                }

                local[data.localName] = item;

                tree = this.host.parse(wrapper);

                tree.parent = element;

                this.host.processTree(tree, local);

                A.each(wrapper.childNodes, function(child) {
                    frag.appendChild(child);
                });
            }, this);

            element.node.innerHTML = EMPTY;
            element.node.appendChild(frag);
        }
    }, {
        NS: 'PluginNodeRepeat',
        EXPR : {
            PARSE : /(((\w+)\s*\:\s*)?(\w+))\s*in\s*(\w+)/ //todo - should be better
        }
    });

    function PluginNodeShow(cfg) {
        this.host = cfg.host;
        PluginNodeShow.superclass.constructor.apply(this, arguments);
    }

    Y.extend(PluginNodeShow, Y.Plugin.Base, {
        initializer : function() {
            this.onHostEvent('main', function(e) {
                var node = e.element.node;

                if (node.nodeType === 1 && (node.getAttribute('data-show') || node.getAttribute('data-hide'))) {
                    this.main(e.element, e);
                }
            });
        },
        main : function(element, e) {
            var node = element.node;
            var mode = -1;
            var attr = EMPTY;

            var show = node.getAttribute('data-show');
            var hide = node.getAttribute('data-hide');

            if (show) {
                mode = 1;
                attr = show;
            }
            else if (hide) {
                mode = 0;
                attr = hide;
            }

            if (~mode) {
                if (!element.data) {
                    element.data = {};
                }

                this.process(node, !!mode, !!this.host.get(attr));

                this.afterHostEvent(attr + 'Change', function(e) {
                    this.process(node, !!mode, !!e.newVal);
                }, this);
            }
        },
        process : function(node, mode, current) {
            //todo - display show depends on nodeType
            node.style.display = mode === current ? 'block' : 'none';
        }
    }, {
        NS: 'PluginNodeShow'
    });

    function PluginNodeAttributes(cfg) {
        this.host = cfg.host;
        PluginNodeAttributes.superclass.constructor.apply(this, arguments);
    }

    Y.extend(PluginNodeAttributes, Y.Plugin.Base, {
        initializer : function() {
            this.onHostEvent('main', function(e) {
                var node = e.element.node;

                if (node.nodeType === 1) {
                    this.main(e.element, e);
                }
            });
        },
        main : function(element, e) {
            A.each(PluginNodeAttributes.LIST, function(attr) {
                var value, newVal;

                value = element.node.getAttribute(attr);

                if (value) {

                    newVal = [];

                    A.each(value.split(A2.EXPR.SPLIT), function(v) {
                        newVal.push(
                            new RegExp(A2.EXPR.TEST).test(v) ? this.host.processString(v, e, element).value : v
                        );
                    }, this);

                    newVal = newVal.join(EMPTY);

                    if (newVal !== value) {
                        element.node.setAttribute(attr, newVal);
                    }
                }
            }, this);
        }
    }, {
        NS: 'PluginNodeAttributes',
        LIST : [
            'href',
            'class'
        ]
    });

    function PluginNodeClick(cfg) {
        this.host = cfg.host;
        PluginNodeClick.superclass.constructor.apply(this, arguments);
    }

    Y.extend(PluginNodeClick, Y.Plugin.Base, {
        initializer : function() {
            this.onHostEvent('main', function(e) {
                var node = e.element.node;

                if (node.nodeType === 1) {
                    this.main(e.element, e);
                }
            });
        },
        main : function(element, e) {
            var clickHandler = element.node.getAttribute('data-click');

            if (clickHandler) {
                (new Y.Node(element.node)).on('click', function(e) {
                    if (L.isFunction(this.host[clickHandler])) {
                        this.host[clickHandler].call(this.host, e);
                    }
                }, this);
            }
        }
    }, {
        NS: 'PluginNodeClick'
    });

    Y.A2 = A2;

}, '1.0.0', {"requires": ["base", 'node', 'plugin']});
