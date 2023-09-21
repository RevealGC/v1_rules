
var express = require('express');
var requireDir = require('require-dir');
var bodyParser = require("body-parser");
var router = express.Router();
var config = require('../config')
var swaggerFile = require('../aiesSwagger')

const Papa = require('papaparse')
const multer = require('multer');
const storage = multer.memoryStorage();  // Store the file in memory
const upload = multer({ storage: storage });
const { processCSVData, internalServerErrorResponse, badRequestResponse } = require('../utils/responses');
const axios = require('axios')
router.get('/app-info', function (req, res, next) {
    res.status(200)
    res.send({ "version": "c31e775" })
})


/**
 * GET home page
 */
router.get('/', function (req, res) {
    res.status(200)
    res.send(swaggerFile)
});
router.post('/upload_csv', upload.single('csv'), async (req, res) => {
    if (!req.file) {
        return badRequestResponse(res, "No file uploaded");
    }
    const csvString = req.file.buffer.toString('utf8');
    Papa.parse(csvString, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: async (result) => {
            const msg = processCSVData(result.data);
            try {
                const validatedRules = await axios.post('/rulesrepo/stringsToRules', msg.payload, {
                    headers: {
                        'x-api-key': 'x5nDCpvGTkvHniq8wJ9m',
                        'x-jbid': 'kapoo'
                    }
                })
                msg.validateRules = validatedRules.data
                res.json(msg);
            } catch (error) {
                console.error(error)
                return internalServerErrorResponse(res, error);
            }
        },
        error: (err) => {
            badRequestResponse(res, err);
        }
    });

});

router.post('/save_csv', async (req, res) => {
    const body = req.body;
    const requestBody = body.map((_r, k) => {
      console.log({_r});
      let r = _r.data
      let name = (r.event.name || "Dynamic Rule") + ": " + r.event.ruleId
      let description = _r.description
      r.event.ruleId = "0"
      r.event.type = "0"
      r.event.eventType = "impute"
  
      return { parsed_rule: r, data: r, name, description, id: 0 }
    })
    try {
      const savedRules = await axios.post('/rulesrepo/new/parsedrules/0', { data: requestBody }, {
        headers: {
          'x-api-key': 'x5nDCpvGTkvHniq8wJ9m',
          'x-jbid': 'kapoo'
        }
      })
      console.log(savedRules.data)
      res.json(savedRules.data);
    } catch (error) {
      console.error(error)
      return internalServerErrorResponse(res, error);
    }
  })
module.exports = router;

