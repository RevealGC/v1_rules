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
        format: {
            type: 'string',
            source: ['query'],
            required: false,
            default: 'json'
        }
    },
    authContext: {
        super: false,
        server: false
    }
}