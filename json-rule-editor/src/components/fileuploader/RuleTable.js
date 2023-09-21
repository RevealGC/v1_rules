import React, { useState } from 'react';
// import { Button, CircularProgress } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
// import APIReq from "services/api";
import axios from 'axios';
const RuleTable = ({ data }) => {

  const [isTableError, setIsTableError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useState(() => {
    data.find(row => row.output.error && setIsTableError(true));
  });

  const saveRules = async () => {
    setIsSaving(true);
    try {
      // Todo
      awaitaxios.post(`http://localhost:8000/save_csv`, csvData)
      setIsSaved(true);
    } catch (error) {
      console.error('Error saving rules:', error);
      alert('Error saving rules');
    } finally {
      setIsSaving(false);
    }
  };

  const columnDefs = [
    { headerName: "#", valueGetter: "node.rowIndex + 1", width: 50 },
    { field: 'name', headerName: 'Name' },
    { field: 'ruleType', headerName: 'Type' },
    { field: 'conditionstring', headerName: 'Condition' },
    { field: 'actionDisplay', headerName: 'Action' },
    {
      field: 'output.message',
      headerName: 'Error Message',
      cellStyle: params => params.data.output.error ? { color: 'red' } : {}
    },
    { field: 'rule.event.rulePriority', headerName: 'Priority' },
  ];

  if (isSaved) {
    return (
      <div style={{ display: "flex", justifyContent: "center", margin: "48px 0" }}>
        <h2>Rules saved</h2>
      </div>
    );
  }

  return (
    <>
      {!isTableError && (
        <div style={{ display: "flex", justifyContent: "end", margin: "8px 0" }}>
          <button style={{ width: "96px" }} onClick={saveRules} variant="contained" color="primary">
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
        />
      </div>
    </>
  );
}

export default RuleTable;