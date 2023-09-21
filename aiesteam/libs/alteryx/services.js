const config = require('../../config');
var axios = require('axios').default;
var combineURLs = require('axios/lib/helpers/combineURLs')
var Deferred = require('Deferred');
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
var workflows = "/v1/workflows/subscription/" 

//const appId = "62c87c248751a82d3c9d2448"
var questions = `/v1/workflows/${appId}/questions/`
var queueUp = `/v1/workflows/${appId}/jobs/`
var workflowStatus = `/v1/workflows/${appId}/jobs/`


var buildOauthParams = function(apiKey){
  return {
      oauth_consumer_key: apiKey,
      oauth_signature_method: "HMAC-SHA1",
      oauth_nonce: Math.floor(Math.random() * 1e9).toString(),
      oauth_timestamp: Math.floor(new Date().getTime()/1000).toString(),
      oauth_version: "1.0"
  };
};

var generateSignature = function(httpMethod, url, parameters, secret) {
return oauthSignature.generate(httpMethod, url, parameters, secret, null, { encodeSignature: false});
};

exports.subscriptionRetrieval = function(res){
  var def = Deferred()
  var urlQuery = combineURLs(baseURL, workflows)
  var subParams = buildOauthParams(TOKENKEY);	
  var signature = generateSignature("GET", urlQuery, subParams, TOKENSECRET);
  subParams["oauth_signature"] = signature;

  axios.get(urlQuery, {
      params: subParams
  }).then(function (response) {
    res.send({data: response.data})
    def.resolve()
    return;
    //def.resolve({data: response.data})
  })
  .catch(function (error) {
    //throw BusinessError?
    def.reject(error)
  });
  return def.promise

}

exports.questionRetrieval = function(res){
  var def = Deferred()
  var urlQuery = combineURLs(baseURL, questions)
  var subParams = buildOauthParams(TOKENKEY);	
  var signature = generateSignature("GET", urlQuery, subParams, TOKENSECRET);
  subParams["oauth_signature"] = signature;

  axios.get(urlQuery, {
      params: subParams
  }).then(function (response) {
    res.send({data: response.data})
    def.resolve()
    return;
    //def.resolve({data: response.data})
  })
  .catch(function (error) {
    //throw BusinessError?
    def.reject(error)
  });
  return def.promise

}

exports.questionbyWkflow = function(res, workflowId){
  var def = Deferred()

  //console.log("s.workflowId " + workflowId)g

  var questionURL = `/v1/workflows/${workflowId}/questions/`
  var urlQuery = combineURLs(baseURL, questionURL)

  var subParams = buildOauthParams(TOKENKEY);	
  var signature = generateSignature("GET", urlQuery, subParams, TOKENSECRET);
  subParams["oauth_signature"] = signature;

  axios.get(urlQuery, {
      params: subParams
  }).then(function (response) {
    res.send({data: response.data})
    def.resolve()
    return;
    //def.resolve({data: response.data})
  })
  .catch(function (error) {
    //throw BusinessError?
    def.reject(error)
  });
  return def.promise

}


exports.queueJob = function(body, res){
  var def = Deferred()
  var urlQuery = combineURLs(baseURL, queueUp)
  var subParams = buildOauthParams(TOKENKEY);	
  var signature = generateSignature("POST", urlQuery, subParams, TOKENSECRET);
  subParams["oauth_signature"] = signature;

  axios.post(urlQuery, null, {
    params: subParams,
    data: body
  })
  .then(function (response) {
    res.send({data: response.data})
    def.resolve()
    return;
    //def.resolve({data: response.data})
  })
  .catch(function (error) {
    //throw BusinessError?
    def.reject(error)
  });
  return def.promise

}

