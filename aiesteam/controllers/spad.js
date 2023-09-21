/**
 * Controller for:
 * Scratch pad get all. Has filters, headers, jbid, reporting_id
 */


/**
 * Will take an id of the child record and find its parent and runs it 
 * @param {} locals 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */


var Deferred = require('Deferred');
var Sequelize = require('sequelize');
const qbes = require("../libs/rules/qbes");
/**
 * Get the URL
 * 
 * 
 * PRACTICE URL:
 * http://localhost/spad?filters={"reporting_id": "2800123351"}&DEBUG=true
 * 
 * 
 * X-API-KEY: x5nDCpvGTkvHniq8wJ9m
 * X-JBID: kapoo
 * 
 * 
 */
const url = require("url");
// var session = require("./session")
var dbSeq = require("../dbmodels/relationships")
var config = require("../config")
const Op = Sequelize.Op;
var utils = require("../util");

var aggregate = require('../libs/rules/qbes/aggregate')
var reportingunit = require("./reportingunit")
const { literal } = require('sequelize');
var updateMergeSQL = 'update survey_details_flags set data_version_value = $1 , last_modified_by = $2 where refper = $3 and data_version = $4 and survey_details_id  in ' +
    ' ( select sd.id from survey_details as sd where reporting_id = $5 and sd.rvid in (select rvid from response_variables where rvname = $6) )'

/**
 * CONFIGURABLE PARAMS for controller. Make changes here
 *
 */

let dbAll = dbSeq.spad

var entityColumns = require("./columns/entityColumns")

/**
 * 
 * END OF CONFIGURABLE PARAMS
 */

const spadLibBase = entityColumns.spadLibBase


var getProperties = ((o) => {
    return Object.getOwnPropertyNames(o);
})
/**
 * postRuleUpdates
 * @param {*} locals 
 * 
 * @param {*} deltaFacts 
 */
async function postRuleUpdates(locals, deltaFacts) {
    Object.keys(deltaFacts).forEach(async key => {
        let action = deltaFacts[key].action
        let value = deltaFacts[key].newValue + ''

        let dataPayload = [value, locals.user, '2017A1', 'AC', locals.reporting_id, key]

        // Need to make the sql statement for the update operation.
        if (action === 'update') {
            let result = await config.dbPool.query(updateMergeSQL, dataPayload);
        }
        else {

            // create a new rv  with key and value
            // let {item, created} = await utils.updateOrCreate(dbSeq.response_variables,{where:{rvname:key}},{rvname:key})
        }
    })
}

async function callQbes(facts, rules) {
    try {
  
  
  
      r = await qbes.run({ facts, rules })
      return r;
    } catch (error) {
      return error;
    }
  
  }



