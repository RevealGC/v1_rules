/**
 
I want to creat an react ag-grid with the following columns name, description, active, rvs,refper_start, refper_end, condition, tracked, parsed_rule, priority, created_by, modified_by, created_at, modified_at. The field name must use cellRenderer as agGroupCellRenderer. Use axios to get data from the api end point.



 */
import React from 'react';
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import axios from 'axios';
import { GridApi, ColumnApi } from 'ag-grid-community';
import PropTypes from 'prop-types';

import { processEngine, updateParsedRules } from "../../validations/rule-validation";

import RuleEditor from './ruleeditor'
import SweetAlert from 'react-bootstrap-sweetalert';

import IconLink from '../menus/IconLink'

import { handleDebug } from '../../actions/debug';

import { addAllRulesRedux } from '../../actions/ruleset';
import { handleRule } from "../../actions/rules";



import { truncate } from 'lodash';
import QuickRuleModal from './QuickRuleModal';
import 'semantic-ui-css/semantic.min.css';
import { loadRuleTypes } from "../../actions/ruleset";

import FreeTextModal from './FreeTextModal';


const HOSTURL = 'http://localhost:8000'

const arrayToString = (arr) => {
  return arr.reduce((acc, obj) => {
    // loop through the keys of each object
    for (const key in obj) {
      // add the key and value to the accumulator string, separated by a colon
      acc += `${key}: ${obj[key]}, `;
    }
    return acc;
  }, '');
};
const groupDisplayType = 'multipleColumns';
const gridOptions = {
  rowMultiSelectWithClick: true,
  groupDefaultExpanded: false,




  getRowStyle: function (params) {
    return {

      margin: '0px',


    }
  }
};


// var facts = { reporting_id: 8771348140 }


const newRuleObject = {

  "event": {
    "ruleId": "0",
    "active": true,
    "name": "Creating a new rule. Change its name....",
    "actionType": "impute",
    "validationType": "new",
    "rulePriority": "5",
    "params": {
      "rvs": "['PAY_ANN']",
      rvsJSON: ['PAY_ANN'],
      "action": [{ RCPT_TOT: 'RCPT_TOT' }],
      "message": "Enter the message you want to display... . Some initial conditions have been pre-defined.",
      "actionType": "impute"
    },
    "type": "0"
  },
  "index": -1,
  "conditions": {
    "all": [
      {
        "fact": "checkCondition",
        "path": "$.value",
        "operator": "equal",
        "value": true,
        "params": {
          "conditionstring": "RCPT_TOT > 0"
        }
      }
    ]
  }
}
const breakRuleObject = (ruleObject) => {
  let ruleName = ruleObject.event.name
  let conditionstring = ruleObject.conditions.all[0].params.conditionstring
  let responseVariables = ruleObject.event.params.rvsJSON
  let compute = ruleObject.event.params.action
  let message = ruleObject.event.params.message
  let priority = ruleObject.event.rulePriority
  let ruleType = ruleObject.event.validationType
  let ruleId = ruleObject.event.ruleId


  return ({ ruleName, conditionstring, responseVariables, compute, message, priority, ruleType, ruleId })

}


const cellStyle = {
  fontFamily: '"Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif',
  fontSize: '14px',
  fontWeight: '400',
  display: 'flex',
  'alignItems': 'center',
  fill: '#fff',
  stroke: '#fff',
  strokeWidth: 0,
  color: '#505050',
  padding: '10px',
  // 'border-right': '0.5px dotted'
}


function stripHTML(html) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}
function truncateString(str, len) {
  if (str && str.length > len) {
    return str.substring(0, len) + "...";
  }
  return stripHTML(str)

}

/**
 * Want to create a react component
 */

