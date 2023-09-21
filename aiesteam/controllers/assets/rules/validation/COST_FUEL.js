

var  TESTRULE =


{
  "id": 1, 
  "name": "VALIDATION_INCOME_LOAN", 
  "description": "Ensure that INCOME_LOAN is between 10 and 20 inclusively", 
  "active": true, 
  "type": "validation", 
  "rvs": ["INCOME_LOAN "], 
  data: [{
    conditions:{
      all: [{ 
        "id": 1, 
        "field": " INCOME_LOAN ", 
        "math_operator": ">=", 
        "value": 10,  
      }, { 
        "id": 2, 
        "field": " INCOME_LOAN ", 
        "math_operator": "<=", 
        "value": 20, 
      }]
    },
    event: {
      type: 'RULE_COST_FUEL_FAIL_FUEL_COST_GOOD',
      params: {
        message: 'COST_FUEL > COST_MAT_TOT. CHECK. '
      }
    }
  }]
}

module.exports = TESTRULE;