module.exports = {

    delete: function (locals, req, res, next) {
        let { id } = locals
        let where = { id: id }

        dbAll.destroy({ where, force: true })
            .then((result) => {
                res.status(200)
                res.send({ success: true })
                return;
            }).catch(error => {
                let sqls = dbSeq.sqlGeneratedString
                utils.processBusinessError(req, res, { name: "SQLError", parent: { hint: "Sql Error:" + error } })
                return;
            })
    },

    deleteAll: function (locals, req, res, next) {

        let where = {}
        dbAll.destroy({ where, force: true })
            .then((result) => {
                res.status(200)
                res.send({ success: true })
                return;
            }).catch(error => {
                let sqls = dbSeq.sqlGeneratedString
                utils.processBusinessError(req, res, { name: "SQLError", parent: { hint: "Sql Error:" + error } })
                return;
            })

    },

  
    deployrule: function (locals, req, res, next) {
        let { rules } = locals
        console.log("🚀 ~ file: spad.js ~ line 96 ~ rules", rules)

    },
    aggregateNoRes: async function (id) {
        let ret = await  aggregate.aggregateFunction(id)
        return ret;
    },
    aggregate: async function (locals, req, res, next) {
        let { id } = req.params
        let  ret = await aggregate.aggregateFunction(id)
        res.send(ret)
    },

    merge: async function (locals, req, res, next) {
        var where = {}

        where['id'] = locals.id
        try {


            let result = await dbSeq.spad.findAndCountAll({ where })
            let merge_data = result.rows[0].merge_data
            locals.reporting_id = result.rows[0].reporting_id
            locals.user = config.defaultUser
            await postRuleUpdates(locals, merge_data)
            // update the status of the spad 

            let sql = "update spad set merge_status = 0 where id = $1"
            await config.dbPool.query(sql, [locals.id])


            // {"merge_data":{"RCPT_TOT":{"action":"update","newValue":3500002,"originalValue":3500000},"NEW_RCPT_TOT":{"action":"create","newValue":70316000}},"reporting_id":"8771348140"}


            let data = {
                "success": true,
                "status": "Completed",
                "event": "attended-merge",
                "message": "Merged data successfully",
                "response": { merge_data, jobsid: locals.id },
            }



            // Make a call to merge data 
            res.send(data)
        } catch (e) {
            console.log("🚀 ~ file: spad.js ~ line 169 ~ e", e)
            let error = { name: "JSONParseError", parent: { hint: "Could not merge the data for jobid: " + locals.id } }
            utils.processBusinessError(req, res, error) // Lookup config for this error code
            return;

        }

    },
    getAll: function (locals, req, res, next) {

    

        let sdLib = spadLibBase;
        if (locals.sortBy)
            var order = utils.buildOrder(locals, [[]], sdLib);
        else
            order = [['id', 'DESC']]


        let { api_token, reporting_id, page, itemsPerPage, sortBy, sortDesc,
            filters, name, id } = locals





        if (!itemsPerPage || itemsPerPage < 1) {
            itemsPerPage = 50
        }

        itemsPerPage = 10;
        let label = 'ScratchPad'
        let reqParams = "&itemsPerPage=" + itemsPerPage + "&id=" + id + "&filters=" + filters + "&reporting_id=" + reporting_id

        var { offset } = utils.getPagination(page, itemsPerPage)
        var where = {}

        /**
         * Where is being built
         * 
         */
        if (filters != '{}')
            try {
                where = JSON.parse(filters);
            } catch (e) {
                let error = { name: "JSONParseError", parent: { hint: "Could not parse the filter:" + filters } }
                utils.processBusinessError(req, res, error) // Lookup config for this error code
                return;

            }

        if (locals.id) {
            where['id'] = locals.id
        }
        where['parent_id'] = 0
        let whereClause = utils.buildWhereClause(where, sdLib)
        let attributes = sdLib.spad.attributes

        let include = [
           
            {
                as: 'spadself', model: dbSeq.spad,
                attributes: sdLib.spad.attributes,
                required: false,
                include:[{
                    as: 'spadLevel2', model: dbSeq.spad,
                    attributes: sdLib.spad.attributes,
                    required: false
                }]
            }

        ]





        let pathName = ''//url.parse(req.url).pathname
        // Find the rows that match the where clause
        dbAll.findAndCountAll({ where, attributes, include, limit: itemsPerPage, offset, order })
            .then(function (results) {
                res.send(utils.getPagingDataWithSQL(results, page, itemsPerPage, pathName, dbSeq, '', locals))
                // console.log('Still processing')
                return;
            })
            .catch(function (err) {
                let error = { name: "JSONParseError", parent: { hint: JSON.stringify(err) } }
                utils.processBusinessError(req, res, error) // Lookup config for this error code
                return;
            })
    } ,


// processRules
/**
 * create a function called processRules as an async function that will take locals, req, res, next
 * locals is passed to it from the router in spad.js (routes folder)
 * locals has these properties:
 * facts & rules, are arrays, parent_id: defaults to 0 otherwise it is the parent workflow id,
 * ruleType is a string which can be ['validation',...] Array by default or any type(rules_repo table column) of rule
 * and showNetwork is true by default which will show all children and sub children to process the rules for a given reporting id
 * and reporting_id is required.  This works on different reporting_id one at a time, Will need to extend it to handle an array of reporting ids.
 * @param {*} locals 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

processRules: async function(locals, req, res, next) {
    let { facts, rules } = locals
   
        locals.reporting_id = locals.reporting_id || locals.facts[0].reporting_id || 2010161087 // Default RID
        locals.user = req.headers['x-jbid']
        reportingunit.validate(locals, req, res, next)

},
/**
 * Will become defunct, it is being replaced with processRules with an updated InputParams for spad and rename.
 * @param {} locals 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

     testrule: async function (locals, req, res, next) {
        let { facts, rules } = locals

        locals.reporting_id = locals.facts[0].reporting_id
        locals.user = req.headers['x-jbid']
 
        // locals.rules = TESTExpressionRule


        

        // let spadId = await utils.createSpadRecord(locals)
        // res.send({message: "Testing rule and facts", rules,facts, spadId})
        reportingunit.validate(locals, req, res, next)

        // let ret = await callQbes(facts, TESTExpressionRule)
        // console.log("🚀 ~ file: spad.js:295 ~ ret", ret)
        // res.send(ret)

        // return;


    },
}

let populateScratchPad = ((ayx_jobs_id, results, jbid) => {
    let scratchPadObj = []
    for (var i = 0; i < results.length; ++i) {
        let { rvid, rvname, rv_value, id, reporting_id, refper } = results[i]
        let modified_by = jbid
        let created_by = jbid
        // console.log("🚀 ~ file: sd.js ~ line 277 ~ populateScratchPad ~ results", results[i])
        scratchPadObj.push({ ayx_jobs_id, survey_details_id: id, rvid, rvname, rv_value, reporting_id, refper, created_by, modified_by })
    }

    return scratchPadObj

})
// RCPT_TOT == 3500002 or substr(RCPT_TOT+'',0,4)== '3500'
let TESTExpressionRule = [
    {
        "conditions": {
            "all": [
                {
                    "fact": "checkCondition",
                    "path": "$.value",
                    "params": {
                        conditionstring: "substr(reporting_id,0, 2) == \"87\" and substr(street, 0,3) == \"942\""
                    },
                    "operator": "equal",
                    "value": true
                }
            ]
        },
        "event": {
            "name": "NK Price change check",
            "params": {
                "action": [
                    {
                        "PAY_ANN": "PAY_ANN"
                    },
                    {
                        "RCPT_TOT": "RCPT_TOT"
                    },
                    {
                        "PAY_QTR1": "PAY_QTR1"
                    },
                    {
                        "CHILD_REN": "1+0"
                    }
                ],
                "actionType": "impute",
                "impute": [
                    {
                        "computedRV": "PAY_ANN",
                        "expression": "PAY_ANN"
                    },
                    {
                        "computedRV": "RCPT_TOT",
                        "expression": "RCPT_TOT"
                    },
                    {
                        "computedRV": "PAY_QTR1",
                        "expression": "PAY_QTR1"
                    },
                    {
                        "computedRV": "CHILD_REN",
                        "expression": "1+0"
                    }
                ],
                "message": " COMP1 >=10 CHAINED RULE VIA COMP1 WHICH IS COMPUTED EARLIER",
                "rvs": "[\"RCPT_TOT\",\"PAY_ANN\"]",
                "rvsJSON": [
                    "RCPT_TOT",
                    "PAY_ANN"
                ]
            },
            "ruleId": "101",
            "type": "1"
        },
        "index": 13
    }
]