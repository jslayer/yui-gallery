#! /usr/bin/node

//lex('a111');
//lex('a = {a : 2, b : [1,2,3], c : "Hello" + "World"}');
//lex('"a"  "Hello world"  \'A\'');
//lex('1 + 2');
//lex('a = [1,2,3]');
//lex('$user.name = getFirstName(1,2,3) + " " + $getLastName({a:2})');
//lex('1 + 2*3 ; upper');
//lex('a = b(c) + " Hello" + "Cruel" = world()');
//lex('=123');
lex('!false')
lex('!0')
//lex(' ="Hello" ')

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

    input += ';';

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

            if (~'=&|+-'.indexOf(ch) && tokens.length > 0) {//операции, которые могут быть двойными, либо тройными ===, ==, &&
                stack.push(TYPES.LONG_OPERATOR);
                stack.push(ch);
                continue;
            }

            if (~'()!'.indexOf(ch)) {//одиночные токены которые могут быть в начале
                tokens.push(ch);
                continue;
            }

            if (~'{}[]:,%^*'.indexOf(ch) && tokens.length > 0) {//одиночные токены которые НЕ могут быть в начале
                tokens.push(ch);
                continue;
            }

            if (ch === ';') {
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
                    console.log(stack.length);
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
        throw new Error('Stack is not empty: ' + stack);
    }

    console.log(tokens);
}