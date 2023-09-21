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
 var paramsAll = inputParams.naics.params
 var paramsEnt = inputParams.entId.params // Fir getting an id
 
// Get the handler for processing the business logic
var ctrlNaics = require('../controllers/naics')
var handlerAll = ctrlNaics.getAll
var handlerAnalytics = ctrlNaics.analyticsGetAll

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
 router.get('/analytics', function (req, res, next) {

    config.reqUtils.handleRequest(paramsAll, handlerAnalytics, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})




/**
 * requtils handler is passed
 * 1) params for the naics
 * 2) handler is the business model in the controllers folder
 * 3) req, res, err or next
 */
router.get('/naics', function (req, res, next) {

    config.reqUtils.handleRequest(paramsAll, handlerAll, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})


/**
 * Get All naics for an entity.
 * V2 DONE
 */
 router.get('/naics/company/:entId', function (req, res, next) {
    config.reqUtils.handleRequest(paramsEnt, ctrlNaics.getNaicsByEntId, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})
module.exports = router;    