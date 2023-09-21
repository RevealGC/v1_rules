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
        id: {
            type: 'string',
            source: ['params'],
            required: true
        },
        code: {
            type: 'string',
            source: ['body'],
            required: false
        },
        description: {
            type: 'string',
            source: ['body'],
            required: false
        },
        updated_by: {
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false
        },
        created_by: {
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false
        },
    },
    authContext: {
        super: false,
        server: false
    }
}