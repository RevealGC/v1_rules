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
        'X-API-KEY': {
            type: 'string',
            source: [ 'headers', 'query'],
            required: true
        },
        'X-JBID' : {
            type: 'string',
            source: ['headers', 'query'],
            required: true
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
            default:  (v) =>{if (!v) { return 1000000;} else {  return v; }}
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
            default: "{}"
        },
        type:{
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: true,
            default: "validation as default"   // can be attended, unattended, download or validate
        },
        data:{
            type: 'string',
            source: ['body'],
            required: true,
               // can be attended, unattended, download or validate
        },
        name:{
            type: 'string',
            source: ['body'],
            required: true
               // can be attended, unattended, download or validate
        },
        active:{
            type: 'bool',
            source: ['body'],
            required: false,
            default: (v) => {
                if (typeof v !== 'undefined' && v != '') return v;
                return true;
            }
        },



        share_flag:{
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false,
            // can be attended, unattended, download or validate
        },

        description:{
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false,
            default: 'Rule'           
        },
        rvs:{
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: true,
            
        }
    },
    authContext: {
        super: false,
        server: false
    }
}