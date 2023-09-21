
const { Pool, Client } = require("pg");
var config = {}

const dotenv = require('dotenv');
dotenv.config();
// const port = process.env.PORT;
let host = process.env.HOST
let password = process.env.PASSWORD
let dbUser = process.env.DBUSER
let dbport = process.env.DBPORT 
let database = process.env.DATABASE 
let dialect = process.env.DIALECT
let ayx_key = process.env.AYX_KEY
let ayx_secret = process.env.AYX_SECRET
let ayx_app_id = process.env.AYX_APP_ID
let ayx_api_loc = process.env.AYX_API_LOC
let node_api_key = process.env.NODE_API_KEY


let PGOPTIONS = process.env.PGOPTIONS //process.env.PGOPTIONS="-c search_path=some_schema"

 
config.credentials = { host, password, user:dbUser, schema: 'product_aies' , port: dbport, database, dialect, ayx_key, ayx_secret, ayx_app_id, ayx_api_loc }

config.hostUrl = process.env.HOSTURL
config.QFLOWURL = process.env.QFLOWURL
config.node_api_key = process.env.NODE_API_KEY
/**
 * SQL Prepared Statements
 */
config.sqlNaicsByEntId = 'select distinct naics_codes.naics, naics_codes.title from naics_codes, reporting_units where naics_codes.naics = reporting_units.naics and reporting_units.ent_id = $1';
config.sqlRVsByEntId =
' select  rvid,  rvname,  rv_description , mu_flag, kau_flag, estab_flag, control_flag, qdm_flag, data_type, visible' +
' from response_variables where rvid in ( select distinct rvid from reporting_units, survey_details ' +
' where ent_id = $1 and reporting_units.reporting_id = survey_details.reporting_id)';

// select rvid, rvname, rv_description, mu_flag, kau_flag, estab_flag, control_flag, qdm_flag, data_type, visible from response_variables where rvid in 
// ( select  distinct rvid from reporting_units, survey_details where ent_id = $1 and
// reporting_units.reporting_id = survey_details.reporting_id)


config.sqlVunitCountByEntId = 'select count(*) as "CNT", level_type  from reporting_units where ent_id = $1 group by level_type order by level_type';
config.getCompanyDetails = 'select * from reporting_units where ent_id = $1';

config.sqlGetDataVersion = "select * from flagging_data_versions where id = $1";
config.sqlGetDataFlags = "select * from flagging_data_flags where id = $1";

config.sqlGetSourceFlags = "select * from flagging_source_flags where id = $1";


// Get all flags with joins.  Can add limit and offset to the statement
config.sqlGetAllDataVersionSourceFlags =
"SELECT flagging_data_version_id, flagging_data_flag_id, flagging_source_flag_id ," +
 " fdv.id as dataVersionId, fdv.code as dataVersionCode, fdv.description as dataVersionDescription, "
 +" fdf.id as dataFlagsId, fdf.code as dataFlagsCode, fdf.description as dataFlagsDescription, "
 +" fsf.id as dataSourceId, fsf.code as dataSourceCode, fsf.description as dataSourceDescription FROM flagging_mappings, "
 +"  flagging_data_versions as fdv, flagging_data_flags as fdf, flagging_source_flags as fsf where fdf.id = flagging_data_flag_id "
 +" and fdv.id = flagging_data_version_id and fsf.id = flagging_source_flag_id "


config.sqlgetSurveyDetailsTotals= 
'select count(*) as total from reporting_units where ent_id = $1'
    

// Mappings sql
config.sqlGetFlagMapping = "select * from flagging_mappings where id = $1";
config.ayxMappingJson = '{"name": "Text Box (95)",' +
                        '"type": "QuestionTextBox",' +
                        '"description": "appliance_job_id",' +
                        '"value": ""}';

config.defaultUser = 'kapoo300'

config.defaultDB = 'product_aies';
config.pagingLimit = 50;
config.pagingOffSet = 0;
config.DEBUG = true;
config.page = 1
config.size = 10
config.xApiKey=  node_api_key// 'x5nDCpvGTkvHniq8wJ9m'