class RulesGrid extends React.Component {
  constructor(props) {
    super(props);
    this.gridApi = ''
    this.allRulesRedux = this.props.allRulesRedux


    // rowGroup: true,

    this.state = {
      selectedCondition: {},
      showModalRule: false,
      freeTextShowModal: false,

      selectedRule: newRuleObject,
      rowIndex: 0,
      allRulesRedux: this.props.allRulesRedux,
      ruleCounts: 0,
      displayNewRow: false,

      submitAlert: false, removeAlert: false, successAlert: false, removeDecisionAlert: false, noFactsAlert: false,

      columnDefs: [
        //Type: GROUP like validation or user ruleset 
        {
          field: 'type', valueGetter: this.getValidationType, rowGroup: true, pinned: "left",
          cellStyle: cellStyle,
          cellRenderer: 'agGroupCellRenderer',
          sortable: true, filter: 'agTextColumnFilter', hide: true,
          headerName: "Rule Type",
          cellClass: 'bold-text center-text'
        },
        { headerName: '#', field: 'key', checkboxSelection: true, cellRenderer: 'agGroupCellRenderer', cellStyle: cellStyle, sortable: true, hide: false, filter: 'agTextColumnFilter', comparator: (a, b) => { return a - b } },




        {
          headerName: 'Rule ID', field: 'id', cellRenderer: 'agGroupCellRenderer',
          valueGetter: this.getRuleId,
          cellStyle: cellStyle, sortable: true, filter: 'agTextColumnFilter', comparator: (a, b) => { return a - b }
        },




        { headerName: 'Active', field: 'active', sortable: true, filter: 'agTextColumnFilter', hide: true, cellStyle: cellStyle },

        { headerName: 'Name', field: 'name', valueGetter: this.getRuleName, cellStyle: cellStyle, sortable: true, filter: 'agTextColumnFilter', },

        // DESCRIPTION
        {
          headerName: 'Description', width: 800, field: 'description',
          // autoHeight: true, editable: true, wrapText: true, sortable: true,
          filter: 'agTextColumnFilter', cellEditor: 'agTextCellEditor', cellEditorPopup: true, valueGetter: this.truncateDescription, cellStyle: cellStyle
        },


        { headerName: 'Rule Condition', cellStyle: cellStyle, field: 'condition', valueGetter: this.getConditionString, width: 400, sortable: true, filter: 'agTextColumnFilter' },

        {
          headerName: 'Message', field: 'description', cellStyle: cellStyle,
          valueGetter: this.getRuleMessage, sortable: true, filter: 'agTextColumnFilter',
        },

        { headerName: 'Track', cellStyle: cellStyle, field: 'track', valueGetter: this.getTrackVariables, width: 100, sortable: true, filter: 'agTextColumnFilter', },


        { headerName: 'Action Type', field: 'actionType', cellStyle: cellStyle, valueGetter: this.getActionType, width: 100, sortable: true, filter: 'agTextColumnFilter', hide: true },



        { headerName: 'Action', field: 'action', cellStyle: cellStyle, valueGetter: this.getAction, width: 400, sortable: true, filter: 'agTextColumnFilter' },

        { headerName: 'RefPer Start', cellStyle: cellStyle, field: 'refper_start', sortable: true, filter: 'agTextColumnFilter', hide: true },
        { headerName: 'RefPer End', cellStyle: cellStyle, field: 'refper_end', sortable: true, filter: 'agTextColumnFilter', hide: true },
        { headerName: 'Parsed Rule', cellStyle: cellStyle, field: 'parsed_rule', sortable: true, filter: 'agTextColumnFilter', hide: true },

        { headerName: 'Priority', field: 'priority', width: 200, sortable: true, cellStyle: cellStyle, valueGetter: this.getRulePriority, filter: 'agTextColumnFilter', },

        { headerName: 'Created By', cellStyle: cellStyle, width: 100, field: 'created_by', sortable: true, filter: 'agTextColumnFilter', hide: true },
        { headerName: 'Modified By', cellStyle: cellStyle, width: 100, field: 'modified_by', sortable: true, filter: 'agTextColumnFilter', hide: true },
        { headerName: 'Created At', cellStyle: cellStyle, width: 100, field: 'created_at', sortable: true, filter: 'agTextColumnFilter', hide: true },
        { headerName: 'Modified At', cellStyle: cellStyle, width: 100, field: 'modified_at', sortable: true, filter: 'agTextColumnFilter', hide: true }
      ],
      rowData: [],
      backupRowData: [],
      defaultColDef: {
        flex: 1,
        sortable: true,
        resizable: true,


      },

      autoGroupColumnDef: {
        // minWidth: 200,
      },
      groupMultiAutoColumn: true,
      enableRangeSelection: true,
      groupUseEntireRow: true,
    }
    this.onGridReady = this.onGridReady.bind(this)
    this.createNewRow = this.createNewRow.bind(this)
    this.performCrudOperations = this.performCrudOperations.bind(this)
    this.getRowId = this.getRowId.bind(this)
    this.addAllRulesRedux = this.props.addAllRulesRedux.bind(this)
    this.removeDecisions = this.removeDecisions.bind(this);
    this.onCellClicked = this.onCellClicked.bind(this)

    this.addRowData = this.addRowData.bind(this)
    this.executeMultipleRules = this.executeMultipleRules.bind(this)
  }



