var Deferred = require('Deferred');
var Sequelize = require('sequelize');
var axios = require('axios').default;
/**
 * Get the URL
 */
var dbSeq = require("../dbmodels/relationships")
var config = require("../config")

var utils = require("../util")


module.exports = {
    /**
     * Pull data from the analytics data
     * @param {*} locals 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    createNotification: async (locals, req, res, next) => {
        // Save the notification to the workflow table
        let result = await utils.updateOrCreate(dbSeq.workflow, { where: { id: 0 } }, {
            sent_from: locals.sentFrom,
            sent_to: locals.sentTo,
            data: locals,
            parent_id: locals.parent_id,
            message: locals.message,
        })

        // Now send the notification to NODE RED      
        /*
        axios.post(config.QFLOWURL + 'qflow/notification',
            {
                wfid: result.item.id || 0,
                "sentFrom": locals.sentFrom,
                "sentTo": locals.sentTo,
                data: result.item,
                parent_id: locals.parent_id,
                message: locals.message,
                created_at: utils.dateTime()
            })
        */
        res.send(locals)
        return;
    }
}


