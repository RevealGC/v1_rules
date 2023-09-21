exports.params = {
    forceTls: false,
    params: {
        DEBUG:    {
            type: 'bool',
            source: ['body', 'headers', 'query'],
            required: false
        },
        id:{
            type: 'string',
            source: ['params'],
            required: true
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

        type:{
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false,
        },
        data:{
            type: 'string',
            source: ['body'],
            required: false
        },
        name:{
            type: 'string',
            source: ['body'],
            required: false
        },
        active:{
            type: 'bool',
            source: ['body'],
            required: false
        },



        share_flag:{
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false,
        },

        description:{
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false,
                  
        },
        rvs:{
            type: 'string',
            source: ['body', 'headers', 'query'],
            required: false,
            
        }
    },
    authContext: {
        super: false,
        server: false
    }
}