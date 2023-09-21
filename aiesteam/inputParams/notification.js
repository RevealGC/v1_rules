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
            required: false,
            source: ['body', 'headers', 'query'],
        },
        data: {
            type: 'json',
            source: ['body'],
            required: true,
            default: []
        },
        message: {
            type:'string',
            source: ['body'],
            required: true,
            default: ''
        },
        sentFrom: {
            type:'string',
            source: ['body', 'params', 'query'],
            required: true,
            default: 'Qbes'
        },

        sentTo: {
            type:'string',
            source: ['body', 'params', 'query'],
            required: true,
            default: 'QFlow'
        },
        parent_id:{ 
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