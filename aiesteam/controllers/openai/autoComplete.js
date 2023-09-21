

import { aicomplete } from '../../libs/openai'
// const { aicomplete } = require('../../libs/openai');


module.exports = {

    prompt: async function (locals, req, res, next) {

        let { conditionstring } = locals
        let result = await aicomplete(conditionstring)


        res.send(result)


    }


}
