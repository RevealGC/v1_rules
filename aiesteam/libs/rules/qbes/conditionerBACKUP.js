var { compileExpression } = require('filtrex')
// var { toFunction } = require( 'async-rule-evaluator')
// compileExpression = toFunction

function sleepTest(seconds, callback) {



async function sleep(seconds) {
    return new Promise((resolve) =>setTimeout(resolve, seconds * 1000));
    }


// Custom function: Return string length.
function substr(s, from, to) {
    return s.substr(from, to)
}
function  sum(...args) {
    return args.reduce((acc, curr) => { return acc + curr })
} function SUM(...args) {
    return args.reduce((acc, curr) => { return acc + curr })
}
function strlen(s){
    return s.length 
}
function test(s){

 

  return s;
   
}

let options = {
    extraFunctions: { substr, sum, SUM, strlen , test}
};





module.exports = {
    checkStringAsValidCondition:  function (locals) {
        let {facts} = locals
        // facts[0]['RECORD_NAICS_NUM'] = '51113'

        let fact = (facts)[0]


      
        var ruleResult, conditionObject, value;

        try {
            ruleResult=  compileExpression(locals.conditionstring, options)(fact)


            // ruleResult = execute(fact)//execute(facts[0]);

            if (ruleResult.propertyName) // condition has not paased if propertyName is not defined
                value = false
            else value = true

            conditionObject = { conditions:{all:[{fact: 'checkCondition', path: '$.value', operator: 'equal', value: true, params: { conditionstring: locals.conditionstring } }]}}
            return ({ conditionObject, ruleResult, value });
        } catch (error) {
            throw new Error(error)
        }

    }

}





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
// console.log(facts)
// const t = tArr.map(t => {
//     let execute = compileExpression(t, options)
//     let r = execute(facts);
//     console.log("🚀 ~ file: app.js:30 ~ t ~ r",t, r)
// })


// facts":[{
//     "spadId":2449,
//     "PAY_ANN":"484205000",
//     "DEPR_TOT":1608411667,
//     "PAY_QTR1":144561669,
//     "RCPT_TOT":2493918333,
//     "CAPEX_TOT":129189667,
//     "CHILD_REN":1,
//     "EMP_MAR12":"38307001
// }]

// [{"spadId":2449,"RECORD_NAICS_NUM": "51113","PAY_ANN":"484205000","DEPR_TOT":1608411667,"PAY_QTR1":144561669,"RCPT_TOT":2493918333,"CAPEX_TOT":129189667,"CHILD_REN":1,"EMP_MAR12":38307001}]