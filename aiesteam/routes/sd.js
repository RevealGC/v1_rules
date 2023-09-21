/**
 * Author: Naveen Kapoor
 * Dated: June 28, 2022
 * Modified: June 28, 2022
 * Main Entry point from app.
 * 1) Defines all entry points
 * 2) For each entry point, the handleRequest is passed the following parameters
 * 2.1) params: For each url the parameters could be received from param, query, body or header
 * 2.2) <business model>: Business model is defined in the model folder. It points to a method. Its called the handler
 * 2.3) req
 * 2.4) res
 * 2.5) next(): Is mapped to an error handler. In case the parameters do not meet 
 * the constraints specified in the params(1st argument), next() will be the error handler as
 * (err) => { if (err) utils.processError(req, res, err) }
 * 
*/




var express = require('express');
var requireDir = require('require-dir');
var router = express.Router();
var config = require("../config")
var utils = require('../util')


// Get params from params, query, body, header
var params = requireDir("../inputParams")


/**************************************************** 
 * CONFIGURABLE this line for the inputParams file
 ****************************************************/
// Get params from params, query, body, header
var inputParams = requireDir("../inputParams")
var params = inputParams.sd.params  //<< DONE. MODIFY PER ENTIY

// // CONFIGURABLE Get the handler for processing the business logic

// getAll
var ctrl = require('../controllers/sd');   //<< DONE
var handler = ctrl.getAll  //<< DONE
// get by id
var getHandler = ctrl.get  //<< NOT DONE
var getParams = inputParams.id.params // NOT DONE

var getEntIdParams = inputParams.entId.params


/**************************************************** 
 * 
 * END of CONFIGURABLE
 * 
 ****************************************************/
/**
 * SURVEY DETAILS OR COMPANIES or sd
 * V2 DONE
 */
router.get('/survey-details', function (req, res, next) {
    // In case of an error, they show up in the catch and are passed to utils.processError to get status and set it up
    config.reqUtils.handleRequest(params, handler, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { console.log(results)})
        .catch(error => {
            console.log("error")
         })
})

router.get('/survey-details/lab', function (req, res, next) {
    // In case of an error, they show up in the catch and are passed to utils.processError to get status and set it up
    config.reqUtils.handleRequest(params, getHandler, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { console.log(results)})
        .catch(error => {
            console.log("error")
         })
})
router.get('/survey-details/company/:entId/total', function (req, res, next) {


    // In case of an error, they show up in the catch and are passed to utils.processError to get status and set it up
    config.reqUtils.handleRequest(getEntIdParams, ctrl.getSurveyDetailsTotals, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { console.log(results)})
        .catch(error => {
            console.log("error")
         })
})


/*
END SURVEY DETAILS OR COMPANIES or sd
*/

module.exports = router;