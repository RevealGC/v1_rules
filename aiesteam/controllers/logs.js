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
const naicsLibBase = {
    naics_codes: {
        name: 'naics_codes', attributes: ['naics', 'title'],
        dataType: ['int', 'str'],
        where: {}, order: [[]]
    }
}
/**
 * FIX THIS. NOT DONE SINCE DATA and tables on logs are missing
 */
const logsLibBase = {
    analytics: {
        name: 'analytics', attributes: ['naics_code', 'naics_title', 'companies', 'kaus', 'establishments',
            'categories', 'frame_rate_pct', 'response_rate_pct'],
        dataType: ['int', 'str', 'int', 'int', 'int', 'str', 'int', 'int'],
        where: {}, order: [[]]
    }
}
module.exports = {
    /**
     * Pull data from the analytics data
     * @param {*} locals 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    logsAuditGetAll: (locals, req, res, next) => {

        let error = { name: "JSONParseError", parent: { hint: "Logs service is not operational. Log Tables are missing."  } }
  
     
        utils.processBusinessError(req, res, error)
        return;

        // NEEDS WORK

        let { api_token, page, itemsPerPage, sortBy, sortDesc, filters, naics, title, filter } = locals
        var order = [[]]
        if (typeof sortBy !== 'undefined')
            order = utils.buildOrderNoIncludes(locals, [[]]);



        const { offset } = utils.getPagination(page, itemsPerPage)
        var where = {}
        if (filters != '{}')
            try {
                where = JSON.parse(filters);
            } catch (e) {
                let error = { name: "JSONParseError", parent: { hint: "Could not parse the filter:" + filters } }
                utils.processBusinessError(req, res, error) // Lookup config for this error code
            }
        if (filters["naics"]) {
            naics = filter.naics

        }
        let whereClause = utils.buildWhereClause(where, analyticsLibBase)
        where = whereClause.analytics.where
        let attributes = analyticsLibBase.analytics.attributes
        // res.send(whereClause); return;

        dbSeq.analytics.findAndCountAll({ where, attributes, limit: itemsPerPage, offset })
            .then(function (results) {
                let pathName = url.parse(req.url).pathname
                res.send(utils.getPagingDataWithSQL(results, page, itemsPerPage, pathName, dbSeq, '', locals))
            })
            .catch(function (error) {
                res.send(error)
                console.log(error);
            })
    }


}