  /**
   * On ag-grid cell clicked. get the data and print it to debug window.
   * @param {*} event 
   */
  onCellClicked = (event) => {
    // the event contains the row and column index of the clicked cell
    const rowIndex = event.rowIndex;
    const colId = event.column.colId;
    // you can use these indices to get the row data and column definition from the grid's api
    try {
      const rowData = this.gridApi.getDisplayedRowAtIndex(rowIndex).data;
      const colDef = this.gridApi.getColumnDef(colId)

      // OPen the quick rule modal window.
      if (rowData.parsed_rule)
        this.setState({ selectedRule: rowData.parsed_rule, showModalRule: true })

      // now you can read the name and value of the cell as follows:
      const name = colDef.field;
      // const value = rowData[name];
      var value = rowData[name]
      if (name === 'condition') {    // show the condition string.
        value = rowData.parsed_rule.conditions.all[0].params.conditionstring

        // call the QuickRoleModel








      }

      if (name === 'track') {
        value = rowData.parsed_rule.event.params.rvs
      }
      if (name === 'action') {
        value = JSON.stringify(rowData.parsed_rule.event.params.action)
      }
      if (name === 'priority') {
        value = rowData.parsed_rule.event.rulePriority
      }
      value = stripHTML(value)
      this.props.handleDebug('ADD', { label: 'time', data: { name, ...{ value: value } } }, 0)
    }
    catch (e) {

    }

  }
  getRowNodeId = data => {
    return data.key;
  };
  /**
   * create a new row add new row of a rule. addRule
   */

  quickAddRowData = () => {
    this.setState({ showModalRule: true, selectedRule: newRuleObject })
    // this.addRowData()
  }



  quickAddFreeText = () => {
    this.setState({ freeTextShowModal: true })
    // this.addRowData()
  }

  addRowData = () => {

    let allRulesRedux = this.props.allRulesRedux.slice()
    let key = allRulesRedux.length + 1

    let newRow = {
      parsed_rule: newRuleObject,
      active: true,
      type: 'new',
      data: newRuleObject,
      description: 'New Rule',
      name: newRuleObject.event.name,
      key, showDetail: true
    }




    // allRulesRedux.push(newRow);
    allRulesRedux.unshift(newRow);
    this.props.addAllRulesRedux(allRulesRedux);


    // this.gridApi.getRowId(key).setExpanded(true)//getDisplayedRowAtIndex(key).setExpanded(true)

    // gridApi.getRowNode(allRows.length).setExpanded(true)

  };







  executeMultipleRules = async () => {

    const { facts } = this.props.facts
    if (!facts) {
      // alert("To Execute Rules, please load and select a Dataset")
      this.setState({ noFactsAlert: true })



      return;
    }
    const gridApi = this.gridApi;
    // Get the selected row nodes
    const selectedRowNodes = gridApi.getSelectedNodes();
    // Get the data for the selected rows
    const selectedRowData = selectedRowNodes.map(node => node.data);
    const rules = selectedRowData.map(r => r.parsed_rule)
    // now get the facts and call the end point.


    let result = await processEngine([facts], rules);
    this.setState({ successAlert: true })
    this.props.handleDebug("ADD", { label: "time", data: { result } }, 0);

  }
  reloadRulesFromDB = () => {
    this.setState({ rowData: [] });
    this.props.handleRule("FETCH_FROMDB_ALLRULES_REDUX", {})//    addAllRulesRedux([])
  };






  componentDidMount() {
    this.setState({ rowData: [] });
    this.props.loadRuleTypes()
    // this.props.handleRule("FETCH_FROMDB_ALLRULES_REDUX",{})
  }

  // {
  //   "name": "DEMO RULE: PAY_ANN for MA is less than VA",
  //   "condition": "agg(“PAY_ANN”, “state eq ‘MA’ “) < agg(“PAY_ANN”, “state eq ‘VA’ “)",
  //   "compute": [
  //     "hms = getTime(\"hms\")",
  //     "today=getTime()"
  //   ],
  //   "message": "MAs PAY_ANN is less than the aggregates for VA"
  // }



