const config = require('../../config');
var axios = require('axios').default;
var combineURLs = require('axios/lib/helpers/combineURLs')
var oauthSignature = require("oauth-signature");

const env = config.credentials

const TOKENKEY = env.ayx_key;
const TOKENSECRET = env.ayx_secret;
const appId = env.ayx_app_id;
const apiLoc = env.ayx_api_loc;

//axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.post['Content-Type'] = 'application/json'


var baseURL = apiLoc //"http://20.185.197.49:80/gallery/api"

//generate OAuth1.0 parameters for communicating with Alteryx API
var buildOauthParams = function(apiKey){
  return {
      oauth_consumer_key: apiKey,
      oauth_signature_method: "HMAC-SHA1",
      oauth_nonce: Math.floor(Math.random() * 1e9).toString(),
      oauth_timestamp: Math.floor(new Date().getTime()/1000).toString(),
      oauth_version: "1.0"
  };
};

//signature for Alteryx API
var generateSignature = function(httpMethod, url, parameters, secret) {
return oauthSignature.generate(httpMethod, url, parameters, secret, null, { encodeSignature: false});
};


/**
 * service to list all the workflows in a subscription. Uses the KEY and SECRET given in .env 
 * @returns Promisified Axios Response obj
 */
exports.getWorkflows = async function(){
    var workflows = "/v1/workflows/subscription/" 
    var urlQuery = combineURLs(baseURL, workflows)      //AYX URL to call
    
    //  configuring OAuth 1.0 parameters
    var subParams = buildOauthParams(TOKENKEY);	            
    var signature = generateSignature("GET", urlQuery, subParams, TOKENSECRET);
    subParams["oauth_signature"] = signature;
    
    try{
        var result = await axios.get(urlQuery, {params: subParams})    //passes a config object with query parameters subParams  
        return result
    } catch(err){
        console.error(err.data)             //occurs when Axios request throws an error, typically would be a 404
        throw new Error(err)
    }
}

/**
 * service to list all questions for a given workflowId
 * @param {*} workflowId 
 * @returns Promisified Axios Response object
 */
exports.getQuestions = async function(workflowId){

    var questionURL = `/v1/workflows/${workflowId}/questions/`    //parameterizing URL
    var urlQuery = combineURLs(baseURL, questionURL)          //AYX URL to call

    //making the OAuth1.0 parameters
    var subParams = buildOauthParams(TOKENKEY);	
    var signature = generateSignature("GET", urlQuery, subParams, TOKENSECRET);
    subParams["oauth_signature"] = signature;         

    try{
        var result = await axios.get(urlQuery, {params: subParams})   //calls a GET request with specified OAuth1.0 params      
        return result
    } catch(err){
        console.error(err)      //occurs when Axios request throws an error, typically would be a 404
        throw new Error(err)
    }

}

/**
 * service to post a job on Alteryx providing workflowId and body (with values for the questions) 
 * @param {*} body 
 * @param {*} workflowId 
 * @returns Promisified Axios Response object
 */
exports.postJob = async function(body, workflowId){

    var queueURL = `/v1/workflows/${workflowId}/jobs/` //parameterizing URL
    var urlQuery = combineURLs(baseURL, queueURL)

    var data = JSON.stringify(body)             //critical to ensuring that the body is passed properly to Alteryx.

    var subParams = buildOauthParams(TOKENKEY);	
    var signature = generateSignature("POST", urlQuery, subParams, TOKENSECRET);
    subParams["oauth_signature"] = signature;                    //the usual OAuth1.0 generation

    url_config = urlQuery + "?" + new URLSearchParams(subParams)      //building url to pass in axios config obj

    //config obj made to replicate Postman calling the Alteryx APi
    //post method with stringified body
    var config = {
        method: 'post',               
        url: url_config,  
        headers: {
        'Content-Type': 'application/json'
        },
        data: data
    };

    try {
        var result = await axios(config)        //calling axios with above-made config
        return result 
    } catch(err){
        console.error(err)          //occurs when Axios request throws an error, typically would be a 404
        throw new Error(err)
    }
}

