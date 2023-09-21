var Deferred = require('Deferred');
var Sequelize = require('sequelize');
/**
 * Get the URL
 */
const url = require("url");

// var session = require("./session")
var dbSeq = require("../dbmodels/relationships")
var config = require("../config")
const Op = Sequelize.Op;
var utils = require("../util")
var entityColumns = require("./columns/entityColumns")


const ruLibBase = entityColumns.ruLibBase

function buildMulti(levelType, whereClause) {
    let ret = []

    if (levelType == 'c') {
        ret = [
            {
                model: dbSeq.reporting_units, as: 'ku',
                where: { 'level_type': 'd' },
                include: [{ model: dbSeq.reporting_units, as: 'estab', where: { 'level_type': 'e' } }]
            },
            {
                model: dbSeq.ru_metadata, as: 'ru_metadata', attributes: ruLibBase.ru_metadata, where: whereClause.ru_metadata.where
            }
        ]
    }
    if (levelType == 'd') {
        ret = [{ model: dbSeq.reporting_units, as: 'estab', where: { 'level_type': 'e' } },
        { model: dbSeq.ru_metadata, as: 'ru_metadata', attributes: ruLibBase.ru_metadata, where: whereClause.ru_metadata.where }]
    }
    console.log("🚀 ~ file: company.js ~ line 41 ~ buildMulti ~ ret", ret)


    return ret
}



/**
 *  {
                as: 'reporting_unit', model: dbSeq.reporting_units,
                attributes: sdLib.reporting_unit.attributes,
                where: whereClause.reporting_unit.where,
            },
 * 
 * 
 */

module.exports = {
    /**
     * Get all companies at levels c,d and e when multi=true
     * V2 DONE
     * @param {*} locals 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getAll: (locals, req, res, next) => {

        var include;

        if (locals.sortBy)
            var order = utils.buildOrderNoIncludes(locals, [['naics', 'ASC']]);//   utils.buildOrder(locals, [[]], ruLibBase);



        let label = 'companies'
        // var order = [["name1", "ASC"]];
        let { api_token, reportingId, page, itemsPerPage, sortBy, sortDesc, filters, name, levelType, multi, entId, filter, naics, category } = locals
        if (itemsPerPage < 1) {
            itemsPerPage = 10
        }
        let tableToQuery = dbSeq.reporting_units;

        let reqParams = "&itemsPerPage=" + itemsPerPage + "&name=" + name + "&filter=" + filter + "&levelType=" + levelType
        if (entId !== 0) reqParams += '&entId=' + entId
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
        let whereClause = utils.buildWhereClause(where, ruLibBase)


        where = whereClause.reporting_units.where

        if (!multi) include =
            [{
                model: dbSeq.ru_metadata,
                as: 'ru_metadata', attributes: ruLibBase.ru_metadata.attributes,
                where: whereClause.ru_metadata.where
            }]

        else include = buildMulti(levelType, whereClause)


        if (entId != 0) where.ent_id = entId


        var ret;
        // Query the db now since we have the where, include, and other params

        tableToQuery.findAndCountAll({ where, include, limit: itemsPerPage, offset, order })
            .then(function (results) {
                ret = results;

                res.send(utils.getPagingDataWithSQL(results, page, itemsPerPage, 'ru_meta', dbSeq, reqParams, locals))
            })
            .catch(function (error) {
                // res.send(ret); 
                res.send(utils.getPagingDataWithSQL(ret, page, itemsPerPage, 'ru_meta', dbSeq, reqParams, locals))
                return;
                // res.send([{ "line": "c#76" }, error]); return;
                utils.processBusinessError(req, res, error)
            })
    },
    /**
   * Get all the NAICS given an entId
   * V2  DONE
   * @param {*} locals 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
    getNaicsByEntId: (locals, req, res, next) => {
        config.dbPool.query(config.sqlNaicsByEntId, [locals.entId], function (err, result, fields) {
            if (err) {
                utils.processBusinessError(req, res, { name: "SQLError", parent: { hint: "Sql Error:" + err } })
                return
            }
            if (!result.rows) result.rows = []
            res.send({ entId: locals.entId, data: result.rows });
        });
    },

    /**
 * Get vunit level counts for an entid.
 * V2  DONE
 * @param {Object} locals 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
    getVunitLevelCounts: (locals, req, res, next) => {
        config.dbPool.query(config.sqlVunitCountByEntId, [locals.entId], function (err, result, fields) {
            if (err) {
                utils.processBusinessError(req, res, { name: "SQLError", parent: { hint: "Sql Error:" + err } })
                return
            }
            if (!result.rows) result.rows = []
            res.send({ entId: locals.entId, data: result.rows });
        });
    },
    /**
     * Get all the response variables associated with an entId 
     * V2  DONE
     * @param {*} locals 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    // get response variables by entId. Due to performance reasons using an SQL as opposed to sequelize
    getRVsByEntId: (locals, req, res, next) => {
        config.dbPool.query(config.sqlRVsByEntId, [locals.entId], function (err, result, fields) {
            if (err) {
                utils.processBusinessError(req, res, { name: "SQLError", parent: { hint: "Sql Error:" + err } })
                return;
            }
            if (!result.rows) result.rows = []
            res.send({ data: result.rows });
        });
    },

    /**
 * Get company details where level_type = c and params are entId
 * V2 DONE
 * @param {Object} locals 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 */
    getCompanyDetails: (locals, req, res, next) => {
        /**
         * db query takes 3 params
         * 1) Prepared statements that are in config.js
         * 2) Arguments to the prepared statements
         * 3) Function handler on completion of the query which captures the responses from the query
         */

        config.dbPool.query(config.getCompanyDetails, [locals.entId], function (err, result, fields) {

            if (err) {
                utils.processBusinessError(req, res, { name: "SQLError", parent: { hint: "Sql Error:" + err } })
                return
            }
            if (!result.rows) result.rows = []
            res.send({ entId: locals.entId, data: result.rows });
        });
    },




}

