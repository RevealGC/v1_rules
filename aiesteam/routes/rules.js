var express = require('express');
var requireDir = require('require-dir');
var bodyParser = require("body-parser");
var router = express.Router();
var config = require('../config')
var utils = require("../util")


 /**************************************************** 
  * CONFIGURABLE this line for the inputParams file
  ****************************************************/
 // Get params from params, query, body, header
 var inputParams = requireDir("../inputParams")
 var paramsRules = inputParams.rules.params //<< CHANGE IT
 var paramsOutput = inputParams.rulesOutput.params
 var paramsQueueJob = inputParams.rulesQueueJob.params
 // var paramsEnt = inputParams.entId.params // Fir getting an id
 
// Get the handler for processing the business logic
var ctrlRules = require('../controllers/rules') //CHANGE IT
var handlerWorkflows = ctrlRules.getWorkflows //CHANGE IT
var handlerQuestions = ctrlRules.getQuestions
var handlerQueueJob = ctrlRules.postJob
var handlerWorkStatus = ctrlRules.getWorkStatus
var handlerJobStatus = ctrlRules.getJobStatus
var handlerJobOutput = ctrlRules.getJobOutput
var handlerQueueJobRule = ctrlRules.postJobRule
var handlerQuesbyWkflw = ctrlRules.getQuesbyWkflow
var handlerQueueJobByWkflow = ctrlRules.postJobByWkflow
var handlerStatusByWkflow = ctrlRules.getStatusByWkflow
var handlerQueueSupremeJob = ctrlRules.postSupremeJob

 /**************************************************** 
  * 
  * END of CONFIGURABLE
  * 
  ****************************************************/

/**
 * requtils handler is passed
 * 1) params for the naics
 * 2) handler is the business model in the controllers folder
 * 3) req, res, err or next
 */

// ensuring that this is correct.

 router.get('/ayx/rules/list-workflows', function (req, res, next) {

    config.reqUtils.handleRequest(paramsRules, handlerWorkflows, req, res, (err) => { if (err) utils.processError(req, res, err) })
    .then(results => { })
    .catch(error => { })
})

router.get('/ayx/rules/list-questions/:workflowId', function (req, res, next) {

    config.reqUtils.handleRequest(paramsRules, handlerQuesbyWkflw, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})

router.post('/ayx/rules/queue-job/:workflowId', function (req, res, next) {


    config.reqUtils.handleRequest(paramsQueueJob, handlerQueueJobByWkflow, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})


/**
 * post supreme job endpoint. -- USED for generalizing the entire workflow process (Naveen will call my method in ayxServices)
 */
router.post('/ayx/rules/queue-supreme-job/:jobId', function (req, res, next) {


    config.reqUtils.handleRequest(paramsQueueJob, handlerQueueSupremeJob, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})

router.get('/ayx/rules/workflow-status/:workflowId', function (req, res, next) {

    config.reqUtils.handleRequest(paramsRules, handlerStatusByWkflow, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})

router.get('/ayx/rules/job-status/:jobId', function (req, res, next) {

    config.reqUtils.handleRequest(paramsRules, handlerJobStatus, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})

router.get('/ayx/rules/job/:jobId/output/:outputId', function (req, res, next) {

    config.reqUtils.handleRequest(paramsOutput, handlerJobOutput, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})



// These endpoints are hardcoded -- was made with AYX_APP_ID fixed in mind. Will not necessarily be useful. But good for learning.
router.get('/ayx/rules/list-questions', function (req, res, next) {

    config.reqUtils.handleRequest(paramsRules, handlerQuestions, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})

router.post('/ayx/rules/queue-job', function (req, res, next) {

    config.reqUtils.handleRequest(paramsQueueJob, handlerQueueJob, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})

router.get('/ayx/rules/workflow-status', function (req, res, next) {

    config.reqUtils.handleRequest(paramsRules, handlerWorkStatus, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})

module.exports = router;    