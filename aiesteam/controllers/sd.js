var Deferred = require('Deferred');
var Sequelize = require('sequelize');
/**
 * Get the URL
 * 
 * 
 * PRACTICE URL:
 * http://localhost/survey-details?filters={"reporting_id": "2800123351", "level_type":"e"}&DEBUG=true&levelType=d
 * 
 * 
 */
const url = require("url");
// var session = require("./session")
var dbSeq = require("../dbmodels/relationships")
var config = require("../config")
const Op = Sequelize.Op;
var utils = require("../util");
const { literal } = require('sequelize');

/**
 * CONFIGURABLE PARAMS for controller. Make changes here
 *
 */

let dbAll = dbSeq.survey_details
let dbGetSQL = config.sqlGetDataVersion // NOT MODIFIED YET

var entityColumns = require("./columns/entityColumns")

/**
 * 
 * END OF CONFIGURABLE PARAMS
 */

const sdLibBase = entityColumns.sdLibBase


var getProperties = ((o) => {
    return Object.getOwnPropertyNames(o);
})




/**
 * flattenResultObject since the columns from the included tables have to be 
 * returned in the results returned from sequelize.
 * @param {Object} data 
 * @returns Object which is a flattened version of the rus and rvs
 */
function flattenResultObject(data) {

    let rows = data.rows;
    let retArray = []

    for (var i = 0; i < rows.length; ++i) {
        let r = rows[i]
        let { ent_id, survunit_id, naics, alpha, type_of_operation, unit_type, category, sector, level_type } = r.reporting_unit
        let { rvname, qdm_flag, rv_description } = r.rv
        let { id, reporting_id, rvid, refper, rv_value } = r
        let versions = r.versions

        // let versionsFlat = {id: r.versions.id, 'reporting_id': r.versions_reporting_id}
        // console.log(versionsFlat)
        // retArray[i] = versions; return({'rows': [versionsFlat]})
        // let {code, description} = versions.sdfDV
        // versions ={...versions,code, description}
        retArray[i] = {
            id, ent_id, refper, reporting_id, alpha, sector, naics,
            unit_type, level_type, rvid, rvname, rv_value, category, rv_description, qdm_flag, versions
        }
    }
    data.rows = retArray;
    return data;
}







