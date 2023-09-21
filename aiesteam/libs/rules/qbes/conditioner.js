var { compileExpression } = require('filtrex')
import { toFunction } from 'async-rule-evaluator'
// const { toFunction } = require('async-rule-evaluator');


var config = require("../../../config");
import utils from '../../../util'


function sleepTest(seconds, callback) {

}

let concat = async function(...args) { 
    let str = ''
    const resolvedStrings = await Promise.all(args)
    return resolvedStrings.reduce((a, b) => a + '' + b, str) 
}


let parseInteger = async function(...args) { 
  let str = ''
  const resolvedStrings = await Promise.all(args)
  try {
   return  parseInt(resolvedStrings)
  } catch (error) {
    return resolvedStrings
  }
  // return resolvedStrings
}



let sleep = async function (seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}





async function sum(...values) {
    let sum = 0;
  
    // Use Promise.all to resolve all the promises passed as arguments
    const resolvedValues = await Promise.all(values);
  
    // Add all the resolved values
    for (const value of resolvedValues) {
      sum += value;
    }
  
    return sum;
  }
  




// aggregate('RCPT_TOT', 'naics ="51113"', 'sum')

let aggregate = async function (variable, where, type='sum') {
    let resolvedWhere = await Promise.resolve(where);
   
    let sql = `select  ${type}(data_version_value::INTEGER) from v_survey_details_flags_ac where rvname = '${variable}' and ${resolvedWhere} `

    // console.log("🚀 ~ file: conditioner.js:51 ~ aggregate ~ sql", sql)

    
   try {
    let result = await config.dbPool.query(sql)
   
    let ret = ( parseInt( result.rows[0][type])) || 0
    return ret;
   } catch (error) {
    return 0
   }

}

let agg = async function (variable, where, type='sum') {
    let resolvedWhere = await Promise.resolve(where);
   
    let sql = `select  ${type}(data_version_value::INTEGER) from v_survey_details_flags_ac where rvname = '${variable}' and ${resolvedWhere} `
    
   try {
    let result = await config.dbPool.query(sql)
   
    let ret = ( parseInt( result.rows[0][type])) || 0
    return ret;
   } catch (error) {
    return 0
   }

}

var fact = {
    EXPS_EHR_STAT:'ANOTHER DOT',
    EXPS_EHR_VAL:'OK',
    RECORD_NAICS_NUM: '51113',
RCPT_BOOK_PRNT_PCT: 0, 
RCPT_BOOK_ONLINE_PCT: 10,
 RCPT_BOOK_OTH_PCT: -10,
 TYPE_CODE_STAT:"51113", 
 RCPT_COMSN_GSV_VAL:2,
 RCPT_COMSN_EARN_VAL:3, 
 RCPT_COMSN_AVG_RATE:4,
 TYPOP_CODE_STAT:"4X", 
 RCPT_OWN_VAL:0,
 RCPT_COMSN_EARN_VAL:3,
 RCPT_MOTR_HAZRD_PCT:"ANDY",RCPT_MOTR_HAZRD_STAT:"CD",
//   RCPT_OWN_VAL:4,
RCPT_VAL:5,
 RCPT_TOT_VAL:5,
 INV_CY_TOT:10,  INV_CY_LIFO_VAL:3, INV_CY_NONLIFO_TOT:6
  
}
function convertToInt(str) {
  if (/^\d+$/.test(str)) {
    return parseInt(str, 10);
  }
  else {
    return str;
  }
}

let toNumber = (s) => parseInt(s)
 // for substr ensure it starts from 1 and not 0.  So take what the user specified and move back one so js substr can be remapped.

 let substr = async function(sinput, from, to) {
    let s = sinput + ''
    try{
    var newFrom = 1
    if(from != 0) newFrom = from - 1  
    return s.substring(newFrom, to) 
    }
    catch(e){
      console.log("🚀 ~ file: conditioner.js:114 ~ substr ~ e", e)
      return s;
    }
}


let gt = async function(a,b){
    const resolvedA = await Promise.resolve(a);
    const resolvedB = await Promise.resolve(b);

    return resolvedA > resolvedB
}
let lt = async function(a,b){
    const resolvedA = await Promise.resolve(a);
    const resolvedB = await Promise.resolve(b);

    return resolvedA < resolvedB
}
let eq = async function(a,b){
    const resolvedA = await Promise.resolve(a);
    const resolvedB = await Promise.resolve(b);

    return resolvedA === resolvedB
}

