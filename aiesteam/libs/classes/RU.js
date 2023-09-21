

class RU {
    rid;
    facts=[];
    aggregates =[]
    locals = {}
    rules = {}
    children = []
    parent = 0
    aggregates=[]
    result = {}
    valid=[]
    invalid = []

    constructor(rid) {
        this.rid = rid;
}
validate(){
    return true;
}
getRid(){ return Number(this.rid) }
getFacts(){ return this.facts }
setFacts(facts) { this.facts = facts }
getLocal(){ return this.locals }
setLocals(locals) { this.locals = locals }
getChildren(){ return this.children }
setChildren(children) { this.children = children }

getRules(){ return this.rules }
setRules(rules) { this.rules = rules }
getParent(){ return this.parent }
setParent(parent) { this.parent = parent }
getAggregates(){ return this.aggregates }
setAggregates(aggregates) { this.aggregates = aggregates }
getValid(){ return this.valid}
setValid(valid) { this.valid = valid }

}