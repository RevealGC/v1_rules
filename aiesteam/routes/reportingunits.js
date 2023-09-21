var express = require('express');
var requireDir = require('require-dir');
var router = express.Router();
var config = require('../config')
var utils = require('../util')


/**************************************************** 
 * CONFIGURABLE this line for the inputParams file
 ****************************************************/
var inputParams = requireDir("../inputParams")
var params = inputParams.reportingunit.params
var debouncedParams = inputParams.debouncedParams.params

// Get the handler for processing the business logic
var ctrlValidate = require('../controllers/reportingunit')

/**************************************************** 
  * END of CONFIGURABLE
  ****************************************************/





//  reporting_unit/findRID
/**
 * Get is passed a string which could contain the rid (numberic) or name of the company
 * find matching rids and pass it back as an array
 * 
 */
/**
 * 
 * Find all RIDs that match any numbers passed in the debouncedValue
 * User types in 
 * 1) debouncedValue which is a string
 * 
 * debouncedValue is required 
 * 2) limit: is a number in the params, query, body or header and
 * it defaults to 
 * 
 * 
 * it will return a max of 10 closely matching rids.
 * @param {} locals 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */

router.get('/reporting_unit/findRID/:debouncedValue', function (req, res, next) {

    config.reqUtils.handleRequest(debouncedParams, ctrlValidate.findRID, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})





/**
 * Get Company details for an entity.
 * V2 DONE
 */
router.get('/reporting_unit/:reporting_id/validate', function (req, res, next) {

  req.userPost = false;
  req.userMicro = false;

    config.reqUtils.handleRequest(params, ctrlValidate.validate, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})
router.put('/reporting_unit/:reporting_id/validate', function (req, res, next) {

  req.userPost = false;
  req.userMicro = false;
  config.reqUtils.handleRequest(inputParams.reportingunitPOSTVALIDATE.params, ctrlValidate.validate, req, res, (err) => { if (err) utils.processError(req, res, err) })
      .then(results => { })
      .catch(error => { })
})

router.put('/reporting_unit/:reporting_id/update', function (req, res, next) {
  req.save = true;


  config.reqUtils.handleRequest(inputParams.reportingunitPOSTVALIDATE.params, ctrlValidate.validate, req, res, (err) => { if (err) utils.processError(req, res, err) })
      .then(results => { })
      .catch(error => { })
})


/**
 *  

POST  /{appliance}/{batch}/micro 

Create a job and return its ID 

POST /batch/{appliance}/micro 

BODY  

{ 

    aies_job_id:<aies_jobId>, 

    output: "attended|unattended", 

    scope: "select * from rv inner join ru on ru.id = rv.id and state=?",     

   rules: [ <rule.id>,<rule.id> ] 

} 

Response  

{ 

    appliance_job_id:<appliance_job_id>, 

} 

Success 
 * 
 * 
 */


router.post('/batch/nodejs/micro', function (req, res, next) {
  req.save = false;
  req.userPost = true;
  req.userMicro = true;
  req.userMacro = false;
  
  config.reqUtils.handleRequest(inputParams.reportingunitPOSTVALIDATE.params, ctrlValidate.validate, req, res, (err) => { if (err) utils.processError(req, res, err) })
      .then(results => { })
      .catch(error => { })
})

router.post('/batch/nodejs/macro', function (req, res, next) {
  req.save = false;
  req.userPost = true;
  req.userMicro = false;
  req.userMacro = true;
  
  config.reqUtils.handleRequest(inputParams.reportingunitPOSTVALIDATE.params, ctrlValidate.validate, req, res, (err) => { if (err) utils.processError(req, res, err) })
      .then(results => { })
      .catch(error => { })
})


module.exports = router;    