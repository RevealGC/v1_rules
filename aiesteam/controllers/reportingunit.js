var Sequelize = require("sequelize");
var dbSeq = require("../dbmodels/relationships");
var config = require("../config");
var sdController = require("./sd");
var utils = require("../util");
var rulesRepo = require("./rulesrepository");
var jsonToPivotjson = require("json-to-pivot-json");
const url = require("url");
const qbes = require("../libs/rules/qbes");
var axios = require('axios').default;
/**Business Default values can be set in env also */
let REFPER = '2017A1'
let VAR_TYPE = 'AC'

var aggregate = require('../libs/rules/qbes/aggregate');
const { NUMBER } = require("sequelize");
const { getDistinctRuleTypes } = require("./rulesrepository");
var updateSQL = 'update survey_details_flags set data_version_value = $1 , ' +
  ' last_modified_by = $2,  data_version = $3,  data_flag = $4 , ' +
  ' source_flag = $5, note = $6  where refper = $7 ' +
  ' and  survey_details_id  = $8'


var insertSQLSDF = 'insert into survey_details_flag (data_version_value, created_by, last_modified_by, refper, data_version, data_flag,source_flag, note, survey_details_id) ' +
  ' values($1, $2, $3, $4, $5, $6, $7, $8, $9)'







/**
 * Call Qbes with facts and rules
 * @param {} facts 
 * @param {*} rules 
 * @returns 
 */
async function callQbes(facts, rules) {
  try {
    const startTime = Date.now(); // Get the current timestamp in milliseconds
 
    const r = await qbes.run({ facts, rules });
 
    const endTime = Date.now(); // Get the current timestamp after the call completes
    const executionTime = endTime - startTime; // Calculate the time difference
 
    console.log(`Call to qbes.run() took ${executionTime} milliseconds.`);
 
    return r;
  } catch (error) {
    return error;
  }
 }




/**
 * 
 * @param {*} locals props of reporting_id, 
 * updates the survey flags for values
 */
async function updateSDTables(locals) {

  var rid = { reporting_id: locals.reporting_id };
  var reportingID = locals.reporting_id
  try {
    let bodyFacts = await utils.getJson(locals.data)
    let newFactsObject = bodyFacts.rvs

    for (var i = 0; i < newFactsObject.length; ++i) {
      let f = newFactsObject[i]

      if (f.sqlType == 'update') {
        let dataPayload = [f.data_version_value + '', f.last_modified_by, f.data_version, f.data_flag, f.source_flag,
        f.note, f.refper, f.survey_details_id]



        let updateResult = await config.dbPool.query(updateSQL, dataPayload);
      }
      else if (f.sqlType == 'insert') {
        var insertSQLSD = 'insert into survey_details (reporting_id, refper, rvid, created_by, last_modified_by) ' +
          ' values ($1, $2, $3, $4, $5) '
        let dataPayload = [locals.reporting_id, f.refper, f.rvid, f.last_modified_by, f.last_modified_by]
        await config.dbPool.query(insertSQLSD, dataPayload)
        var insertSQLSDF = 'insert into survey_details_flag ' +
          ' (data_version_value, created_by, last_modified_by, refper, data_version, data_flag,source_flag, note, survey_details_id)   values ' +
          ' ($1, $2, $3, $4, $5, $6, $7, $8, ' +
          ' (select sd.id from survey_details as sd where reporting_id = $9  and sd.rvid =$10 and refper= $11))'
        dataPayload = [f.data_version_value + '', f.last_modified_by, f.last_modified_by,
        f.refper, f.data_version, f.data_flag, f.source_flag, f.note, locals.reporting_id, f.rvid, f.refper]

        await config.dbPool.query(insertSQLSDF, dataPayload)
      }
    }
  }
  catch (e) {
    console.log("🚀 ~ file: reportingunit.js ~ line 143 ~ updateSDTables ~ e", e)
    throw { code: 'UNDEFINED_RU_FACTS', error: e.error, success: false }
  }
}

/** Find difference between two objects. 
 * obj1 is the latest
 * obj2 is historical
  */
