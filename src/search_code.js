import React, { useEffect, useState } from 'react';
import './search_code.css';

// Debounce function to delay search input processing
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Function to extract file extension from MIME type
const getFileExtension = (mimeType) => {
  if (!mimeType) return 'unknown'; // Default value when mimeType is undefined

  switch (mimeType) {
    case 'application/pdf':
      return 'pdf';
    case 'application/msword':
      return 'doc';
    case 'application/vnd.ms-excel':
      return 'xls';
    case 'image/png':
      return 'png';
    case 'image/jpeg':
      return 'jpg';
    // Add more cases as needed
    default:
      return mimeType.split('/')[1] || mimeType;
  }
};

const SearchHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  
  // Default number to use when the search query is empty
  const defaultNumber = '46344';

  // Function to fetch data from the server
  const fetchData = debounce(async (query) => {
    try {
      const numberToSearch = query.trim() === '' ? defaultNumber : query;
      const response = await fetch(`https://server-m2mq.onrender.com/api/files/search?random_number=${numberToSearch}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, 300); // Debounce delay of 300ms

  // Handle search query change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchData(query); // Trigger search with debounce
  };

  // Use default number when component mounts if searchQuery is empty
  useEffect(() => {
    fetchData(searchQuery);
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Unlock Your Files: Instant URL Conversion</h1>
        <p className="text-muted-foreground">Search and download files from our extensive database.</p>
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search for a file..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
          />
        </div>
      </div>
      <div className="mt-8 space-y-4">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">File Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">Person Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {results.map((file, index) => (
                <tr key={index} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 font-medium">{file.file}</td>
                  <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0">{file.name}</td>
                  <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0">{new Date(file.date).toLocaleDateString()}</td>
                  <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 flex items-center gap-2">
                    <a
                      href={`https://server-m2mq.onrender.com/uploads/${file.file}`}
                      className="action-button download-button"
                      target="_blank"
                      download
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon download-icon">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" x2="12" y1="15" y2="3"></line>
                      </svg>
                    </a>
                    <a
                      href={`https://server-m2mq.onrender.com/uploads/${file.file}`}
                      className="action-button view-button"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon view-icon">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
