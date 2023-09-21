/**
 * QBES: Q based Expert System
 * creates a rule engine and accepts the following:
 * a) rules
 * b) facts
 * and it returns an object of type
 * {valid, invalid}
 */


// const { config } = require("dotenv");

var config = require("../../../config");
const Parser = require('expr-eval').Parser;



/**
 * using async-rules-evaluator(ARE) for parsing the condition string.
 * Will not use filtrex till (ARE) is fully resolved and will remove Parser too.
 * 
 * Key entry point is checkStringAsValidCondition from conditioner.js; this function will
 * be passed the {conditionstring: "logical expression" , facts:[{a:b, c:d, e:f}] and a bunch of facts.
 * Qbes will work with facts and save them with computed values.
 * 
 * checkStringAsValidCondition will return an object:
 * 
 * {
 * ruleResult: value 
 * value: true/false
 * error: true/false,
 * message: ''(if no error) or 'Error message' (if no error)
 * }
 * 
 * ruleResult
 * (if a computation value will be computed and if its a logical condition string
 * then value will be 1/0 ), 
 * 
 * 
 * 
 * 
 */
// filtrex is doing the logical if condition. it can also compute but we are using compute ie actions from parser above.  So filtrex will logical decide the expression if RCPT_TOT > 0 then action.  Action is assign new vars or do some additions for impute work.  Support is there for aggregates and api calls.

const parser = new Parser()
var { checkStringAsValidCondition } = require('./conditioner')
const { Engine } = require("json-rules-engine");

let engine;

var facts = []
var utils = require("../../../util");






/**
 * Async function fireNewEngine
 * 
 * Create an engine, clean up the ruleSuccessail
 * and register events on success and failure
 * being emitted from the engine
 * 
 * Returns nothing
 */

async function fireNewEngine(ruleSuccessFail, facts) {

    // initialize with options

    engine = new Engine();

    try {
        engine.on("success", async function (event, almanac, ruleResult) {

            // almanac.addRuntimeFact('screwdriverAficionado', true)
            // Find all the actions and computeObj should be an object of derived facts which should be added to the almanac.
            let action = event.params.action;


            if (action) {
                var computedObj = {}
                // args are actions like <New Var>: conditionstring (which is what we are after for an array of action objects)
                var asyncCalls = action.map((arg) => {
                    return checkStringAsValidCondition({ conditionstring: Object.values(arg)[0], facts })
                })
                // Use Promise.all to wait for all the async function calls to complete
                var asyncResults = await Promise.all(asyncCalls);

                // Assert facts
                // Collate the asyncResults of the async function calls

                for (let i = 0; i < asyncResults.length; i++) {
                    let vName = Object.keys(action[i])[0]
                    let val = asyncResults[i].rvValue
                    computedObj = { ...computedObj, ...{ [vName]: asyncResults[i].rvValue } }
                    almanac.addRuntimeFact(vName, val)


                }
                ruleSuccessFail.push({ event, status: "success", computedObj });
            }



        });


        engine.on("failure", function (event, almanac, ruleResult) {
            ruleSuccessFail.push({ event, status: "failed" });
        });
    } catch (e) {
        throw e;
    }
}

/**
 * Async function from an array of rules that passed or failed
 * and returns an object of valid and invalid
 * If valid and has computations, those computations are done
 * and values are stored in the facts.
 * Store new facts in an array so requestor of this function
 * can call it again.
 * 
 * 
 * @param {Array} ruleSuccessFail 
 * @param {Array} facts 
 * @returns {valid, invalid} Object comprised of arrays
 */