const difference = (obj1, obj2) => {
  var ret = {}
  let keyFound = false;
  Object.keys(obj1).forEach(key => {
    if (obj1[key] !== obj2[key]) {

      let action = 'create';
      if (obj2[key] != null) action = 'update'

      ret = { ...ret, ...{ [key]: { newValue: obj1[key], originalValue: obj2[key], action } } };
    }
  });
  return ret;
}
/**
 * Async function to get all reporting_ids for a given parent reporting_id 
 * 
 */

// async function spawnChildrenForValidation(locals, rules) {

//   // get all the children reporting_ids and then call axios url call for validations.
//   let sql = 'select reporting_id from reporting_units where parent_id = $1'
//   try {
//     let result = await config.dbPool.query(sql, [locals.reporting_id])
//     result.rows.forEach(async key => {

//       locals.reporting_id = key.reporting_id
//       facts = await utils.getReportingData(locals);

//       let url = config.hostUrl + 'spad/processRules?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'

//       let result = await axios.post(url, { facts, reporting_id: key.reporting_id, rules: locals.rules, showNetwork: locals.showNetwork, attended: locals.attended, parent_id: locals.spadId })

//     })
//   }
//   catch (e) {
//     console.log("🚀 ~ file: reportingunit.js ~ line 126 ~ spawnChildrenForValidation ~ e", e)
//   }
// }
/**
 * 
 * @param {*} res 
 * @param {*} locals has properties of {validInvalidResults/.valid/.invalid:<>, UndefinedFacts:<>, facts[], rid{reporting_id:<v>}
 * @returns sends out the message with the package for debug
 */

async function sendRulesPackage(res, locals, rules) {

  // locals carries originalFacts and facts after 2 run qbes. Find the difference that needs to be posted back to the db.
  try {

    // locals.facts[0]["CAPEX_OTH_USED"] = 400 // TEST
    let deltaFacts = difference(locals.facts[0], locals.originalFacts[0])

    let validInvalidResults = (locals.r.validInvalidResults) ? locals.r.validInvalidResults : locals.r

    // facts = utils.sortFacts(facts)
    // locals.DEBUG
    let package = (true) ? {
      spadId: locals.spadId,
   
      rules: validInvalidResults, PID: process.pid, elapsedTime: locals.elapsedTime, deltaFacts,
      // debug: { deltaFacts, undefinedFacts: locals.r.UndefinedFacts, facts: locals.facts, originalFacts: locals.originalFacts, rid: locals.rid }
    }
      : { spadId: locals.spadId, rules: validInvalidResults, PID: process.pid, elapsedTime: locals.elapsedTime, deltaFacts }




    /**
     * 
     * DEBUGGIN SECTION TURN IT OFF
     */
    // res.send(package); return;

    /**
     * END DEBUGGIN SECTION TURN IT OFF
     */


    let status = '200'//(validInvalidResults.invalid.length) ? '200' : '200'

    let delta_status = (deltaFacts) ? 1 : 0
    let delta_data = (deltaFacts) ? deltaFacts : {}
    locals.aggregate = validInvalidResults.aggregate || {}

    // change the status to completed update with results delta data and aggregates
    // Update spad row with status of the execution result
    let spadUpdateSql = 'update spad set status = $1,result=$2, elapsed_time = $3, merge_status = $4, merge_data = $5, aggregate=$6, facts=$7 , last_modified_date = now() where id = $8'
    let aggregatesAndFacts = { ...locals.facts[0], ...{ aggregate: locals.aggregate } }
    let spadUpdateValues = [status, package, locals.elapsedTime, delta_status, delta_data, locals.aggregate, aggregatesAndFacts, locals.spadId]
    await config.dbPool.query(spadUpdateSql, spadUpdateValues)

    // get the locals.spadId get its parent id and if it exists aggregate it recursively upwards till parent id = 0

    const rptUnit = await dbSeq.spad.findOne({ where: { id: locals.spadId } })

    let spadParentId = Number(rptUnit.dataValues.parent_id)


    // if the job is attended or you dont want to see the network then send the package to res.
    // or if the network is not to be shown then  
 
    let url = config.hostUrl + 'notification?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'
    console.log("🚀 ~ file: reportingunit.js:214 ~ sending notification for ", locals.reporting_id, url)
   let o =  await axios.post(url, 
      {"data":package,"message":"Rules Executed for RID: "+locals.reporting_id || 0,"sentFrom":"QBes","sentTo":"QFlow", topic:locals.topic||"Rules Fired"}
    )

  //  if (locals.attended || !locals.showNetwork) {
    if (!locals.showNetwork) {
    
    res.send(package)
    return
  }
  if(locals.attended){
    res.send(package)
 
  }
 
 
  //  if(spadParentId !== 0)
    // await aggregate.aggregateFunction(spadParentId)
    

    // await spawnChildrenForValidation(locals, rules)
  }
  catch (e) {
    // console.log("🚀 ~ file: reportingunit.js ~ line 215 ~ sendRulesPackage ~ e", e.message)

    await config.dbPool.query('update spad set status = $1, error_message = $3, elapsed_time= $4 where id = $2', ['400', locals.spadId, e.message, locals.elapsedTime])

    if (locals.attended) {
      res.status(400)
      return res.send(locals)
    }

  }

}





