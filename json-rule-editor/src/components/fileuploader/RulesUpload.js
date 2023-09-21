import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
// import RuleTable from './RuleUpload.js';

function saveCSV(csvData) {
    axios.post(`${rulesBaseEndpoint}/save_csv`, csvData)
}

function uploadCSV(csvData){
    axios.post(`${rulesBaseEndpoint}/upload_csv`, csvData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}




function RulesUpload() {
    const [uploadResult, setUploadResult] = useState(null); // [1

    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('csv', file);

            try {
                // Make a POST request to the specified URL with the selected file
                const result = await uploadCSV(formData);

                // Optionally, you can handle success or show a message to the user
                setUploadResult(result.data.validateRules.results);
            } catch (error) {
                // Handle any errors that occur during the upload process
                console.error('Error uploading file:', error);
                alert('Error uploading file');
            }
        }
    };

    return (
        <>
            {/* {uploadResult && (
                <RuleTable data={uploadResult} />
            )} */}
            {!uploadResult && <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '48px'
            }}>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="file-input"
                />
                <label htmlFor="file-input">
                    <Button
                        variant="outlined"
                        color="primary"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload CSV
                    </Button>
                </label>
            </div>}
        </>
    );
}

export default RulesUpload;