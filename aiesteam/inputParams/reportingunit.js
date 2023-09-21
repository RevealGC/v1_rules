exports.params = {
    forceTls: false,
    params: {
        DEBUG:    {
            type: 'bool',
            source: ['body', 'headers', 'query'],
            required: false,
            default: (v) => {
                if (typeof v !== 'undefined' && v != '') return JSON.parse(v);
                return false;
            }
        },
        api_token: {
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false
        },
        reporting_id: {
            type: 'int',
            source: ['params'],
            required: true
        },
        data: {
            type: 'string',
            source: ['body'],
            required: false
        },
        rules: {
            type:'string',
            source: ['body', 'params', 'query'],
        },
        ruleType: {
            type:'string',
            source: ['body', 'params', 'query'],
            required: false,
            default: 'validation'
        },
        showNetwork:{
            type: 'bool',
            source: ['body', 'headers', 'query'],
            required: false,
            default: true
        },
        attended: {
            type:'bool',
            source: ['body', 'headers', 'query','params'],
            required: false,
            default: true
        },
        parent_id:{ // if spad_parent_id is specified then create children with spad_parent_id
            type: 'int',
            source: ['params', 'query', 'body', 'headers'],
            required: false,
            default: 0
        }

    },
    authContext: {
        super: false,
        server: false
    }
}