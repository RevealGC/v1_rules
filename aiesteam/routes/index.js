/**
 * Author: Naveen Kapoor
 * Dated: June 28, 2022
 * Modified: June 28, 2022
 * Main Entry point from app.
 * 1) Defines all entry points
 * 2) For each entry point, the handleRequest is passed the following parameters
 * 2.1) params: For each url the parameters could be received from param, query, body or header
 * 2.2) <business model>: Business model is defined in the model folder. It points to a method. Its called the handler
 * 2.3) req
 * 2.4) res
 * 2.5) next(): Is mapped to an error handler. In case the parameters do not meet 
 * the constraints specified in the params(1st argument), next() will be the error handler as
 * (err) => { if (err) utils.processError(req, res, err) }
 * 
*/


const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const subRouters = [];
const getAllSubroutes = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    
 
    
    if (fs.lstatSync(fullPath).isDirectory()) {
      getAllSubroutes(fullPath);
    } else {
      if (fullPath !== __filename) {
        subRouters.push(require(fullPath));
      }
    }
    return subRouters;
  });
};

 getAllSubroutes(__dirname)
router.use(subRouters);

module.exports = router;