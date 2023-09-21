var DataTypes = require("sequelize").DataTypes;

var _workflow = require('./workflow')



var _spad = require('./spad')
var _spad_jobs = require('./spad_jobs')

var _X_data_flags = require("./X_data_flags");
var _X_data_versions = require("./X_data_versions");
var _aies_csv_masked = require("./aies_csv_masked");
var _analytics = require("./analytics");

var _ayx_jobs = require("./ayx_jobs");
var _ayx_job_mapper = require("./ayx_job_mapper");
var _ayx_scratch_pad = require("./ayx_scratch_pad");


var _rules_repository = require("./rules_repository")
var _examples = require("./examples");
var _failed_jobs = require("./failed_jobs");
var _flagging_data_flags = require("./flagging_data_flags");
var _flagging_data_versions = require("./flagging_data_versions");
var _flagging_mappings = require("./flagging_mappings");
var _flagging_source_flags = require("./flagging_source_flags");
var _item_flags = require("./item_flags");
var _jobs = require("./jobs");
var _migrations = require("./migrations");
var _naics_codes = require("./naics_codes");
var _notes = require("./notes");
var _personal_access_tokens = require("./personal_access_tokens");
var _reporting_units = require("./reporting_units");

var _ru_metadata = require("./ru_metadata");

var _response_variables = require("./response_variables");
var _survey_details = require("./survey_details");
var _survey_details_archive = require("./survey_details_archive");
var _survey_details_flags = require("./survey_details_flags");
var _survey_details_flags_archive = require("./survey_details_flags_archive");
var _telescope_entries = require("./telescope_entries");
var _telescope_entries_tags = require("./telescope_entries_tags");
var _telescope_monitoring = require("./telescope_monitoring");
var _users = require("./users");

function initModels(sequelize) {


var workflow = _workflow(sequelize, DataTypes)

var spad = _spad(sequelize, DataTypes)
var spad_jobs = _spad_jobs(sequelize, DataTypes)

  var rules_repository = _rules_repository(sequelize, DataTypes)

  var X_data_flags = _X_data_flags(sequelize, DataTypes);
  var X_data_versions = _X_data_versions(sequelize, DataTypes);
  var aies_csv_masked = _aies_csv_masked(sequelize, DataTypes);
  var analytics = _analytics(sequelize, DataTypes);

  var ayx_jobs = _ayx_jobs(sequelize, DataTypes);
  var ayx_job_mapper = _ayx_job_mapper(sequelize, DataTypes);
  var ayx_scratch_pad = _ayx_scratch_pad(sequelize, DataTypes);


  var examples = _examples(sequelize, DataTypes);
  var failed_jobs = _failed_jobs(sequelize, DataTypes);
  var flagging_data_flags = _flagging_data_flags(sequelize, DataTypes);
  var flagging_data_versions = _flagging_data_versions(sequelize, DataTypes);
  var flagging_mappings = _flagging_mappings(sequelize, DataTypes);
  var flagging_source_flags = _flagging_source_flags(sequelize, DataTypes);
  var item_flags = _item_flags(sequelize, DataTypes);
  var jobs = _jobs(sequelize, DataTypes);
  var migrations = _migrations(sequelize, DataTypes);
  var naics_codes = _naics_codes(sequelize, DataTypes);
  var notes = _notes(sequelize, DataTypes);
  var personal_access_tokens = _personal_access_tokens(sequelize, DataTypes);
  var reporting_units = _reporting_units(sequelize, DataTypes);

  var ru_metadata = _ru_metadata(sequelize, DataTypes);

  var response_variables = _response_variables(sequelize, DataTypes);
  var survey_details = _survey_details(sequelize, DataTypes);
  var survey_details_archive = _survey_details_archive(sequelize, DataTypes);
  var survey_details_flags = _survey_details_flags(sequelize, DataTypes);
  var survey_details_flags_archive = _survey_details_flags_archive(sequelize, DataTypes);
  var telescope_entries = _telescope_entries(sequelize, DataTypes);
  var telescope_entries_tags = _telescope_entries_tags(sequelize, DataTypes);
  var telescope_monitoring = _telescope_monitoring(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);


  return {
    workflow,
    spad,
    spad_jobs,
    rules_repository,
    X_data_flags,
    X_data_versions,
    aies_csv_masked,
    analytics,
    ayx_jobs,
    ayx_job_mapper,
    ayx_scratch_pad,
    examples,
    failed_jobs,
    flagging_data_flags,
    flagging_data_versions,
    flagging_mappings,
    flagging_source_flags,
    item_flags,
    jobs,
    migrations,
    naics_codes,
    notes,
    personal_access_tokens,
    reporting_units,
    
    ru_metadata,

    response_variables,
    survey_details,
    survey_details_archive,
    survey_details_flags,
    survey_details_flags_archive,
    telescope_entries,
    telescope_entries_tags,
    telescope_monitoring,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
