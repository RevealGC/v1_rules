'use strict'

const Sequelize = require('sequelize');
const config = require('../config');
const env = config.credentials
const Op = Sequelize.Op;
let sqlGeneratedString = '';




const sequelize = new Sequelize(env.database, env.user, env.password, {
    host: env.host,
    port: env.port,
    "logging": false, // if true will dump to the console.
    dialect: 'postgres',
    // logging: true,
    logging: function (str) {

        if (!config.DEBUG) return;

        let sqlArray = [{
            
            ["sql_" + dbSeq.sqlCount]:str.replace('Executing (default):', '')//.replace('"', '').replaceAll("FROM", 'FROM     ')
        }];
        // console.log("🚀 ~ file: relationships.js ~ line 26 ~ sqlArray", sqlArray)
        
        dbSeq.sqlCount++;


        dbSeq.sqlGeneratedString = [...dbSeq.sqlGeneratedString, ...sqlArray]
        // dbSeq.sqlGeneratedString = []str.replaceAll('"', '');

    },
    dialectOptions: {
        charset: 'utf8mb4'
    },
    define: {
        underscored: true,
        timestamps: false,
        freezeTableName: true,
    }
});


// Connect all the models/tables in the database to a db object,
//so everything is accessible via one object

const initModels = require('./init-models').initModels(sequelize)


var dbSeq = {
    sqlGeneratedString: [],
    sqlCount: 1,
    init: () => {
        dbSeq.sqlGeneratedString = [];
        dbSeq.sqlCount = 1;
        dbSeq.reqParams = {}

    },
    Sequelize: Sequelize,
    sequelize: sequelize,
    ...initModels
};

/**
 * Companies
*/
dbSeq.reporting_units.hasMany(dbSeq.reporting_units, {
    as: 'ku',
    foreignKey: 'parent_id',
    sourceKey: 'reporting_id',
    useJunctionTable: false
})
dbSeq.reporting_units.hasMany(dbSeq.reporting_units, {
    as: 'estab',
    foreignKey: 'parent_id',
    sourceKey: 'reporting_id',
    useJunctionTable: false
})

// Scratch Pad
dbSeq.spad.hasMany(dbSeq.spad,{
    as: 'spadself',
    foreignKey: 'parent_id',
    sourceKey: 'id',
    useJunctionTable: false
})
dbSeq.spad.hasMany(dbSeq.spad,{
    as: 'spadLevel2',
    foreignKey: 'parent_id',
    sourceKey: 'id',
    useJunctionTable: false
})

dbSeq.spad.hasMany(dbSeq.spad_jobs,{
    foreignKey: 'spad_id',
    sourceKey: 'id',
    as: "spadJobsHasMany",
    constraints: false,
})

dbSeq.spad_jobs.belongsTo(dbSeq.spad,{
    foreignKey: 'spad_id',
    sourceKey: 'id',
    as: "spadJobsBelongsTo",
    constraints: false,
})


// End scratch pad

/**
 * Tie reporting units to mu_reporting_units
 */

// dbSeq.ru_metadata.hasMany(dbSeq.reporting_units,{
//     as: 'reporting_units',
//     foreignKey: 'ru_metadata_id',
//     sourceKey: 'id',
//     constraints: false,
//     useJunctionTable: false,
// })

dbSeq.reporting_units.belongsTo(dbSeq.ru_metadata,{
    as: 'ru_metadata',
    foreignKey: 'ru_metadata_id',
    sourceKey: 'id',
    constraints: false,     
    useJunctionTable: false,
    scope: {
        [Op.and]: sequelize.where(sequelize.col("reporting_units.ru_metadata_id"), Op.eq, sequelize.col('ru_metadata.id'))
    },
})

/**
 * SURVEY DETAILS FLAGS are associated with response_variables
*/
dbSeq.survey_details_flags.belongsTo(dbSeq.survey_details, {
    foreignKey: 'survey_details_id',
    sourceKey: 'id',
    as: "sdFlags",
    // scope: {
    //     [Op.and]: sequelize.where(sequelize.col("survey_details_flags.rvid"), Op.eq, sequelize.col('sdFlags.rvid'))
    // },
    constraints: false,
    // useJunctionTable: false
});


