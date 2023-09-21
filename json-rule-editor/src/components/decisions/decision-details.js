import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tree from '../tree/tree';
import { PanelBox } from '../panel/panel';
import 'font-awesome/css/font-awesome.min.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import { transformRuleToTree } from '../../utils/transform';
import  RuleEditor  from "./ruleeditor"

import { processEngine, updateParsedRules } from '../../validations/rule-validation';

import ViewAttribute from '../attributes/view-attributes';
import { forEach } from 'lodash';

class DecisionDetails extends Component {

    static getDerivedStateFromProps(props, state) {
        if (Object.keys(props.outcomes).length !== state.showCase.length) {
            const showCase = Object.keys(props.outcomes).map((key, index) => {
                return ({ case: false, edit: false, index });
            });
            return { showCase };
        }
        return null;
    }

    constructor(props) {
        super(props);
        const showCase = Object.keys(props.outcomes).map((key, index) => {
            return ({ case: false, edit: false, index });
        })

        this.state = { showCase, submitAlert: false, removeAlert: false, successAlert: false, removeDecisionAlert: false };
        this.handleExpand = this.handleExpand.bind(this);
        this.handleRemoveCondition = this.handleRemoveCondition.bind(this);
        this.handleRemoveConditions = this.handleRemoveConditions.bind(this);

        //NK
        this.handleViewRule = this.handleViewRule.bind(this)
        this.handleDeployRule = this.handleDeployRule.bind(this)
        this.handleTestRule = this.handleTestRule.bind(this)
        this.handleToggleStatus = this.handleToggleStatus.bind(this)
        // this.props.addDebug({data:'TEST'})

        this.editCondition = this.editCondition.bind(this);
        this.cancelAlert = this.cancelAlert.bind(this);
        this.removeCase = this.removeCase.bind(this);
        this.removeDecisions = this.removeDecisions.bind(this);
    }


    handleEdit(e, val) {
        e.preventDefault();
        this.setState({ showRuleIndex: val });
    }

    editCondition(e, decisionIndex) {
        e.preventDefault();
        this.props.editCondition(decisionIndex);
    }

    handleExpand(e, index) {
        e.preventDefault();
        const cases = [...this.state.showCase];
        let updateCase = cases[index];
        updateCase = { ...updateCase, case: !updateCase.case }
        cases[index] = { ...updateCase };
        this.setState({ showCase: cases });
    }


    //NK
    handleViewRule(e, decisionIndex) {
        e.preventDefault();

        this.props.addDebug({ rule: this.props.outcomes[decisionIndex][0] })
    }


getFacts(decisionIndex) {
    const { attributes } = this.props;
    let f = {};

    for (var i = 0; i < attributes.length; i++) {
        f[attributes[i].name] = attributes[i].value
    }
    let facts = [f];
    return facts



}


    async handleTestRule(e, decisionIndex) {
        e.preventDefault();

        const { attributes } = this.props;
        let f = {};
        let r = this.props.outcomes[decisionIndex][0]

        for (var i = 0; i < attributes.length; i++) {
            f[attributes[i].name] = attributes[i].value
        }
        let facts = [f];
        let rules = [r]
        let result = await processEngine(facts, rules)
        this.props.addDebug({ result })
    }

    async handleDeployRule(e, decisionIndex) {
        e.preventDefault();

        // data:{active: true/false,parsed_rule:<json object> }, id, 
        let r = this.props.outcomes[decisionIndex][0];

        r.event.ruleId==='0'
        let id = r.event.ruleId==='0' ? 0 : Number(r.event.ruleId)

        // if id is 0 then its an insert otherwise update it.
        let result = await updateParsedRules({ parsed_rule: r, active: r.event.active,type:'validation',active:true, data:r, description: r.event.name,data: r,
            id: id , name: r.event.name, rvs: (r.event.params.rvs)? r.event.params.rvs: '[]', created_by:'qbes', modified_by:'qbes'});
        this.setState({ removeAlert: false, successAlert: true, successMsg: "Rule#"+id+" is saved to the database."});

    }

    async handleToggleStatus(e, decisionIndex) {
        e.preventDefault();

        let r = this.props.outcomes[decisionIndex][0];
        let id = Number(r.event.type)
    }


    handleRemoveCondition(e, decisionIndex) {
        e.preventDefault();
        this.setState({ removeAlert: true, removeDecisionIndex: decisionIndex });
    }

    handleRemoveConditions(e, outcome) {
        e.preventDefault();
        this.setState({ removeDecisionAlert: true, removeOutcome: outcome });
    }

    cancelAlert = () => {
        this.setState({ removeAlert: false, successAlert: false, removeDecisionAlert: false });
    }