  handleAddFreeTextRule(freeTextResultJSON) {

    let nro = {

      "event": {
        "ruleId": "0",
        "active": true,
        "name": freeTextResultJSON.name,
        "actionType": "impute",
        "validationType": "new",
        "rulePriority": freeTextResultJSON.rulePriority,
        "params": {
          "rvs": "['PAY_ANN']",
          rvsJSON: ['PAY_ANN'],
          "action": freeTextResultJSON.action,
          "message": freeTextResultJSON.message,
          "actionType": "impute"
        },
        "type": "0"
      },
      "index": -1,
      "conditions": {
        "all": [
          {
            "fact": "checkCondition",
            "path": "$.value",
            "operator": "equal",
            "value": true,
            "params": {
              "conditionstring": freeTextResultJSON.condition
            }
          }
        ]
      }
    }

    this.setState({ selectedRule: nro, showModalRule: true, freeTextShowModal: false })

  }


  closeModal() {
    this.setState({ showModalRule: false, freeTextShowModal: false })
  }
  addModalRule() {

    const { showModalRule } = this.state

    const { ruleName, conditionstring, responseVariables, compute, message, priority, ruleType, ruleId } = breakRuleObject(this.state.selectedRule)

    if (showModalRule)
      return (<div ><QuickRuleModal

        handleDebug={this.props.handleDebug}
        handleRule={this.props.handleRule}

        closeModal={this.closeModal.bind(this)}
        open={true}
        onClose={this.closeModal.bind(this)}
        ruleName={ruleName}
        conditionstring={conditionstring}
        responseVariables={responseVariables}
        ruleType={ruleType}
        compute={compute}
        ruleTypes={this.props.ruleType}
        priority={priority}
        ruleId={ruleId}
        facts={this.props.facts.facts}
        factsName={this.props.facts.name}
        message={message} /></div>)
    else
      return (<div></div>)
  }




  detailCellRenderer(params) {

    let rule = [params.data.data]

    return (<div>





      <RuleEditor conditions={rule} description={params.data.description}
        reloadRulesFromDB={this.reloadRulesFromDB}
        performCrudOperations={this.performCrudOperations}
        handleCancel={this.handleCancel}
        // facts={this.props.facts} 

        decisionIndex={params.rowIndex} />


    </div>



    )

  }

  getValidationType(params) {
    try {
      let ret = params.data.parsed_rule.event.validationType
      return (ret)
    } catch (error) {
      return ''
    }
  }
  getRulePriority(params) {
    try {
      let ret = params.data.parsed_rule.event.rulePriority
      return (ret)
    } catch (error) {
      return ''
    }
  }
  getAction(params) {
    try {
      let ret = params.data.parsed_rule.event.params.action

      return arrayToString(ret)

    } catch (error) {
      return ''
    }
  }
  getRuleName(params) {
    try {
      let ret = params.data.parsed_rule.event.name

      return (ret)

    } catch (error) {
      return ''
    }
  }

  getTrackVariables(params) {
    try {
      let ret = params.data.parsed_rule.event.params.rvs

      return (ret)

    } catch (error) {
      return ''
    }
  }


  getRuleMessage(params) {
    try {
      let ret = params.data.parsed_rule.event.params.message

      return stripHTML(ret)

    } catch (error) {
      return ''
    }
  }

  truncateDescription(params) {

    try {
      let ret = params.data.description
      return truncateString(stripHTML(ret), 100)
    }
    catch (error) {

      return ''
    }
  }

  getRuleId(params) {
    try {
      let ret = params.data.id || 'New'
      return ret
    } catch (error) {
      return ''
    }
  }
  getActionType(params) {
    try {
      let ret = params.data.parsed_rule.event.actionType
      return ret
    } catch (error) {
      return ''
    }
  }

  getConditionString(params) {
    try {
      let ret = params.data.parsed_rule.conditions.all[0].params.conditionstring
      return ret
    } catch (error) {
      return ''
    }
  }
  crudRule() {
    let { rowIndex } = this.state
    if (rowIndex) this.createNewRow()
  }

  // debug(data) {
  //   this.props.handleDebug('ADD', { label: 'time', data }, 0)
  // }




  getRowId = params => params.data.id;

