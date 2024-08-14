import React, { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Swal from 'sweetalert2';
import './App.css';
import CourseList from './components/CourseList'; // Import CourseList
import SearchCode from './search_code'; // Ensure this file exists

  function App() {
    return (
      <div className="App">
        <header className="App-header">
          <img src="logo.png" alt="Logo" className="App-logo" />
          <nav className="App-nav">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/search-code">Search Code</Link></li>
              <li><Link to="/nptel">NPTEL</Link></li>
              <li><Link to="/about-us">About Us</Link></li>
            </ul>
          </nav>
        </header>
        <main className="App-main1">
          <Routes>
            <Route path="/" element={<UploadFile />} />
            <Route path="/search-code" element={<SearchCode />} />
            <Route path="/nptel" element={<CourseList />} /> {/* Use CourseList here */}
            <Route path="/about-us" element={<div>About Us Page</div>} />
          </Routes>
        </main>   
      </div>
    );
  }

  function UploadFile() {
    const [fileName, setFileName] = useState(''); // File name state
    const [name, setName] = useState(''); // Name state
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setFileName(file ? file.name : '');
    };

    const handleNameChange = (event) => {
      setName(event.target.value);
    };

    const handleFileUpload = async (event) => {
      event.preventDefault();

      const formData = new FormData();
      const fileInput = event.target.elements.file;
      const file = fileInput.files[0];
      const randomNumber = Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000; // Random number between 1000 and 100000

      if (!file || !name) {
        Swal.fire({
          title: 'Error!',
          text: 'Please select a file and enter your name.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }

      formData.append('file', file);
      formData.append('name', name);
      formData.append('random_number', randomNumber.toString()); // Ensure it's a string

      setIsLoading(true); // Set loading to true

      try {
        const response = await fetch('https://server-m2mq.onrender.com/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json(); // Parse JSON response

        console.log('Server Response:', result); // Debugging line
        console.log('Response Status:', response.status); // Debugging line

        if (response.ok) {
          // Copy the random number to clipboard
          await navigator.clipboard.writeText(result.random_number.toString());

          // Show a SweetAlert2 dialog with both messages
          Swal.fire({
            title: 'Success!',
            text: `File "${fileName}" uploaded successfully! Your number is: ${result.random_number} (Copied to clipboard)`,
            icon: 'success',
            confirmButtonText: 'OK'
          });

          // Clear the form fields
          setFileName('');
          setName('');
          fileInput.value = ''; // Clear the file input
        } else {
          // Handle errors from the server
          Swal.fire({
            title: 'Failed!',
            text: `Failed to upload file: ${result.error || 'Unknown error'}`,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        console.error('Fetch Error:', error); // Debugging line
        Swal.fire({
          title: 'Error!',
          text: 'Error uploading file.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setIsLoading(false); // Set loading to false
      }
    };

    return (
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Upload File</h1>
        <form className="space-y-6" onSubmit={handleFileUpload}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <div className="mt-1">
              <input
                id="name"
                placeholder="Enter your name"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                type="text"
                name="name"
                value={name}
                onChange={handleNameChange} // Handle name change
              />
            </div>
          </div>
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">File</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Upload a file</span>
                    <input
                      id="file"
                      className="sr-only"
                      type="file"
                      name="file"
                      onChange={handleFileChange} // Handle file change
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">Any file type </p>
                {fileName && <p className="text-xs text-gray-500 mt-2">Selected file: {fileName}</p>}
              </div>
            </div>
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              {isLoading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    );
  }

  export default App;
