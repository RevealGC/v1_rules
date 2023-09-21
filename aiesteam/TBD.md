http://localhost:3000/survey-details?DEBUG=true&page=1&itemsPerPage=25&sortBy[]=reporting_id&sortDesc[]=true&groupBy[]=reporting_id&groupDesc[]=false&mustSort=false&multiSort=false&filters={"reporting_id":"8001657750"}


http://localhost:3000/survey-details?page=1&itemsPerPage=25&sortBy[]=reporting_id&sortDesc[]=true&groupBy[]=reporting_id&groupDesc[]=false&mustSort=false&multiSort=false&filters={"parent_id":"3000111284"}

SELECT "survey_details".*, "versions"."id" AS "versions.id", "versions"."reporting_id" AS "versions.reporting_id", "versions"."refper" AS "versions.refper",
 "versions"."rvid" AS "versions.rvid", "versions"."data_version" AS "versions.data_version", "versions"."data_version_value" AS "versions.rv_value", "versions->sdfDV.code" AS "versions.code", "versions->sdfDV"."code" AS "versions.sdfDV.code", "versions->sdfDV"."description" AS "versions.sdfDV.description" FROM (SELECT "survey_details"."id", "survey_details"."reporting_id", "survey_details"."rvid", "survey_details"."refper", "survey_details"."rv_value", "reporting_unit"."ent_id" AS "reporting_unit.ent_id", "reporting_unit"."reporting_id" AS "reporting_unit.reporting_id", "reporting_unit"."naics" AS "reporting_unit.naics", "reporting_unit"."alpha" AS "reporting_unit.alpha", 
 "reporting_unit"."unit_type" AS "reporting_unit.unit_type", "reporting_unit"."level_type" AS "reporting_unit.level_type", "reporting_unit"."sector" AS "reporting_unit.sector", 
 "reporting_unit"."category" AS "reporting_unit.category", "reporting_unit"."login_id" AS "reporting_unit.login_id", "reporting_unit"."parent_id" AS "reporting_unit.parent_id", 
 "reporting_unit"."parent_type" AS "reporting_unit.parent_type", "rv"."rvid" AS "rv.rvid", "rv"."rvname" AS "rv.rvname", "rv"."rv_description" AS "rv.rv_description", "rv".
 "qdm_flag" AS "rv.qdm_flag" FROM "aies"."survey_details" AS "survey_details" INNER JOIN "aies"."reporting_units" AS "reporting_unit" ON "survey_details"."reporting_id" = 
 "reporting_unit"."reporting_id" AND "reporting_unit"."reporting_id" = 2800888303 INNER JOIN "aies"."response_variables" AS "rv" ON "survey_details"."rvid" = "rv"."rvid" WHERE 
 "survey_details"."reporting_id" = 2800888303 ORDER BY "reporting_id" ASC LIMIT \'15\' OFFSET 0) AS "survey_details" LEFT OUTER JOIN "aies"."survey_details_flags" AS "versions" ON 
 "survey_details"."reporting_id" = "versions"."reporting_id" AND ("versions"."reporting_id" = 2800888303 AND ("survey_details"."rvid" = "versions"."rvid" AND "survey_details".
 "refper" = "versions"."refper")) LEFT OUTER JOIN "aies"."flagging_data_versions" AS "versions->sdfDV" ON "versions"."data_version" = "versions->sdfDV"."code" AND 
 ("versions->sdfDV"."deleted_at" IS NULL) ORDER BY "reporting_id" ASC;





WORKING
http://localhost:3000/survey-details?page=1&itemsPerPage=25&sortBy[]=parent_id&sortDesc[]=false&groupBy[]=reporting_id&groupDesc[]=false&mustSort=false&multiSort=false&entId=2007694988&filters=%7B%7D&DEBUG=true



http://ec2-18-254-37-140.us-gov-east-1.compute.amazonaws.com:3000/survey-details?page=1&itemsPerPage=25&sortBy[]=login_id&sortDesc[]=true&groupBy[]=reporting_id&groupDesc[]=false&mustSort=false&multiSort=false&entId=2007694988&filters=%7B%7D




http://localhost::3000/survey-details?page=1&itemsPerPage=25&sortBy[]=login_id&sortDesc[]=false&groupBy[]=reporting_id&groupDesc[]=false&mustSort=false&multiSort=false&entId=2007694988&filters=%7B%7D



http://ec2-18-254-37-140.us-gov-east-1.compute.amazonaws.com:3000/survey-details-archive/reportingId/2000148000?rvId=845

http://localhost:3000/survey-details-archive/reportingId/2000148000?rvId=845







SELECT count(reporting_units.reporting_id) AS count FROM aies.reporting_units AS reporting_units WHERE reporting_units.login_id LIKE '%8001579502%' AND reporting_units.state LIKE '%CA%';


SURVEY DETAILS ARCHIVE

http://localhost:3000/survey-details-archive/reportingId/3000112037?rvId=347

Survey details
SELECT \"survey_details\".*, \"versions\".\"id\" AS \"versions.id\", \"versions\".\"reporting_id\" AS \"versions.reporting_id\", \"versions\".\"refper\" AS \"versions.refper\", \"versions\".\"rvid\" AS \"versions.rvid\", \"versions\".\"data_version\" AS \"versions.data_version\", \"versions\".\"data_version_value\" AS \"versions.rv_value\", \"versions->sdfDV\".\"code\" AS \"versions.sdfDV.code\", \"versions->sdfDV\".\"description\" AS \"versions.sdfDV.description\" FROM (SELECT \"survey_details\".\"id\", \"survey_details\".\"reporting_id\", \"survey_details\".\"rvid\", \"survey_details\".\"refper\", \"survey_details\".\"rv_value\", \"reporting_unit\".\"ent_id\" AS \"reporting_unit.ent_id\", \"reporting_unit\".\"reporting_id\" AS \"reporting_unit.reporting_id\", \"reporting_unit\".\"naics\" AS \"reporting_unit.naics\", \"reporting_unit\".\"alpha\" AS \"reporting_unit.alpha\", \"reporting_unit\".\"unit_type\" AS \"reporting_unit.unit_type\", \"reporting_unit\".\"level_type\" AS \"reporting_unit.level_type\", \"reporting_unit\".\"sector\" AS \"reporting_unit.sector\", \"reporting_unit\".\"category\" AS \"reporting_unit.category\", \"rv\".\"rvid\" AS \"rv.rvid\", \"rv\".\"rvname\" AS \"rv.rvname\", \"rv\".\"rv_description\" AS \"rv.rv_description\", \"rv\".\"qdm_flag\" AS \"rv.qdm_flag\" FROM \"aies\".\"survey_details\" AS \"survey_details\" INNER JOIN \"aies\".\"reporting_units\" AS \"reporting_unit\" ON \"survey_details\".\"reporting_id\" = \"reporting_unit\".\"reporting_id\" INNER JOIN \"aies\".\"response_variables\" AS \"rv\" ON \"survey_details\".\"rvid\" = \"rv\".\"rvid\" LIMIT '25' OFFSET 0) AS \"survey_details\" LEFT OUTER JOIN \"aies\".\"survey_details_flags\" AS \"versions\" ON \"survey_details\".\"reporting_id\" = \"versions\".\"reporting_id\" AND ((\"survey_details\".\"rvid\" = \"versions\".\"rvid\" AND \"survey_details\".\"refper\" = \"versions\".\"refper\")) LEFT OUTER JOIN \"aies\".\"flagging_data_versions\" AS \"versions->sdfDV\" ON \"versions\".\"data_version\" = \"versions->sdfDV\".\"code\" AND (\"versions->sdfDV\".\"deleted_at\" IS NULL);"