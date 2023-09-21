//-----------------

Operators.push(new _operator2.default('=', function (a, b) {
    return a === b;
    }));
    Operators.push(new _operator2.default('!=', function (a, b) {
    return a !== b;
    }));
    
    Operators.push(new _operator2.default('<', function (a, b) {
    return a < b;
    }, numberValidator));
    Operators.push(new _operator2.default('<=', function (a, b) {
    return a <= b;
    }, numberValidator));
    Operators.push(new _operator2.default('>', function (a, b) {
    return a > b;
    }, numberValidator));
    Operators.push(new _operator2.default('>=', function (a, b) {
    return a >= b;
    }, numberValidator));
    
    //--------------
    Operators.push(new _operator2.default('[min,max]', function (a, b) {
    return a<=b[1] && a>=b[0];
    }));
    Operators.push(new _operator2.default('(min,max]', function (a, b) {
    return a<=b[1] && a>b[0];
    }));
    Operators.push(new _operator2.default('(min,max)', function (a, b) {
    return a<b[1] && a>b[0];
    }));
    Operators.push(new _operator2.default('[min,max)', function (a, b) {
    return a<b[1] && a>=b[0];
    }));
    exports.default = Operators;