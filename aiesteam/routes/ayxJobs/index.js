var express = require('express');
var requireDir = require('require-dir');
var bodyParser = require("body-parser");
var router = express.Router();
var config = require('../../config')
var utils = require('../../util')



/**************************************************** 
 * CONFIGURABLE this line for the inputParams file
 ****************************************************/
// Get params from params, query, body, header
var inputParams = requireDir("../../inputParams")
var params = inputParams.ayxGetallParams.params  //<< DONE. MODIFY PER ENTIY

// getAll
var ctrl = require('../../controllers/ayxJobs');   //<< MODIFY PER ENTIY
var ctrlAllHandler = ctrl.getAll  //<< MODIFY PER ENTIY

// get by id
var ctrlGetOneHandler = ctrl.get
var getParams = inputParams.id.params

// add a new record/post
var postParams = inputParams.dataVersions


// Update a data flag
var ctrlUpdateDataFlag = ctrl.ctrlUpdateDataFlag
var updateParams = inputParams.flaggingUpdate.params

/**************************************************** 
 * 
 * END of CONFIGURABLE
 * 
 ****************************************************/




/**
 * create jobs in AYX, it will have a body, an apikey in the header and a workflowId.
 * 1) header: requtils takes care of the api key.
 * 2) query: a) workFlowId for AYX, and a body
 * 3) body: json object comprised of sql and other params
 */


router.post('/ayx/submitWorkFlow', (req, res, next)=>{
    config.reqUtils.handleRequest(inputParams.ayxSubmitWorkFlow.params, ctrl.submitWorkFlow, req, res, (err) => { if (err) utils.processError(req, res, err) })
    .then(results => { })
    .catch(error => { })
})



/**
 * GET ALL JOBS
 * uses ctrlAllHandler
 * params are defined in the inputParams folder for flaggingGetAll.params
 */
router.get('/ayx/jobs/', function (req, res, next) {
    config.reqUtils.handleRequest(params, ctrl.getAll, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})
/**
 * Get  data-version for a given id. #10
 * uses ctrlGetOneHandler
 * getParams are for id: an id is being passed to it. Verified by requtils
 * 
 */
router.get('/ayx/jobs/:id', function (req, res, next) {

    config.reqUtils.handleRequest(getParams, ctrl.get, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { 
        
    })
        .catch(error => { console.log(error) })
})
/**
 * POST Posting data. Want to add data #9
 * uses ctrlPostHandler
 *  does not use requtils(which has a bug in it for posts)
 * Pad the user created field modified field and add to the table in the
 * controller
 */
router.post('/ayx/jobs/', function (req, res, next) {
    req.body['created_by'] = config.defaultUser
    req.body['updated_by'] = config.defaultUser
    let locals = req.body

    let verified = verifyLocals(locals)
    if (verified.status) ctrl.post(locals, req, res, next)
    else {
        utils.processBusinessError(req, res,
            { name: "SQLError", parent: { hint: verified.err } })
    }
})


router.put('/ayx/jobs/:id', function (req, res, next) {
    req.body['updated_by'] = config.defaultUser
    let locals ={}
    locals.data = req.body
    locals.id = req.params.id
    // let verified = verifyLocals(locals.data)
    ctrl.update(locals, req, res, next)
})

router.delete('/ayx/jobs/:id', function (req, res, next) {
    let locals ={}
    locals.id = req.params.id
    
    ctrl.delete(locals, req, res, next)
})



module.exports = router;