exports.queueJobByWkflow = function(body, res, workflowId){
  var def = Deferred()

  var queueURL = `/v1/workflows/${workflowId}/jobs/`
  var urlQuery = combineURLs(baseURL, queueURL)

  var data = JSON.stringify(body)

  //console.log(workflowId)

  var subParams = buildOauthParams(TOKENKEY);	
  var signature = generateSignature("POST", urlQuery, subParams, TOKENSECRET);
  subParams["oauth_signature"] = signature;

  url_config = urlQuery + "?" + new URLSearchParams(subParams)

  var config = {
    method: 'post',
    url: url_config,
    headers: {
      'Content-Type': 'application/json'
    },
    data : data
  };

  axios(config)
  .then(function (response) {
    //console.log(JSON.stringify(response.data));
    res.send({data: response.data})
    def.resolve()
    return;
  })
  .catch(function (error) {
    //console.log(error);
    def.reject(error)
  });

  return def.promise


  //console.log(JSON.parse(body))
  body = JSON.stringify({
    "questions": [
      {
        "name": "SQL Query Data Source Text Box",
        "type": "QuestionTextBox",
        "description": "Enter in SQL Query to access AIES data",
        "value": "SELECT * FROM \"product_aies\".\"ayx_scratch_pad\" WHERE \"ayx_scratch_pad\".\"rvname\" IN ('PAY_ANN', 'RCPT_TOT')"
      },
      {
        "name": "SQL Rule Parameter Text Box ",
        "type": "QuestionTextBox",
        "description": "Enter in the parameter query to be executed ",
        "value": "[RCPT_TOT] + 12222"
      }
    ],
    "priority": "0"
  });
  
  url_config = urlQuery + new URLSearchParams(subParams)
  console.log(url_config)

  config = {
    method: 'post',
    url: url_config,
    headers: {
      'Content-Type': 'application/json'
    },
    data: body
  }

  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    res.send(response.data)
    def.resolve()
    return;
  })
  .catch(function (error) {
    console.log(error);
    def.reject(error)
  });

  return def.promise

  // axios.post(urlQuery, null, {
  //   params: subParams,
  //   data: body
  // })
  // .then(function (response) {
  //   res.send(response.data)
  //   def.resolve()
  //   return;
  //   //def.resolve({data: response.data})
  // })
  // .catch(function (error) {
  //   //throw BusinessError?
  //   def.reject(error)
  // });
  // return def.promise

}


exports.workflowRetrieval = function(res){
  var def = Deferred()
  var urlQuery = combineURLs(baseURL, workflowStatus)
  var subParams = buildOauthParams(TOKENKEY);	
  var signature = generateSignature("GET", urlQuery, subParams, TOKENSECRET);
  subParams["oauth_signature"] = signature;

  axios.get(urlQuery, {
      params: subParams
  }).then(function (response) {
    res.send({data: response.data})
    def.resolve()
    return;
    //def.resolve({data: response.data})
  })
  .catch(function (error) {
    //throw BusinessError?
    def.reject(error)
  });
  return def.promise

}


exports.statusByWkflow = function(res, workflowId){
  var def = Deferred()

  var statusURL = `/v1/workflows/${workflowId}/jobs/`
  var urlQuery = combineURLs(baseURL, statusURL)

  var subParams = buildOauthParams(TOKENKEY);	
  var signature = generateSignature("GET", urlQuery, subParams, TOKENSECRET);
  subParams["oauth_signature"] = signature;

  axios.get(urlQuery, {
      params: subParams
  }).then(function (response) {
    res.send({data: response.data})
    def.resolve()
    return;
    //def.resolve({data: response.data})
  })
  .catch(function (error) {
    //throw BusinessError?
    def.reject(error)
  });
  return def.promise

}


exports.jobRetrieval = function(jobId, res){
  var def = Deferred()
  var jobStatus = `/v1/jobs/${jobId}/`
  var urlQuery = combineURLs(baseURL, jobStatus)
  var subParams = buildOauthParams(TOKENKEY);	
  var signature = generateSignature("GET", urlQuery, subParams, TOKENSECRET);
  subParams["oauth_signature"] = signature;

  axios.get(urlQuery, {
      params: subParams
  }).then(function (response) {
    res.send({data: response.data})
    def.resolve()
    return;
    //def.resolve({data: response.data})
  })
  .catch(function (error) {
    //throw BusinessError?
    def.reject(error)
  });
  return def.promise

}


exports.jobOutput = function(jobId, outputId, res, format){
  var def = Deferred()
  var jobOutput = `/v1/jobs/${jobId}/output/${outputId}/`
  var urlQuery = combineURLs(baseURL, jobOutput)

  var subParams = buildOauthParams(TOKENKEY);	
  subParams["format"] = format
  var signature = generateSignature("GET", urlQuery, subParams, TOKENSECRET);
  subParams["oauth_signature"] = signature;

  //console.log(subParams)

  axios.get(urlQuery, {
      params: subParams
  }).then(function (response) {
    res.send(response.data)
    def.resolve()
    return;
    //def.resolve({data: response.data})
  })
  .catch(function (error) {
    //throw BusinessError?
    def.reject(error)
  });
  return def.promise

}