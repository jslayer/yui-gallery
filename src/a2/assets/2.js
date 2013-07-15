#! /usr/bin/node

lex('1+1');

function lex(str) {
    var l, i, ch, s, S, ts, c, lsc;

    S = {
        normal   : 0,
        literal  : 1,
        str      : 2,
        operator : 3
    };

    l = str.length;
    i = 0;
    ts = [];
    s = S.normal;


    while(i < l) {
        ch = str.substr(i, 1);//charAt ?
        i++;

        console.log(i + ' : ' + ch + ' : ' + s);

        switch(s) {
            case S.normal:
                if (~' \r\t\n\v\u00A0'.indexOf(ch)) {//whitespace
                    continue;
                }
                if (new RegExp('[0-9a-z$.]').test(ch)){
                    console.log('omg');
                    s = S.literal;
                    c = ch;
                    continue;
                }
                if (~'\'"'.indexOf(ch)) {//string start
                    s = S.str;
                    lsc = ch;
                    c = '';
                    continue;
                }
                if (~'+-*/~!%&|'.indexOf(ch)) {//+-*/
                    c = ch;
                    s = S.operator;
                    continue;
                }
                break;
            case S.literal:
                if (new RegExp('[0-9a-z$.]').test(ch)) {
                    c += ch;
                    continue;
                }
                else {
                    ts.push(c);
                    s = S.normal;
                    i--;
                    continue;
                }
                break;
            case S.str:
                if (ch !== lsc) {
                    c += ch;
                }
                else {
                    ts.push(c);
                    s = S.normal;
                    i--;
                }
                break;
            case S.operator:
                if ((c === '|' && ch === '|') || (c === '&' && ch === '&')) {
                    c += ch;
                }
                else {
                    i--;
                }
                ts.push(c);
                s = S.normal;
                break;
        }
    }

    console.log(ts);
}