module.exports = {

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
  findRID: async function (locals, req, res, next) {

    const query = "SELECT id, ent_id, ent_id as value, ent_id as shortValue FROM product_aies.item_estabs_2023a1 WHERE ent_id LIKE $1 || '%'  or ent_id::text LIKE $1 || '%' limit $2";


    try {
      const { rows } = await config.dbPool.query(query, [locals.debouncedValue, locals.limit])

      res.send(rows)
      return;
    } catch (error) {
      console.log("🚀 ~ file: reportingunit.js:256 ~ findRID:function ~ error", error)
      res.send("Er")

    }



  },

  /**
   * 
   * @param {*} locals  contains data from the body and reporting id in the params.  
   * @param {*} req     contains save as true or false
   * @param {*} res 
   * @param {*} next 
   * @returns  res.send the rules that validated and not validated
   */

  /**
   * If save is true, (earlier) we had saved the data provided by the user in the db by the updateSDTables and facts were then pulled out.
   * 
   * If save is false, 
   * 1) we dont update the database. 
   * 2) Pull the facts from the db as they are.
   * 3) Overwrite the facts array with the data from the url body.
   * 4) Once done we call Qbes
   *  
   */


  validate: async function (locals, req, res, next) {
    var start = new Date()
    locals.workFlowId = "validateNode";
    var rid = { reporting_id: locals.reporting_id };
    locals.pid = process.pid


    console.log(`Slave ${process.pid} is serving this.`);

    var facts;

    // If save is true then save it to the db first and then pull the facts; if false impose the facts
    var save = req.save || false;
    var userPost = req.userPost || false;  // Instead of get and puts this is for POST for micro and macro
    var micro = req.userMicro || false;
    var macro = req.userMacro || false;

    locals = {
      ...locals, ...{ save }, ...{ userPost }, ...{ micro }, ...{ macro },
      ...{ user: req.headers['x-jbid'] }
    }


    locals.filters = JSON.stringify(rid);
    locals.page = 1;
    locals.itemsPerPage = -1;

    config.DEBUG = locals.DEBUG



    let spadInsertResult = await utils.updateOrCreate(dbSeq.spad,
      { where: { reporting_id: locals.reporting_id, status: '0' } },
      {
        status: 'init', request: locals,
        created_by: locals.user, last_modified_by: locals.user, parent_id: 0,
        reporting_id: locals.reporting_id
      })

    let spadId = (spadInsertResult && spadInsertResult.item && spadInsertResult.item.id) ?
      spadInsertResult.item.id : 0

    let updateParentId = await config.dbPool.query('update spad set parent_id=$1 where id=$2', [locals.parent_id, spadId])



    if (spadId != 0) {
      locals.spadId = parseInt(spadInsertResult.item.id)
      if (!locals.attended) res.send({ workflowId: spadInsertResult.item.id, success: true });

    }
    else {
      res.status(500)
      res.send({ success: false, error: 'Could not insert a workflow ID. Flow is terminated.' })
      return;
    }
    //The user may send rules in the url as well as a ruleType (which should be passed as an array 
    // 1) default all rules to Array []

    // 2) if rules are provided in locals.rules add it to rules #1 above 
    // 3) if ruleType is  defined which could be like below
    // const types = ['validation', 'new', 'other', 'another'];

    // Generate a comma-separated list of placeholders for each value
    // const placeholders = locals.ruleType.map((rt) => `'${rt}'`).join(',');
    // const addOnRules = `SELECT parsed_rule FROM product_aies.rules_repository WHERE type IN (${placeholders})`;


    // 3.2) Pad rules.push(parsedRulesArray)
    try {
    let rules = []
    if (locals.rules) rules = locals.rules


    
    if (typeof locals.ruleType === 'string') {
      // Convert string to array
      locals.ruleType = [locals.ruleType];
    }
  
    if(locals.ruleType != undefined) {
      const placeholders = locals.ruleType.map((rt) => `'${rt}'`).join(',');
      const addOnRules = `SELECT parsed_rule FROM product_aies.rules_repository WHERE type IN (${placeholders})`;
      let rows = await config.dbPool.query(addOnRules)
      rows.rows.map(row => rules.push(row.parsed_rule))
    }
    


 
        // Continue to process while you send the workflow ID back.
        // try {
        //   if (!locals.rules) {
        //     // GET RULES: Get data from rulesrepo that match all validations
        //     // NK2 get the ruleType if not specified set it to to 'validation'.  
        //     // calling method should pass ruleType and could be part of the query line. not post items
        //     // so type should be 
    
        //     let rulesFilters = JSON.stringify({ active: true, type: locals.ruleType ? locals.ruleType : 'validation' })
        //     // +         '{"active":"true", "type":'+locals.type ? locals.type: "validation"+'}';
        //      var rules = await rulesRepo.getRuleByID({ filters: rulesFilters });
        //   }
        //   else rules = locals.rules
    




    // GET FACTS: if save to the db then update the tables and pull facts which are an array of pivoted values [{name:value},{n:v}..]
    if (locals.data && save) await updateSDTables(locals)


    // If rid is given then getReportingData and get facts from the db.  If locals.facts is defined then pad all values returned by getReportingData with facts from the user. 
  
    if(locals.reporting_id){
      facts = await utils.getReportingData(locals);
     
      if(locals.facts){
        let o = facts[0]
        let n = locals.facts
        facts = [{...o, ...n[0]}]
      }
    }
    else facts = locals.facts




    // if (!locals.facts)
    //   facts = await utils.getReportingData(locals);
    // else facts = locals.facts;









    facts[0]['spadId'] = locals.spadId;
    // MERGE FACTS FROM USER
    locals.originalFacts = JSON.parse(JSON.stringify(facts))
    if (locals.data && !save) {
      let userFacts = await utils.getJson(locals.data)  //CHANGED TO the utils getJSON
      
      facts[0] = { ...facts[0], ...userFacts.rvs }//Adding facts the user sent

    }

    if (!facts.length || !rules.length) return utils.processBusinessError(req, res, { name: "UNDEFINED_RU_FACTS", parent: { hint: "No facts have been defined for ", rid } })



    // sort the facts by name
    // facts = utils.sortFacts(facts);
    // console.log("🚀 ~ file: reportingunit.js:310 ~ facts", facts)



    /**
     * RUN QBES: Run and rinse qbes 2 times to assert computed facts and apply the rules again.  
     * Running only once since almanac is asserting facts on derived ie computedObj  
     */


    let r = await callQbes(facts, rules)
    

    r = await callQbes(facts, rules)
    // End 2nd run

    locals.r = r

    locals.rid = rid
    locals.facts = r.facts  // Added 
    locals.PID = process.pid


    locals.elapsedTime = new Date() - start
    return sendRulesPackage(res, locals, rules)

  }
    catch(e) {
    console.log("🚀 ~ file: reportingunit.js:411 ~ e", e)
    let errorName = e.code ? e.code : "JSONParseError";

    if (e.code == 'UNDEFINED_RU_FACTS') {

      utils.processBusinessError(req, res, { name: errorName, parent: { hint: JSON.parse(locals.data) } });
      return;
    }

    if (e.code) {
      r = await callQbes(facts, rules)

      locals.r = r
      locals.rid = rid
      locals.facts = facts
      locals.PID = process.pid

      locals.elapsedTime = new Date() - start
      return sendRulesPackage(res, locals, rules)
    }

    let error = {
      name: errorName,
      parent: { hint: locals.data },
    };

    console.log("🚀 ~ file: reportingunit.js ~ line 437 ~ error", locals);


    await config.dbPool.query('update spad set status = $1 where id = $2', [JSON.stringify(errorName).substring(0, 9), locals.spadId])

    //utils.processBusinessError(req, res, error); // Lookup config for this error code
  }
}
};
