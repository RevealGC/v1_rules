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
        id:{
            type: 'int',
            source:['body', 'params', 'query'],
            required: false
        },
        reporting_id: {
            type: 'int',
            source: ['body', 'headers', 'query'],
            required: false
        },
        parent_id:{ // if spad_parent_id is specified then create children with spad_parent_id
            type: 'int',
            source: ['params', 'query', 'body', 'headers'],
            required: false,
            default: 0
        },
        conditionstring:{
            type:'string',
            source: ['params', 'query', 'body', 'headers'],
            required: false,
        },
        action:{
            type:'string',
            source: ['body', 'params', 'query'],
        },
        facts:{
            type:'string',
            source: ['body', 'params', 'query'],
        },
        rules: {
            type:'string',
            source: ['body', 'params', 'query'],
        },
        page: {
            type: 'int',
            source: ['body', 'headers', 'query'],
            required: false,
            default: (v) => {
                if (!v) {
                    return 1;
                } else {
                    return v;
                }
            }
        },
        itemsPerPage: {
            type: 'int',
            source: ['body', 'headers', 'query'],
            required: false,
            default:  (v) =>{if (!v) { return 100;} else {  return v; }}
        },
        sortBy: {
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false
        },
        sortDesc: {
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false
        },
        filters: {
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false,
            default: '{}'
        }

    },
    authContext: {
        super: false,
        server: false
    }
}