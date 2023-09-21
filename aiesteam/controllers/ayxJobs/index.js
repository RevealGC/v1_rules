var Deferred = require('Deferred');
var Sequelize = require('sequelize');

// var session = require("./session")
var dbSeq = require("../../dbmodels/relationships")
var config = require("../../config")
var sdController = require('../sd')
const Op = Sequelize.Op;
var utils = require("../../util")
var services = require("../../libs/alteryx/ayxServices")
/**
 * Get the URL
 */
const url = require("url");

// Reversing the updates to the sd table. $1 is the ayx_jobs_id in the scratch pad table
let updateSDTableSQL = 'update survey_details set (rv_value) = ' +
'(select ayx_scratch_pad.rv_value from ayx_scratch_pad where survey_details.id = ayx_scratch_pad.survey_details_id '+
 '  and ayx_scratch_pad.ayx_jobs_id = $1)'

/**
 * CONFIGURABLE PARAMS for controller. Make changes here
 *
 */

let dbAll = dbSeq.ayx_jobs
let dbGetSQL = config.sqlGetAYXJOB


const ayxJobsLibBase = {
    ayx_jobs: {
        name: 'ayx_jobs',
        attributes: ['id', 'process_rules_id', 'status',
        'created_by', 'modified_by', 'deleted_by',
        'created_at', 'modified_at', 'deleted_at'],
        dataType: ['int', 'str', 'str',
            'str', 'str', 'str',
            'str', 'str', 'str'], where: {}, order: [[]]
    },
    ayx_scratch_pad: {
        name: 'ayx_jobs',
        attributes: [ 'rvid', 'rvname', 'rv_value', 'rv_scratch_value',
            'survey_details_id',
            'created_by', 'modified_by', 'deleted_by',
            'created_at', 'modified_at', 'deleted_at'],
        dataType: [ 'str', 'str', 'str', 'str', 'int',
            'str', 'str', 'str',
            'str', 'str', 'str'], where: {}, order: [[]]
    }
}


async function getJson(str){



    
    try{
    let retObj = await JSON.parse(str)
    return retObj;
    }
    catch(err){
        throw new Error(err)
    }
}



/**
 * 
 * END OF CONFIGURABLE PARAMS
 */
module.exports = {


    submitWorkFlow: async function(locals, req, res, next){
        let {filters, sql, type, output, args, workFlowId} = locals;
   
        try{
            let where =  await getJson(filters)
            let argsObj = await getJson(args)
        
            // use the where clause to filter data from sd controller
            // create an entry in the ayx_jobs and get an id for the inserted row.
            // Copy the selected data from the sd table and append the id created in the ayx_jobs table
            // to the selected columns and append those rows into the ayx_scratch_pad table
            // AYX_JOBS: will have all the parameters that have been passed in the body.
            // Submit the job to AYX with the id of the ayx_jobs(newly inserted row)
            // locals.name=''
            // locals.levelType='c'
            // locals.multi=false
            // locals.entId= 0
            // locals.naics=''
            
         
            let ayxJobsObj =  await sdController.getAll(locals, req, res, next)
     

            
            let jobId = ayxJobsObj.jobsResult.id
            let jobSubmitted = await services.postSupremeJob(jobId, workFlowId)
            res.send({jobId,workFlowId, ...jobSubmitted})

            // Call axios from here
            //res.send(ayxJobsObj)
            }
            catch (e) {
                console.log(e)



                let error = { name: "JSONParseError", parent: { hint:  e } }

                // utils.processBusinessError(req, res, error) // Lookup config for this error code

            }
 
    },






    // uses dbAll which points to data_versions table
    getAll: function (locals, req, res, next) {
        let reqParamObject = locals;
          var order =  [['id', 'DESC']];
        let { api_token, page, itemsPerPage, sortBy, sortDesc, filters } = locals
        // Get the order
        if (typeof sortBy !== 'undefined')
            order = utils.buildOrder(locals, order, ayxJobsLibBase)

        const { offset } = utils.getPagination(page, itemsPerPage)
        var where = {}
        if (filters != '{}')
            try {
                where = JSON.parse(filters);
            } catch (e) {
                let error = { name: "JSONParseError", parent: { hint: "Could not parse the filter:" + filters } }
                utils.processBusinessError(req, res, error) // Lookup config for this error code

            }

        let whereClause = utils.buildWhereClause(where, ayxJobsLibBase)

        where = whereClause.ayx_jobs.where
  

        let include = [
            {
                model: dbSeq.ayx_scratch_pad,
                as: 'ayxJobsScratchPad',
                attributes: ayxJobsLibBase.ayx_scratch_pad.attributes,
                where: whereClause.ayx_scratch_pad.where
               
            }]

        dbSeq.ayx_jobs.findAndCountAll(
            { where, include, limit: itemsPerPage, offset, order })
            .then(function (results) {
                // pathname will be like /ayx/bvd
                let pathName = url.parse(req.url).pathname
                res.send(utils.getPagingDataWithSQL(results, page, itemsPerPage, pathName, dbSeq, '', locals))
            })
            .catch(function (error) {
           
                
                console.log(error);
            })
    },





    get: function (locals, req, res, next) {
        let id = parseInt(locals.id)
        var order = [['id', 'DESC']];

        let { api_token, page, itemsPerPage, sortBy, sortDesc, filters } = locals
        let where = {  id }
        let reqParams = "&debug=" + locals.DEBUG + "&itemsPerPage=" + itemsPerPage + '&filters=' + filters + '&sortBy=' + sortBy + '&sortDesc=' + sortDesc
        reqParams += '&page=' + page
        locals['reqParams'] = reqParams


        const { offset } = utils.getPagination(1, 1)

        let whereClause = utils.buildWhereClause(where, ayxJobsLibBase)

        where = whereClause.ayx_jobs.where

        let include = [
            {
                model: dbSeq.ayx_scratch_pad,
                as: 'ayxJobsScratchPad',
                attributes: ayxJobsLibBase.ayx_scratch_pad.attributes,
                // where: whereClause.ayx_scratch_pad.where
            }]
          
        dbSeq.ayx_jobs.findAndCountAll(
            { where,
                 include,
                  limit: itemsPerPage,
                   offset, order
                    })

            .then(function (results) {
                let pathName = url.parse(req.url).pathname
                res.send(utils.getPagingDataWithSQL(results, page, itemsPerPage, pathName, dbSeq, reqParams, locals))
            })
            .catch(function (error) {
                console.log(error);
            })
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