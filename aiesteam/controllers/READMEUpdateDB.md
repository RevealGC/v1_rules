Expiations: 

Operations needs to be performed: 

Validate the input data 

If data passes the Validation, 

Make a copy of SURVEY_DETAILS_FLAGS data and the insert data into SURVEY_DETAILS_ARCHIVE table (Duplicate respective record from SURVEY_DETAILS_FLAGS to SURVEY_DETAILS_ARCHIVE) 

Update the data in SURVEY_DETAILS_FLAGS table  

If data failed to pass Validation rules,  

Return with the appropriate error message. 

Parameter’s mapping:  

versionId 	 à survey_details_flags.id 

value		 à survey_details_flags.data_version_value 

dataFlag 	à survey_details_flags.data_flag 

sourceFlag 	à survey_details_flags.source_flag 

user 		à survey_details_flags.last_modified_by 

note 		à survey_details_flags.note 

refper 		à survey_details_flags.refper 

rvid 		à survey_details.rvid 

Sample existing PHP Code: 

Copying SURVEY_DETAILS_FLAGS data and the insert data into SURVEY_DETAILS_ARCHIVE table 

$itemDataOrg = new SurveyDetailArchive(); 

$itemDataOrg->data_version = $itemData->data_version; 

$itemDataOrg->data_version_value = $itemData->data_version_value; 

$itemDataOrg->data_flag = $itemData->data_flag; 

$itemDataOrg->source_flag = $itemData->source_flag; 

$itemDataOrg->note = $itemData->note; 

$itemDataOrg->created_by = $itemData->created_by; 

$itemDataOrg->last_modified_by = $itemData->last_modified_by; 

$itemDataOrg->created_date = $itemData->created_date; 

$itemDataOrg->last_modified_date = $itemData->last_modified_date; 

$itemDataOrg->refper = $itemData->refper; 

$itemDataOrg->survey_details_id = $itemData->survey_details_id; 

$itemDataOrg->save(); 

 

Updating SURVEY_DETAILS_FLAGS data: 

$itemData->data_version_value = $v['value']; 

$itemData->data_flag = $v['dataFlag']; 

$itemData->source_flag = $v['sourceFlag']; 

$itemData->last_modified_by = $v['user']; 

$itemData->note = empty($v['note']) ? null : $v['note']; 

 

Scenario 2: Insert data into SURVEY_DETAILS and SURVEY_DETAILS_FLAGS Data 

API Input payload: 

{ 

"rvs":  

[ 

{ 

“sqlType”: “insert”, 

"rvname": "RCPT_TOT", 

"versionId":””, 

"value": 2435, 

"dataFlag": "R", 

"sourceFlag": "B", 

"note": "test", 

"user": "li000340", 

“reporting_id”:”2233445566”, 

“refper”:”2017AI”, 

“rvid”:”347”, 

} 

] 

} 

Parameter’s mapping:  

reporting_id	à survey_details.reporting_id 

refper 		à survey_details.refper 

rvid 		à survey_details.rvid 

 

versionId 	 à survey_details_flags.id 

value		 à survey_details_flags.data_version_value 

dataFlag 	à survey_details_flags.data_flag 

sourceFlag 	à survey_details_flags.source_flag 

user 		à survey_details_flags.last_modified_by 

note 		à survey_details_flags.note 

refper 		à survey_details_flags.refper 

rvid 		à survey_details.rvid 

 

Expiations: 

Operations needs to be performed: 

Validate the input data 

If data passes the Validation, 

Create a record into SURVEY_DETAILS table  

Create record into SURVEY_DETAILS_FLAGS Data (Utilize SURVEY_DETAILS.id as SURVEY_DETAILS_FLAGS.survey_details_id) 

If data failed to pass Validation rules, 

Return with the appropriate error message. 