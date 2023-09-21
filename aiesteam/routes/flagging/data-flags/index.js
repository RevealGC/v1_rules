var express = require('express');
var requireDir = require('require-dir');
var bodyParser = require("body-parser");
var router = express.Router();
var config = require('../../../config')
var utils = require('../../../util')



/**************************************************** 
 * CONFIGURABLE this line for the inputParams file
 ****************************************************/
// Get params from params, query, body, header
var inputParams = requireDir("../../../inputParams")
var params = inputParams.flaggingGetAll.params  //<< DONE. MODIFY PER ENTIY

// getAll
var ctrl = require('../../../controllers/flagging/data-flags');   //<< MODIFY PER ENTIY
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
 * GET ALL data flags #8
 * uses ctrlAllHandler
 * params are defined in the inputParams folder for flaggingGetAll.params
 */
router.get('/flagging/data-flags', function (req, res, next) {
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
router.get('/flagging/data-flags/:id', function (req, res, next) {

    config.reqUtils.handleRequest(getParams, ctrl.get, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { console.log(error) })
})
/**
 * POST Posting data. Want to add data #9
 * uses ctrlPostHandler
 *  does not use requtils(which has a bug in it for posts)
 * Pad the user created field modified field and add to the table in the
 * controller
 */
router.post('/flagging/data-flags/', function (req, res, next) {
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


router.put('/flagging/data-flags/:id', function (req, res, next) {
    req.body['updated_by'] = config.defaultUser
    let locals ={}
    locals.data = req.body
    locals.id = req.params.id
    // let verified = verifyLocals(locals.data)
    ctrl.update(locals, req, res, next)
})

router.delete('/flagging/data-flags/:id', function (req, res, next) {
    let locals ={}
    locals.id = req.params.id
    
    ctrl.delete(locals, req, res, next)
})


/**
 * Verify all the variables passed in the Post have no issues
 * Called from the above post method for data-versions
 * Checks if code and description are defined and they meet the string length
 * criteria.  All errors are found and packed in an err array and processed
 * based on the return {status, err[]}
 * @param {Object} locals 
 * @returns 
 */
let verifyLocals = (locals) => {
    // Code should be less than 2 and title should be less than 50
    if (locals.code && locals.description && locals.code.length < 10
        && locals.description.length < 256) {
        return { status: true, error: [] }
    }
    let err = []
    if (!locals.code) err.push('Code is not defined')
    if (locals.code && locals.code.length > 2) err.push('Code cannot be greater than 2 characters')
    if (!locals.description) err.push('Description is not defined')
    if (locals.description && locals.description.length > 50) err.push('Description cannot be greater than 50 characters')
    return { status: false, err }
}
module.exports = router;

