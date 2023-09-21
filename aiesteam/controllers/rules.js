var Deferred = require('Deferred');
var Sequelize = require('sequelize');
var dbSeq = require("../dbmodels/relationships")
var config = require("../config")
const env = config.credentials
const Op = Sequelize.Op;
var utils = require("../util")
var axios = require('axios').default;
const csvtojsonV2=require("csvtojson");

var auth = require("../libs/alteryx/services")
var services = require("../libs/alteryx/ayxServices");
const { request } = require('express');
// added comment to controller in rules

module.exports = {

        getWorkflows: async (locals, req, res, next) => {
            //services is the wrapper for our axios calls to alteryx -- handling OAuth1.0 and other details
            try{
                var results = await services.getWorkflows()
                //results returns an axios response object. We are only interested in the data key.
                
                //Controller must send HTTP Response data. Controller sends res back to user.
                res.send(results.data)
            } catch(err) {
                let error = { 
                    name: "ayxSubscriptionError", 
                    parent: 
                        { hint: "Got process subscription error:" + err.message } 
                }
                console.error(error)
                utils.processBusinessError(req, res, error) 
            }
            
        },

        getQuesbyWkflow: async (locals, req, res, next) => {

            //getting the workflowId parameter
            var workflowId = req.params['workflowId']

            try{
                var results = await services.getQuestions(workflowId)
                //results returns an axios response object. We are only interested in the data key.                
                results.data = removeWorkflowIdNode(results.data, 'appliance_job_id')
                
                //Controller must send HTTP Response data. Controller sends res back to user.
                res.send(results.data)
            } catch(err) {
                let error = { 
                    name: "ayxSubscriptionError", 
                    parent: 
                        { hint: "Got process subscription error: " + err.message } 
                }
                console.error(error)
                utils.processBusinessError(req, res, error) 
            }
        },

        //asynchronous controller to queue up an alteryx job for a specific workflow 
        postJobByWkflow: async (locals, req, res, next) => {
            
            var workflowId = req.params['workflowId']   //retrieving required parameter workflowId
            try{
                //get Random GUID for jobID
                var applianceJobId  = utils.getGuid()  

                req.body = setGUID(req.body, workflowId, applianceJobId)
                
                //pass in the generated GUID and the workflowId to the postJob function
                var results = await services.postJob(req.body, workflowId)
                //results returns an axios response object. We are only interested in the data key.     

                //store the workflowId, applianceJobId and alteryx returned job id mapping into ayx_job_mapper mapping table
                var job = await dbSeq.ayx_job_mapper.create({workflow_id: workflowId, appliance_job_id: applianceJobId, alteryx_generated_job_id: results.data.id})
            
                //Controller must send HTTP Response data. Controller sends res back to user.
                res.send(results.data)
            } catch(err) {
                let error = { 
                    name: "ayxSubscriptionError", 
                    parent: { hint: "Got process subscription error: " + err.message } 
                }
                console.error(error)
                utils.processBusinessError(req, res, error) 
            }
        },

        //used for testing purposes for the supreme endpoint (ayxServices.postS)
        postSupremeJob: async (locals, req, res, next) => {
            
            var jobId = req.params['jobId']   //retrieving required parameter workflowId

            try{
                var results = await services.postSupremeJob(jobId)
                //results returns an axios response object. We are only interested in the data key.
                
                //Controller must send HTTP Response data. Controller sends res back to user.
                res.send(results.data)
            } catch(err) {
                let error = { 
                    name: "ayxSubscriptionError", 
                    parent: { hint: "Got process subscription error: " + err.message } 
                }
                console.error(error)
                utils.processBusinessError(req, res, error) 
            }
        },

        getStatusByWkflow: async (locals, req, res, next) => {

            var workflowId = req.params['workflowId']   //retrieving required parameter workflowId

            try{
                var results = await services.getWorkflowStatus(workflowId)
                //results returns an axios response object. We are only interested in the data key.
                
                //Controller must send data from HTTP Response. Controller sends res back to user.
                res.send(results.data)
            } catch(err) {
                let error = { 
                    name: "ayxSubscriptionError", 
                    parent: { hint: "Got process subscription error: " + err.message } 
                }
                console.error(error)
                utils.processBusinessError(req, res, error) 
            }
        },
        
        getJobStatus: async (locals, req, res, next) => {
            var jobId = req.params['jobId']     //retrieving required parameter jobId

             try{
                var results = await services.getJobStatus(jobId)
                //results returns an axios response object. We are only interested in the data key.
                
                //Controller must send data from HTTP Response. Controller sends res back to user.
                res.send(results.data)
            } catch(err) {
                let error = { 
                    name: "ayxSubscriptionError", 
                    parent: { hint: "Got process subscription error: " + err.message } 
                }
                console.error(error)
                utils.processBusinessError(req, res, error) 
            }
        },

        getJobOutput: async (locals, req, res, next) => {
            var jobId = req.params['jobId']             //retrieving required parameter jobId
            var outputId = req.params['outputId']       //retrieving required parameter outputId
            
            var format = locals.format          //optional parameter format. (default to json)

             try{
                var results = await services.getJobOutput(jobId, outputId)
                //results returns an axios response object. We are only interested in the data key.
                
                //Controller must send data from HTTP Response. Controller sends res back to user.
                //var resultJson = utils.convertcsvjson(results.data)
                
                res.send(results.data)
            } catch(err) {
                let error = { 
                    name: "ayxSubscriptionError", 
                    parent: { hint: "Got process subscription error: " + err.message } 
                }
                console.error(error)
                utils.processBusinessError(req, res, error) 
            }
        },

        
        //methods below deal with hardcoded workflowId -- i.e. when a specific worklow is provided in the .env file as AYX_APP_ID
        // ESSENTIALLY DEPRECATED CONTROLLERS

        getQuestions: (locals, req, res, next) => {
            auth.questionRetrieval(res)
                .then(results => {
                    res.send(results)
                })
                .catch(err => {
                    let error = { 
                        name: "ayxSubscriptionError", 
                        parent: 
                            { hint: "Got process subscription error:" + err.message } 
                    }
                    utils.processBusinessError(req, res, error) 
                })
        },

        postJob: (locals, req, res, next) => {

            auth.queueJob(req.body, res)
                .then(results => {
                    res.send(results)
                })
                .catch(err => {
                    let error = { 
                        name: "ayxSubscriptionError", 
                        parent: 
                            { hint: "Got process subscription error:" + err.message } 
                    }
                    utils.processBusinessError(req, res, error) 
                })
        },


        getWorkStatus: (locals, req, res, next) => {
            auth.workflowRetrieval(res)
                .then(results => {
                    res.send(results)
                })
                .catch(err => {
                    let error = { 
                        name: "ayxSubscriptionError", 
                        parent: 
                            { hint: "Got process subscription error:" + err.message } 
                    }
                    utils.processBusinessError(req, res, error) 
                })
        },

}

//This function is used to update jsonObject value with applianceJobId (GUID) for the match on workflowId in description. 
// This is a hack to send Alteryx WorkflowId to map jobID
function setGUID(reqBody, workflowId, guid) {
    if(workflowId == process.env.AYX_RULES_ENGINE_WORKFLOW_ID){   
        let mappingJSON = JSON.parse(config.ayxMappingJson)
        mappingJSON.value = guid
        reqBody.questions.push(mappingJSON)
    }
    return reqBody;
}

// This is a hack to remove WorkFlowId Guid name from response Object
function removeWorkflowIdNode(jsonObj, idName) {                    
    for (var i = 0; i < jsonObj.length; i++) {  
        if (jsonObj[i].description == idName) {  
            jsonObj.splice(i, 1);
        }  
    }        
    return jsonObj;
}