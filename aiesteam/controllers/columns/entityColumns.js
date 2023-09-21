
    let spadLibBase = {
        spad:{
            name: 'spad', 
            attributes:['id', 'parent_id', 'reporting_id','status','merge_status','merge_data',
             'elapsed_time', 'error_message','request', 'created_by', 'created_date', 'last_modified_by', 'last_modified_date' , 'result','aggregate' , 'facts'],
            dataType: ['int', 'str','str','str',
             'int', 'str', 'str', 'str', 'str', 'str', 'str',  'int', 'int', 'str', 'str'],
            where: {}, 
            order: [[]]
        },
        spad_jobs:{
            name: 'spad_jobs',
            attributes: [ 'spad_id', 'result', 'valid', 'invalid', 'facts', 'debug', 'created_by', 'created_date', 'last_modified_by', 'last_modified_date'],
            dataType: ['int', 'str', 'str', 'str', 'str', 'str','str', 'str', 'str', 'str'],
            where: {},
            order: [[]]
        }
    }

    let ruLibBase= 
     {
        reporting_units: {
            name: 'reporting_units', attributes:
                ['id', 'ru_metadata_id', 'refper', 'ent_id', 'login_id', 'reporting_id', 'kau_id', 'alpha',
                    'sector', 'naics', 'unit_type', 'level_type', 'estab_type', 'item_level', 'name1', 'name2',
                    'street', 'city', 'state', 'zip', 'category', 'naics_csv', 'parent_id', 'parent_type',
                    'parent_name1', 'created_by', 'created_date', 'last_modified_by', 'last_modified_date',
                ],
            dataType: ['int', 'int', 'str', 'int', 'int', 'int', 'int', 'str',
                'int', 'int', 'str', 'str', 'str', 'str', 'str', 'str',
                'str', 'str', 'str', 'int', 'str', 'str', 'int', 'str',
                'str', 'str', 'str', 'str', 'str'], where: {}, order: [[]]
        },
        ru_metadata: {
            name: 'ru_metadata',
            attributes: ["id", "ent_id", "login_id", "company_id", "name1", "name2", "mail_street", "mail_city",
                "mail_state", "mail_zip",
                "created_by", "created_date", "last_modified_by", "last_modified_date"
            ],
            dataType: ['int', 'int', 'int', 'int', 'str', 'str', 'str', 'str',
                'str', 'str',
                'str', 'str', 'str', 'str'], where: {}, order: [[]]
        }
    };


    let survey_details_flags =   {
        name: 'survey_details_flags', where: {}, order: [[]], 
        attributes: ['id', 'refper', 'survey_details_id', 'data_version', 'data_version_value',
        'data_flag', 'source_flag', 'note', 
        "created_by", "created_date", "last_modified_by", "last_modified_date"],
        dataType: ['int',  'str', 'int', 'str', 'str', 'str', 'str', 'str', 'str', 'str', 'str', 'str'] 
    }


    let rv = {
        name: 'rv', where: {}, order: [[]], attributes: ['rvid', 'rvname', 'rv_description', 'qdm_flag'],
        dataType: ['int', 'str', 'str', 'str']
    }

    let sdLibBase=  {
        survey_details: {
            name: 'survey_details', attributes: ['id', 'reporting_id', 'rvid', 'refper'],
            dataType: ['int', 'int', 'int', 'str'], where: {}, order: [[]]
        },
        ...{reporting_units:ruLibBase.reporting_units, ru_metadata: ruLibBase.ru_metadata},
        rv,
        survey_details_flags,
        // versions: {
        //     name: 'versions', where: {}, order: [[]], attributes: ['id', 'reporting_id', 'refper', 'rvid', 'data_version', 'rv_value',
        //         'code', 'title', 'data_flag', 'data_flag_id'],
        //     // the code and title are virtual fields created in survey_details_flags.js(dbModel).
        //     dataType: ['int', 'int', 'str', 'int', 'str', 'str', 'str', 'str', 'str', 'int']
        // }
    }

  
module.exports = { ruLibBase, sdLibBase, spadLibBase }
    
    





