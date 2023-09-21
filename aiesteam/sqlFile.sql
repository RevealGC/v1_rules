SELECT "survey_details".*, "versions"."id" AS "versions.id",
 "versions"."reporting_id" AS "versions.reporting_id", 
 "versions"."refper" AS "versions.refper", "versions"."rvid" AS "versions.rvid", 
 "versions"."data_version" AS "versions.data_version", "versions"."data_version_value" AS 
 "versions.rv_value", "versions"."sdfDV" AS "versions.sdfDV", "versions->sdfDV"."code" AS
  "versions.sdfDV.code", "versions->sdfDV"."description" AS "versions.sdfDV.description" 
  FROM (SELECT "survey_details"."id", "survey_details"."reporting_id", "survey_details"."rvid",
   "survey_details"."refper", "survey_details"."rv_value", "reporting_unit"."ent_id" AS "reporting_unit.ent_id",
    "reporting_unit"."reporting_id" AS "reporting_unit.reporting_id", "reporting_unit"."naics" AS "reporting_unit.naics",
     "reporting_unit"."alpha" AS "reporting_unit.alpha", "reporting_unit"."unit_type" AS "reporting_unit.unit_type", 
     "reporting_unit"."level_type" AS "reporting_unit.level_type", "reporting_unit"."sector" AS "reporting_unit.sector", 
     "reporting_unit"."category" AS "reporting_unit.category", "rv"."rvid" AS "rv.rvid", "rv"."rvname" AS "rv.rvname", 
     "rv"."rv_description" AS "rv.rv_description", "rv"."qdm_flag" AS "rv.qdm_flag" FROM "product_aies"."survey_details" 
     AS "survey_details" INNER JOIN "product_aies"."reporting_units" AS "reporting_unit" ON 
     "survey_details"."reporting_id" = "reporting_unit"."reporting_id" AND
      "reporting_unit"."reporting_id" = '2800888303' AND "reporting_unit"."naics" = '541214' 
      INNER JOIN "product_aies"."response_variables" AS "rv" ON "survey_details"."rvid" = "rv"."rvid" AND "rv"."rvname" 
      LIKE '%PAY_ANN%' WHERE "survey_details"."reporting_id" = '2800888303' ORDER BY "survey_details"."reporting_id" 
      ASC LIMIT '15' OFFSET 0) AS "survey_details" LEFT OUTER JOIN "product_aies"."survey_details_flags" AS "versions" 
      ON "survey_details"."reporting_id" = "versions"."reporting_id" AND ("versions"."reporting_id" = '2800888303' 
      AND ("survey_details"."rvid" = "versions"."rvid" AND "survey_details"."refper" = "versions"."refper")) 
      LEFT OUTER JOIN "product_aies"."flagging_data_versions" AS "versions->sdfDV"
       ON "versions"."data_version" = "versions->sdfDV"."code" AND 
       ("versions->sdfDV"."deleted_at" IS NULL) ORDER BY "survey_details"."reporting_id" ASC;