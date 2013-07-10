YUI.add('a2', function (Y, NAME) {

    var A = Y.Array;

    var L = Y.Lang;

    var A2 = function A2() {
        A2.superclass.constructor.apply(this, arguments);
    };

    var EMPTY_RE = /^\s*$/;

    A2.NAME = 'A2';

    Y.extend(A2, Y.Base, {
        initializer : function() {
            this.publish('pre', {
                emitFacade: true
            });

            this.publish('main', {
                emitFacade: true
            });

            this.plug(PluginTextModel);
            this.plug(PluginNodeModel);

            var src = this.get('srcNode').getDOMNode();

            console.time('tree');

            this.processTree(
                this.parse(src)
            );

            console.timeEnd('tree');
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
        processTree : function(tree) {
            this.fire('main', {
                element : tree
            });
            if (tree.children) {
                A.each(tree.children, function(child) {
                    this.fire('main', {
                        element : child
                    });
                }, this);
            }
        }
    }, {
        ATTRS : {
            srcNode : {
                setter : function(v) {
                    return L.type(v) ? Y.one(v) : v;
                }
            },
            value1 : {
                value : 1
            },
            value2 : {
                value : 2
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
                console.log('evt', e);
                if (e.element.node.nodeType === 3) {
                    this.main(e.element, e);
                }
            });
        },
        main : function(element, e) {
            var text = L.trim(element.node.wholeText);

            var frag = document.createDocumentFragment();

            A.each(text.split(this.expr.split).filter(function(item) {
                return !!item;
            }), function(item) {
                var node;

                if (this.expr.test.test(item)) {
                    var name = item.match(this.expr.parse).pop();

                    node = document.createTextNode(this.host.get(name));

                    this.afterHostEvent(name + 'Change', function(e) {
                        node.nodeValue = e.newVal;
                    });
                }
                else {
                    node = document.createTextNode(item);
                }
                frag.appendChild(node);
            }, this);

            element.node.parentNode.replaceChild(frag, element.node);
        },
        expr : {
            split : /({{\s*\w+\s*}})/g,
            test  : /^{{\s*\w+\s*}}$/g,
            parse : /\w+/g
        }
    }, {
        NS : 'PluginTextModel'
    });

    function PluginNodeModel() {
        PluginNodeModel.superclass.constructor.apply(this, arguments);
    }

    Y.extend(PluginNodeModel, Y.Plugin.Base, {
        initializer : function() {
//            this.onHostEvent('pre', function(e) {
//                if (e.element.node.nodeType === 1) {
//                    this.pre(e.element, e);
//                }
//            });
        },
        pre : function() {

        }
    }, {
        NS : 'PluginNodeModel'
    });

    /**
     * Basic text plugin
     */
    /*function PluginTextBasic(cfg) {
        console.log(cfg);
        PluginTextBasic.superclass.constructor.apply(this, arguments);
    }

    Y.extend(PluginTextBasic, Y.Plugin.Base, {
       initializer : function() {
           this.onHostEvent('pre', function(e) {
             console.log('PTB', e);
           });
       }
    }, {
        NS: 'textBasic'
    });

    *//**
     * Basic model plugin
     *//*
    function PluginNodeBasic(cfg) {
        PluginNodeBasic.superclass.constructor.apply(this, arguments);
    }

    Y.extend(PluginNodeBasic, Y.Plugin.Base, {
        initializer : function() {
            this.onHostEvent('pre', function(e) {
                console.log('PNB', e);
            });
        }
    }, {
        NS : 'nodeBasic'
    });*/

    /**
     * We should go through dom tree (with text nodes)
     * Invoke all the attached modules
     * Generate attributes & listeners
     * Profit
     */


    //scope extension

    //repeat extension

    //model extension

    //process extension

    //& extension




    Y.A2 = A2;

}, '1.0.0-dev', {"requires": ["base", 'node', 'plugin']});