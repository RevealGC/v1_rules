var express = require('express');
var requireDir = require('require-dir');
var bodyParser = require("body-parser");
var router = express.Router();
var config = require('../../config')



// Create an instance of reqUtils to read all params and raise errors if any
const ReqUtils = require('@outofsync/request-utils');
const reqUtils = new ReqUtils(config.reqUtilOptions);


/**************************************************** 
 * CONFIGURABLE this line for the inputParams file
 ****************************************************/
// Get params from params, query, body, header
// var inputParams = requireDir("../../inputParams")
// var params = inputParams.rv.params  //<< MODIFY PER ENTIY

// CONFIGURABLE Get the handler for processing the business logic
// var ctrlRV = require('../../controllers/rv');   //<< MODIFY PER ENTIY
// const { rv } = require('../../dbmodels/relationships'); //<<  OPTIONAL NEED FOR THE RELATIONSHIP TO BE LOADED HERE. MODIFY THE RELATIONSHIP 
// var handler = ctrlRV.getAll  //<< MODIFY PER ENTIY
/**************************************************** 
 * 
 * END of CONFIGURABLE
 * 
 ****************************************************/


router.get('/flagging', function (req, res, next) {

    res.send("Servicing being built")
    // reqUtils.handleRequest(params, handler, req, res, (err) => { if (err) utils.processError(req, res, err) })
    //     .then(results => { })
    //     .catch(error => { })
})

module.exports = router;  


/**
 Contains the flagging end points at the root level
8) GET ./flagging/data-flags ,return paged list of data flags
9) POST ./flagging/data-flags ,Store new data flag
10) GET ./flagging/data-flags/{id} ,Get data flag by id
11) PUT ./flagging/data-flags/{id} ,Update data flag
12) DELETE ./flagging/data-flags/{id} ,Delete data flag
13) GET ./flagging/data-version ,
14) POST ./flagging/data-version ,
15) GET ./flagging/data-version/{id} ,
16) GET ./flagging/mappings ,
17) POST ./flagging/mappings ,Store new mapping
18) GET ./flagging/mappings/:id ,Get mappings by id
19) PUT ./flagging/mappings/:id ,Update mappings
20) DELETE ./flagging/mappings/:id ,Delete mappings
21) PUT ./flagging/mappings/versions/:version/flags/:flag , Updates maps with version and flag
22) GET ./flagging/source-flags returns list of source flags ,Getsource flags
23) POST ./flagging/source-flags Store new source flags ,Store new source flags
24) GET ./flagging/source-flags/:id ,Get flags by source flag id
25) PUT ./flagging/source-flags/:id ,Update source flags
26) DELETE ./flagging/source-flags/:id ,Delete soruce flags
*/


/**
 * requtils handler is passed
 * 1) params for the flagging
 * 2) handler is the business model in the controllers folder
 * 3) req, res, err or next
 */