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
            var src = this.get('srcNode').getDOMNode();

            console.time('tree');

            var tree = this.parse(src);

            console.timeEnd('tree');
        },
        parse : function(node, parent) {
            var tree = {};

            var element = {
                node   : node,
                parent : parent || false
            };

            var dive;

            dive = this.pre(element);

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
        pre : function(element) {
            console.log('PRE     ', element);
            return true;
        }
    }, {
        ATTRS : {
            srcNode : {
                setter : function(v) {
                    return L.type(v) ? Y.one(v) : v;
                }
            }
        }
    });

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

}, '1.0.0-dev', {"requires": ["base", 'node']});