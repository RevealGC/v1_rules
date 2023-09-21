/**
 * Author: Naveen Kapoor
 * Dated: June 28, 2022
 * Modified: June 28, 2022
 * Utilities for Processing
 * 1) processError: shows all errors related to the input parameters
 * 2) processBusinessError: shows all errors related to the business model
 * 2.1) Will also capture JSON parse errors
 * 
 * 3) getPagingData: returns the offset when building the query
 * 4) getPagingDataWithSql: If DEBUG is true, the response with data is formed here and sent with a status of 200
 * 5) The utilities use custom response messages keys to capture business error   
*/


var Deferred = require('Deferred');

var jsonToPivotjson = require("json-to-pivot-json");

var config = require("./config")
let { reqUtilOptions } = config;
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var dbSeq = require("./dbmodels/relationships")
var uuid = require('uuid');


// code for replacing fields with fact


// let s = JSON.stringify(j)
// let s2 = s.replace(/field/g, 'fact')
// DOING aggregate('sum', 'RCPT_TOT', 'naics = "51113" and state = "MD"')
// select sum(cast(data_version_value as float8)) from v_survey_details_flags where rvname = 'RCPT_TOT' and naics = '561210' 
// and data_version = 'AC' 
// and
// city = 'MD';
// console.log(JSON.parse(s2).data.conditions)


// var sqlReportingData =
//     "select sd.id, sd.reporting_id, sd.refper, sd.rvid, rv.rvname,rv.data_type, sdf.data_version_value,  sdf.data_version,  sdf.data_flag from survey_details as sd, response_variables as rv , " +
//     " survey_details_flags as sdf where sd.reporting_id = $1  and sdf.survey_details_id = sd.id and rv.rvid = sd.rvid and sdf.data_version = 'AC' order by rvname ASC ";

// var sqlMetaFacts =

//     `select rv.rvname as name, CASE WHEN data_type = 'string'  THEN 'NUMERIC' ELSE 'number' END as type  from survey_details as sd, response_variables as rv , survey_details_flags as sdf where sd.reporting_id = $1 and sdf.survey_details_id = sd.id and rv.rvid = sd.rvid and sdf.data_version = 'AC' order by rvname`;

function sortObject(object) {
    return Object.fromEntries(
        Object.entries(object).sort(([a], [b]) => a.localeCompare(b))
    );
}


