import React, { useState } from 'react';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState(null);
  const [filters, setFilters] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = async () => {
    setError('');
    try {
      const parsedData = JSON.parse(jsonInput);
      setShowDropdown(true);
      const apiResponse = await callApi(parsedData);
      setResponse(apiResponse);
    } catch (err) {
      setError('Invalid JSON input. Please correct it.');
    }
  };

  const callApi = async (data) => {
    const apiUrl = 'http://localhost:3000/bhfl'; // Replace with your API endpoint
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.json();
  };

  const handleFilterChange = (event) => {
    const { options } = event.target;
    const selectedOptions = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFilters(selectedOptions);
  };

  const filteredResponse = () => {
    if (!response) return null;
    const filteredData = {};

    // Collect filtered data based on selected filters
    filters.forEach(filter => {
      if (filter === 'alphabets') {
        filteredData.alphabets = response.alphabets || [];
      }
      if (filter === 'numbers') {
        filteredData.numbers = response.numbers || [];
      }
      if (filter === 'highestLowercase') {
        // Return the character instead of an array
        filteredData.highest_lowercase = response.highest_lowercase_alphabet[0] || ''; // Get the first element or empty string
      }
      if (filter === 'fileType') {
        filteredData.fileResult = {
          file_valid: response.fileResult.file_valid,
          file_mime_type: response.fileResult.file_mime_type,
          file_size_kb: response.fileResult.file_size_kb,
        };
      }
    });

    return filteredData;
  };

  return (
    <div className="container">
      <h1>JSON Input and API Response</h1>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder="Enter valid JSON here..."
      />
      <button onClick={handleSubmit}>Submit</button>
      {error && <div className="error">{error}</div>}

      {showDropdown && (
        <div>
          <select multiple onChange={handleFilterChange}>
            <option value="alphabets">Alphabets</option>
            <option value="numbers">Numbers</option>
            <option value="highestLowercase">Highest Lowercase Alphabet</option>
            <option value="fileType">File Type</option>
          </select>
          <button onClick={() => setResponse(filteredResponse())}>Filter Response</button>
        </div>
      )}

      {response && (
        <div id="responseContainer">
          <h2>Filtered Response:</h2>
          <pre>{JSON.stringify(filteredResponse(), null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
