/**
 * Get response variables with multiple params
 */
 var express = require('express');
 var requireDir = require('require-dir');
 var router = express.Router();
 var config = require('../../config')
 var utils = require('../../util')
 
 /**************************************************** 
  * CONFIGURABLE this line for the inputParams file
  ****************************************************/
// Get params from params, query, body, header
var inputParams = requireDir("../../inputParams")
var params = inputParams.openai.params
 
 // CONFIGURABLE Get the handler for processing the business logic
 var autoComplete = require('../../controllers/openai/autoComplete');
//  var handler = ctrlRV.getAll
 /**************************************************** 
  * 
  * END of CONFIGURABLE
  * 
  ****************************************************/
//conditionstring is passed in the body, it contains what the user wants to autocomplete
  router.post('/openai/aicomplete', function (req, res, next) {

    config.reqUtils.handleRequest(params, autoComplete.prompt, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => {

        }).
        catch(error => {
            console.log(error)
        })
})
module.exports = router;  