var self = module.exports = {



    // Regular expression to match variables
    // findVariables: (expression) => {

    //     const variableRegex = /[a-zA-Z_]+/g;
    //     // Find all matches in the expression
    //     let variables = expression.match(variableRegex);

    //     if (!variables) return [];

    //     // Remove duplicates
    //     variables = Array.from(new Set(variables));
    //     return variables;
    // },

    findVariables(expression) {
        // Regular expression to match variables

        try {
            const variableRegex = /[A-Z_]+|naics\w+/g;
            // const variableRegex = /[a-zA-Z]+|naics\w+/g;
          
            // Find all matches in the expression
            let variables = expression.match(variableRegex);
          
            // Remove duplicates
            variables = Array.from(new Set(variables));
          
            // Return the variables
            return variables;    
        } catch (error) {
            // console.log("🚀 ~ file: util.js:90 ~ findVariables ~ error, expression", error, JSON.stringify(expression))
            return []
        }
        
      },
      

    // if an array
    sortFacts(facts) {
        if (facts && facts.length > 0) {
            facts.forEach((fact, index) => {
                facts[index] = sortObject(fact)
            })

        }
        return facts;
    },


    sortFact(fact) {
        return sortObject(fact)
    },

    dateTime() {
        // Create a date object with the current time
        var date = new Date();

        // Extract the hours, minutes, and seconds from the date object
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();

        // Convert the hours, minutes, and seconds to strings and add leading zeros if necessary
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        // Create a string in the format "hh:mm:ss"
        var timeString = hours + ":" + minutes + ":" + seconds;

        // Return the string
        return timeString;
    },

    /// get the guid
    getGuid() {
        return uuid.v4();
    },

    /**
     * given a condition with a reporting id, get all the sds using the sql
     */
    async getReportingData(locals) {

        try {
            // let result = await config.dbPool.query(sqlReportingData, [locals.reporting_id]);
            // pivot it
            // let options = { row: "reporting_id", column: "rvname", value: "data_version_value", };
            // var facts = jsonToPivotjson(result.rows, options);

            // add reporting_units data besides the reporting_id
            let row = await config.dbPool.query('select * from product_aies.item_estabs_2023a1 where ent_id = $1 and version = $2', [locals.reporting_id, "PI"])
            let m2 = row.rows[0];
            facts = m2
            // .map(obj => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toUpperCase(), v])));

            return [facts];
        } catch (e) {
            throw e;
        }
    },
    async createSpadRecord(locals) {

        let spadInsertResult = await this.updateOrCreate(dbSeq.spad,
            { where: { reporting_id: locals.reporting_id, status: '0' } },
            {
                status: 'init', request: locals,
                created_by: locals.user, last_modified_by: locals.user, parent_id: 0,
                reporting_id: locals.reporting_id
            })

        let spadId = (spadInsertResult && spadInsertResult.item && spadInsertResult.item.id) ?
            spadInsertResult.item.id : 0
        return spadId;
    },



    async getAttributes(locals) {



        try {
            // gets the rv with their values
            // let metaFacts = await config.dbPool.query(sqlMetaFacts, [locals.reporting_id]);
            // merge row[0] in aggregates
            let m
            // = metaFacts.rows

            // get all the attributes
            let row = await config.dbPool.query('select * from reporting_units where reporting_id = $1', [locals.reporting_id])

            let m2 = row.rows[0]
            if (m2) {
                let keys = Object.keys(m2)
                keys.forEach(function (key) {
                    m.push({ name: key, type: 'string', value: m2[key] })
                })
            }
            return ({ attributes: m })
        } catch (e) {
            console.log("🚀 ~ file: util.js ~ line 76 ~ getAttributes ~ e", e)
            throw e;
        }
    },


    /**
     * 
     * If a record meets the where clause, it is updated
     * otherwise its inserted. 
     * @param {*} model dbSeq Model, ex: dbSeq.response_variables 
     * @param {*} where Object for seq ex: {rvname:'RCPT_TOT'}
     * @param {*} newItem Object of new values ex: {rvname:'RCPT_TOT',created_at, }
     * @returns {item, created:true/false}
     */
    async updateOrCreate(model, where, newItem) {
        // console.log("🚀 ~ file: util.js ~ line 48 ~ updateOrCreate ~ where", where)
        // First try to find the record
        const foundItem = await model.findOne(where);
  
        if (!foundItem) {
            // Item not found, create a new one
            const item = await model.create(newItem)
           

            return { item, created: true, success: true };
        }
        // Found an item, update it
        const item = await model.update(newItem, { where });
      
        return { item, updated: true, success: true };
    },
    /**
     * 
     * @param {*} str 
     * @param {*} label 
     * @returns 
     */

    async compileRuleString(str, label) {
        try {
            let strObj = await JSON.parse(str)
            let newKeysString = str.replace(/field/ig, 'fact')
            let parsed_rule = await JSON.parse(newKeysString);

            parsed_rule.event = { type: label, params: { message: parsed_rule.message } }
            delete parsed_rule.message

            let ret = { data: strObj, parsed_rule: parsed_rule }
            return ret
        } catch (e) {
            let error = { name: "JSONParseError", parent: { hint: "Could not parse the <" + label + ">:" + str } }
            throw error
        }


    },
    async getJson(str) {
        try {
            let retObj = await JSON.parse(str)
            return retObj;
        }
        catch (err) {
            let error = { name: "JSONParseError", parent: { hint: "Could not parse the str to JSON " + str } }
            throw error
            console.log("🚀 ~ file: util.js ~ line 68 ~ getJson ~ error", error)
        }
    },




    /** HOT ISSUE AND SOLn :DONE
     * We are building like the following: 
     *  order = [[Sequelize.literal(`"reporting_unit.naics"`),'ASC']]
     * 
     * 
     */

    getEntityInLibBase(sortBy, sdLib) {
        let libKeys = Object.keys(sdLib)

        for (var j = 0; j < libKeys.length; ++j) {
            let attributes = sdLib[libKeys[j]].attributes

            for (var k = 0; k < attributes.length; ++k) {

                if (attributes[k] === sortBy[0]) {
                    if (j == 0) return '';
                    return sdLib[libKeys[j]].name + '.'
                }
            }
        }


    },
    /**
     * DO NOT USE The utils one since this one has no includes
     * so we dont need to pad the alias name in the literal
     * 
     * @param {*} locals 
     * @param {*} defaultOrder 
     * @returns 
     */
    buildOrderNoIncludes(locals, defaultOrder) {
        let { sortDesc, sortBy } = locals;
        let order = []
        let column = sortBy
        if (sortBy.length) {
            for (var i = 0; i < sortBy.length; ++i) {
                let ascOrDesc = (sortDesc[i] == 'true') ? 'DESC' : 'ASC'
                order.push([Sequelize.literal(`"${column}"`), ascOrDesc])
                console.log(order)
                return order;
            }
        }
        return defaultOrder

    },

    /**
     * Has includes. So we need to find and pad the alias name to the column name
     * @param {} locals 
     * @param {*} defaultOrder 
     * @param {*} sdLibBase 
     * @returns 
     */
    buildOrder(locals, defaultOrder, sdLibBase) {
        let { sortDesc, sortBy } = locals;
        let order = []



        let entityName = this.getEntityInLibBase(sortBy, sdLibBase)
        // Need to specify the fully entityname.columnname

        let column = entityName + sortBy

        if (sortBy.length) {
            for (var i = 0; i < sortBy.length; ++i) {
                let ascOrDesc = (sortDesc[i] == 'true') ? 'DESC' : 'ASC'
                order.push([Sequelize.literal(`"${column}"`), ascOrDesc])
                console.log(order)
                return order;
            }
        }
        return defaultOrder
    },





    /**
     * Build the where clause, where(json) is parsed from ui
     * sdLib is the business lib for all entities like
     * rv, sd, sdFlags, company, etc.
     * @param {*} where 
     * @param {*} sdLib 
     * @returns 
     */
    buildWhereClause(where, sdLib) {
        // DEEP COPY THE SDLIB
        let retObj = JSON.parse(JSON.stringify(sdLib))


        let filterKeys = Object.keys(where) // {rid: xx,name:...}
        let libKeys = Object.keys(sdLib)
        for (var i = 0; i < filterKeys.length; ++i) {
            let strSearch = filterKeys[i]
            for (var j = 0; j < libKeys.length; ++j) {
                let attributes = sdLib[libKeys[j]].attributes
                for (var k = 0; k < attributes.length; ++k) {
                    if (attributes[k] === strSearch) {
                        let dataType = sdLib[libKeys[j]].dataType[k]
                        try {
                            if (dataType == 'int')
                                retObj[libKeys[j]]['where'][`${strSearch}`] = parseInt(where[filterKeys[i]]);
                            else if (dataType == 'str')
                                retObj[libKeys[j]]['where'][`${strSearch}`] = { [Op.iLike]: '%' + where[filterKeys[i]] + '%' };
                            else if (dataType == 'bool')
                                retObj[libKeys[j]]['where'][`${strSearch}`] = where[filterKeys[i]];


                        } catch (e) {
                            let error = { name: "JSONParseError", parent: { hint: "Could not parse the filter:" + e } }
                            console.log(error)
                            utils.processBusinessError(req, res, error) // Lookup config for this error code
                            return;
                        }
                    }
                }
            }
        }
        return retObj;
    },







    // Business errors resulting from db or server related. 500 series respCode
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} error 
     */
    processBusinessError(req, res, error) {
        console.log("🚀 ~ file: util.js ~ line 285 ~ processBusinessError ~ error", error)
        let respCode = (reqUtilOptions.customErrorResponseCodes[error.name]) + ''
        if (!reqUtilOptions.customResponseMessagesKeys[respCode]) respCode = '500001'
        let { status, summary, message } = reqUtilOptions.customResponseMessagesKeys[respCode]
        // message += ' ' + error.parent.hint
        let responseMessage = { summary, message, error, status, hasError: true, respCode }
        res.status(status)
        res.send(responseMessage)
    },

    // Business input errors resulting from params, body, header or query. 
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} error 
     */
    processError(req, res, error) {

        if (req.hasError) {

            let { status, summary, message } = reqUtilOptions.customResponseMessagesKeys[req.respCode]
            let responseMessage = { summary, message, status, hasError: req.hasError, error, respCode: req.respCode }
            req.hasError = false;
            res.status(status)
            res.send(responseMessage)
        }
        else {
            res.status(500);
            res.send({ error })
        }
    },
    /**
     * 
     * @param {*} inStr 
     * @returns 
     */
    convertDate(inStr) {
        if ((typeof inStr == 'undefined') || (inStr == null) ||
            (inStr.length <= 0)) {
            return '';
        }
        var year = inStr.substring(0, 4);
        var month = inStr.substring(5, 7);
        var day = inStr.substring(8, 10);
        return month + '-' + day + '-' + year;
    },

    /**
     * Used to get offset given an page and its size
     * It will return offset for sql queries
     * 
     * @param {number} page.  Page number of interest
     * @param {number} size   Size of each page
     * @returns 
     */
    getPagination(page, size) {
        const offset = (page == 1) ? 0 : (page - 1) * size + 1;
        return {
            offset
        };
    },

    /**
     * 
     * @param {*} data 
     * @param {*} page 
     * @param {*} limit 
     * @returns {object} Object. Returns totalItmes, totalPages, currentPages, rows
     */
    getPagingData(data, page, limit) {
        const {
            count: totalItems,
            rows: rows
        } = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return {
            totalItems,
            totalPages,
            currentPage,
            rows
        };
    },

    /**
     * 
     * @param {*} data 
     * @param {*} page 
     * @param {*} limit 
     * @param {*} label 
     * @param {*} dbSeq 
     * @param {*} reqParams 
     * @param {*} locals 
     * @returns 
     */
    getPagingDataWithSQL(data, page, limit, label, dbSeq, reqParams, locals) {
        let { count: totalItems, rows, itemsPerPage } = data;
        // return(data)



        const currentPage = page ? +page : 1;
        const totalPages = Math.ceil(totalItems / limit);
        const prevPage = (currentPage == 1) ? currentPage : (currentPage - 1)
        const nextPage = (currentPage == totalPages) ? currentPage : currentPage + 1
        let meta = {}
        if (locals.DEBUG) meta.locals = locals
        let links = {

            "first": "?page=1" + reqParams,
            "last": "?page=" + totalPages + reqParams,
            "prev": "?page=" + prevPage + reqParams,
            "next": "?page=" + nextPage + reqParams,
        }


        meta.debug = locals.DEBUG
        meta.current_page = currentPage
        meta.from = currentPage * locals.itemsPerPage
        meta.last_page = totalPages
        meta.link = [links]
        meta.path = "?"
        meta.per_page = parseInt(locals.itemsPerPage)
        meta.to = totalPages
        meta.total = totalItems




        // let linkPadding = "&itemsPerPage="+locals.itemsPerPage+"&"
        let sqlArray = [...dbSeq.sqlGeneratedString]
        // reset the counters of the sql
        dbSeq.init();
        if (locals.DEBUG) {
            return {

                reqParams,
                // locals,
                links,
                meta,
                sqlArray,
                ["data"]: rows,
                ["allData"]: data
            }
        } else
            return {
                links,
                meta,
                ["data"]: rows,
                ["allData"]: data

            }
    },

    makePagingOrderingCondition(params) { }

}