/**
 * service to post a job on Alteryx providing jobId (stored in scratchpad) & handles everything required for basic functionality. 
 * To provide alteryx with a jobId needed to process a job (rule definition and dataset SQL is in the ayx_jobs table)
 * @param {*} jobId
 * @returns Promisified Axios Response object
 */
 exports.postSupremeJob = async function(jobId, workFlowId){

    var workflowId =workFlowId// "630f8a2f8751a80570499ead"
  //  console.log({workFlowId, workflowId}); return;
    var body = {
        "questions": [
          {
            "name": "JOBS_ID input for ScratchPad",
            "type": "QuestionTextBox",
            "description": "Enter in JOBS_ID to access AIES data ScratchPad Data",
            "value": `SELECT * FROM \"product_aies\".\"ayx_scratch_pad\" WHERE \"ayx_scratch_pad\".\"ayx_jobs_id\" IN ('${jobId}')`
          },
          {
            "name": "JOBS_ID input for ayx_jobs",
            "type": "QuestionTextBox",
            "description": "Enter in JOBS_ID to access AIES.ayx_jobs data",
            "value": `SELECT * FROM \"product_aies\".\"ayx_jobs\" WHERE \"ayx_jobs\".\"id\" IN ('${jobId}')`
          }
        ],
        "priority":"0"
        }
    
      try {
        var resultPost = await exports.postJob(body, workflowId)

        return resultPost.data
        //return exports.getJobStatus(ayx_job_id)

      } catch(err){
        console.error(err)
      }
}


/**
 * service to get status for all jobs run on a workflow 
 * @param {*} workflowId 
 * @returns Promisified Axios Response object
 */
exports.getWorkflowStatus = async function(workflowId){

  var workflowStatus = `/v1/workflows/${appId}/jobs/`    //parameterizing URL

  var urlQuery = combineURLs(baseURL, workflowStatus)
  var subParams = buildOauthParams(TOKENKEY);	
  var signature = generateSignature("GET", urlQuery, subParams, TOKENSECRET);
  subParams["oauth_signature"] = signature;               //the usual OAuth1.0 generation

  try{
      var result = await axios.get(urlQuery, {params: subParams})        
      return result
  } catch(err){ 
      console.error(err)        //occurs when Axios request throws an error, typically would be a 404
      throw new Error(err)
  }

}

/**
 * service to get job status with messages on workflow execution. Provides outputId
 * @param {*} jobId 
 * @returns Promisified Axios Response object
 */
exports.getJobStatus = async function(jobId){

  var jobStatus = `/v1/jobs/${jobId}/`    //parameterizing URL

  var urlQuery = combineURLs(baseURL, jobStatus)
  var subParams = buildOauthParams(TOKENKEY);	
  var signature = generateSignature("GET", urlQuery, subParams, TOKENSECRET);
  subParams["oauth_signature"] = signature;         //the usual OAuth1.0 generation

  try{
      var result = await axios.get(urlQuery, {params: subParams})        
      return result
  } catch(err){
      console.error(err)            //occurs when Axios request throws an error, typically would be a 404
      throw new Error(err)
  }

}
/**
 * service to get job output
 * @param {*} jobId 
 * @param {*} outputId 
 * @returns Promisified Axios Response object
 */
exports.getJobOutput = async function(jobId, outputId){

  var jobOutput = `/v1/jobs/${jobId}/output/${outputId}/`    //parameterizing URL

  var urlQuery = combineURLs(baseURL, jobOutput)
  var subParams = buildOauthParams(TOKENKEY);	
  subParams["format"] = "Csv"       //returning back a Csv format for visual purposes.

  var signature = generateSignature("GET", urlQuery, subParams, TOKENSECRET);
  subParams["oauth_signature"] = signature;   //must follow directly after signature is set, OAuth1.0 throws error otherwise.

  try{
      var result = await axios.get(urlQuery, {params: subParams})        
      return result
  } catch(err){
      console.error(err)            //occurs when Axios request throws an error, typically would be a 404
      throw new Error(err)
  }

}