let gteq = async function(a,b){
    const resolvedA = await Promise.resolve(a);
    const resolvedB = await Promise.resolve(b);

    return resolvedA => resolvedB
}
let lteq = async function(a,b){
    const resolvedA = await Promise.resolve(a);
    const resolvedB = await Promise.resolve(b);

    return resolvedA <= resolvedB
}


let getTime= async function(time) {
    let currentDate = new Date();
    let hours = currentDate.getHours().toString().padStart(2, "0");;
    let minutes = currentDate.getMinutes().toString().padStart(2, "0");;
    let seconds = currentDate.getSeconds().toString().padStart(2, "0");;
    let year = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1).toString().padStart(2, "0");;
    let date = currentDate.getDate();
    if (time === undefined) {
    //   return `${hours} : ${minutes} : ${seconds}`;
      return `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`;
    }
    if (time === "year") {
        return `${year}`;
      }
      if (time === "month") {
        return `${month}`;
      }


      
    if (time === "date") {
      return `${date}`;
    }

    if (time === "m") {
      return `${minutes}`;
    }
    if (time === "s") {
      return `${seconds}`;
    }
    if (time === "hm") {
      return `${hours}:${minutes}`;
    }
    if (time === "hms") {
      return `${hours}:${minutes}:${seconds}`;
    }
    return `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`;
  }

let functions = { concat, aggregate,agg,  substr, toNumber,parseInteger,
  sum , gt, lt,eq, gteq,lteq, getTime}



async function runFilter(input, data) {
try {
    const fn = toFunction(input,{functions})//, customResolver})
    return fn(data);

} catch (error) {
    throw (error)
    
}
    
  }
  var _lodash = _interopRequireDefault(require("lodash.topath"));


  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  const cachedPromises = new WeakMap();
  async function customResolver(name) {
    let current = obj;
    const path = (0, _lodash.default)(name);
    let index = 0;
    const {
      length
    } = path; // Walk the specified path, looking for functions and promises along the way.
    // If we find a function, invoke it and cache the result (which is often a promise)

    while (current != null && index < length) {
      const key = String(path[index]);
      let currentVal = Object.prototype.hasOwnProperty.call(current, key) ? current[key] : undefined;

      if (typeof currentVal === 'function') {
        let cacheEntry = cachedPromises.get(current);

        if (cacheEntry && Object.hasOwnProperty.call(cacheEntry, key)) {
          currentVal = cacheEntry[key];
        } else {
          // By passing objectResolver to the fn, it can "depend" on other promises
          // and still get the cache benefits
          currentVal = currentVal(objectResolver, obj, current, name); // Need to get this again because someone else may have made it

          cacheEntry = cachedPromises.get(current);

          if (!cacheEntry) {
            cacheEntry = {};
            cachedPromises.set(current, cacheEntry);
          }

          cacheEntry[key] = currentVal;
        }
      } // eslint-disable-next-line no-await-in-loop


      current = await currentVal;
      index += 1;
    }

    return index && index === length ? current : undefined;
  }











module.exports = {

    /**
     * 
     * @param {facts[], conditionstring(to process used by qbes and whatif)} locals 
     * @returns 
     *  {
        * parseSuccess: true/false 
        * ruleResult:  computed value or false(if cant be computed due to missing vars) if parseSuccess is true.  It will be an error string if there is syntax error 
        * value: true/false(if ruleResult is >0 then true else false)
        * error: true/false,
        * message: ''(if no error) or 'Error message' (if error)<<<< EXPRESSION to be computed
        * condition:{conditions.all[{....}]} returns the rule condition object
        * facts: returns them back
        * }
        * ruleResult
        * (if a computation value will be computed and if its a logical condition string  then value will be 1/0 ), 
     */


    checkStringAsValidCondition: async function (locals) {
        let { facts,conditionstring } = locals
    
    
      
     
        let fact = (facts)[0]
        var   conditionObject, value;
        try {
            let ruleResult = await runFilter(conditionstring, fact)
       
            if(!ruleResult || ruleResult < 0) value  = false
            else value = true;
            if(!ruleResult) 
            ruleResult =""

            conditionObject = { conditions: { all: [{ fact: 'checkCondition', path: '$.value', operator: 'equal', value: true, params: { conditionstring: locals.conditionstring } }] } }

            
            let out = {error:false,success:true, parseSucess: true, message:'', conditionObject,  expression: locals.conditionstring,
            value:ruleResult, rvName:locals.conditionstring,
            expressionVariables: utils.findVariables(locals.conditionstring),
            rvValue: ruleResult,ruleResult, value }
            return (out);
        } catch (error) {


   

          
        let parseSuccess = error.message.substring(0,5) == 'Parse' ? false: true

        conditionObject = { conditions: { all: [{ fact: 'checkCondition', path: '$.value', operator: 'equal', value: true, params: { conditionstring: locals.conditionstring } }] } }

            //  let err = { name: "JSONParseError", parent: { hint: "Could not parse the condition:" + error.message } }



            let ret =  {error:true,success: false, parseSuccess, message:error.message,conditionObject, ruleResult: error.message, 
              expression: locals.conditionstring,
              expressionVariables: utils.findVariables(locals.conditionstring),
              rvName:locals.conditionstring, rvValue: error.message, ruleResult: undefined, value: false}
           
              return(ret);
            // throw new Error(error)
        }

    }

}




