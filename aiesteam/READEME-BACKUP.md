

8/14
#42 
getSurveyDetailsTotals
http://localhost:3000/survey-details/company/2007749789/total?DEBUG=true

8/12


http://localhost:3000/flagging/data-flags

Analytics url is added
http://localhost:3000/analytics?itemsPerPage=100

http://localhost:3000/analytics?DEBUG=true&filters={%22naics_title%22:%20%22So%22}



8/11

Added iLike capability in utils so filters can be case insensitive



http://ec2-18-254-37-140.us-gov-east-1.compute.amazonaws.com:3000/survey-details?page=1&itemsPerPage=25&sortBy[]=reporting_id&sortDesc[]=true&groupBy[]=reporting_id&groupDesc[]=false&mustSort=false&multiSort=false&entId=2007869520&filters=%7B%7D

No DATA
http://localhost:3000/survey-details?page=1&itemsPerPage=25&sortBy[]=reporting_id&sortDesc[]=true&groupBy[]=reporting_id&groupDesc[]=false&mustSort=false&multiSort=false&entId=2007869520&filters=%7B%7D

8/10 Ordering for emebdded urls

http://localhost:3000/survey-details?DEBUG=true&page=1&itemsPerPage=25&groupBy[]=reporting_id&groupDesc[]=false&mustSort=false&multiSort=false&entId=2007912823&filters={%22level_type%22:%22c%22}



http://localhost:3000/survey-details?DEBUG=false&page=1&itemsPerPage=25&sortBy[]=naics&sortDesc[]=false&groupBy[]=reporting_id&groupDesc[]=false&mustSort=false&multiSort=false&entId=2007912823&filters=%7B%7D


Companies supporting order
http://localhost:3000/companies?DEBUG=true&page=1&itemsPerPage=25&sortBy[]=reporting_id&sortDesc[]=false&groupBy[]=reporting_id&groupDesc[]=false&mustSort=false&multiSort=false&filters=%7B%7D


RVs
http://localhost:3000/response-variables?DEBUG=true&page=1&itemsPerPage=25&sortBy[]=rvname&sortDesc[]=false&groupBy[]=&groupDesc[]=false&mustSort=false&multiSort=false&filters=%7B%7D





8/10
http://localhost:3000/companies/2007912823?DEBUG=true
http://localhost:3000/companies?1
http://localhost:3000/companies?entId=2007834121&DEBUG=true
http://ec2-18-254-37-140.us-gov-east-1.compute.amazonaws.com:3000/companies?page=1&itemsPerPage=10&sortDesc[]=false&mustSort=false&multiSort=false&filters=%7B%7D

VUE INTERFACE
http://census-vue-js-app.s3-website.us-gov-east-1.amazonaws.com/#/response-explorer/responses/2007912823


http://localhost:3000/flagging/data-flags/NK

FDV
http://localhost:3000/flagging/data-version?page=1&itemsPerPage=15&DEBUG=true&filters={%22code%22:%22OR%22}&



COMPANIES WITH FILTERS ARE ON and so are for RV
http://localhost:3000/companies?filters={%22name1%22:%22WALSKI%22}&levelType=c&DEBUG=true


RV 

http://localhost:3000/response-variables?page=1&itemsPerPage=10&sortDesc[]=false&mustSort=false&multiSort=false&filters={"rvname":"EMP"}&DEBUG=true



http://ec2-18-254-37-140.us-gov-east-1.compute.amazonaws.com
http://localhost:3000/response-variables?page=1&itemsPerPage=10&sortDesc[]=false&mustSort=false&multiSort=false&filters=%7B%7D
http://ec2-18-254-37-140.us-gov-east-1.compute.amazonaws.com:3000/survey-details-archive/reportingId/8001657750?rvId=845

