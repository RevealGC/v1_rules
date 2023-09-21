import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Modal, Button, Icon, Form, Input, Dropdown, TextArea, Checkbox, Select } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';



function MultiselectRID(props) {
  const [ridsForProcessing, setRidsForProcessing] = useState([]);
  const [inputValue, setInputValue] = useState(''); // is the search string. 
  const [options, setOptions] = useState([]);
  const [debouncedValue, setDebouncedValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);


  
//   const HOSTURL='http://localhost:8000/reporting_unit/findRID?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'
  useEffect(() => {
    if ((debouncedValue !== undefined) && debouncedValue !== '' && debouncedValue.length > 3) {
        const RIDSURL=`http://localhost:8000/reporting_unit/findRID/${debouncedValue}?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false`
        axios.get(RIDSURL)
      .then(response => {
        setOptions(response.data);
        // setDropdownOpen(true)
      })
      .catch(error => {
        console.log(error);
      });
    }
  }, [debouncedValue]);

  const handleChange = (event) => {
    setRidsForProcessing(event.target.selectedOptions);
  };

  const handleInputChange = (event) => {
    event.preventDefault(); 
    setInputValue(event.target.value);
  };

  // Call navigation-panels loadRuleSet function
  const loadRuleSetForRid = async (event) =>{
    event.preventDefault(); 
    await props.loadRuleSet(inputValue)
  }


  const  optionsList= options.map((option) => ({ key: option.ent_id, 
    value: option.ent_id, 
    text: option.value
  
  }))
 
   
  const handleOptionClick = (event, payload) => {
    event.preventDefault(); 
    props.loadRuleSet(payload.value);
    console.log(payload)
    setInputValue(payload.value);
    setDebouncedValue(payload.value)  
   
  };


  const handleSearchTextChange = (event, { value }) => {
      event.preventDefault(); 
            setInputValue(event.target.value)
            console.log(event.target)
            setDebouncedValue(event.target.value )  
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(inputValue);
   
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue]);

/**
 * 
 * Will return a drop down. 
 * Drop down input text field will be the inputValue which is set by the onChangeEvent of the drop down
 * the onChange event will call handleSearchText. 
 * Handle searchTextChange will set the input value to the input field
 * 
 * Use effect should kick in with input value change and will load the optionsList 
 * 
 * 
 */


  return (
    <div style={{width:'300px',}}>
    <Dropdown button
    style={{width:'300px', height:'40px'}}
    className='icon'
    floating
    label={"Choose from"}
    labeled
    icon='world'
    options={optionsList}
    search
    text={inputValue}
    onChange={handleOptionClick}
      onSearchChange={handleSearchTextChange}
  />
</div>
);
}
export default MultiselectRID;

