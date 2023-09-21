module.exports = {
  processCSVData: (data) => {
    let preRules = [];

    data.forEach((r, k) => {
      let cs = r['CONDITION'] || 'PAY_ANN > 0'

      let shortCondition = r['Short Condition'] || ''
      cs = (shortCondition == '') ? cs : shortCondition + ' and ' + cs

      let actionStringRHS = ''
      let action = [] // [{ 'FAILURE': true }]
      let actionString = (r['ACTIONSTRING']).trim()

      // actionString = (actionString.endsWith(";")) ? actionString.slice(0, -1) + "" : ""

      let arr = actionString.split(";");

      for (let i = 0; i < arr.length; i++) {
        const equation = arr[i];
        const [key, val] = equation.split(/(?<=^[^\=]+)\=/) //split("=");


        let c_key = (key || "").replace(/[^\x20-\x7E]/g, "").trim()
        let c_value = (val || "").replace(" eq ", "=").trim()

        if (key)
          action.push({ [c_key]: c_value });
      }

      // GET DETAIL TOTALS:
      let SUM_DET = ''
      let SUM_DET_ARRAY = []

      for (let j = 0; j < 14; ++j) {
        let detVar = r['DETAIL ' + j] ? r['DETAIL ' + j] : ''
        if (detVar !== '') SUM_DET_ARRAY.push(detVar)
      }


      if (SUM_DET_ARRAY.length > 0) {
        action.push({ ["TOTAL"]: r['TOTAL'] })
        SUM_DET = SUM_DET_ARRAY.join(' + ')
        action.push({ "SUM_DET": SUM_DET })
      }
      let sector = r['SECTOR/TRADE'] ? r['SECTOR/TRADE'] : "All"
      let validationType = r["RULE_TYPE"]


      preRules.push({
        key: k + 2,
        ruleId: k + 2,
        type: k + 2,
        priority: r['PRIORITY'] || 5,
        conditionstring: cs,
        message: r['DESCRIPTION'],
        action,
        actionString: JSON.stringify(action),
        validationType,
        sector,
        name: r['NAME'],
        description: r['DESCRIPTION'],
      });
    });

    return {
      preRules,
      params: preRules,
      payload: { paramFile: preRules }
    };
  },
  successResponse: (res, data) => {
    res.status(200).json({
      status: 'success',
      data,
    });
  },
  internalServerErrorResponse: (res, error) => {
    res.status(500).json({
      status: 'error',
      error,
    });
  },
  badRequestResponse: (res, error) => {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
}