********************************
AUGUST 7, 2022: SURVEY_DETAILS WHERE AND ORDER
********************************
http://localhost:3000/survey-details/?page=1&itemsPerPage=15&DEBUG=true&filters={%22reporting_id%22:%222800888303%22,%22naics%22:%20%22541214%22,%22rvname%22:%20%22PAY_ANN%22}&sortBy%5B%5D=reporting_id&sortDesc%5B%5D=false





********************************
AUGUST 6, 2022: SURVEY_DETAILS
********************************
1) Missing versions code. Need db fix on it for data_versions
and data_flags

2) Sort ASC by reporting_id and filters are {"reporting_id": "value"}
http://localhost:3000/survey-details?page=1&itemsPerPage=15&DEBUG=true&filters={%22reporting_id%22:%222800888303%22}&sortBy%5B%5D=reporting_id&sortDesc%5B%5D=false

Ex:
  "data": [
    {
      "id": "5908",
      "ent_id": "2007694988",
      "refper": "2017A1",
      "reporting_id": "2000001873",
      "alpha": "111204",
      "sector": "44",
      "naics": "445110",
      "unit_type": "MU",
      "level_type": "e",
      "rvid": "347",
      "rvname": "PAY_ANN",
      "rv_value": "2,740,000",
      "category": "",
      "rv_description": "Annual Payroll Total",
      "qdm_flag": "YES",
      "versions": [
        {
          "id": "12696",
          "reporting_id": "2000001873",
          "refper": "2017A1",
          "rvid": "347",
          "data_version": "AC",
          "rv_value": "2740000"
        }
      ]
    },

********************************
        August 5, 2022: COMPANY
********************************

http://localhost:3000/companies?levelType=d&multi=true&naics=531120&entId=2007907292&DEBUG=true
/ 20220805132302
// http://localhost:3000/companies?levelType=d&multi=true&naics=531120&entId=2007907292&DEBUG=true

{
  "reqParams": "&itemsPerPage=10&name=&filter={}&levelType=d&entId=2007907292",
  "locals": {
    "DEBUG": true,
    "page": 1,
    "itemsPerPage": 10,
    "name": "",
    "levelType": "d",
    "multi": true,
    "entId": "2007907292",
    "filter": "{}",
    "naics": "531120"
  },
  "links": {
    "first": "?page=1&itemsPerPage=10&name=&filter={}&levelType=d&entId=2007907292",
    "last": "?page=1&itemsPerPage=10&name=&filter={}&levelType=d&entId=2007907292",
    "prev": "?page=1&itemsPerPage=10&name=&filter={}&levelType=d&entId=2007907292",
    "next": "?page=1&itemsPerPage=10&name=&filter={}&levelType=d&entId=2007907292"
  },
  "meta": {
    "locals": {
      "DEBUG": true,
      "page": 1,
      "itemsPerPage": 10,
      "name": "",
      "levelType": "d",
      "multi": true,
      "entId": "2007907292",
      "filter": "{}",
      "naics": "531120"
    },
    "debug": true,
    "current_page": 1,
    "from": 10,
    "last_page": 1,
    "link": [
      {
        "first": "?page=1&itemsPerPage=10&name=&filter={}&levelType=d&entId=2007907292",
        "last": "?page=1&itemsPerPage=10&name=&filter={}&levelType=d&entId=2007907292",
        "prev": "?page=1&itemsPerPage=10&name=&filter={}&levelType=d&entId=2007907292",
        "next": "?page=1&itemsPerPage=10&name=&filter={}&levelType=d&entId=2007907292"
      }
    ],
    "path": "?",
    "per_page": 10,
    "to": 1,
    "total": 1
  },
  "sqlArray": [
    {
      "sql_1": " SELECT count(reporting_units.reporting_id) AS count FROM      aies.reporting_units AS reporting_units INNER JOIN aies.reporting_units AS estab ON reporting_units.reporting_id = estab.parent_id AND estab.level_type = 'e' WHERE reporting_units.naics = '531120' AND reporting_units.level_type = 'd' AND reporting_units.ent_id = '2007907292';"
    },
    {
      "sql_2": " SELECT reporting_units.*, estab.id AS estab.id, estab.ent_id AS estab.ent_id, estab.refper AS estab.refper, estab.reporting_id AS estab.reporting_id, estab.alpha AS estab.alpha, estab.sector AS estab.sector, estab.naics AS estab.naics, estab.unit_type AS estab.unit_type, estab.level_type AS estab.level_type, estab.name1 AS estab.name1, estab.name2 AS estab.name2, estab.street AS estab.street, estab.city AS estab.city, estab.state AS estab.state, estab.zip AS estab.zip, estab.created_by AS estab.created_by, estab.created_date AS estab.created_date, estab.last_modified_by AS estab.last_modified_by, estab.last_modified_date AS estab.last_modified_date, estab.category AS estab.category, estab.naics_csv AS estab.naics_csv, estab.parent_id AS estab.parent_id, estab.parent_type AS estab.parent_type, estab.login_id AS estab.login_id FROM      (SELECT reporting_units.id, reporting_units.ent_id, reporting_units.refper, reporting_units.reporting_id, reporting_units.alpha, reporting_units.sector, reporting_units.naics, reporting_units.unit_type, reporting_units.level_type, reporting_units.name1, reporting_units.name2, reporting_units.street, reporting_units.city, reporting_units.state, reporting_units.zip, reporting_units.created_by, reporting_units.created_date, reporting_units.last_modified_by, reporting_units.last_modified_date, reporting_units.category, reporting_units.naics_csv, reporting_units.parent_id, reporting_units.parent_type, reporting_units.login_id FROM      aies.reporting_units AS reporting_units WHERE reporting_units.naics = '531120' AND reporting_units.level_type = 'd' AND reporting_units.ent_id = '2007907292' AND ( SELECT parent_id FROM      aies.reporting_units AS estab WHERE (estab.level_type = 'e' AND estab.parent_id = reporting_units.reporting_id) LIMIT 1 ) IS NOT NULL ORDER BY reporting_units.name1 ASC LIMIT 10 OFFSET 0) AS reporting_units INNER JOIN aies.reporting_units AS estab ON reporting_units.reporting_id = estab.parent_id AND estab.level_type = 'e' ORDER BY reporting_units.name1 ASC;"
    }
  ],
  "data": [
    {
      "navDataLink": {
        "ent_id": "2007907292",
        "naics": "531120",
        "levelType": "d",
        "url": "?name=&multi=true&entId=2007907292&levelType=d&naics=531120"
      },
      "id": "17683",
      "ent_id": "2007907292",
      "refper": "2017A1",
      "reporting_id": "3000111797",
      "alpha": "844868",
      "sector": "53",
      "naics": "531120",
      "unit_type": "MU",
      "level_type": "d",
      "name1": "HALLMARK CARDS INC",
      "name2": "",
      "street": "",
      "city": "",
      "state": "",
      "zip": null,
      "created_by": "DATALOAD",
      "created_date": "2022-08-03T15:24:49.000Z",
      "last_modified_by": "DATAUPDATE",
      "last_modified_date": "2022-08-03T15:29:38.000Z",
      "category": "",
      "naics_csv": "",
      "parent_id": "8001595031",
      "parent_type": "c",
      "login_id": "8001595030",
      "estab": [
        {
          "navDataLink": {
            "ent_id": "2007907292",
            "naics": "531120",
            "levelType": "e",
            "url": "?name=&multi=true&entId=2007907292&levelType=e&naics=531120"
          },
          "id": "82789",
          "ent_id": "2007907292",
          "refper": "2017A1",
          "reporting_id": "2010152047",
          "alpha": "844868",
          "sector": "53",
          "naics": "531120",
          "unit_type": "MU",
          "level_type": "e",



********************************
        August 2, 2022: flagging
********************************
1) Moved requtils instance creation to config.js
2) Updated all the routes to use config.requtils as opposed to requtils
thereby not creating multiple instances
3) Waiting for the rest of the tables to be put in place

********************************
        July 31, 2022: flagging
********************************
There are 19 services in flagging.

The original template for all these services are being developed for data-versions
Folder structure:
/controllers/flagging/data-version << will list all the business models in the index.js file>>
    Need to copy the entire folder for data-flags, service-flags,...

/controllers/* <<additional controllers>>

/ dbmodels << From the db introspection to use them for the controllers>>

/inputParams <<Allowable parameters for different routes>>

/routes has multiple routes to support breaking each entities by subfolder


data-version/{1}

// 20220731222431
// http://localhost:3000/flagging/data-version/1

{
  "data": [
    {
      "version_id": "1",
      "code": "OR",
      "title": "Original Reported",
      "created_by": null,
      "created_date": "2022-07-28T04:00:00.000Z",
      "last_modified_by": null,
      "last_modified_date": "2022-07-29T01:00:34.000Z"
    }
  ]
}



********************************
        July 29, 2022: MOVING TO V2
********************************

Big change coming in.  The code is being refactored into the following folders
1) controllers: It will contain all the controllers or business models that are executed
2) dbModels: These are ORM models built by introspection of the pg db
3) inputParams: A folder of all input params that are acceptable to the controllers
4) routes: The index.js file is now pulling all the .js file in its folders and subfolders

Process chain:
1) Enter the app.js which calls the routes folder to build all the routes.
There are routes for all entities that will be opened up. Currently there is a route for naics
Rest of the routes have to be refactored out of main.js
2) Once routes are loaded the relevant route for example naics will point to the controller by the reqUtils
3) reqUtils checks the input params and passes the following control to reqUtils.handleRequest which takes the following params
3.1) params (stored in the inputParams)
3.2) handler (business or control function in the controller which does the pulling of daTA)
3.3) req
3.4) res
3.5) (err) a function handler for errors in the input params

NAICS IS NOW PAGED AND POPULATED
// 20220730171137
// http://localhost:3000/naics?page=77&debug=false&itemsPerPage=10&naics=0&filter={}

{
  "links": {
    "first": "?page=1&debug=false&itemsPerPage=10&naics=0&filter={}",
    "last": "?page=78&debug=false&itemsPerPage=10&naics=0&filter={}",
    "prev": "?page=76&debug=false&itemsPerPage=10&naics=0&filter={}",
    "next": "?page=78&debug=false&itemsPerPage=10&naics=0&filter={}"
  },
  "meta": {
    "debug": false,
    "current_page": 77,
    "from": 770,
    "last_page": 78,
    "link": [
      {
        "first": "?page=1&debug=false&itemsPerPage=10&naics=0&filter={}",
        "last": "?page=78&debug=false&itemsPerPage=10&naics=0&filter={}",
        "prev": "?page=76&debug=false&itemsPerPage=10&naics=0&filter={}",
        "next": "?page=78&debug=false&itemsPerPage=10&naics=0&filter={}"
      }
    ],
    "path": "?",
    "per_page": 10,
    "to": 78,
    "total": 771
  },
  "data": [
    {
      "naics": 812990,
      "title": "ALL OTHER PERSONAL SERVICES"
    },
    {
      "naics": 813211,




********************************
        July 29, 2022
********************************
1) Added survey_details and collapsed the model.

/ 20220729230553
// http://localhost:3000/survey-details?DEBUG=false

{
  "links": {
    "first": "?page=1&itemsPerPage=10&name=&filter={}&levelType=c",
    "last": "?page=45701&itemsPerPage=10&name=&filter={}&levelType=c",
    "prev": "?page=1&itemsPerPage=10&name=&filter={}&levelType=c",
    "next": "?page=2&itemsPerPage=10&name=&filter={}&levelType=c"
  },
  "meta": {
    "debug": false,
    "current_page": 1,
    "from": 10,
    "last_page": 45701,
    "link": [
      {
        "first": "?page=1&itemsPerPage=10&name=&filter={}&levelType=c",
        "last": "?page=45701&itemsPerPage=10&name=&filter={}&levelType=c",
        "prev": "?page=1&itemsPerPage=10&name=&filter={}&levelType=c",
        "next": "?page=2&itemsPerPage=10&name=&filter={}&levelType=c"
      }
    ],
    "path": "?",
    "per_page": 10,
    "to": 45701,
    "total": 457004
  },
  "data": [
    {
      "id": 6,
      "reporting_id": "2003551363.000000                                           ",
      "rvid": 1,
      "refper": "2017A1",
      "rv_value": "2,009,000",
      "naics": "623311.000",
      "alpha": "572318",
      "type_of_operation": null,
      "unit_type": "MU",
      "level_type": "d",
      "versions": [
        {
          "id": 136066,
          "reporting_id": "2003551363.000000",
          "refper": "2017A1",
          "rvid": 1,
          "type_of_tax": null,
          "data_version_id": "1",
          "data_version_value": "8087000",
          "item_flag_id": null
        }
      ]
    },

********************************
        July 27, 2022
********************************

1) Added an .env file.  Add your file in the main folder as .env and place these lines in it.
PORT=3000
HOST= census-poc-aurora-dev.cluster-ro-cjflqg3bd6i9.us-gov-east-1.rds.amazonaws.com
PASSWORD= ****PUT YOUR PASSWORD HERE****
DBUSER=***PUT YOUR USER NAME***
DBPORT=5432
DATABASE=census_poc
DIALECT=postgres

2) npm install dotenv --save
That will install the dotenv package. The config.js file does not have any creds for the db. All are moved to the .env file.

3) Add the line 
.env
to .gitignore if not already in from the repo.

4) Added naicsByEntId.js to the params folder and added a naics request.  

5) Executing prepared sql statements to increase performance and prevent sql injection 

6) / 20220727140608
// http://localhost:3000/naics/company/9538469521?DEBUG=false

{
  "entId": "9538469521",
  "data": [
    {
      "naics": null
    },
    {
      "naics": "531120.000"
    },
    {
      "naics": "336413.000"
    },
    {
      "naics": "532412.000"
    },


    7) // 20220727161005
// http://localhost:3000/response-variables/company/9538469521?DEBUG=false

{
  "data": [
    {
      "rvid": 1,
      "rvname": "EMP_MAR12_CHIRO",
      "rv_description": "Employment By Occupation, Chiropractic physicians - licensed practitioners having D.C. degree"
    },
    {.....

8) vunitlevelcounts are in place/ 20220727204417
// http://localhost:3000/vunitlevelcounts/9009459626?DEBUG=true

{
  "entId": "9009459626",
  "data": [
    {
      "CNT": "1",
      "LEVEL_TYPE": "c"
    },
    {
      "CNT": "15",
      "LEVEL_TYPE": "d"
    },
    {
      "CNT": "124",
      "LEVEL_TYPE": "e"
    }
  ]
}

9) // 20220727205820
// http://localhost:3000/companies/9009459626?DEBUG=true

{
  "entId": "9009459626",
  "data": [
    {
      "id": 74088,
      "ent_id": "9009459626",
      "refper": "2017A1",
      "reporting_id": "8683463154.000000",
      "survunit_id": null,
      "alpha": "504982",
      "naics": null,
      "type_of_operation": null,
      "unit_type": "MU",
      "level_type": "c",
      "name1": "TX COMPANY 9615 LLC",
      "name2": null,
      "street": "9182 TX ADDRESS 4 ST",
      "city": "THE WOODLANDS",
      "state": "TX",
      "zip": "773800000",
      "levels": "3",
      "pcflg": null,
      "created_by": "Sharanya Marapadi",
      "created_date": "2022-06-13T04:00:00.000Z",
      "last_modified_by": "Sharanya Marapadi",
      "last_modified_date": "2022-06-13T04:00:00.000Z"
    }
  ]
}

********************************
        END OF JULY 27, 2022
********************************



July 26, 2022
Added a npm i require-dir

controller folder has been replaced with inputParams folder with multiple files for listing all the input types possible in the uri

Can get all response variables used by an entity.  Used sql connector config.dbPool as opposed to sequelize for performance reasons

Made edits for handling the UI.

Recommend not using defer promises moving forward. Works without defer in getRVsByEntId.

// 20220726213916
// http://localhost:3000/response-variables/company/9538469521?DEBUG=true

{
  "data": [
    {
      "rvid": 1,
      "rvname": "EMP_MAR12_CHIRO",
      "rv_description": "Employment By Occupation, Chiropractic physicians - licensed practitioners having D.C. degree"
    },
    {
      "rvid": 2,
      "rvname": "EMP_MAR12_DENTIST",
      "rv_description": "Employment By Occupation, Dentists - having D.M.D., D.D.S., or D.D.Sc. degree and other dental practitioners_x000D_\r\n(Include hygienists, assistants, and others performing or assisting with dental procedures.)"
    },
    {
      "rvid": 3,
      "rvname": "EMP_MAR12_DIET",
      "rv_description": "Employment By Occupation, Dieticians"
    }
  ]
}

July 25, 2022
Error Handling with db errors like an incorrect column is specified
in the code for reporting_units, I am forcing an error by sorting on some column that does not exist.  It will respond with

// http://localhost:3000/companies?filter={%22reporting_id%22:%2289%22}&levelType=c&DEBUG=true

{
  "summary": "General Server Error",
  "message": "A fatal error has occurred on the server. Perhaps you meant to reference the column \"reporting_units.name1\".",
  "status": 500,
  "hasError": true,
  "respCode": "500100"
}



MALFORMED JSON string will throw a 500101 error. A business error, starts with a 500 series
// 20220725172344
// http://localhost:3000/companies?filter={%22reporting_id%22=%2289%22}&levelType=c&DEBUG=true

{
  "summary": "General Server Error",
  "message": "Please consult your administrator. Your filter was malformed. Could not parse the filter:{\"reporting_id\"=\"89\"}",
  "status": 500,
  "hasError": true,
  "respCode": "500101"
}

Column name name1 was changed in code to ensure db errors are all having respCode as 500100.  This is a business error which is caused in the specific entity like reportingUnits.js







July 24, 2022
ERROR HANDLING
When running over https and want to ensure it support https look at index.js for companies.  It will check for TLS or HTTPS via the following code:
if(!req.secure) res.send(reqUtilOptions.customResponseMessagesKeys['403001'])
and it will return the following object if http is specified as opposed to HTTPS.

// 20220724032706
// http://localhost:3000/companies/

{
  "summary": "Forbidden",
  "message": "Secure endpoints can only be accessed via HTTPS.",
  "status": 403
}


Incomplete parameters check
Lets say some required parameters are missing like DEBUG or sortBy. That will be specified in the controller file.
 params: {
        DEBUG:    {
            type: 'bool',
            source: ['body', 'headers', 'query'],
            required: true,
            default: (v) => {
                if (typeof v !== 'undefined' && v != '') return JSON.parse(v);
                return false;
            }
        },
The required is true. If the user does not specify the DEBUG param it will give the following error
// 20220724033310
// http://localhost:3000/companies/

{
  "summary": "Missing Parameters",
  "message": "The request is missing required parameters.",
  "status": 400,
  "hasError": true,
  "error": "Required parameters [DEBUG] are missing from this request.",
  "respCode": 400001
}


All error codes have been enabled and processing of all errors will now be in utils.js




July 21, 2022
Have added the debug as part of the rv as a url parameter which is boolean.

YOu can turn the debugger on or off from here





Whats changed July 19 2022
1) Created a controller folder which has all the data types and defaults set for input request
2) Each entity has a controller component. controller.js is the params that are passed to a new component:
npm install @outofsync/request-utils

3) the outofsync will default, and set the correct data types which will be then read in the reportingUnits
4) The index.js has been modified to handle the requestUtils like so:

reqUtils.handleRequest(controllerParams.companies, reportingUnits.getAll, req, res, next).
	 	then(results =>{
	 	console.log(results)
	 }). then(......)

The above parameters are:
controllerParams.companies (defined the controller.js for companies)
reportingUnits.getAll (function to be called when the parameters are loaded as per the controllerParams)
req, res, next (We will be returning via res.send)

5) If the url.req params are not according to the specs in the controllerParams it will return an error
6) The handleRequest method will be further extended to specify the error codes in the swagger



INSTALL PG 6.4.2
npm install -g pg@6.4.2

SEQUELIZE TO GET THE DATA MODEL FROM PG

sequelize-auto -o "./models" -d census_poc -h census-poc-aurora-dev.cluster-ro-cjflqg3bd6i9.us-gov-east-1.rds.amazonaws.com -u knick -p 5432 -x password1 -e postgres -s aies

/**
* Newer DB. Ensure you dont copy the virtual in the reporting_units table or preserve it
*
**/
sequelize-auto -o "./newmodels" -d census_poc -h aies-aurora-pg-dev-instance-1.cjflqg3bd6i9.us-gov-east-1.rds.amazonaws.com -u nick_kapoor -p 5432 -x nick_pass123 -e postgres -s aies




ON MAC INSTALL BREW (BE PATIENT)

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

If you are using NODE ON MAC then make sure you edit the file .h shown below for the package:
@outofsync/request-utils

You will get an error. SO edit this file

vi /Users/revealgc/Library/Caches/node-gyp/16.16.0/include/node/v8-internal.h
Edit line 492 and remove 
 	!std::is_same<Data, std::remove_cv_t<T>>::value>::Perform(data);
 	this with
 	 !std::is_same<Data, std::remove_cv<T>>::value>::Perform(data);

and now install outofsync with
npm install @outofsync/request-utils

// ONLY FOR MAC END





https://dev.to/projectescape/the-comprehensive-sequelize-cheatsheet-3m1m?utm_source=dormosheio&utm_campaign=dormosheio#order


ResponseVariables

http://localhost:3000/rv?limit=50&offset=4&name=AFFIL
http://localhost:3000/rv/138
http://localhost:3000/rv?limit=&offset=&name=
http://localhost:3000/rv?limit=&offset=&name=CONTRACT_NONPRD

RV WITH page and offset
http://localhost:3000/rv?name=AFFIL&page=1&size=10


Companies


** DEPRECATED ***
http://localhost:3000/companies?name=&limit=10&offset=0&levelType=c&filter={"refper":"2017A1"}

// use a different filter
{"refper":"2017A1",%20"city":%20"HELENA"}


WORKING
http://localhost:3000/companies
http://localhost:3000/companies?name=WA
http://localhost:3000/companies?name=&multi=true&entId=9538469521&levelType=d&naics=531120.000
http://localhost:3000/companies?name=&multi=true&entId=9538469521&levelType=e&naics=531120.000





Survey Details
http://localhost:3000/sd?rid=259



http://localhost:3000/companies?name=&page=1&size=10&levelType=d&multi=false&naics=541512.000
http://localhost:3000/companies?name=&page=1&size=10&levelType=d&multi=true&naics=541512.000



WORKING D July 17 2022

http://localhost:3000/companies?name=&page=1&size=10&levelType=d&multi=true&naics=531&name1=WA


WORKING JULY 22, 2022
http://localhost:3000/companies?name=W&page=1&size=1&levelType=c&multi=fals&
