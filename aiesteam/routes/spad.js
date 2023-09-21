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
var params = inputParams.spad.params
// CONFIGURABLE Get the handler for processing the business logic
var ctrlRV = require('../controllers/spad');
var handler = ctrlRV.getAll
/**************************************************** 
 * 
 * END of CONFIGURABLE
 * 
 ****************************************************/
router.get('/spad', function (req, res, next) {

    config.reqUtils.handleRequest(params, handler, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => {

        }).
        catch(error => {
            console.log(error)

        })
})


/**
 * Same handler as the one for spad/merge/:id next function
 * make sure the calls are the same. Route end points supports both spad from qbes editor and
 * from api endpoints.
 */
router.get('/api/appliances/jobs/:id/merge', function (req, res, next) {
    config.reqUtils.handleRequest(params, ctrlRV.merge, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => {

        }).
        catch(error => {
            console.log(error)

        })
})

router.get('/spad/merge/:id', function (req, res, next) {
    config.reqUtils.handleRequest(params, ctrlRV.merge, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => {

        }).
        catch(error => {
            console.log(error)

        })
})
/**
 * END OF similar end points
**/



/**
 * Aggregate the parent of the spad id being passed in as id
 */
router.get('/spad/aggregate/:id', function (req, res, next) {
    config.reqUtils.handleRequest(params, ctrlRV.aggregate, req, res, (err) => { if (err) utils.processError(req, res, err) })
    .then(results => {

    }).
    catch(error => {
        console.log(error)

    })
})

router.get('/spad/:id', function (req, res, next) {
    config.reqUtils.handleRequest(params, handler, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => {

        }).
        catch(error => {
            console.log(error)

        })
})

router.delete('/spad/:id', function (req, res, next) {
    config.reqUtils.handleRequest(params, ctrlRV.delete, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => {

        }).
        catch(error => {
            console.log(error)
        })
})

router.delete('/spad', function (req, res, next) {
    config.reqUtils.handleRequest(params, ctrlRV.deleteAll, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => {
        })
        .catch(error => {
            console.log(error)
        })
})

/**
 * End point for processing rules: /spad/processRules. It is replacing /spad/testrule
 * They can be passed a reporting_id, parent_id (workflow id of the parent in spad table, default = 0),
 * facts & rules are optional as arrays, ruleType can be the type of the rule,
 * showNetwork can be true/false to see the network of children, attended can be true/false.  If attended is true then return the executed rule otherwise return the workflow id.  If showNetwork is false or attended is true or any combination of true/false => true will return the package with a workflowId plus the usual paging props.
 * 
 * 
 * 
 * Controller comments:
 *  * create a function called processRules as an async function that will take locals, req, res, next
 * locals is passed to it from the router in spad.js (routes folder)
 * locals has these properties:
 * facts & rules, are arrays, parent_id: defaults to 0 otherwise it is the parent workflow id,
 * ruleType is a string which can be 'validation' by default or any type(rules_repo table column) of rule
 * and showNetwork is true by default which will show all children and sub children to process the rules for a given reporting id
 * and reporting_id is required.  This works on different reporting_id one at a time, Will need to extend it to handle an array of reporting ids.
 * 
 * 
 */
router.post('/spad/processRules', function (req, res, next) {



    config.reqUtils.handleRequest(params, ctrlRV.processRules, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => {

        }).
        catch(error => {
            console.log(error)
        })
})



router.post('/spad/testrule', function (req, res, next) {

    config.reqUtils.handleRequest(params, ctrlRV.testrule, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => {

        }).
        catch(error => {
            console.log(error)
        })
})

router.post('/spad/deployrule', function (req, res, next) {
    config.reqUtils.handleRequest(params, ctrlRV.deployrule, req, res, (err) => { if (err) utils.processError(req, res, err) })
        .then(results => {

        }).
        catch(error => {
            console.log(error)
        })
})





module.exports = router;  