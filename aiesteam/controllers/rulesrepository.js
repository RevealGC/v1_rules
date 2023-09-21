var Deferred = require('Deferred');
var Sequelize = require('sequelize');
var reportingunit = require('./reportingunit')
// var { checkStringAsValidCondition } = require("../libs/rules/qbes/conditioner");// require('filtrex')

/**
 * Get the URL
 */
const url = require("url");
// var session = require("./session")
var dbSeq = require("../dbmodels/relationships")
var config = require("../config")
const Op = Sequelize.Op;
var utils = require("../util")
var { checkStringAsValidCondition } = require("../libs/rules/qbes/conditioner")


var rulesCompiler = require("../libs/rules/compiler");
const { sortFact } = require('../util');

const rulesRepoLib = {
    rules_repository: {
        name: 'rules_repository',
        attributes: ['id', 'name', 'description', 'active', 'type', 'rvs', 'data', 'share_flag'],
        dataType: ['int', 'str', 'str', 'bool', 'str', 'jsonb', 'jsonb', 'int'], where: {}, order: [[]]
    }
}





async function getRules(locals) {
    if (!locals.itemsPerPage)
        locals['itemsPerPage'] = 5000;

    if (!locals.page)
        locals['page'] = 1;

    // if (locals.sortBy)
    var order = [['id', 'DESC']] //utils.buildOrderNoIncludes(locals, [['id', 'DESC']]);//   utils.buildOrder(locals, [[]], ruLibBase);



    let { api_token, page, itemsPerPage, sortBy, multi, sortDesc, filters, name, filter } = locals
    let reqParams = "&debug=" + locals.DEBUG + "&itemsPerPage=" + itemsPerPage + "&name=" + name + "&filter=" + filter


    locals['reqParams'] = reqParams

    const { offset } = utils.getPagination(page, locals.itemsPerPage)
    let attributes = rulesRepoLib.attributes
    var where = {}
    if (filters != '{}')


        try {
            where = JSON.parse(filters);
        } catch (e) {
            let error = { name: "JSONParseError", parent: { hint: "Could not parse the filter:" + filter } }
            // utils.processBusinessError(req, res, error) // Lookup config for this error code
            throw error
        }

    var include = []

    let whereClause = utils.buildWhereClause(where, rulesRepoLib)
    where = whereClause.rules_repository.where
    try {
        let results = await dbSeq.rules_repository.findAndCountAll({ where, include, limit: itemsPerPage, offset, order })
        let parsed_rules = [], parsedRulesArray = []
        let rows = results.rows
        rows.map(row => parsedRulesArray.push(row.parsed_rule))

   

        // package the parsed rules and put them in the result.data

        results.parsedRulesArray = parsedRulesArray
        return results;
    }
    catch (e) {
        console.log(e)
    }
}


