var config = require("../../../config");
var dbSeq = require("../../../dbmodels/relationships");


module.exports = {



    aggregateFunction: async function (id) {
        // get all the keys for the parent record of the id

        if (id === 0) return {};


        try {


            let aggVars = await config.dbPool.query("select result::json->'rules'->'facts' as facts, (aggregate::json) as aggregate from spad where id = $1", [id])



            if (aggVars && aggVars.rows.length > 0) {
                let aggVarObject = aggVars.rows[0].aggregate
                let aggArr = Object.keys(aggVarObject)

                let selectAggQuery = aggArr.map(agg => ` sum(coalesce(aggregate::json->'${agg}'->>'fact','0')::DECIMAL) as "${agg}"`)
                    .reduce((a, current, index) => a + (index === 0 ? ' ' : ',') + current, 'select ')
                    .concat(' from spad where parent_id = $1')



                let result = await config.dbPool.query(selectAggQuery, [id])

                aggArr.map(agg => {
                    aggVarObject[agg]['aggregateValue'] = Number(result.rows[0][agg])
                    let type = aggVarObject[agg]['type'] || 'sum'
                    aggVarObject[agg][type] = Number(result.rows[0][agg])
                })

                // append aggregate values to facts now
                let fact = aggVars.rows[0].facts[0]

                fact = { ...fact, ...{ aggregate: aggVarObject } }



                await config.dbPool.query('update spad set aggregate = $1 ,facts = $2, last_modified_date = now() where id = $3', [aggVarObject, fact, id])
                // call itself after finding the ids parent and call its parents with axios


                const rptUnit = await dbSeq.spad.findOne({ where: { id: id } })
                let spadParentId = Number(rptUnit.dataValues.parent_id)

                return this.aggregateFunction(spadParentId)

            }
            return {};
        }
catch(error) {
        return {}
    }
}
}

