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
var ctrl = require('../../../controllers/flagging/data-version');   //<< MODIFY PER ENTIY
var ctrlAllHandler = ctrl.getAll  //<< MODIFY PER ENTIY

// get by id
var ctrlGetOneHandler = ctrl.get
var getParams = inputParams.id.params

// add a new record/post
var postParams = inputParams.dataVersions
var ctrlPostHandler = ctrl.post
/**************************************************** 
 * 
 * END of CONFIGURABLE
 * 
 ****************************************************/




/**
 * GET ALL data versions 
 * uses ctrlAllHandler
 * params are defined in the inputParams folder for flaggingGetAll.params
 */
router.get('/flagging/data-versions', function (req, res, next) {
    config.reqUtils.handleRequest(params, ctrlAllHandler, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { })
})
/**
 * Get  data-version for a given id.
 * uses ctrlGetOneHandler
 * getParams are for id: an id is being passed to it. Verified by requtils
 * 
 */
router.get('/flagging/data-versions/:id', function (req, res, next) {

    config.reqUtils.handleRequest(getParams, ctrlGetOneHandler, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => { })
        .catch(error => { console.log(error) })
})
/**
 * POST Posting data. Want to add data
 * uses ctrlPostHandler
 *  does not use requtils(which has a bug in it for posts)
 * Pad the user created field modified field and add to the table in the
 * controller
 */
router.post('/flagging/data-versions/', function (req, res, next) {
    req.body['created_by'] = config.defaultUser
    req.body['last_modified_by'] = config.defaultUser
    let locals = req.body

    let verified = verifyLocals(locals)
    if (verified.status) ctrlPostHandler(locals, req, res, next)
    else {
        utils.processBusinessError(req, res,
            { name: "SQLError", parent: { hint: verified.err } })
    }
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
    if (locals.code && locals.description && locals.code.length < 3
        && locals.description.length < 51) {
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