  performCrudOperations = (operation, rowIndex, rowData) => {
    // Get a reference to the ag-Grid component
    const gridApi = this.gridApi;

    // not using create.  Leave it.
    if (operation === 'create') {
      // Insert a new row
      gridApi.updateRowData({ add: [rowData], addIndex: 0 });
      let allRows = this.props.allRulesRedux
      let newRules = { ...allRows, ...rowData }
      this.props.addAllRulesRedux(newRules)

      // allRows.push(rowData);
      // this.setState({ rowData: allRows });


      // gridApi.getRowNode(allRows.length).setExpanded(true)


    } else if (operation === 'read') {
      // Get the row data for a specific row
      const rowNode = gridApi.getRowNode(rowIndex);
      const rowData = rowNode.data;
    } else if (operation === 'update') {
      // Update an existing row


      gridApi.updateRowData({ update: [{ index: rowData.key, data: rowData }] });

      // const allRowData = this.state.rowData

      // let out = []
      // allRowData.forEach(row => { out.push(row) })
      // out[rowData.key - 1] = rowData
      // this.setState({ rowData: out });
      // this.props.addAllRulesRedux(out)

    } else if (operation === 'delete') {
      // Delete an existing row
      gridApi.applyTransaction({ remove: [rowData] });
    }
  }
  createNewRow() {
    // this.setState({ displayNewRow: true });

    let data = {
      parsed_rule: newRuleObject,
      active: true,
      type: 'impute',
      data: newRuleObject,
      description: 'New Rule',
      name: newRuleObject.event.name,
      id: 0,
      isOpen: true

    }



    return data
    // this.performCrudOperations('create', null, data);
  }


  onFirstDataRendered = (params) => {
    setTimeout(function () {
      // params.api.getDisplayedRowAtIndex(1).setExpanded(true);
    }, 0);
  }




  onGridReady = function (params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // or setState if using components
    this.setState({
      gridApi: params.api,
      columnApi: params.columnApi
    });

    this.gridColumnApi.autoSizeColumns();
  }




  handleCancel = () => {
    // this.alert("REACHED RGRID at579")
    // this.setState({ displayNewRow: !this.state.displayNewRow });
  }

  hideAlert = () => {
    this.setState({
      alert: null
    });
  }
  removeDecisionAlert = () => {

    return (<SweetAlert
      warning
      showCancel
      confirmBtnText="Yes, Remove it!"
      confirmBtnBsStyle="danger"
      title="Are you sure you want to delete the selected rule(s)"
      onConfirm={this.removeDecisions}
      onCancel={this.cancelAlert}
      focusCancelBtn
    >
      You will not be able to recover the changes!
    </SweetAlert>)
  }

  alert = () => {
    return (<div >
      {/* {this.state.removeAlert && this.removeCaseAlert()} */}
      {this.state.removeDecisionAlert && this.removeDecisionAlert()}
      {this.state.successAlert && this.successAlert()}
      {this.state.noFactsAlert && this.noFactsAlert()}


    </div>);
  }
  cancelAlert = () => {
    this.setState({ removeAlert: false, successAlert: false, noFactsAlert: false, removeDecisionAlert: false });
  }
  noFactsAlert = () => {
    return (
      <div style={{ width: "fit-content" }}>
        <SweetAlert
          success
          title={"Please select a Dataset to execute the rules against. "}
          onConfirm={this.cancelAlert.bind(this)}
          onCancel={this.cancelAlert.bind(this)}
        >
          {this.state.updatedAlert}
        </SweetAlert>
      </div>
    );
  };
  successAlert = () => {
    return (
      <div style={{ width: "fit-content" }}>
        <SweetAlert
          success
          title={"Rules have been executed successfully!! "}
          onConfirm={this.cancelAlert.bind(this)}
          onCancel={this.cancelAlert.bind(this)}
        >
          {this.state.updatedAlert}
        </SweetAlert>
      </div>
    );
  };