    removeCase = () => {
        this.props.removeCase(this.state.removeDecisionIndex);
        this.setState({ removeAlert: false, successAlert: true, successMsg: 'Selected condition is removed' });
    }

    removeDecisions = () => {
        this.props.removeDecisions(this.state.removeOutcome);
        this.setState({ removeDecisionAlert: false, successAlert: true, successMsg: 'Selected conditions are removed', removeOutcome: '' });
    }

    removeCaseAlert = () => {
        return (<SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, Remove it!"
            confirmBtnBsStyle="danger"
            title="Are you sure?"
            onConfirm={this.removeCase}
            onCancel={this.cancelAlert}
            focusCancelBtn
        >
            You will not be able to recover the changes!
        </SweetAlert>)
    }

    removeDecisionAlert = () => {
        return (<SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, Remove it!"
            confirmBtnBsStyle="danger"
            title="Are you sure?"
            onConfirm={this.removeDecisions}
            onCancel={this.cancelAlert}
            focusCancelBtn
        >
            You will not be able to recover the changes!
        </SweetAlert>)
    }

    successAlert = () => {
        return (<SweetAlert
            success
            title={this.state.successMsg}
            onConfirm={this.cancelAlert}
        >
        </SweetAlert>);
    }

    alert = () => {
        return (<div>
            {this.state.removeAlert && this.removeCaseAlert()}
            {this.state.removeDecisionAlert && this.removeDecisionAlert()}
            {this.state.successAlert && this.successAlert()}
        </div>);
    }

    handleCancel(index) {
        const cases = [...this.state.showCase];
        let updateCase = cases[index];
        updateCase = { ...updateCase, case: !updateCase.case }
        cases[index] = { ...updateCase };
        this.setState({ showCase: cases });

    }

    renderConditions = (conditions, decisionIndex) => {


        let facts = this.getFacts(decisionIndex)



        const transformedData = transformRuleToTree(conditions);
        return (<div className="rule-flex-container_X">
            <RuleEditor conditions={conditions} facts={facts} decisionIndex={decisionIndex} handleCancel={this.handleCancel.bind(this)}/>
           
            {/* {transformedData && transformedData.map((data, caseIndex) => (<div className="decision-box" key={`case - ${caseIndex} - ${decisionIndex}`}>
                <div className="tool-flex">
                    <div><a href="" onClick={(e) => this.editCondition(e, data.index)}><span className="fa fa-edit" /></a></div>
                    <div><a href="" onClick={((e) => this.handleRemoveCondition(e, data.index))}><span className="fa fa-trash-o" /></a></div>
                </div>
                <Tree treeData={data.node} count={data.depthCount} />
                
            </div>))} */}
        </div>)     
    }

    render() {
        const { outcomes } = this.props;
        const { showCase } = this.state;

        const conditions = Object.keys(outcomes).map((key, index) =>
        (
        
        <div key={key}>
            <PanelBox className={'boolean'}>
                <div className="menu">
                    <a href="" onClick={(e) => this.handleExpand(e, index)}> {showCase[index].case ? 'Collapse' : 'Edit Conditions'}</a>

                    <a href="" onClick={((e) => this.handleViewRule(e, String(key)))}>View Rule</a>
                    <a href="" onClick={((e) => this.handleTestRule(e, String(key)))}>Test Rule</a>
                    {/* <a href="" onClick={((e) => this.handleDeployRule(e, String(key)))}>Deploy</a> */}
                 
                    
                    {/* <a href="" onClick={((e) => this.handleToggleStatus(e, String(key)))}>Toggle Status ({ (outcomes[key][0].event.active) ? 'Active' : 'Inactive'})</a> */}
                    <a href="" onClick={((e) => this.handleRemoveConditions(e, String(key)))}>Remove</a>
                </div>
           
  
            </PanelBox>
            <PanelBox >
            
                <div className="index">{index + 1}</div>
                <div className="name">{String(key)}</div>
                <div className="name">{(outcomes[key][0].event.name)}</div>
                <div className="type">conditions <span className="type-badge">{outcomes[key].length}</span></div>
            </PanelBox>
            {showCase[index].case && this.renderConditions(outcomes[key], index)}
            <p></p>
        </div>));

        return (<div className="">
            {/* {this.alert()} */}
            {conditions}
        </div>);
    }
}

DecisionDetails.defaultProps = ({
    decisions: [],
    editCondition: () => false,
    removeCase: () => false,
    removeDecisions: () => false,
    outcomes: {},
    addDebug: () => false,
});

DecisionDetails.propTypes = ({
    decisions: PropTypes.array,
    editCondition: PropTypes.func,
    removeCase: PropTypes.func,
    removeDecisions: PropTypes.func,
    outcomes: PropTypes.object,
    addDebug: PropTypes.func
});

export default DecisionDetails;