var express = require('express');
var requireDir = require('require-dir');
var router = express.Router();
var config = require('../config')
var utils = require('../util')


/**************************************************** 
 * CONFIGURABLE this line for the inputParams file
 ****************************************************/
var inputParams = requireDir("../inputParams")
var params = inputParams.companies.params
var entParams = inputParams.entId.params
// Get the handler for processing the business logic
var ctrlCompany = require('../controllers/company')

/**************************************************** 
  * END of CONFIGURABLE
  ****************************************************/

/**
 * Get Company details for an entity.
 * V2 DONE
 */
router.get('/companies/:entId', function (req, res, next) {
   


    config.reqUtils.handleRequest(entParams, ctrlCompany.getCompanyDetails, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})

/**
 * Get vUnitLevelCountsByEntId
 * V2 DONE
 */

router.get('/vunitlevelcounts/:entId', function (req, res, next) {
    config.reqUtils.handleRequest(entParams, ctrlCompany.getVunitLevelCounts, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})

/**
 * Get All Response Variables for an entity.
 * V2 DONE
 */
router.get('/response-variables/company/:entId', function (req, res, next) {
    config.reqUtils.handleRequest(entParams, ctrlCompany.getRVsByEntId, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})





/**
 *  Get all companies    
 * V2 DONE
 *  1) pass companies params via url, body,.. , 
 *   2) handler: used to call the method that will run if all the params pass controls
 *   3) req will get populated with errors and they get processed in utils with res and next
*    In case of an error, they show up in the catch and are passed to utils.processError to get status and set it up
*
*/
router.get('/companies', function (req, res, next) {
    

    config.reqUtils.handleRequest(params, ctrlCompany.getAll, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => {
            // error has already been process in the handler or in the (err) method if its a format or tls or required parameters issue
            // If its a business related error, the headers will be sent in the business unit like reportingUnits.js db call
            console.log(error)
          
        })
})

/*
END REPORTING UNITS OR COMPANIES
*/






module.exports = router;    