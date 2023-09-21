var Deferred = require('Deferred');
var Sequelize = require('sequelize');
/**
 * Get the URL
 */
 const url = require("url");

// var session = require("./session")
var dbSeq = require("../../../dbmodels/relationships")
var config = require("../../../config")
const Op = Sequelize.Op;
var utils = require("../../../util")

/**
 * CONFIGURABLE PARAMS for controller. Make changes here
 *
 */

let dbAll = dbSeq.flagging_data_flags
let dbGetSQL = config.sqlGetDataFlags


const flaggingDataFlagsLibBase = {
    flagging_data_flags: {
        name: 'flagging_data_flags',
        attributes: ['id', 'code', 'description',
            'created_by', 'updated_by', 'deleted_by',
            'createdAt', 'updatedAt', 'deletedAt'],
        dataType: ['int', 'str', 'str',
            'str', 'str', 'str',
            'str', 'str', 'str'], where: {}, order: [[]]
    }
}


/**
 * 
 * END OF CONFIGURABLE PARAMS
 */
module.exports = {
    // uses dbAll which points to data_versions table
    getAll: function (locals, req, res, next) {
        var order = [['code']];
        let { api_token, page, itemsPerPage, sortBy, sortDesc, filters } = locals
        // Get the order
        if (typeof sortBy !== 'undefined')
            order = utils.buildOrderNoIncludes(locals, order);
           
     

        let reqParams = "&debug=" + locals.DEBUG + "&itemsPerPage=" + itemsPerPage + '&filters=' + filters + '&sortBy=' + sortBy + '&sortDesc=' + sortDesc
        reqParams += '&page=' + page
        locals['reqParams'] = reqParams
        const { offset } = utils.getPagination(page, itemsPerPage)
        var where = {}
        if (filters != '{}')
            try {
                where = JSON.parse(filters);
            } catch (e) {
                let error = { name: "JSONParseError", parent: { hint: "Could not parse the filter:" + filters } }
                utils.processBusinessError(req, res, error) // Lookup config for this error code

            }

        let whereClause = utils.buildWhereClause(where, flaggingDataFlagsLibBase)

        where = whereClause.flagging_data_flags.where

        let include = []

        dbAll.findAndCountAll({ where, include, limit: itemsPerPage, offset, order })
            .then(function (results) {
                res.send(utils.getPagingDataWithSQL(results, page, itemsPerPage, url.parse(req.url).pathname, dbSeq, reqParams, locals))
            })
            .catch(function (error) {
                console.log(error);
            })
    },
    get: function (locals, req, res, next) {
        let id = parseInt(locals.id)
        config.dbPool.query(dbGetSQL, [id], function (err, result, fields) {
            if (err) {
                utils.processBusinessError(req, res, { name: "SQLError", parent: { hint: "Sql Error:" + err } })
                return
            }
            if (!result.rows) result.rows = []
            res.send({ data: result.rows });
        });
    },
    /**
     * Add a new record in the entity
     * @param {*} locals 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    post: function (locals, req, res, next) {
        dbAll.create(locals).then((result) => {
            res.send(result)
            return;
        }).catch(error => {
            utils.processBusinessError(req, res, { name: "SQLError", parent: { hint: "Sql Error:" + error } })
            return;
        })
    },


    /**
     * Update 
     * @param {*} locals 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    update: function (locals, req, res, next) {
        let { data, id } = locals
        dbAll.update(data, {
            where: { id: id },
            returning: true
        }).then((result) => {
            res.send(result)
            return;
        }).catch(error => {
            let sqls = dbSeq.sqlGeneratedString
            // console.log("🚀 ~ file: index.js ~ line 117 ~ sqls", sqls)
            utils.processBusinessError(req, res, { name: "SQLError", parent: { hint: "Sql Error:" + error } })
            return;
        })
    },



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
    }
}