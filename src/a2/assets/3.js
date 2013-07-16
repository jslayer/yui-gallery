//#! /usr/bin/node

//lex('a111');
//lex('a = {a : 2, b : [1,2,3], c : "Hello" + "World"}');
//lex('"a"  "Hello world"  \'A\'');
//lex('1 + 2');
//lex('a = [1,2,3]');
//lex('$user.name = getFirstName(1,2,3) + " " + $getLastName({a:2})');
//lex('1 + 2*3 ; upper');
//lex('a = b(c) + " Hello" + "Cruel" = world()');
//lex('=123');
//lex('!false')
//lex('!0')
//lex(' ="Hello" ')

//lex('$user.prefix ; translate($user.lang) ; upper')

//lex('1+2+$localMethod(id, true, "hello", a()) + globalValue');
//lex('1+1*a(user.local, false, {a:b(), c:[1,2,test]})');
//lex('"Hello " + "Cruel " +  "World"');

//lex('$user.prefix ; translate ; upper')

//lex('1*2*3*4*5*6')

console.time('b');
//for(i = 0; i < 1000; i++) {
    //lex('a = 1+2+3+4*5/6')
//}
//lex('-1+2*3+"Hello"');
//lex('user.name = "[" + user.getFirstName() + " " + user.getLastName() + "]"');
//lex('user.name = "[" + user.firstName + " " + user.lastName + "]"');

lex('a = "Hello"; translate; upper')

console.timeEnd('b');

//console.time('a');
//for(i = 0; i < 1000000; i++) {
//    var out = '[' + 'Eugene' + ' ' + 'Poltorakov' + ']';
//}
//console.timeEnd('a');

