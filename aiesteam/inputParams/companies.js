//End point for reporting units
/**
 * 
 */
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
            source: [ 'query'],
            required: false
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
            default: (v) => {
                if (!v) {
                    return 10;
                } else {
                    return v;
                }
            }

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
        name: {
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false,

            // default:  (v) =>{if (typeof v === 'undefined') { return '';} else {  return v; }}
            default: (v) => {
                if (typeof v !== 'undefined' && v !== '') {
                    return v;
                } else {
                    return '';
                }
            }

        },
        reportingId:{
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false,
        },
        levelType: {
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false,
            default: (v) => {
                //return 'd';
                if (typeof v === 'undefined' || v === '') {
                    return 'c';
                } else {
                    return v;
                }
            }
        },
        multi: {
            type: 'bool',
            source: ['body', 'headers', 'query'],
            required: false,
            default: (v) => {
                if (typeof v !== 'undefined' && v != '') return JSON.parse(v);
                return false;
            }
        },

        entId: {
            type: 'int',
            source: ['body', 'headers', 'query'],
            required: false,
            default: (v) => {
                if (typeof v !== 'undefined' && parseInt(v)) return v
                return 0;

            }


        },
        filter: {
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false ,
            default: "{}"
        },
        naics: {
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false,
            default: (v) => {
                if (typeof v === 'undefined' || v === '') {
                    return '';
                } else {
                    return v;
                }
            }



        },
        // category: {
        //     type: 'string',
        //     source: ['body', 'headers', 'query'],
        //     required: false,
        //     default: (v) => {
        //         if (typeof v === 'undefined' || v === '') {
        //             return '';
        //         } else {
        //             return (''+v);
        //         }
        //     }
        // }
    },
    authContext: {
        super: false,
        server: false
    }
    
}

