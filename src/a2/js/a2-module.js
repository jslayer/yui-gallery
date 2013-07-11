YUI.add('a2', function (Y, NAME) {

    var A = Y.Array;

    var O = Y.Object;

    var L = Y.Lang;

    var A2 = function A2() {
        A2.superclass.constructor.apply(this, arguments);
    };

    var EMPTY_RE = /^\s*$/;

    A2.NAME = 'A2';

    Y.extend(A2, Y.Base, {
        //_allowAdHocAttrs : true,
        initializer : function() {
            this.publish('pre', {
                emitFacade: true
            });

            this.publish('main', {
                emitFacade: true
            });

            this.plug(PluginTextModel);
            this.plug(PluginNodeModel);
            this.plug(PluginNodeRepeat);
            this.plug(PluginNodeShow);

            var src = this.get('srcNode').getDOMNode();

            this.onceAfter('initializedChange', function() {
                console.time('tree');
                this.processTree(
                    this.parse(src)
                );
                console.timeEnd('tree');
            });

            src.style.visibility = 'visible';
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
                            if (!EMPTY_RE.test(child.textContent)) {
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
        }
    }, {
        NAME : 'A2',
        ATTRS : {
            srcNode : {
                setter : function(v) {
                    return L.type(v) ? Y.one(v) : v;
                }
            }
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

            A.each(text.split(PluginTextModel.EXPR.SPLIT).filter(function(item) {
                return !!item;
            }), function(item) {
                var node;

                if (new RegExp(PluginTextModel.EXPR.TEST).test(item)) {//note - should create new regExpr
                    var parts = item.match(PluginTextModel.EXPR.PARSE);

                    var name = parts[2];

                    var text;

                    switch(parts[1]) {
                        case '&.':
                            if (e.data && e.data[name]) {
                                text = e.data[name];
                                node = document.createTextNode(text);
                            }
                            break;
                        default:
                            text = this.host.get(name) || '';

                            node = document.createTextNode(text);

                            this.afterHostEvent(name + 'Change', function(e) {
                                node.nodeValue = e.newVal || '';
                            });
                    }
                }
                else {
                    node = document.createTextNode(item);
                }

                if (node) {
                    frag.appendChild(node);
                }
            }, this);


            element.node.parentNode.replaceChild(frag, element.node);
        }
    }, {
        NS : 'PluginTextModel',
        EXPR : {
            SPLIT : /({{\s*[&.a-zA-Z0-9]+\s*}})/g,
            TEST  : /^{{\s*[&.a-zA-Z0-9]+\s*}}$/g,
            PARSE : /(&.)?(\w+)/
        }
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

                                if (!node.checked) {
                                    node.checked = !!this.host.get(rawModel);
                                }
                                else {
                                    this.host.set(rawModel, node.checked && node.value);
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

            if (parts.length === 3) {

                if (!element.data) {
                    element.data = {};
                }

                element.data.NodeRepeat = {
                    modelName : parts[2],
                    localName : parts[1],
                    template  : L.trim(element.node.innerHTML)
                };

                this.process(element);

                this.afterHostEvent(parts[2] + 'Change', function(e) {
                    this.process(element);
                }, this);
            }
        },
        process : function(element) {
            var data = element.data.NodeRepeat;

            var frag = document.createDocumentFragment();

            var wrapper = document.createElement('div');

            O.each(this.host.get(data.modelName), function(item) {
                var local = {};

                wrapper.innerHTML = data.template;

                local[data.localName] = item;

                var tree = this.host.parse(wrapper);

                tree.parent = element;

                this.host.processTree(tree, local);

                A.each(wrapper.childNodes, function(child) {
                    frag.appendChild(child);
                });
            }, this);

            element.node.innerHTML = '';
            element.node.appendChild(frag);
        }
    }, {
        NS: 'PluginNodeRepeat',
        EXPR : {
            PARSE : /(\w+)\s+in\s(\w+)/
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
            var attr = '';

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

    Y.A2 = A2;

}, '1.0.0-dev', {"requires": ["base", 'node', 'plugin']});
