/**
 * utils for qbes
 * 
 * 1) parse any string and report if it is valid and convert it to an expression
 * 2) compile the data-rule passed and save it.
 * 3) get a specific rule
 * 4) update a specific rule
 * 5) change the rules props
 */

/**
 * parse any string
 */
const Parser = require('expr-eval').Parser;

const arrayToString = (arr) => {
    return arr.reduce((acc, obj) => {
      // loop through the keys of each object
      for (const key in obj) {
        // add the key and value to the accumulator string, separated by a colon
        acc += `${key}: ${obj[key]}, `;
      }
      return acc;
    }, '');
  };
  

//  const parser = new Parser()
// parser.evaluate(valString.replace(/\"/g, ""), facts[0])}

module.exports = {

    arrayToString: function(arr){
        arrayToString(arr)
    },




    parse: function (req, res, next) {

        // const ast = LEP.ast(requirements);
        // console.log({ ast });
        let {condition, expression, action, message} = req.body
        try {
            let tokens = Parser.parse(condition);
            console.log("🚀 ~ file: utils.js ~ line 29 ~ condition", tokens.tokens)
           

            let retConditions = getConditions(tokens.tokens)
           
            res.send({retConditions, tokens}); return;

            let astRet = ast(ret.tokens)
            console.log("🚀 ~ file: utils.js ~ line 31 ~ astRet", astRet)
            res.send(astRet); return;

            res.status(200).send({ result: ret.toString(), astRet, newString: ret, error: false, originalString: req.body.data })
            return;
        }
        catch (e) {
            // console.log("🚀 ~ file: utils.js ~ line 47 ~ e", e)

            res.send({ error: true, message: "Could not parse the expression" })
            return;
        }
    }
}

/**
 *  Create the logical AST for rules conditions A > B, and ...
 * Convert it to and:[{A,>,B},{C,<3}]
 * Tokens are an array of [IVAR, INUMBER, IOP2, IEXPR, ]
 * @param {*} tokens Pass an array of tokens
 */

const getConditions = (tokens) => {


    let ret = {}
    var stack = [], opStack = []
   var len = tokens.length

   if(len < 2) return {type: 'IVAR', value: tokens[0].value}
    for(var i = 0; i < tokens.length; ++i){
        let t = tokens[i]
      
        
       switch(t.type){
        case 'INUMBER':
            stack.push(t)
            break;
        case 'IVAR':
            stack.push(t)
            break;
        case'IEXPR':
        // parse Expression
        let c = getConditions(t.value)
        ret = {...ret, ...{value:c}}
        stack.push({type: 'IVAR', value : c.value})
        console.log("🚀 ~ file: utils.js ~ line 79 ~ getConditions ~ ret", ret)
        break;
        case'IOP2':
            let l , sl 
            if(stack.length  < 2) opStack.push(t) 
            else { 
                l = stack.pop(); 
                sl = stack.pop() 
                if(t.value == 'and' || t.value == 'or')
                {
                    let operator = t.value
                    ret = {...{ret},...{[operator]:[sl.value,l.value]}}
                    stack.push({type:'IVAR', value: {[operator]:[{fact:sl.value},{facts:l.value}]}})
                    console.log("🚀 ~ file: utils.js ~ line 82 ~ getConditions ~ ret", ret)
                }
                else {
                    ret = {...ret, ...{fact: sl.value, operator: t.value, value: l.value}}

                    stack.push({type:'IVAR', value: sl.value+' '+ t.value+' '+ l.value} )
                    console.log("🚀 ~ file: utils.js ~ line 86 ~ getConditions ~ ret", ret)
                }

            
            }
          

        break;
        
       }
       
    }


    return ret;

}

const ast = (tokens) => {
     console.log("🚀 ~ file: utils.js ~ line 54 ~ ast ~ tokens", JSON.stringify(tokens))
return tokens;
    var stack = []
    var ret = {}

    for (var i = 0; i < tokens.length; ++i) {
        let t = tokens[i]
        console.log("🚀 ~ file: utils.js ~ line 61 ~ ast ~ stack", JSON.stringify(stack))

        if (t.type == 'IVAR') {
            // t.value = {fact: t.value}
            stack.push(t);

        }
        if (t.type == 'INUMBER') stack.push(t);

        if (t.type == 'IEXPR') {

        }

        if (t.type == 'IOP2') {
            let logical = false
          
            if(t.value == 'and' || t.value == 'or') logical = true
            console.log("🚀 ~ file: utils.js ~ line 75 ~ ast ~ logical", logical)
            let last = stack.pop()
            console.log("🚀 ~ file: utils.js ~ line 79 ~ ast ~ last", last)
            let secondLast = stack.pop()
            console.log("🚀 ~ file: utils.js ~ line 80 ~ ast ~ secondLast", secondLast)
            // if( last.type == 'IVAR')
            // last.value = {fact:last.value}

            let pushExpression = {}
            // IF INUMBER & INUMBER
            if (last.type == 'INUMBER' && secondLast.type == 'INUMBER') {
                pushExpression = { type: 'INUMBER', value: secondLast.value + t.value + last.value }

            }
            let logicProperty 
            if(logical)
            logicProperty = {and:[{fact:secondLast.value, value:last.value}]  }
            console.log("🚀 ~ file: utils.js ~ line 92 ~ ast ~ logicProperty", logicProperty)

            if ((last.type = 'IVAR' && secondLast && secondLast.type == 'INUMBER') ||
                (last.type = 'INUMBER' && secondLast && secondLast.type == 'IVAR')) {
                pushExpression = {
                    type: 'IEXPR', ...{
                        value: (logical) ? {[t.value]:[{fact:secondLast.value, value:last.value, operator:t.key}]} [t.value] : secondLast.value + t.value + last.value,
                        fact: secondLast.value, valueTBD: last.value, operator: t.value

                    }
                }


            }

            stack.push(pushExpression)
            console.log("🚀 ~ file: utils.js ~ line 104 ~ ast ~ pushExpression", pushExpression)



            ret = { ...ret, ...{ pushExpression } }


            // else ret = {...ret, ...{}}

            console.log("🚀 ~ file: utils.js ~ line 71 ~ tokens.map ~ ret", ret)
        }

        // return ret;
    }
    console.log("🚀 ~ file: utils.js ~ line 71 ~ tokens.map ~ stack", stack)
    return { ret, tokens };
}