module.exports = {



    saveMultipleRules: async function (locals, req, res, next) {
        let {data} = req.body;
        let id = 0, active = true
        let rulesSaved = []
        for(var i = 0; i < data.length; ++i){

            delete data[i].id
            
            let result = await dbSeq.rules_repository.create(data[i])

            console.log(result.dataValues)
            id = Number(result.dataValues.id)
            data[i].parsed_rule.event.type = id
            data[i].parsed_rule.event.ruleId = id
            data[i].parsed_rule.event.params.actionType = 'impute'
            data[i].parsed_rule.event.params.rvsJSON = ["PAY_ANN"]
            data[i].parsed_rule.event.params.rvs = JSON.stringify(["PAY_ANN"])
            // data[i].parsed_rule.event.params.rvs = JSON.stringify(["PAY_ANN"])
            data[i].parsed_rule.event.params.actionType = 'impute'
            let active = 1//data.parsed_rule.event.active ? 1 : 0

           let where =  { id: id} 
            result = await utils.updateOrCreate(dbSeq.rules_repository, where, { parsed_rule: data[i].parsed_rule, active, data: data[i].parsed_rule,
                 type: data[i].parsed_rule.event.validationType })
          
            rulesSaved.push(id)

            
        }

        res.send({rulesSaved, data})
    },


    /**
     * Passed an array of parametersArray : [
     * {"key":2,"ruleId":2,"priority":5,"conditionstring":"substr(naics00,1,3) ==484  and  (TRUCK_WOD_NUM + TRUCK_NUM_TOT) != TRUCK_NUM_TOT and UNIT_TYPE == \"KAU\"","message":"Truck Inventories not in balance","action":[{"TRUCK_NUM_TOT":"TRUCK_WD_NUM +TRUCK_WOD_NUM "}],"actionString":"[{\"TRUCK_NUM_TOT\":\"TRUCK_WD_NUM +TRUCK_WOD_NUM \"}]"}]
     * @param {*} locals 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    stringsToRules: async function (locals, req, res, next) {
        let { paramFile } = locals

        // results will be objects:
        // key: key, rule: { event, conditions}, result: {key: , conditionResult, actionResult }

        var results = []
        var conditionError = []
        var actionError = []
        var factsNeeded = {}
        var factsNeededNameValue = []

        for (var i = 0; i < paramFile.length; ++i) {
            let index = i
            let p = paramFile[i]

            let rvsJSON = []// ["PAY_ANN"] // Defaultng some
            let rvs = JSON.stringify(rvsJSON)

            let { ruleId } = p, active = true, name = p.message, actionType = 'impute', validationType = p.validationType||'dynamic', rulePriority = p.priority, params = {
                rvs, rvsJSON,
                action: p.action, message: p.message
            }

            let event = {
                ruleId, type: ruleId, active, name, actionType, validationType, rulePriority, params
            }

            let ret = await checkStringAsValidCondition({ facts: [null], conditionstring: p.conditionstring })


            // ["naics00","TRUCK_WOD_NUM","TRUCK_NUM_TOT","UNIT_TYPE","KAU"]
            // let fA = ret.expressionVariables.map(f => ({[f]:''} ) 
            for (const element of ret.expressionVariables) {
                factsNeeded[element] = '';
              }
         

              factsNeeded =  utils.sortFact(factsNeeded)  //sortedObj
             

       


              
            // console.log("🚀 ~ file: rulesrepository.js:111 ~ ret", ret.expressionVariables, factsNeeded)

            if(ret.error){
                conditionError.push({ruleId: p.ruleId, type: p.ruleId, row: p.ruleId, message: ret.message, expression: ret.expression })
            }

            // let status = (ret)

            let conditions = {
                all: [{
                    "fact": "checkCondition",
                    "path": "$.value",
                    "operator": "equal",
                    "value": true,
                    "params": {
                        "conditionstring": p.conditionstring
                    }
                }]
            }



            // Do the action test
            let args = p.action

            // args are actions like <New Var>: conditionstring (which is what we are after for an array of action objects)
            const asyncCalls = args.map((arg) => {
                return checkStringAsValidCondition({ conditionstring: Object.values(arg)[0], facts: [null] })
            })



            // Use Promise.all to wait for all the async function calls to complete
            const actionResults = await Promise.all(asyncCalls);
            // Collate the results of the async function calls
            const collatedResults = [];
            try {
                for (let i = 0; i < args.length; i++) {
                    let key = (Object.keys(args[i])[0])
                
                    collatedResults.push({ key: key, value: actionResults[i].rvValue,
                        
                        expressionVariables: utils.findVariables(actionResults[i].rvName ),
                        derivedVariables: key,
                        actionResult: actionResults[i],
                        expression: actionResults[i].rvName })
                }
            } catch (error) {
                console.log("🚀 ~ file: rulesrepository.js:149 ~ stringsToRules:function ~ error", error)

            }

            // End the action test

            let out = {
                "conditionstring": p.conditionstring,
                "actiontring": JSON.stringify(p.action),
                rule: { event, conditions, index: -1 },
                output: ret,
            
                outputAction: collatedResults,
                
                // conditionResult:JSON.stringify(ret)
                //, actionResult:status
            }
            // {key:p.key,conditionResult:status, actionResult:status}}

            results.push(out)
        }


        
        for (let key in factsNeeded) {
            factsNeededNameValue.push({ name: key, value: factsNeeded[key] });
          }

        res.send({results,     conditionError,
            factsNeeded,
            factsNeededNameValue,
            outputErrorCount: conditionError.length})

    },



    /**
 * Get all distinct rule types getDistinctRuleTypes
 * @param {get} locals 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

    getDistinctRuleTypes: async function (locals, req, res, next) {
        const sql = 'select distinct type as type , count(*) as cnt from product_aies.rules_repository group by type order by type'
        try {
            let result = await config.dbPool.query(sql, []);
           
            return (result.rows);

        } catch (e) {
            console.log("🚀 ~ file: rulesrepository.js:93 ~ getDistinctRuleTypes:function ~ e", e)
            throw e;
        }

    },

    //Testing actions

    actiontest: async function (locals, req, res, next) {
        var error = {}




        const { facts, action } = locals
        let args = JSON.parse(action)

        // args are actions like <New Var>: conditionstring (which is what we are after for an array of action objects)
        const asyncCalls = args.map((arg) => {
            return checkStringAsValidCondition({ conditionstring: Object.values(arg)[0], facts })
        })



        // Use Promise.all to wait for all the async function calls to complete
        const results = await Promise.all(asyncCalls);
       


        // Collate the results of the async function calls
// Will show undefined if any of the computed vars are undefined.

        const collatedResults = [];
        for (let i = 0; i < args.length; i++) {
            let key = (Object.keys(args[i])[0])
            collatedResults.push({ key: key, value: results[i].ruleResult ,
                // rvValue,
                 expression: results[i].rvName })
        }

        // imputedValue: results[i], imputedVariable:(Object.keys(args[i])[0])})

        res.send(collatedResults);


    },



    testcondition: async function (locals, req, res, next) {
        // var error = {}

        try {



            let ret = await checkStringAsValidCondition(locals)
           

            //if there are no errors then return this api endpoint to the user with the following object:
            // parseSucess,message is the conditionstring, value, conditionObject which is used to build the rule, ruleResult is the value of a computation and all facts used for the computation, value is true or false.

            if (!ret.error) {

                res.send({ parseSuccess: true, message: locals.conditionstring, value: ret.value, condition: ret.conditionObject, ruleResult: ret.ruleResult, facts: locals.facts })
            }
            else {

                // error = { parseSuccess: ret.parseSuccess, name: "JSONParseError", parent: { hint: "Could not parse the condition:" + ret.message } }

                
                res.send({ parseSuccess: ret.parseSuccess, message: locals.conditionstring, value: ret.value, condition: ret.conditionObject, ruleResult: ret.rvValue, facts: locals.facts })
             
               
                // utils.processBusinessError(req, res, error)
            }

            return;
        } catch (e) {
            console.log("🚀 ~ file: rulesrepository.js:146 ~ e", e)
            // Should not be called since the checkStringCondition function in the conditioner will convert any error to set the ret.error = true and the message will be in ret.message above


            //            let error = { parseSuccess: false, name: "JSONParseError", parent: { hint: "Could not parse the condition:" + e.message +' '+locals.conditionstring, ruleResult:'Cannot be parsed'} }
            //            res.send(error)

            // // let o = { parseSuccess: false, message: e.message, value: ret.rvValue,   ruleResult: ret.ruleResult, facts: locals.facts }

            //             // console.log("🚀 ~ file: rulesrepository.js:156 ~ o", o)
            //             // res.send(o)
            //             console.log("🚀 ~ file: rulesrepository.js:158 ~ error", error)
            //             // utils.processBusinessError(req, res, error)
            //             return;
        }
    },



    createdummyrule: function (locals, req, res, next) {
        try {
            res.send('Creating a dummy rule')


        } catch (error) {
            res.send(error)
        }
    },





    getFactsAndRules: async function (locals, req, res, next) {
        let parsedRulesArray = []
        locals.reporting_id = Number(req.params.enity_id)
        try {
            let results = await getRules(locals);
            let rows = results.rows
            rows.map(row => parsedRulesArray.push(row.parsed_rule))
            let facts = await utils.getReportingData(locals)
            // let attributes = await utils.getAttributes(locals)
            let factKeys = Object.keys(facts[0])
            let resultArray = []
            factKeys.map(f => resultArray.push({ name: f, type: 'number', value: facts[0][f] }))
            resultArray[0]['reporting_id'] = locals.reporting_id
            // console.log("🚀 ~ file: rulesrepository.js:215 ~ attributes", resultArray, attributes)
            // // add value to the attributes
            // let attributesWithValue = attributes.attributes.map((a) => {
            //     if (!a.value) a.value = facts[0][a.name];
            //     return a
            // })

            // attributesWithValue[0] = { ...attributesWithValue[0], ...{ name: 'reporting_id', value: locals.reporting_id, type: 'number' } }

            // attributesWithValue
            let dateTime = utils.dateTime()
            let factsToUpperCase = Object.fromEntries(Object.entries(facts[0]).map(([k, v]) => [k.toUpperCase(), v]))
            resultArray = resultArray.map(obj=>Object.fromEntries(Object.entries(obj).map(([k, v]) => k == 'name' ? [k, v.toUpperCase()]: [k, v])))
            console.log({factsToUpperCase, resultArray})
            let output = { ...{ name: "RID(" + req.params.enity_id + ') ' + dateTime }, ...{ attributes: resultArray }, ...{ decisions: parsedRulesArray }, ...{ facts: factsToUpperCase } }
            res.send(output)
        }
        catch (e) {
            console.log(e)


            res.status(500)
            res.send({ error: e })
        }
    },


    getRuleByID: async function (locals) {
        let parsedRulesArray = []
        try {
            let results = await getRules(locals);
            let rows = results.rows
            rows.map(row => parsedRulesArray.push(row.parsed_rule))
            return parsedRulesArray
        }
        catch (e) {
            throw e
        }
    },

    compileDbRule: async function (locals, req, res, next) {
        let entity_id = locals.entity_id;
        let kau_id = locals.kau_id;
        let estab_id = locals.estab_id;
        locals.filters = JSON.stringify({
          "entity_id": entity_id,
          "kau_id": kau_id,
          "estab_id": estab_id
        });
        locals.offset = 0

        locals.modified_by = req.header("X-JBID")


        delete locals['X-API-KEY']
        delete locals['X-JBID']

        try {

            // Get the rule that needs to be compiled

            var ruleRepoObj = await getRules(locals)
            // get the data on the rules and associated rulename 


            if (!ruleRepoObj.rows.length) {
                utils.processBusinessError(req, res, { name: "SQLError", parent: { hint: "Sql Error: No rule found by the id provided:" + id } })
                return;
            }
            var rule = ruleRepoObj.rows[0].data
            var ruleName = ruleRepoObj.rows[0].description
            var ruleString = JSON.stringify(rule)
            var rvs = ruleRepoObj.rows[0].rvs

            var retObj

            // Compile the string to an object
            try {
                retObj = await rulesCompiler.compile(rule, id);

            }
            catch (e) {
                console.log("🚀 ~ file: rulesrepository.js ~ line 121 ~ e", e)
                throw e
                return;
            }


            // Data is parsed to parsed_rules
            /**
             * Rule input object
             * {rvs, name, data:{conditions:{any/all:[{field:, operator:, value:}]}, actions}}
             * 
             * Parsed_rule Object
             * {event:{name:,type:, params:{message:, action:, rvs}}}
             */

            locals.data = rule
            locals.parsed_rule = retObj.parsed_rule

            locals.parsed_rule.event.name = ruleName
            locals.parsed_rule.event.params.rvs = rvs


            // Update the record with parsed_values

            dbSeq.rules_repository.update(locals, { where: { id: id }, returning: true })
                .then((result) => {
                    res.send(result)
                    return;
                }).catch(error => {
                    utils.processBusinessError(req, res, { name: "SQLError", parent: { hint: "Sql Error:" + error } })
                    return;
                })



        } catch (e) {
            let error = { name: "JSONParseError", parent: { hint: "Could not compile rule" + id } }
            throw error
        }
    },


    getAll: async function (locals, req, res, next) {


        try {


            let results = await getRules(locals);
            let pathName = url.parse(req.url).pathname
            res.send(utils.getPagingDataWithSQL(results, locals.page, locals.itemsPerPage, pathName, dbSeq, '', locals))
        }
        catch (e) {
            console.log(e)
            if (e == 'JSONParseError') {
                let error = { name: "JSONParseError", parent: { hint: locals.filters } }
                utils.processBusinessError(req, res, error)
                return;
            }
            utils.processBusinessError(req, res, e)


            // Lookup config for this error code
        }
    },
    /**
     * 
     * @param {*} locals : data:{active: true/false,parsed_rule:<json object> }, id, 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    updateParsedRule: async function (locals, req, res, next) {
        let { data, id } = locals
        try {
            if (id == '0') {
                delete data.id
                delete data.data
                let result = await dbSeq.rules_repository.create(data)

                id = Number(result.dataValues.id)
                data.parsed_rule.event.type = id
                data.parsed_rule.event.ruleId = id
                let active = data.parsed_rule.event.active ? 1 : 0


                result = await utils.updateOrCreate(dbSeq.rules_repository, { id }, { parsed_rule: data.parsed_rule, active, data: data.parsed_rule })
                let sql = 'select * from product_aies.rules_repository where id = $1'
                let rule = await config.dbPool.query(sql, [id])
                res.send(rule.rows);
                return
            }
            else {
                let active = data.parsed_rule.event.active
                data.active = active
                result = await dbSeq.rules_repository.update(data, { where: { id: id } })
                let sql = 'select * from product_aies.rules_repository where id = $1'
                let rule = await config.dbPool.query(sql, [id])
                res.send(rule.rows);

                return;
            }
        } catch (e) {
            let error = { name: "SQLError", parent: { hint: "Sql Error:" + e } }
            console.log("🚀 ~ file: rulesrepository.js ~ line 264 ~ error", error)
            utils.processBusinessError(req, res, error)

            return;
        }
    },

    /**
         * Update for rule formats that does not follow parsed-rules. This will call the compileRuleString
         * @param {*} locals : {id, data{active:true/false,}}
         * @param {*} req 
         * @param {*} res 
         * @param {*} next 
         */
    update: async function (locals, req, res, next) {
        let { data, id } = locals

        locals.modified_by = req.header("X-JBID")

        delete locals['X-API-KEY']
        delete locals['X-JBID']


        try {

            if (locals.data) {

                let { data, parsed_rule } = await utils.compileRuleString(locals.data, 'rule');
                locals.data = data
                locals.parsed_rule = parsed_rule

            }
            dbSeq.rules_repository.update(locals, { where: { id: id }, returning: true })
                .then((result) => {
                    res.send(result)
                    return;
                }).catch(error => {
                    utils.processBusinessError(req, res, { name: "SQLError", parent: { hint: "Sql Error:" + error } })
                    return;
                })

        }
        catch (e) {
            console.log("🚀 ~ file: rulesrepository.js ~ line 112 ~ e", e)
            utils.processBusinessError(req, res, e)
            //   { name: "SQLError", parent: { hint: "Sql Error:" + error } })
        }
    },

    post: async function (locals, req, res, next) {
        locals.created_by = req.header("X-JBID")
        locals.modified_by = req.header("X-JBID")

        /**
         * Get the rule and compie it.  Save the compiled version in parsed_rule in rules_repository table.
         */

        try {
            let rulesObj = await utils.compileRuleString(locals.data, locals.name);

            locals.data = rulesObj.data
            locals.parsed_rule = rulesObj.parsed_rule


            dbSeq.rules_repository.create(locals).then((result) => {
                res.send(result)
                return;
            }).catch(error => {
                utils.processBusinessError(req, res, { name: "SQLError", parent: { hint: "Sql Error:" + error } })
                return;
            })
        }
        catch (e) {
            console.log("🚀 ~ file: rulesrepository.js ~ line 121 ~ e", e)
            utils.processBusinessError(req, res, e)
            //   { name: "SQLError", parent: { hint: "Sql Error:" + error } })
        }
    },


    delete: function (locals, req, res, next) {
        let { id } = locals
        id = JSON.parse(id)

        let where = { id: id }

        dbSeq.rules_repository.destroy({ where, force: true })
            .then((result) => {
                let sqls = dbSeq.sqlGeneratedString
                res.status(200)
                res.send({ success: true })
                return;
            }).catch(error => {
                let sqls = dbSeq.sqlGeneratedString
                utils.processBusinessError(req, res, { name: "SQLError", parent: { hint: "Sql Error:" + error } })
                return;
            })
    }
}

