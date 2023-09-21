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
        naics: {
            type: 'double',
            source: ['body', 'headers', 'query'],
            required: false,
            default: (v) => {
                if (typeof v !== 'undefined' && v !== '') {
                    return v;
                } else {
                    return 0;
                }
            }
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
            default:  (v) =>{if (!v) { return 10;} else {  return v; }}
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
        },
        filter: {
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false,
            default: (v) => {
                if (typeof v !== 'undefined' && v !== '') return v;
                return "{}";
            }
        },
        title: {
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false,

            default: (v) => {
                if (typeof v !== 'undefined' && v !== '') {
                    return v;
                } else {
                    return '';
                }
            }

        }

    },
    authContext: {
        super: false,
        server: false
    }
}