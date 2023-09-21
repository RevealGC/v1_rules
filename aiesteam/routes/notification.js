var express = require('express');
var requireDir = require('require-dir');
var bodyParser = require("body-parser");
var router = express.Router();
var config = require('../config')


 /**************************************************** 
  * CONFIGURABLE this line for the inputParams file
  ****************************************************/
 // Get params from params, query, body, header
 var inputParams = requireDir("../inputParams")
 var paramsAll = inputParams.notification.params
 
 
// Get the handler for processing the business logic
var notificationCtrlr = require('../controllers/notification')
var handlerAll = notificationCtrlr.createNotification
// var handlerAnalytics = ctrlNaics.analyticsGetAll

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
router.post('/notification', function (req, res, next) {

    config.reqUtils.handleRequest(paramsAll, handlerAll, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})


/**
 * Get All naics for an entity.
 * V2 DONE
 */
 router.get('/logs/survey-details-archive', function (req, res, next) {
    config.reqUtils.handleRequest(paramsEnt, ctrlNaics.getNaicsByEntId, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})
module.exports = router;    