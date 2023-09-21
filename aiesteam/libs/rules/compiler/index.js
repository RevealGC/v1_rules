var input = {
  "message": "TEST",
  "formula": [
    {
      "id": 1,
      "field": "INCOME_LOAN",
      "math_operator": ">=",
      "value": 10
    },
    {
      "logical_operator": " AND "
    },
    {
      "id": 2,
      "field": "INCOME_LOAN_SURPLUS",
      "math_operator": "=",
      "value": 0
    },
    {
      "logical_operator": " AND "
    },
    {
      "id": 2,
      "field": "INCOME_LOAN_TEST",
      "math_operator": "=",
      "value": 0
    }
  ],
  "action": [
    {
      "id": 1,
      "type": "rv",
      "field": "TOTAL_INCOME_BONUS",
      "formula": [
        {
          "id": 1,
          "type": "rv",
          "value": "INCOME_LOAN"
        },
        {
          "math_operator": "+"
        },
        {
          "id": 2,
          "type": "text",
          "value": 100
        }
      ]
    },
    {
      "id": 1,
      "type": "rv",
      "field": "TOTAL_INCOME_BONUS2",
      "formula": [
        {
          "id": 1,
          "type": "rv",
          "value": "INCOME_LOAN"
        },
        {
          "math_operator": "*"
        },
        {
          "id": 2,
          "type": "rv",
          "value": "BASE_LOAN"
        }
      ]
    }
  ]
}


var output;

var utils = require("../../../util")


function buildConditionFromFormula(formula) {
  var c = []
  var o, f;
  var opQ = []

  var fQ = []

  formula.map(f => {
    if (f.logical_operator) {
      opQ.push(f)
    }
    else fQ.push(f)
  })


  // No opeator
  if (!opQ.length) {
    let f = fQ.shift()
    c.push({ all: [f] })
    return c[0];
  }


  c = recurse({ opQ, fQ })
  return c;
}

function recurse(Q) {

  var { fQ, opQ } = Q
  var c = []
  if (fQ.length) {

    o = opQ.shift()  // operator  {logical_operator: ' AND  '}
    f = fQ.shift()   // operand   { id:, fact:"INCOM_LOAN", operator:: ">=", value:10}


    if (o && o.logical_operator.indexOf('AND') != -1) {
      let all = [f]
      all.push(recurse({ fQ, opQ }))
      c.push({ all: all })
    }
    else if (o && o.logical_operator.indexOf('OR') != -1) {
      let or = [f]
      or.push(recurse({ fQ, opQ }))
      c.push({ any: or })
    }
    else if (!o) {
      return f
    }
  }

  return c[0];
}


var rvFlag = 'rv'

function getAction(action) {
  let r = []
  let e = ''

  action.map(a => {
    if (a.type == rvFlag) {
      a.formula.map(a0 => {
        if (a0 && a0.type && a0.type == rvFlag) {
          e += ' "' + a0.value + '" '  // Quote the rv in the string
        }
        else if (a0 && a0.operator) {
          e += a0.operator
        }
        else if (a0 && a0.value) {
          e += a0.value
        }
      })


      r.push({ [a.fact]: e })
      e = ''
    }
  })
  return r;
}

module.exports = {


  compile: async function (strObj, label) {
    var action
    try {
      let str = JSON.stringify(strObj)

      let n1 = str.replace(/field/ig, 'fact')
      let newKeysString = n1.replace(/math_operator/ig, 'operator')

      let parsed_rule = await JSON.parse(newKeysString);

      // Build conditions

      parsed_rule.conditions = buildConditionFromFormula(parsed_rule.formula)


      // Build actions
      if (parsed_rule.action) {
        action = getAction(parsed_rule.action)
      }
      parsed_rule.event = { type: label, params: { message: parsed_rule.message, action } }

      delete parsed_rule.formula
      delete parsed_rule.message
      delete parsed_rule.action

      let ret = { data: strObj, parsed_rule: parsed_rule }
      return ret

    }
    catch (e) {
      throw e
    }

  }

}







