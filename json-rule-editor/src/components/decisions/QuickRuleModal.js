import React, { useState } from 'react';
import './index.css'
import NameValueTable from './NameValueTable'
import ReactJson from 'react-json-view'

// Action Request sent
// [{"RCPT_TOT":"RCPT_TOT"},{"PAY_ANN":"RCPT_TOT*4"}]

import { Modal, Button, Icon, Checkbox, Loader, Form, Table, Input, TextArea, Label, Dropdown, Select } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import { green } from '@mui/material/colors';
import { MarkAsUnread } from '@mui/icons-material';
// import {
//     processEngine,
//     updateParsedRules,
// } from "../../validations/rule-validation";

import { processEngine, processEngineValidate, updateParsedRules, validateRuleset } from '../../validations/rule-validation';

const HOSTURL = "http://localhost:8000";




const QuickRuleModal = (props) => {

    const handleRule = props.handleRule


    const [ruleName, setRuleName] = useState(props.ruleName);
    const [conditionstring, setConditionstring] = useState(props.conditionstring);
    const [loading, setLoading] = useState(true);
    const [conditionResult, setConditionResult] = useState({});
    const [actionTestResult, setActionTestResult] = useState({});

    const [responseVariables, setResponseVariables] = useState(props.responseVariables);
    const [ruleType, setRuleType] = useState(props.ruleType);
    const [compute, setCompute] = useState(props.compute);
    const [priority, setPriority] = useState(props.priority);
    const [message, setMessage] = useState(props.message);
    const [ruleTypes, setRuleTypes] = useState(props.ruleTypes);
    const [facts, setFacts] = useState(props.facts || {})
    const [parseSuccess, setParseSuccess] = useState(false)


    const [ruleNameError, setRuleNameError] = useState('');

    const [aiDescribe, setAiDescribe] = useState("")
    // have 2 modal switchable windows. 
    // First one is for the record add/update, its state value = 'create'
    // second one is for results the state value = 'result'

    const [currentModal, setCurrentModal] = useState("create");

    const [ruleId, setRuleId] = useState(0);




    const ridOptions = [
        { key: '1', text: '1', value: '1' },
        { key: '2', text: '2', value: '2' },
        { key: '3', text: '3', value: '3' },
        { key: '4', text: '4', value: '4' }
    ];


    // testRuleResult
    const [testRuleResult, setTestRuleResult] = useState('....');

    const [network, setNetwork] = useState(false);
    const [attended, setAttended] = useState(true);
    const [selectedRid, setSelectedRid] = useState([]);
    const [addOnFacts, setAddOnFacts] = useState('');
    const [nameValuePairs, setNameValuePairs] = useState([{ name: 'Workflow', value: "Please wait..." }]);



    const convertRuleTestToTable = (obj) => {
        const { workflowId, rules, facts, elapsedTime, deltaFacts } = obj;
        const valid = rules.valid;
        const invalid = rules.invalid;
        let deltaFactValues = []


        const messages = valid.map((item) => item.message);
        const invalidMessage = invalid.map((item) => item.message);
        // const computedRVs = [];



        let computedRVS = valid.map(v =>v.computedRVS)

        let allRvs = ''
        computedRVS.map(cv => allRvs += JSON.stringify(cv))


        // if (rules.computedRVS)
        //     Object.keys(rules.computedRVS).forEach((key) => {
        //         computedRVs.push(rules.computedRVS[key]);
        //     });
        const factValues = (facts) ? facts.map((item) => item.value) : [];

        if (deltaFacts)
            deltaFactValues = JSON.stringify(deltaFacts)// .map((item) => item.value);


        setNameValuePairs([{ name: 'Workflow', value: workflowId },
        { name: 'Time(ms)', value: elapsedTime},
        { name: 'Status', value: valid.length > 0 },
        { name: 'Messages', value: messages },
        { name: 'Computed', value: allRvs },
        {name: 'Facts', value: JSON.stringify(combineAllFacts())},
        { name: 'Delta Facts', value: deltaFactValues }
        ])


        
    };



    const handleChangeConditionString = (e) => {
        setConditionstring(e.target.value)
        // await callAITrackVariablesFromConditions()

    }

    const handleNetworkChange = (e, { checked }) => {
        setNetwork(checked);
    };

    const handleAttendedChange = (e, { checked }) => {
        setAttended(checked);
    };

    const handleRidChange = (e, { value }) => {
        setSelectedRid(value);
    };

    const handleAddOnFactsChange = (e, { value }) => {
        setAddOnFacts(value);
    };


    const cleanupString = (str) => { return str.replace(/[^\x20-\x7E]/g, "").trim(); }


    const combineAllFacts  = () =>{
       return( {...{"reporting_id" : "3010008883"},...facts, ...stringToAddOnFacts(addOnFacts)})
    }


    const testRule = async () => {
        // collect the network, attended, additionalfacts, and array of rids. And call the process rule function.   
        // let facts = {}
        // facts.reporting_id = "3010008883" // In case no facts are given

        // // If there are any addy on facts, get the addon and append to facts
        // facts = {...facts, ...(stringToAddOnFacts(addOnFacts))}

        let allFacts = combineAllFacts()

        // if no facts are given, some rid should be provided.  Ensure rule is tested with some facts available

        let rule = [getRule()]
        let result = await processEngineValidate([allFacts], rule, attended, network)

        setTestRuleResult(JSON.stringify(result))
        convertRuleTestToTable(result)
        

    }


    const getRule = () => {
        let action = stringToJSON(computeString)
        let ruleId = props.ruleId

        let event = {
            ruleId, active: true, name: ruleName, actionType: 'impute', validationType: ruleType,
            rulePriority: priority, params: {
                rvs: JSON.stringify[responseVariables], rvsJSON: responseVariables,
                action, message, apiSource: {}, actionType: "impute", apiChecked: false
            },
            type: ruleId
        }

        let conditions = {
            "all": [
                {
                    "fact": "checkCondition",
                    "path": "$.value",
                    "operator": "equal",
                    "value": true,
                    "params": { conditionstring }
                }
            ]
        };

        let r = { index: -1, event, conditions }
        return r

    }

    const saveRuleToDbAndRedux = async function (e) {
        e.preventDefault()
        let r = getRule()
        let data = {
            parsed_rule: r,
            active: true,
            type: ruleType,
            data: r,
            description: aiDescribe,
            name: ruleName,
            id: props.ruleId,
        };

        // write to the db
        let result = await updateParsedRules(data);
        // handleRule is a prop that was passed rom RulesGrid. It will add/delete/update any rule given the index.

        handleRule("ADD", result[0])
        let resultId = result.length > 0 ? result[0].id + '' : ''
        alert("Rule " + resultId + " was successfully deployed");

        props.closeModal()


    }







    const generateApiDescription = () => {
        // const { apiChecked, apiSource } = this.state;
        //   (!apiChecked)
        return "No api has been defined.";
        // return "API end point is: " + JSON.stringify(apiSource);
    }
    const generateDescription = () => {


        // If:
        let description =
            "Express this: Rule " +
            ruleName +
            ". If " +
            conditionstring +
            " then send a message: " +
            message +
            " and track these facts: " +
            JSON.stringify(responseVariables) +
            ". Also perform the following actions, if the rule is successful:" +
            computeString +
            ". " +
            "It has a priority of " +
            priority +
            " on a scale of 1-10." +
            generateApiDescription() + " This rule was created at " + new Date();


        return description;
    },




        callAIDescribe = async () => {
            let url =
                HOSTURL +
                "/openai/aicomplete?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false";
            // get the string you want to process and update
            let str = generateDescription();
            // now call axios post and once you get the value
            let valueFromAI = await axios.post(url, { conditionstring: str });

            // update the value of the state parameter.
            setAiDescribe(valueFromAI.data.trim());
        };



    const callAITrackVariablesFromConditions = async () => {
        let url =
            HOSTURL +
            "/openai/aicomplete?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false";

        // now call axios post and once you get the value
        let valueFromAI = await axios.post(url, { conditionstring: 'Find the variables in the string and return it as a semicolon and new line delimited  expressions:   ' + conditionstring });

        // update the value of the variables to track
        setAddOnFacts(valueFromAI.data.trim().replace("let", ''))
    };

    const equations = props.compute.map(obj => {
        const key = Object.keys(obj)[0];
        return `${key} = ${obj[key]}`;
    }).join('; ');



    const stringToAddOnFacts = (str) => {
        let arr = str.split(";");
        let json = {};
        for (let i = 0; i < arr.length; i++) {
            const equation = arr[i];
            const [key, val] = equation.split("=");

            if(key)
            json = { ...json, ...{ [cleanupString(key)]: cleanupString(val) } }

        }
        return json;
    }



    // function to convert string of equations to JSON array
    const stringToJSON = (str) => {
        let arr = str.split(";");
        let json = [];
        for (let i = 0; i < arr.length; i++) {
            const equation = arr[i];
            const [key, val] = equation.split(/(?<=^[^\=]+)\=/) //split("=");

     
            json.push({ [cleanupString(key)]: cleanupString(val.replace(" eq ", "=")) });
        }
        return json;
    }

    const [computeString, setComputeString] = useState(equations)

    const [ruleTypeOptions, setRuleTypeOptions] = useState(props.ruleTypes.map((type) => ({ key: type.type, value: type.type, text: type.type })))



    const handleSubmit = (e) => {
        e.preventDefault();
        // handle form submission here
        props.closeModal()
    };

    const validateQuickAdd = async (e) => {
        e.preventDefault();


        let rule = {
            ruleId: props.ruleId,
            name: ruleName,
            computeString,
            conditionstring,
            message,
            compute: stringToJSON(computeString)
        }
        let action = JSON.stringify(stringToJSON(computeString))
        // Call testcondition
        let urlForCondition = HOSTURL +
            "/rulesrepo/testcondition?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false";

        let result = await axios.post(urlForCondition, { facts: [facts], conditionstring })

        setConditionResult(result.data)
        setParseSuccess(result.data.parseSuccess)

        if (!result.data.parseSuccess) setRuleNameError(result.data.ruleResult)
        else setRuleNameError(result.data.value)



        // Call Action test and set it to actionTestResult
        let urlForCompute = HOSTURL +
            "/rulesrepo/actiontest?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false";

        result = await axios.post(urlForCompute, { facts: [facts], action })
        setActionTestResult(result.data)


        // Show the result modal window
        if (result.data) setCurrentModal("result")
       
         // call describe
       await  callAIDescribe()

        props.handleDebug('ADD', { label: 'time', data: { rule, conditionResult, actionTestResult, facts } }, 0)
    };

    const handleComputeChange = (e) => {
        e.preventDefault();
        setCompute(e.target.value)
    }

    return (
        <Modal className="rule-modal"
            style={
                {
                    height: '700px',
                    // modal: {
                    marginTop: '0px !important',
                    marginLeft: '40px',
                    marginRight: 'auto'
                    // }
                }
            }


            open={props.open} onClose={props.onClose}>


            {/* <>
            <Loader active style={{ visibility: loading ? 'visible' : 'hidden' }} />
            </> */}


            {currentModal === "create" && (
                <>
                    <Modal.Header>{props.ruleId == 0 ? 'Add New Rule': 'Edit Rule:' +props.ruleId}</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', padding: '20px' }}>
                                <div style={{ width: "50%" }}>

                                    <Dropdown button
                                        className='icon'
                                        floating
                                        labeled
                                        icon='folder open'
                                        options={ruleTypeOptions}
                                        label='Save...'
                                        search
                                        text={ruleType}
                                        onChange={(e, { value }) => setRuleType(value)}
                                    />
                                    <Label as='a' tag>
                                        Save As...
                                    </Label>
                                </div >
                                <div >

                                    <Dropdown button
                                        className='icon'
                                        label='Priority'
                                        floating
                                        labeled
                                        icon='tasks'
                                        options={[...Array(10).keys()].map((num) => ({ key: num + 1 + '', value: num + 1 + '', text: num + 1 + '' }))}
                                        search
                                        text={priority}
                                        onChange={(e, { value }) => setPriority(value)}
                                    />
                                    <Label as='a' color='gray' tag>
                                        Priority
                                    </Label>
                                </div>

                            </div>


                            <Label as='a' color='gray' >
                                1. Name the rule
                            </Label>

                            <Form.Field
                                control={TextArea}
                                // label="Rule Name"
                                placeholder="Enter a rule name"
                                maxLength={80}
                                value={ruleName}
                                onChange={(e) => setRuleName(e.target.value)}
                            />


                            <Label as='a' color='gray' >
                                2. Condition
                            </Label>
                            <Form.Field
                                control={TextArea}
                                // label="Condition"
                                placeholder="Enter a condition"
                                value={conditionstring}
                                onChange={handleChangeConditionString}
                            />
                            {ruleNameError && <span className='error-message'>{ruleNameError}</span>}
                            <div></div>
                            <Label as='a' color='gray' >
                                3. Track
                            </Label>

                            <Form.Field
                                control={Input}
                                // label="Response Variables"
                                placeholder="Enter response variables, separated by commas"
                                value={responseVariables.join(';')}
                                onChange={(e) => setResponseVariables(e.target.value.split(';'))}
                            />
                            <Label as='a' color='gray' >
                                4. Actions
                            </Label>
                            <Form.Field
                                control={TextArea}
                                // label="Compute"
                                placeholder="Enter compute expressions, one per line"
                                value={computeString}
                                // onChange={handleComputeChange}
                                onChange={(e) => setComputeString(e.target.value)}
                            />
                            <Label as='a' color='gray' >
                                5. Message
                            </Label>
                            <Form.Field
                                control={Input}
                                // label="Message"
                                placeholder="Enter a message"
                                maxLength={400}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <Modal.Actions>
                                <Button onClick={() => props.closeModal()}>
                                    <Icon name='cancel' />Cancel
                                </Button>

                                <Button onClick={validateQuickAdd}>
                                    <Icon name='tasks' /> Validate
                                </Button>

                                {/* <Button onClick={() => props.closeModal()}>
                            <Icon name='save' /> Save
                        </Button> */}
                            </Modal.Actions>






                        </Form >
                    </Modal.Content >
                </>
            )}
            {currentModal === "result" &&
                (

                    <>
                 
                        <Modal.Header>{props.ruleId == 0 ? 'Validate New Rule': 'Validate Rule: ' +props.ruleId}</Modal.Header>
                        <Modal.Content>
                            <Form>
                                <Form.Field>
                                    <label>Rule Name</label>
                                    <Input
                                        value={ruleName}
                                        onChange={(e) => setRuleName(e.target.value)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Status</label>
                                    <Checkbox
                                        checked={parseSuccess}
                                        //   onChange={(e) => setParseSuccess(e.target.checked)}
                                        label={parseSuccess ? 'Success' : 'Failed'}
                                        color={parseSuccess ? 'green' : 'red'}
                                    />
                                </Form.Field>
                                {parseSuccess && <span className='message'>{conditionResult.message}<br></br>
                                    {conditionResult.ruleResult}
                                </span>}
                                {!parseSuccess && <span className='error-message'>{conditionResult.message}<br></br>{ruleNameError}</span>}

                                <Table>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Key</Table.HeaderCell>
                                            <Table.HeaderCell>Value</Table.HeaderCell>
                                            <Table.HeaderCell>Expression</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {actionTestResult.map((result) => (
                                            <Table.Row key={result.key}>
                                                <Table.Cell>{result.key}</Table.Cell>
                                                <Table.Cell>{result.value}</Table.Cell>
                                                <Table.Cell>{result.expression}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                                <Form.Field>
                                    <label>Describe</label>
                                    <TextArea style={{ height: '200px' }}
                                        value={aiDescribe}
                                        onChange={(e) => setAiDescribe(e.target.value)}
                                    />
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button onClick={() => setCurrentModal("create")}>Back</Button>
                            <Button primary disabled={!parseSuccess} onClick={async () => {
                                setCurrentModal("submitrule");
                                await callAITrackVariablesFromConditions()
                            }

                            }>
                                Test
                            </Button>
                            <Button primary disabled={!parseSuccess} onClick={saveRuleToDbAndRedux}>
                                Submit
                            </Button>
                        </Modal.Actions>
                    </>


                )
            }
            {currentModal === "submitrule" &&
                <>
                    <Modal.Header>{props.ruleId == 0 ? 'Test New Rule': 'Test Rule: ' +props.ruleId}</Modal.Header>
                     
                    <Modal.Content>
                        <div>
                            <Checkbox
                                label="Attended"
                                checked={attended}
                                onChange={handleAttendedChange}
                            />

                            <Checkbox
                                label="Network"
                                checked={network}
                                onChange={handleNetworkChange}
                            />
                            <div>
                            <Label as='a' color='gray' >
                             Condition
                            </Label>
                            <Form.Field>

                                <TextArea style={{ height: '60px', width: '100%' }}
                                    value={conditionstring}

                                />
                            </Form.Field>
                            </div>



                            <Label as='a' color='gray' >
                                Dataset
                            </Label>


                            
                            <Dropdown
                                label="Select RID"
                                placeholder="Select RID"
                                fluid
                                // multiple
                                selection
                                options={[{key:1, text: props.factsName, value: props.factsName}]}
                                onChange={handleRidChange}
                                value={props.factsName}//{selectedRid}
                            />

                            <Label as='a' color='gray' >
                                Simulated Facts
                            </Label>
                            <Form.Field>

                                <TextArea style={{ height: '100px', width: '100%' }}
                                    value={addOnFacts}
                                    onChange={handleAddOnFactsChange}
                                />
                            </Form.Field>


                            <Label as='a' color='gray' >
                                Test Result
                            </Label>
                            {/* <Form.Field>

                                <TextArea style={{ height: '100px', width: '100%' }}
                                    value={testRuleResult}
                                    // onChange={handleAddOnFactsChange}
                                />
                            </Form.Field> */}
                            <NameValueTable nameValuePairs={nameValuePairs}/>
                            {/* <ReactJson displayObjectSize={false} key={'resultdebug'} displayDataTypes={false} collapsed={false}
                                src={nameValuePairs} /> */}

                            {/* <Form.Field
                                control={TextArea}
                                // label="Rule Name"
                                placeholder="Enter additional facts..."
                               
                                value={addOnFacts}
                                onChange={handleAddOnFactsChange}
                            /> */}




                        </div>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => setCurrentModal("result")}>Back</Button>
                        <Button onClick={() => setCurrentModal("create")}>Home</Button>
                        <Button primary disabled={!parseSuccess} onClick={testRule}>Test</Button>
                        <Button primary disabled={!parseSuccess} onClick={saveRuleToDbAndRedux}>
                            Submit
                        </Button>
                    </Modal.Actions>
                </>

            }



        </Modal >
    );
};

export default QuickRuleModal

/*

import React, { useState } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';

const ModalWorkflow = () => {
  const [currentModal, setCurrentModal] = useState(1);

  const handleNextModal = () => {
    // Validate current modal form here
    if (valid) {
      setCurrentModal(currentModal + 1);
    }
  };

  const handlePreviousModal = () => {
    setCurrentModal(currentModal - 1);
  };

  return (
    <Modal open={true}>
      {currentModal === 1 && (
        <>
          <Modal.Header>Modal 1</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input label="Name" placeholder="Enter your name" />
              <Form.Input label="Email" placeholder="Enter your email" />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleNextModal}>Next</Button>
          </Modal.Actions>
        </>
      )}
      {currentModal === 2 && (
        <>
          <Modal.Header>Modal 2</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input label="Address" placeholder="Enter your address" />
              <Form.Input label="Phone" placeholder="Enter your phone number" />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handlePreviousModal}>Back</Button>
            <Button onClick={handleNextModal}>Next</Button>
          </Modal.Actions>
        </>
      )}
      {currentModal === 3 && (
        <>
          <Modal.Header>Modal 3</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input label="City" placeholder="Enter your city" />
              <Form.Input label="Country" placeholder="Enter your country" />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handlePreviousModal}>Back</Button>
            <Button>Submit</Button>
          </Modal.Actions>
        </>
      )}
    </Modal>
  );
};

export default ModalWorkflow;
*/