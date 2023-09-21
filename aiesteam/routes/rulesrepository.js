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
 var params = inputParams.rules.params
 var postParams = inputParams.rulesRepoSubmit.params
 var updateParams = inputParams.rulesRepoUpdate.params
 
 // CONFIGURABLE Get the handler for processing the business logic
 var ctrlRV = require('../controllers/rulesrepository');
 var handler = ctrlRV.getAll


 var testCompileController = require("../libs/rules/compiler")

 /**************************************************** 
  * 
  * END of CONFIGURABLE
  * 
  ****************************************************/
/**
 * Testing the compile string.  The controller is in the libs/rules/compiler
 */

 router.get('/test/compile', async function (req, res, next) {
   try{
   let o = await testCompileController.compile()

    res.send(o)
   }
   catch(e){
    res.status(404)
    res.send(e);
   }


})
/**
 * Save multiple rules as post
 * 
 * 
 */

router.post('/rulesrepo/new/parsedrules/:id', function (req, res, next) {

    config.reqUtils.handleRequest(updateParams, ctrlRV.saveMultipleRules, req, res, (err) => { if (err) utils.processError(req, res, err) })
    .then(results => {
    }).
    catch(error => {
        console.log(error)
    }) 

})




/**
 * A get request to get all the distinct rule types in the rules repository
 */

 router.get('/rulesrepo/getruletype', async function (req, res, next) {
    try{
    let o = await ctrlRV.getDistinctRuleTypes({}.req, res, {})
 
     res.send(o)
    }
    catch(e){
     res.status(404)
     res.send(e);
    }
 
 
 })

/**
 * Need the following end points for compiling and testing a rule condition
 * 1) testCondition: parse a string and return an error message if condition has no issues
 * 1.1) post: string name is conditionstring
 * 2) testConditionWithValue: parse a string and accept an array of facts to see if the condition works
 * 2.1) post: with conditionstring and facts array will return a true or a false or an error message
 * 3) post/rulerepositorysave rule with an expression and return the json object
 * 
 */
/**
 * Router for testCondition will cover for both with facts and without facts. Will be passed a conditionstring in post and facts
 */
router.post('/rulesrepo/testcondition', function(req, res, next){
    config.reqUtils.handleRequest(inputParams.spad.params, ctrlRV.testcondition, req, res, (err) => { if (err) utils.processError(req, res, err) })
    .then(results => {
        }).
        catch(error => {
            console.log(error)
        }) 
})

// Given an array of parameter file strings convert them to arrays of rules and return the issues if any
router.post('/rulesrepo/stringsToRules', function(req, res, next){
// console.log("🚀 ~ file: rulesrepository.js:91 ~ router.post ~ req", req.body)
// res.send(req.body);
// return;

    

    config.reqUtils.handleRequest(inputParams.spad.params, ctrlRV.stringsToRules, req, res, (err) => { if (err) utils.processError(req, res, err) })
    .then(results => {
        }).
        catch(error => {
            console.log(error)
        }) 
})





/**
 * action test is an api end point to test an action which is an array of name/value pairs.  The value will be an expression string which will be computed and assigned to a new property called imputedValue, which will be padded to the original object. In addition if there are any errors, an error object will be created with error as true and message will be the location of the error.  
 * 
 * If there are no errors then error will be false and message be ''
 */
router.post('/rulesrepo/actiontest', function(req, res, next){
    
    config.reqUtils.handleRequest(inputParams.spad.params, ctrlRV.actiontest, req, res, (err) => { if (err) utils.processError(req, res, err) })
    .then(results => {
        }).
        catch(error => {
            console.log(error)
        }) 
})

/**
 * End of 
 */


router.get('/rulesrepo/createdummyrule', function(req, res, next){

    // res.send("Dummy rule")
    ctrlRV.createdummyrule({}, req, res,next)
    // config.reqUtils.handleRequest([], ctrlRV.createdummyrule, req, res, (err) => { if (err) utils.processError(req, res, err) })
    // .then(results => {
    //     }).
    //     catch(error => {
    //         console.log(error)
    //     }) 
})



router.get('/rulesrepo/factsandrules/:enity_id', function(req, res, next){
    config.reqUtils.handleRequest(params, ctrlRV.getFactsAndRules, req, res, (err) => { if (err) utils.processError(req, res, err) })
    .then(results => {
        }).
        catch(error => {
            console.log(error)
        }) 
})


router.put('/rulesrepo/compile/:id', function(req, res, next){
    config.reqUtils.handleRequest(updateParams, ctrlRV.compileDbRule, req, res, (err) => { if (err) utils.processError(req, res, err) })
    .then(results => {
        }).
        catch(error => {
            console.log(error)
        }) 
})

 router.get('/rulesrepo', function (req, res, next) {
    config.reqUtils.handleRequest(params, handler, req, res, (err) => { if (err) utils.processError(req, res, err) })
    .then(results => {
            
        }).
        catch(error => {
            console.log(error)
    
        })
})

router.post('/rulesrepo', function (req, res, next) {
    config.reqUtils.handleRequest(postParams, ctrlRV.post, req, res, (err) => { if (err) utils.processError(req, res, err) })
    .then(results => {
        }).
        catch(error => {
            console.log(error)
        }) 
})

// Update an existing rule data, active, type, name, share_flag, notes,description

// data: {"message":"TEST","formula":[{"id":1,"field":"INCOME_LOAN","math_operator":">=","value":10}],"action":[{"id":1,"type":"rv","field":"TOTAL_INCOME_BONUS","formula":[{"id":1,"type":"rv","value":"INCOME_LOAN"},{"math_operator":"+"},{"id":2,"type":"text","value":100}]},{"id":1,"type":"rv","field":"TOTAL_INCOME_BONUS2","formula":[{"id":1,"type":"rv","value":"INCOME_LOAN"},{"math_operator":"*"},{"id":2,"type":"rv","value":"BASE_LOAN"}]}]}


router.put('/rulesrepo/save/parsedrule/:id', function (req, res, next) {
    config.reqUtils.handleRequest(updateParams, ctrlRV.updateParsedRule, req, res, (err) => { if (err) utils.processError(req, res, err) })
    .then(results => {
    }).
    catch(error => {
        console.log(error)
    }) 

})

router.put('/rulesrepo/:id', function (req, res, next) {

    config.reqUtils.handleRequest(updateParams, ctrlRV.update, req, res, (err) => { if (err) utils.processError(req, res, err) })
    .then(results => {
        }).
        catch(error => {
            console.log(error)
        }) 

})

// locals.id will be treated as a string of a JSON object array which is stringifed & rule ids that are separated by commas
router.delete('/rulesrepo/:id', function (req, res, next) {

    config.reqUtils.handleRequest(inputParams.id.params, ctrlRV.delete, req, res, (err) => { if (err) utils.processError(req, res, err) })
    .then(results => {
        }).
        catch(error => {
            console.log(error)
        }) 
})

module.exports = router;  