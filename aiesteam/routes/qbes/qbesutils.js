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
//  var inputParams = requireDir("")
//  var params = inputParams.rv.params
 
 // CONFIGURABLE Get the handler for processing the business logic
 var qbesUtils = require('../../controllers/qbes/utils');
//  var handler = ctrlRV.getAll
 /**************************************************** 
  * 
  * END of CONFIGURABLE
  * 
  ****************************************************/
 router.post('/qbes/utils/parse', async function (req, res, next) {
  
    try{
        qbesUtils.parse( req, res, next) 
    }
    catch(e)
{
    // console.log("🚀 ~ file: qbesutils.js ~ line 31 ~ e", e)
    
    // res.status(500).send(e)
}
})

module.exports = router;  