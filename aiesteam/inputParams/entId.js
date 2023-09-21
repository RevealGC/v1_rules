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
        entId: {
            type: 'int',
            source: ['params'],
            required: true
        }, filters: {
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false,
            default: "{}"
        }
    },
    authContext: {
        super: false,
        server: false
    }
}