config.checkHeaders=((req)=>{

  if(!req.headers['x-jbid'] && !req.headers['X-JBID']) return false;

  if(req.query && req.query.api_token && req.query.api_token == config.xApiKey) {
    return true;
  }
  return (
    (req.query && req.query['X-API-KEY'] && req.query['X-API-KEY'] === config.xApiKey) ||
  (req.headers && req.headers['x-api-key'] && req.headers['x-api-key'] === config.xApiKey))
})



/**
 * 
 */
config.reqUtilOptions = {
  enableForceTlsCheck: true,
  debug: true,
  checkPermissions: ((req) => { 

    if(req.query && req.query.api_token && req.query.api_token == config.xApiKey) {
      return true;
    }
    return (
      (req.query && req.query['X-API-KEY'] && req.query['X-API-KEY'] === config.xApiKey) ||
    (req.headers && req.headers['x-api-key'] && req.headers['x-api-key'] === config.xApiKey))
 }),
  customErrorResponseCodes: {
    ['SequelizeDatabaseError']: '500100',
    ['JSONParseError']: "500101",
    ['UNDEFINED_FACT'] : "400003",
    ['UNDEFINED_RU_FACTS']: "400004",
    ['SQLError']: "500102",
    ['ayxSubscriptionError']: "405001",
  },
  customResponseMessagesKeys: {
    [200000]: { summary: 'OK', message: '', status: 200 },
    [400000]: { summary: 'Bad Request', message: 'The request is malformed.', status: 400 },
    [400001]: { summary: 'Missing Parameters', message: 'The request is missing required parameters.', status: 400 },
    [400002]: { summary: 'Missing Parameters', message: 'The requested parameter should be boolean.', status: 400 },
    [400003]: { summary: 'Missing Rule Facts', message: 'Somne facts have not been defined for the rules to fire.', status: 400 },
    [400004]: { summary: 'Undefined Facts for Reporting Unit', message : 'No data is available for the reporting id.', status: 404 },
    
    [401000]: { summary: 'Unauthorized', message: 'This request is not authorized.', status: 401 },
    [403000]: { summary: 'Forbidden', message: 'The credentials provided are not authorized for this request', status: 403 },
    [403001]: { summary: 'Forbidden', message: 'Secure endpoints can only be accessed via HTTPS.', status: 403 },
    [404000]: { summary: 'Not Found', message: 'The requested resource does not exist or you are not authorized to access it.', status: 404 },
    [405001]: { summary: 'Not Found', message: 'The requested resource does not exist or you are not authorized to access it.', status: 405 },
    [408000]: { summary: 'Timed Out', message: 'The request timed out.', status: 408 },
    [429000]: { summary: 'Rate Limit', message: 'Rate limit has been exceeded', status: 429 },
    [500000]: { summary: 'Could Not Connect', message: 'The server connection timed out', status: 500 },
    [500001]: { summary: 'General Server Error', message: 'A fatal error has occurred on the server.', status: 500 },
    [500100]: { summary: 'General Server Error', message: 'A fatal error has occurred on the server.', status: 500 },
    [500101]: { summary: 'General Server Error', message: 'Please consult your administrator. Your data was malformed.', status: 500 },
    [500102]: { summary: 'General Server Error', message: 'A fatal error has occurred on the SQL server.', status: 500 },
  },
};

const ReqUtils = require('@outofsync/request-utils');
// Create an instance of reqUtils to read all params and raise errors if any
config.reqUtils = new ReqUtils(config.reqUtilOptions);



async function poolConnector() {
  const pool = new Pool(config.credentials);

  // pool.on('connect', (client) => {
  //   client.query(`SET search_path TO product_aies`);
  // });

  // await pool.query(`SET search_path TO product_aies`);


  const now = await pool.query("SELECT count(*) from product_aies.rules_repository");
  config.dbPool = pool
  
  config.now = now 
  return now;
}

// Use a self-calling function so we can use async / await.

(async () => {
  const poolResult = await poolConnector();
  console.log("Time with pool: " + JSON.stringify(poolResult.rows[0]));
})();


module.exports = config;