  removeDecisions() {
    const gridApi = this.gridApi;

    // Get the selected row nodes
    const selectedRowNodes = gridApi.getSelectedNodes();
    // Get the data for the selected rows
    const selectedRowData = selectedRowNodes.map(node => node.data);
    const rids = selectedRowData.map(r => r.id)
    const keysArray = selectedRowData.map(r => r.key)


    try {
      let url = HOSTURL + '/rulesrepo/' + JSON.stringify(rids) + '?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'
      let result = axios.delete(url)
        .then((response) => {
          if (response.status === 200) {
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
    catch (e) {
      console.log(e)
    }

    // Delete the selected rows
    gridApi.updateRowData({ remove: selectedRowData });
    this.setState({ successAlert: false, removeDecisionAlert: false })

    this.props.handleRule("REMOVERULES", keysArray)


  }
  deleteSelectedRows = () => {
    // Get a reference to the ag-Grid component
    const gridApi = this.gridApi;
    const selectedRowNodes = gridApi.getSelectedNodes();

    if (!selectedRowNodes.length) return
    this.setState({ removeDecisionAlert: true });
  }

  render() {
    // const { rowIndex, rowData } = this.state
    const rowData = this.props.allRulesRedux
    const { background } = this.context;
    const ruleCount = rowData.length;

    const links = [
      { label: 'Add', className: 'add square', onClick: this.addRowData },
      { label: 'Quick Add', className: 'fast forward', onClick: this.quickAddRowData },

      { label: 'Free Text', className: 'fast forward', onClick: this.quickAddFreeText },

      { label: 'Execute', className: 'paper plane', onClick: this.executeMultipleRules },
      { label: 'Refresh', className: 'refresh', onClick: this.reloadRulesFromDB },
      { label: 'Delete', className: 'remove', onClick: this.deleteSelectedRows },
    ]






    return (
      <div   >
        {this.alert()}



     

        <div className={`attributes-header ${background}`}
          style={{ display: 'block', }} >
          <IconLink links={links} />
        </div>

        <div className="ag-theme-alpine" id="myGrid" style={{ height: 1000, }}>
          <AgGridReact

            onRowClicked={(e) => {
              if (e.data) this.setState({ selectedCondition: e.data.parsed_rule, rowIndex: e.rowIndex })

            }
            }
            rowMultiSelectWithClick={true}
            onGridReady={this.onGridReady}
            getRowNodeId={this.getRowNodeId}
            detailRowAutoHeight={true}
            onCellClicked={this.onCellClicked}

            columnDefs={this.state.columnDefs}
            rowData={this.props.allRulesRedux}
            animateRows={true}
            masterDetail={true}

            groupSelectsChildren={true}

            detailCellRenderer={this.detailCellRenderer.bind(this)}
            groupDisplayType={groupDisplayType}
            gridOptions={gridOptions}

            // detailCellRendererParams={this.state.selectedCondition}

            defaultColDef={{
              flex: 1,
              minWidth: 200,
              filter: true,
              sortable: true,
              resizable: true,
              display: 'flex',
              'align-items': 'center'
            }}
            embedFullWidthRows={false}
            rowSelection={'multiple'}
            pagination={true}
            paginationPageSize={50}
            onFirstDataRendered={this.onFirstDataRendered.bind(this)}
            theme="alpine"
          />
        </div>

        {(this.state.showModalRule) && (<div>
          {this.addModalRule()}
        </div>)}

        {(this.state.freeTextShowModal) && (
          <div>
            <FreeTextModal open={true}
              handleRule={this.props.handleRule}
              closeModal={this.closeModal.bind(this)}
              onClose={this.closeModal.bind(this)}
              ruleId={"0"}
              handleAddFreeTextRule={this.handleAddFreeTextRule.bind(this)}
            />
          </div>
        )}


      </div>
    );
  }

}

RulesGrid.defaultProps = {
  ruleset: {},

  handleAttribute: () => false,
  handleDecisions: () => false,
  updatedFlag: false,
  updateState: () => false,
  loadRuleTypes: () => false,
  handleRule: () => false  // is being used to add, delete and update rules. Add is called from QuickRuleModal, delete from this RulesGrid and Update from the ruleeditor
}

RulesGrid.propTypes = {
  updateState: PropTypes.func,
  loadRuleTypes: PropTypes.func
}



const mapStateToProps = (state) => ({
  ruleset: state.ruleset.rulesets[state.ruleset.activeRuleset],
  allRulesRedux: state.ruleset.allRulesRedux, // gets all the rules pulled from the db and not from the ruleset.
  updatedFlag: state.ruleset.updatedFlag,
  facts: state.ruleset.rulesets[state.ruleset.activeRuleset],
  ruleType: state.ruleset.ruleType
});

const mapDispatchToProps = (dispatch) => ({
  addAllRulesRedux: (rules) => dispatch(addAllRulesRedux(rules)),
  handleAttribute: (operation, attribute, index) => dispatch(handleAttribute(operation, attribute, index)),
  handleDecisions: (operation, decision) => dispatch(handleDecision(operation, decision)),
  handleDebug: (operation, attribute, index) => dispatch(handleDebug(operation, attribute, index)),
  handleRule: (operation, rules) => dispatch(handleRule(operation, rules)),
  loadRuleTypes: () => dispatch(loadRuleTypes())
});

export default connect(mapStateToProps, mapDispatchToProps)(RulesGrid);





  // export default RulesGrid;