function lex(input){
    var i = 0;

    var ch;

    var tokens = [];

    var _current;

    var stack = [];

    var TYPES = {
        STRING        : 'T_STRING',
        NUMBER        : 'T_NUMBER',
        IDENTIFIER    : 'T_IDENTIFIER',
        LONG_OPERATOR : 'T_LONG_OPERATOR'
    };

    input += '\u0000';

    var l = input.length;

    //parse tokens
    while(i < l) {
        ch = input.substr(i,1);

        i++;

        if (stack.length === 0) {
            if (~' \r\t\n\v\u00A0'.indexOf(ch)) {//игнорируем пробельные символы если стек пустой либо в начале
                continue;
            }

            if (new RegExp(/['"]/).test(ch)) {//начало разбора строки
                stack.push(TYPES.STRING);
                stack.push(ch);//сохраняем символ, которым открывается строка
                continue;
            }
            if (new RegExp(/\d/).test(ch)) {//число
                stack.push(TYPES.NUMBER);
                stack.push(ch);
                continue;
            }

            if (new RegExp(/[\$\w]/).test(ch)) {//начало идентификатора
                stack.push(TYPES.IDENTIFIER);
                stack.push(ch);
                continue;
            }

            if (~'=&|+'.indexOf(ch) && tokens.length > 0) {//операции, которые могут быть двойными, либо тройными ===, ==, &&
                stack.push(TYPES.LONG_OPERATOR);
                stack.push(ch);
                continue;
            }

            if (~'()!-'.indexOf(ch)) {//одиночные токены которые могут быть в начале
                tokens.push(ch);
                continue;
            }

            if (~'{}[]:,%^*/;'.indexOf(ch) && tokens.length > 0) {//одиночные токены которые НЕ могут быть в начале
                tokens.push(ch);
                continue;
            }

            if (ch === '\u0000') {
                break;
            }

            throw new Error('Unexpected token ' + ch + ' at ' + i);
        }
        else {
            if (stack[0] === TYPES.STRING) {
                if (ch === stack[1]) {//завершение чтения строки
                    stack.shift();
                    stack.shift();
                    tokens.push(['"', stack.join(''), '"'].join(''));
                    stack = [];
                    continue;
                }
                else {//продолжение чтения строки
                    stack.push(ch);
                    continue;
                }
            }

            if (stack[0] === TYPES.NUMBER) {
                if (new RegExp(/[\d.]/).test(ch)) {
                    stack.push(ch);
                }
                else {
                    stack.shift();
                    tokens.push(parseFloat(stack.join('')));
                    stack = [];
                    i--;//вернемся немного назад
                }
                continue;
            }

            if (stack[0] === TYPES.IDENTIFIER) {
                if (new RegExp(/[\$\w\d.]/).test(ch)) {
                    stack.push(ch);
                }
                else {
                    stack.shift();
                    _current = stack.join('');

                    switch(_current) {
                        case 'false':
                            _current = false;
                            break;
                        case 'true':
                            _current = true;
                            break;
                        case 'null':
                            _current = null;
                            break;
                    }

                    tokens.push(_current);
                    stack = [];
                    i--;//вернемся немного назад
                }
                continue;
            }

            if (stack[0] === TYPES.LONG_OPERATOR) {
                if (ch === stack[1]) {
                    stack.push(ch);
                    //console.log(stack.length);
                }
                else {
                    stack.shift();
                    tokens.push(stack.join(''));
                    stack = [];
                    i--;//вернемся немного назад
                }
                continue;
            }

            if (~' \r\t\n\v\u00A0'.indexOf(ch)) {//игнорируем пробельные символы
                continue;
            }

            throw new Error('Unexpected token ' + ch + ' at ' + i);
        }
    }

    if (stack.length > 0) {
        throw new Error('Stack is not empty: [ ' + stack.join(',') + ' ]');
    }

    //тут у нас уже есть пачка токенов, которую теперь нужно привести в чувства :)
    //console.log(tokens);

    TYPES = {
        END           : 'T_END',
        VALUE         : 'T_VALUE',//string, null, boolean, number
        OPERATOR      : 'T_OPERATOR',
        IDENTIFIER    : 'T_IDENTIFIER',
        //FUNCTION      : 'T_FUNCTION',
        BRACKET_OPEN  : 'T_BRACKET_OPEN',
        BRACKET_CLOSE : 'T_BRACKET_CLOSE',
        ENUM          : 'T_ENUM',
        ARRAY_START   : 'T_ARRAY_START',
        ARRAY_END     : 'T_ARRAY_END',
        OBJECT_START  : 'T_OBJECT_START',
        OBJECT_END    : 'T_OBJECT_END',
        OBJECT_KEY    : 'T_OBJECT_KEY',
        ASSIGNMENT    : 'T_ASSIGNMENT'
    };

    var body = '';

    i = 0;
    l = tokens.length;

    var token;

    //stack = [];

    var services = [];
    var endOfMainExpression = false;

    console.log(tokens);

    while(tokens.length) {
        token = tokens.shift();

        //console.log(token);
        //console.log(token, ' :: ' ,tokenType(token, tokens), ' :: ', nextTokenType(tokens));
        var type = tokenType(token, tokens);
        var next = nextTokenType(tokens);

        if (endOfMainExpression) {
            if (type === TYPES.IDENTIFIER) {
                services.push(token);
            }
            continue;
        }

        if (type === TYPES.IDENTIFIER) {
            if (next === TYPES.BRACKET_OPEN) {//function call
                body += ['this._getMethod.call(this,("', token, '")'].join('');
                continue;
            }
            else if (next === TYPES.ASSIGNMENT) {//some magic :)
                body += 'this._setValue.call(this,"' + token + '",';
                for(i=0, l=tokens.length; i < l; i++) {
                    if (tokens[i] === ';') {
                        break;
                    }
                }
                tokens.splice(i, 0, ')');
                continue;
            }
            else if (next !== TYPES.OBJECT_KEY) {
                body += ['this._getValue.call(this,("', token, '")'].join('');
                continue;
            }
            else {
                body += token;
                continue;
            }
        }

        switch(type) {
            case TYPES.VALUE:
            case TYPES.OPERATOR:
            case TYPES.BRACKET_OPEN:
            case TYPES.BRACKET_CLOSE:
            case TYPES.ENUM:
            case TYPES.ARRAY_START:
            case TYPES.ARRAY_END:
            case TYPES.OBJECT_START:
            case TYPES.OBJECT_END:
            case TYPES.OBJECT_KEY:
                body += token;
                continue;
        }

        if (type === TYPES.ASSIGNMENT) {
            continue;
        }

        if (type == TYPES.END) {
            endOfMainExpression = true;
            continue;
        }

        throw new Error('Unknown token type : ' + token + ' (' + type + ') in ' + tokens);

    }

    function tokenType(token, tokens) {
        if (typeof token === 'undefined') {
            return TYPES.END;
        }
        if (token === null || ~['boolean', 'number'].indexOf(typeof(token)) || token.substr(0, 1) === '"') {
            return TYPES.VALUE;
        }
        if (token === '=') {
            return TYPES.ASSIGNMENT;
        }
        if (~'!+-*/&|^=%'.indexOf(token.substr(0, 1))) {
            return TYPES.OPERATOR;
        }
        if (new RegExp(/[$\w]/).test(token.substr(0, 1))) {
            return TYPES.IDENTIFIER;
        }

        switch(token) {
            case '(':
                return TYPES.BRACKET_OPEN;
            case ')':
                return TYPES.BRACKET_CLOSE;
            case ',':
                return TYPES.ENUM;
            case '[':
                return TYPES.ARRAY_START;
            case ']':
                return TYPES.ARRAY_END;
            case '{':
                return TYPES.OBJECT_START;
            case '}':
                return TYPES.OBJECT_END;
            case ':':
                return TYPES.OBJECT_KEY;
            case ';':
                return TYPES.END;
        }
        throw new Error('Unknown token type : ' + token + ' in ' + tokens);
    }

    function nextTokenType(tokens) {
       return tokenType(tokens[0], tokens);
    }

    console.log(body);

    //apply services
    var service;

    while(service = services.shift()) {
        body = ['this._applyService.call(this,("', service, '",', body, ')'].join('');
    }

    //add return
    body = 'return ' + body;

    console.log(body);

    var func = new Function(body);

    //console.log(body);
    var mock = {
        _setValue : function(name, value) {
            //console.log(name, value);
            return value;
        },
        _getValue : function(name) {
            switch(name) {
                case 'user.firstName':
                    return 'Eugene';
                case 'user.lastName':
                    return 'Poltorakov';
            }
            throw new Error('Unknown method ' + name);
        },
        _getMethod : function(name) {
            switch(name) {
                case 'user.getFirstName':
                    return function() {
                        return 'Eugene';
                    };
                case 'user.getLastName':
                    return function() {
                        return 'Poltorakov';
                    };
            }
            throw new Error('Unknown method ' + name);
        }
    };

    var out;

    console.time('c');

    for(i = 0; i < 1000000; i++) {
        //out = func.call(mock);
    }

    console.timeEnd('c');

    //console.log('OUTPUT: ', out);
}