async function collectValidInvalidRules(ruleSuccessFail, facts) {
    var valid = [];
    var invalid = [];

    var computedRVS = []
    let aggregate = {}



    try {
        for (var i = 0; i < ruleSuccessFail.length && ruleSuccessFail[i].event; ++i) {

            let event = ruleSuccessFail[i].event
            let params = event.params
            let message = params.message
            let rvs = []
            if (params.rvs)
                rvs = await utils.getJson(params.rvs);
            let action = params.action;
            // build the rvs array of objects with field/value
            var rvsWithValues = [];
            rvs.map((r) => { rvsWithValues.push({ field: r, value: facts[0][r] ? facts[0][r] : '' }); })


            if (ruleSuccessFail[i].status == "success") {               // SUCCESS

                if (action) {
                    // args are actions like <New Var>: conditionstring (which is what we are after for an array of action objects)
                    // var asyncCalls = action.map((arg) => {
                    //     return checkStringAsValidCondition({ conditionstring: Object.values(arg)[0], facts })
                    // })
                    // Use Promise.all to wait for all the async function calls to complete
                    // var asyncResults = await Promise.all(asyncCalls);


                    // Collate the asyncResults of the async function calls
                    var computedObj = ruleSuccessFail[i].computedObj
                    // for (let i = 0; i < asyncResults.length; i++) {
                    //     let vName = Object.keys(action[i])[0]
                    //     computedObj = { ...computedObj, ...{[vName]: asyncResults[i].rvValue }}
                    // }
                    facts[0] = { ...facts[0], ...computedObj }
                    computedRVS = { ...computedRVS, ...computedObj }

                    for (let i = 0; i < action.length; i++) {
                        let vName = Object.keys(action[i])[0]
                        aggregate = { ...aggregate, ...{ [vName]: { type: 'sum', fact: facts[0][vName], aggregateValue: 0 } } }

                    }



                }
                else action = []

                // pack the valid array
                let package = (config.DEBUG) ? { id: event.type||event.ruleID, message, rvs: rvsWithValues, computedRVS, action } : { id: event.type, message, rvs: rvsWithValues, computedRVS }


                valid.push(package);
            } else {
                if (!action) action = []
                // Rule didnt fire                                      // FAIL
                let package = (config.DEBUG) ? { id: event.type||event.ruleID, message, rvs: rvsWithValues, action } : { id: event.type, message, rvs: rvsWithValues }
                invalid.push(package);
            }
        }
    }
    catch (e) {
        console.log("🚀 ~ file: index.js ~ line 133 ~ collectValidInvalidRules ~ e", e)
        throw e

    }
    // console.log("🚀 ~ file: index.js ~ line 125 ~ collectValidInvalidRules ~ valid", valid)

    // facts = utils.sortFacts(facts)

    return { valid, invalid, facts, aggregate };
}






module.exports = {

    run: async function (locals) {

        var ruleSuccessFail = [];

        var { facts, rules } = locals;
        this.facts = facts;
        config.DEBUG = false;
        /**
         * Fire the engine, load up the rules and assert facts
         * results are loaded in ruleSuccessFail
         */

        try {
            await fireNewEngine(ruleSuccessFail, facts);
            rules.map((rule) => {
                rule.priority = parseInt(rule.event.rulePriority) // rule engine uses priority while front end is coded with rulePriority
                return engine.addRule(rule)
            })


            // add expression for rules builder EDITING: can be anything like a string "RCPT_TOT >=/==/!= 0"
            engine.addFact('checkCondition', (params, almanac) => {
                return almanac.factValue('reporting_id')
                    .then(async function (condition) {
                        let value = await checkStringAsValidCondition({ facts, conditionstring: params.conditionstring })

                        return value.value
                    })
            }

            )


            // end add expression for rules builder

            await engine.run(facts[0]);// facts:[{rcpt_tot:34, pY_nn: 45,...},...{userFacts}]

            /**
             * Get the results back as valid/invalid/Undefined
             * returns { valid, invalid, facts, aggregate };
             */

            let validInvalidResults = await collectValidInvalidRules(ruleSuccessFail, facts);


            engine.stop();
            return validInvalidResults;

        }
        catch (e) {
            if (e.code) {
                let uniqueCode = [...new Set(e.code)];
                let validInvalidResults = await collectValidInvalidRules(ruleSuccessFail, facts);

                engine.stop();
                return validInvalidResults;

            }
        }
    }
}