/**
let tArr =
    [
        //3
        `substr(RECORD_NAICS_NUM,0,5)== "51113" and sum(RCPT_BOOK_PRNT_PCT,  RCPT_BOOK_ONLINE_PCT, RCPT_BOOK_OTH_PCT) ==0`,


        // //5  TYPE_CODE_STAT:"51113", RCPT_COMSN_GSV_VAL:2,RCPT_COMSN_EARN_VAL:3, RCPT_COMSN_AVG_RATE:4
        `TYPE_CODE_STAT=="51113" and RCPT_COMSN_GSV_VAL not in (0,1) and RCPT_COMSN_EARN_VAL not in (0,1) and RCPT_COMSN_AVG_RATE not in (0,1)`,

        // //7 TYPOP_CODE_STAT:"4X", RCPT_OWN_VAL:0,RCPT_COMSN_EARN_VAL:3.RCPT_OWN_VAL:4,RCPT_TOT_VAL:5
        `TYPOP_CODE_STAT == "4X" and RCPT_OWN_VAL == 0 and RCPT_COMSN_GSV_VAL != RCPT_TOT_VAL and RCPT_COMSN_GSV_VAL < RCPT_TOT_VAL and RCPT_VAL == sum(RCPT_COMSN_GSV_VAL, RCPT_COMSN_EARN_VAL)`,

        // // 9 INV_CY_TOT:10, . INV_CY_LIFO_VAL:3, INV_CY_NONLIFO_TOT:6
        `INV_CY_TOT != sum(INV_CY_LIFO_VAL, INV_CY_NONLIFO_TOT)`,

        // // 15 RCPT_MOTR_HAZRD_PCT:"ANDY",RCPT_MOTR_HAZRD_STAT:"CD"
        `RCPT_MOTR_HAZRD_PCT!= 30 and substr(RECORD_NAICS_NUM,0,3) =="511" and RCPT_MOTR_HAZRD_STAT =="CD" and RCPT_MOTR_HAZRD_PCT ==0`,

        // // 22
        `substr(RECORD_NAICS_NUM,0,5) == "51113" and SUM(RCPT_BOOK_PRNT_PCT,  RCPT_BOOK_ONLINE_PCT, RCPT_MOTR_HAZRD_PCT) != 0`,

        // // 33
        `substr(RECORD_NAICS_NUM,1,2) =="11" and substr(RECORD_NAICS_NUM,1,3) !="624" and EXPS_EHR_VAL !="SomeDOT" and EXPS_EHR_STAT =="ANOTHER DOT" or EXPS_EHR_VAL == "OK"`

    ]
var facts = {
    "EXPS_EHR_STAT": 'ANOTHER DOT',
    "EXPS_EHR_VAL": 'OK',
    "RECORD_NAICS_NUM": '51113',
    "RCPT_BOOK_PRNT_PCT": 0,
    "RCPT_BOOK_ONLINE_PCT": 10,
    "RCPT_BOOK_OTH_PCT": -10,
    "TYPE_CODE_STAT": "51113",
    "RCPT_COMSN_GSV_VAL": 2,
    "RCPT_COMSN_EARN_VAL": 3,
    "RCPT_COMSN_AVG_RATE": 4,
    "TYPOP_CODE_STAT": "4X",
    "RCPT_OWN_VAL": 0,
    "RCPT_COMSN_EARN_VAL": 3,
    "RCPT_MOTR_HAZRD_PCT": "ANDY",
    "RCPT_MOTR_HAZRD_STAT": "CD",

    "RCPT_VAL": 5,
    "RCPT_TOT_VAL": 5,
    "INV_CY_TOT": 10, "INV_CY_LIFO_VAL": 3, "INV_CY_NONLIFO_TOT": 6

}
 */