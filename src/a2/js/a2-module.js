YUI.add('a2', function (Y, NAME) {

    var A2 = function A2() {
        A2.superclass.constructor.apply(this, arguments);
    };

    A2.NAME = 'A2';

    Y.extend(A2, Y.Base, {
        initializer : function() {
            console.log('initialize');

            console.log(this.get('strings.textValueLabel'));
            console.log(this.get('form.textValue'));
        }
    }, {
        ATTRS : {
            srcNode : {
                value : null
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