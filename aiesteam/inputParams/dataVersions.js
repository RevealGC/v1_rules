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
        version_id: {
            type: 'int',
            source: ['body', 'headers', 'query'],
            required: false,
            primaryKey: true,
        },
        code: {
            type: 'string',
            source: ['body'],
            required: true,
            default: (v) => {
                if (typeof v !== 'undefined' && v !== ''  && v.length < 2) {
                    return v;
                } else {
                    return '';
                }
            }
        },
        description: {
            type: 'string',
            source: ['body'],
            required: true,
            default: (v) => {
                if (typeof v !== 'undefined' && v !== ''  && v.length < 50) {
                    return v;
                } else {
                    return '';
                }
        }
    },
    authContext: {
        super: false,
        server: false
    }
}
}