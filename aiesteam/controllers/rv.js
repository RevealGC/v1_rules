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

const rvLibBase ={
    response_variable:{name: 'response_variables', attributes:['rvid','rvname','rv_description', 'mu_flag', 'kau_flag','estab_flag','qdm_flag'],
    dataType:['int', 'str', 'str', 'str', 'str', 'str', 'str'], where: {}, order: [[]]}
}

module.exports = {

    getAll: function (locals, req, res, next) {
        // var def = Deferred()
        if(locals.sortBy)
        var order = utils.buildOrderNoIncludes(locals, [['rvid', 'ASC']]);//   utils.buildOrder(locals, [[]], ruLibBase);


        let { api_token, page, itemsPerPage, sortBy, multi, sortDesc, filters, name, filter } = locals
        let reqParams = "&debug=" + locals.DEBUG + "&itemsPerPage=" + itemsPerPage + "&name=" + name + "&filter=" + filter
        locals['reqParams'] = reqParams

        const { offset } = utils.getPagination(page, itemsPerPage)
        let attributes = ['rvid','rvname', 'rv_description', 'mu_flag', 'kau_flag', 'estab_flag', 'qdm_flag']
        var where = {}
        if (filters != '{}')
            try {
                where = JSON.parse(filters);
            } catch (e) {
                let error = { name: "JSONParseError", parent: { hint: "Could not parse the filter:" + filter } }
                utils.processBusinessError(req, res, error) // Lookup config for this error code

            }
         
            let whereClause = utils.buildWhereClause(where, rvLibBase)
            where = whereClause.response_variable.where

        var include = []// (!multi) ? [] : [{ model: dbSeq.survey_details, as:'sd', limit: 10, }]
        dbSeq.response_variables.findAndCountAll({ where, attributes, include, limit: itemsPerPage, offset, order })
            .then(function (results) {
                let pathName = url.parse(req.url).pathname
                res.send(utils.getPagingDataWithSQL(results, page, itemsPerPage, pathName, dbSeq, reqParams, locals))
            })
            .catch(function (error) {

                console.log(error);
            })
    },

/**
     * Update 
     * @param {*} locals 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
 update: function(locals, req, res, next){
    let {data, id} = locals
    dbSeq.response_variables.update(data,{
        where: { rvid: id },
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

post: function (locals, req, res, next) {
    dbSeq.response_variables.create(locals).then((result) => {
        res.send(result)
        return;
    }).catch(error => {
        utils.processBusinessError(req, res, { name: "SQLError", parent: { hint: "Sql Error:" + error } })
        return;
    })
},


    delete: function(locals, req, res, next){
        let {id} = locals
        let where = {rvid:id}
        
        dbSeq.response_variables.destroy({where,force:true })
            .then((result) => {
                let sqls = dbSeq.sqlGeneratedString
                console.log("🚀 ~ file: rv.js ~ line 59 ~ .then ~ sqls", sqls)
                res.status(200)
                res.send({success: true})
                return;
            }).catch(error => {
            let sqls = dbSeq.sqlGeneratedString
                utils.processBusinessError(req, res, { name: "SQLError", parent: { hint: "Sql Error:" + error } })
                return;
            })
        }


}

