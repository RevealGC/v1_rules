/**
 * Get response variables with multiple params
 */
 var express = require('express');
 var requireDir = require('require-dir');
 var router = express.Router();
 var config = require('../config')
 var utils = require('../util')
 
 /**************************************************** 
  * CONFIGURABLE this line for the inputParams file
  ****************************************************/
 // Get params from params, query, body, header
 var inputParams = requireDir("../inputParams")
 var params = inputParams.rv.params
 
 // CONFIGURABLE Get the handler for processing the business logic
 var ctrlRV = require('../controllers/rv');
 var handler = ctrlRV.getAll
 /**************************************************** 
  * 
  * END of CONFIGURABLE
  * 
  ****************************************************/
 router.get('/response-variables', function (req, res, next) {
    config.reqUtils.handleRequest(params, handler, req, res, (err) => { if (err) utils.processError(req, res, err) })
    .then(results => {
            
        }).
        catch(error => {
            console.log(error)
    
        })
})

router.post('/response-variables', function (req, res, next) {
    console.log("IN RV.JS Route testing")
    req.body['created_by'] = config.defaultUser
    req.body['last_modified_by'] = config.defaultUser
    let locals = req.body
     ctrlRV.post(locals, req, res, next)
})



router.put('/response-variables/:id', function (req, res, next) {
    req.body['last_modified_by'] = config.defaultUser
    let locals ={}
    locals.data = req.body
    locals.id = req.params.id
    // let verified = verifyLocals(locals.data)
    ctrlRV.update(locals, req, res, next)
})


router.delete('/response-variables/:id', function (req, res, next) {
    let locals ={}
    locals.id = req.params.id
    console.log("🚀 ~ file: rv.js ~ line 39 ~ locals", locals)
    
    ctrlRV.delete(locals, req, res, next)
})

module.exports = router;  