module.exports = {
    getAll: function (locals, req, res, next) {

        var def = Deferred()
        let sdLib = sdLibBase;
        if (locals.sortBy)
            var order = utils.buildOrder(locals, [[]], sdLib);

        let { api_token, reportingId, page, itemsPerPage, sortBy, sortDesc,
            filters, name, levelType, multi, entId, filter, naics, category,
            workFlowId, output, sql_from_frontend, status, args } = locals


        if (itemsPerPage < 1) {
            itemsPerPage = 10000000000
        }

        let label = 'SurveyDetails'
        let reqParams = "&itemsPerPage=" + itemsPerPage + "&name=" + name + "&filter=" + filter + "&levelType=" + levelType

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
        // Shove the entId too in the where JSON
        if (locals.entId && locals.entId != 0) {
            where['ent_id'] = locals.entId
        }
        let whereClause = utils.buildWhereClause(where, sdLib)
        where = whereClause.survey_details.where
        let versionAttributes = sdLib.survey_details_flags.attributes


        /**                                 
         * ORDER WORKS. DO NOT CHANGE THIS
         */
        //EX:  order = [[Sequelize.literal(`"reporting_unit.naics"`),'ASC']]
        /**
         *  DO NOT CHANGE the pattern
         */

     
       let include = [
            {
                as: 'rus', model: dbSeq.reporting_units,
                attributes: sdLib.reporting_units.attributes,
                where: whereClause.reporting_units.where,
            },
            {
            as: 'rv', model: dbSeq.response_variables,
            attributes: sdLib.rv.attributes,
            where: whereClause.rv.where
        },
        {
            as: 'survey_details_flags', required: false,
            model: dbSeq.survey_details_flags,
            attributes: versionAttributes,//  sdLib.versions.attributes,
            where: whereClause.survey_details_flags.where,
            // Include is now available as a virtual field for code and description
            include: [
                {
                as: 'sdfDV', model: dbSeq.flagging_data_versions,
                attributes: ['code', 'description']  // Actual field value is used to build the virtual column "description" -> "title"
            },
            {
                as: 'sdfDF', model: dbSeq.flagging_data_flags,
                attributes: ['id'] // another virtual field called data_flag_id is created, note in the sdLibBase
            }
            ]
        }
    
    
    ]



        let pathName = ''//url.parse(req.url).pathname


        // Find the rows that match the where clause
        dbAll.findAndCountAll({
            where,
            // raw:true,
            attributes: sdLib.survey_details.attributes,  // ['id', 'reporting_id', 'rvid', 'refper', 'rv_value'],
            include, limit: itemsPerPage, offset,
            order

        })
            .then(function (results) {
                if (!workFlowId) {
                    res.send(utils.getPagingDataWithSQL(results, page, itemsPerPage, pathName, dbSeq, '', locals))
                    return;
                }
                else {
                    let sqls = dbSeq.sqlGeneratedString[1]
                    let sql_clob = sqls.sql_2 + ''

                    let jobsObj = {

                        process_rules_id: workFlowId + '',
                        ayx_workflow_id: workFlowId + '',
                        sql_clob,
                        sql_from_frontend,
                        args,
                        status: 'submitted',
                        created_by: locals['X-JBID'],
                        modified_by: locals['X-JBID'],
                        output,
                        filters
                    }



                    dbSeq.ayx_jobs.create(jobsObj)
                        .then((jobsResult) => {
                            locals.jobsObj = jobsResult;
                            results = flattenResultObject(results);
                            let ayx_jobs_id = jobsResult.id;
                            let scratchPadObj = populateScratchPad(ayx_jobs_id, results.rows, locals['X-JBID'])
                            dbSeq.ayx_scratch_pad.bulkCreate(scratchPadObj)
                                .then((resultScratchPad) => {
                                    // return the data from creating 
                                    // This module is being also called from ayxJobs controller for submitting a job.  Return the jobId after creating the scratch pad
                                    def.resolve({ jobsResult, scratchPadObj })
                                    //    res.send(utils.getPagingDataWithSQL(results, page, itemsPerPage, pathName, dbSeq, '', locals))
                                    return;
                                })
                                .catch(error => {
                                    let sqls = dbSeq.sqlGeneratedString
                                    console.log("🚀 ~ file: sd.js ~ line 230 ~ .then ~ sqls", JSON.stringify(error))

                                    utils.processBusinessError(req, res, {
                                        name: "SQLError",
                                        parent: { hint: "Sql Error:" + error }
                                    })
                                })

                        })
                }
            })
            .catch(function (err) {

                console.log(JSON.stringify(err))
                let error = { name: "JSONParseError", parent: { hint: JSON.stringify(err) } }
                utils.processBusinessError(req, res, error) // Lookup config for this error code
                return;

                (utils.processBusinessError(req, res, {
                    name: "SQLError",
                    parent: { hint: { err } }
                }))
            })
        return def.promise()
    },
    // sd/labs

    getSurveyDetailsTotals: function (locals, req, res, next) {
        let { entId } = locals;
        config.dbPool.query(config.sqlgetSurveyDetailsTotals, [locals.entId], function (err, result, fields) {
            if (err) {
                utils.processBusinessError(req, res, { name: "SQLError", parent: { hint: "Sql Error:" + err } })
                return
            }
            if (!result.rows) result.rows = []
            res.send({ entId: locals.entId, data: result.rows });
        });
    },
    get: function (locals, req, res, next) {
        let props = getProperties(sdLib)
        let where = {}
        let { filters } = locals
        if (filters != '{}')
            try {
                where = JSON.parse(filters);
            } catch (e) {
                let error = { name: "JSONParseError", parent: { hint: "Could not parse the filter:" + filters } }
                utils.processBusinessError(req, res, error) // Lookup config for this error code
                return;

            }
        res.send(utils.buildWhereClause(where, sdLib))
        return;
    }
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
