import React, { useState, useEffect, useRef } from 'react';
import { TiMessages } from 'react-icons/ti';

const AIAssistantForm = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://shoolschatapi.pythonanywhere.com/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: query }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response || 'No response received.');
      setQuery('');  // Clear the query after submitting
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setResponse('Error fetching response. Please try again.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setIsFormVisible(false);
      }
    };

    if (isFormVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFormVisible]);

  return (
    <div className="fixed bottom-0 right-0 m-4 p-4 z-50">
      {isFormVisible ? (
        <div ref={formRef} className="fixed bottom-0 right-0 m-4 p-4 bg-white shadow-lg rounded-lg md:w-96">
          {response && <div className="max-h-72 overflow-y-auto p-5 text-sm text-gray-800 mb-5">{response}</div>}
          <form onSubmit={handleSubmit}>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows="3"
              className="w-full p-2 border rounded-md"
              placeholder="Ask me your question here..."
            />
            <button type="submit" className="mt-2 bg-main3 text-white p-2 rounded-md">Ask</button>
          </form>
        </div>
      ) : (
        <button onClick={() => setIsFormVisible(true)} className="flex items-center justify-center w-12 h-12 bg-main3 text-white rounded-full">
          <TiMessages className="text-2xl" />
        </button>
      )}
    </div>
  );
};

export default AIAssistantForm;
