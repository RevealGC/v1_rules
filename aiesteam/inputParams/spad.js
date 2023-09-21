exports.params = {
    forceTls: false,
    params: {
        DEBUG: {
            type: 'bool',
            source: ['body', 'headers', 'query'],
            required: false,
            default: (v) => {
                console.log({v})
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
            type: 'int',
            source: ['body', 'params', 'query'],
            required: false
        },
        reporting_id: {
            type: 'int',
            source: ['body', 'headers', 'query'],
            required: false
        },
        parent_id: { // if spad_parent_id is specified then create children with spad_parent_id
            type: 'int',
            source: ['params', 'query', 'body', 'headers'],
            required: false,
            default: 0
        },
        conditionstring: {   // used for testing if conditionstring will parse or not
            type: 'string',
            source: ['params', 'query', 'body', 'headers'],
            required: false,
        },
        action: {  // if user wants to test an action array it will return the requested variables and expressions in the action object after executing the conditioner of qbes
            type: 'string',
            source: ['body', 'params', 'query'],
        },
        facts: {      // Is an array of facts
            type: 'string',
            source: ['body', 'params', 'query'],
        },
        paramFile:{  // passed from parameters file is an array
            type: 'string',
            source: ['body'],
            default: '[]'
        },
        rules: {
            type: 'string',
            source: ['body', 'params', 'query'],
        },
        ruleType: { // can be type in rules_repo column.  they are like 'validation', 'test',...
            type: 'string',
            source: ['body', 'params', 'query'],
            required: false,
            default: 'validation'
        },
        showNetwork:{  // Want to see the children leave default as true else turn to false
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
            default: (v) => { if (!v) { return 100; } else { return v; } }
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