/**
 * COMPOSITE FOREIGN KEYS
 */
dbSeq.survey_details.hasMany(dbSeq.survey_details_flags, {
    foreignKey: 'survey_details_id',
    sourceKey: 'id',
    as: "survey_details_flags",
    // scope: {
    //     [Op.and]: [sequelize.where(sequelize.col("survey_details.rvid"), Op.eq, sequelize.col('versions.rvid')),
    //     sequelize.where(sequelize.col("survey_details.refper"), Op.eq, sequelize.col('versions.refper'))]
    // },
    constraints: false,
    // useJunctionTable: false

});


// Add RV name is pulled out from here
dbSeq.survey_details.belongsTo(dbSeq.response_variables, {
    foreignKey: 'rvid',
    sourceKey: 'rvid',
    as: "rv",
    useJunctionTable: false
});
dbSeq.response_variables.hasMany(dbSeq.survey_details, {
    foreignKey: 'rvid',
    sourceKey: 'rvid',
    as: "sd",
    useJunctionTable: false
});

// Relationship between reportingUnits and sd
dbSeq.survey_details.belongsTo(dbSeq.reporting_units, {
    as: 'rus',
    foreignKey: 'reporting_id',
    targetKey: 'reporting_id',
    useJunctionTable: false,
    // as: 'ru'
});
// dbSeq.reporting_units.hasMany(dbSeq.survey_details, {
//     foreignKey: 'reporting_id',
//     sourceKey: 'reporting_id',
//     as: 'sd',
//     useJunctionTable: false,
// });


dbSeq.flagging_data_versions.hasMany(dbSeq.survey_details_flags, {
    foreignKey: 'data_version',
    sourceKey: 'code',
    as: 'dvSDF',
    constraints: false,
    // scope: {
    //     [Op.and]: [sequelize.where(sequelize.col("survey_details_flags.data_version"), Op.eq, sequelize.col('dvSDF.code')),
    //     sequelize.where(sequelize.col("survey_details.refper"), Op.eq, sequelize.col('versions.refper'))
    // ]
    // },
    useJunctionTable: false,
});

// Relationship between survey_details_flags and flagging_data_versions
dbSeq.survey_details_flags.belongsTo(dbSeq.flagging_data_versions, {
    as: 'sdfDV',
    foreignKey: 'data_version',
    sourceKey: 'code',
    constraints: false,
    useJunctionTable: false,
    // scope: {
    //     [Op.and]: [sequelize.where(sequelize.col("survey_details_flags.data_version"), Op.eq, sequelize.col('sdfDV.code')),
    //     // sequelize.where(sequelize.col("survey_details.refper"), Op.eq, sequelize.col('versions.refper'))
    // ]
    // },
    // as: 'ru'
});





/**
 * sdf and fdf 
 * 
 */
 dbSeq.flagging_data_flags.hasMany(dbSeq.survey_details_flags, {
    foreignKey: 'data_flag',
    sourceKey: 'code',
    as: 'dfSDF',
    constraints: false,
    useJunctionTable: false,
});

// Relationship between survey_details_flags and flagging_data_flags
dbSeq.survey_details_flags.belongsTo(dbSeq.flagging_data_flags, {
    as: 'sdfDF',
    foreignKey: 'data_flag',
    sourceKey: 'code',
    constraints: false,
    useJunctionTable: false,
});


//Relationships between ayx_jobs and ayx_scratch_pad

dbSeq.ayx_jobs.hasMany(dbSeq.ayx_scratch_pad, {
    foreignKey: 'ayx_jobs_id',
    sourceKey: 'id',
    as: 'ayxJobsScratchPad',
    constraints: false,
    useJunctionTable: false,
});
dbSeq.ayx_scratch_pad.belongsTo(dbSeq.ayx_jobs, {
    as: 'ayxScratchPadJobs',
    foreignKey: 'ayx_jobs_id',
    sourceKey: 'id',
    constraints: false,
    useJunctionTable: false,
});
/**
 * 
 */
module.exports = dbSeq;