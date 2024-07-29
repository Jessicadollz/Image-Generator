import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const token = "677a85ca2amsh918a6d32fe5c1bep15b3dejsn43de075a92a6";

  async function query() {
    setLoading(true);
    setImageSrc('./src/assets/loading-icon.gif');

    const inputText = inputRef.current.value;
    console.log("Input Text:", inputText);  // Debug: Log input text

    try {
      const response = await axios.post(
        "https://ai-text-to-image-generator-api.p.rapidapi.com/realistic",
        { inputs: inputText },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-RapidAPI-Key": token,  // Adding RapidAPI Key if needed
            "X-RapidAPI-Host": "ai-text-to-image-generator-api.p.rapidapi.com"  // Adding RapidAPI Host if needed
          }
        }
      );

      console.log("Response Data:", response.data);  // Debug: Log response data
      setLoading(false);
      return response.data;

    } catch (error) {
      setLoading(false);
      if (error.response) {
        console.error("Response Status:", error.response.status);  // Debug: Log response status
        console.error("Response Data:", error.response.data);  // Debug: Log response data
        alert(`Error: ${error.response.status} - ${error.response.data}`);
      } else {
        console.error("Error Message:", error.message);  // Debug: Log error message
        alert(`Error: ${error.message}`);
      }
      return null;
    }
  }

  const handleClick = async () => {
    const response = await query();
    if (response && response.url) {
      console.log("Image URL:", response.url);  // Debug: Log image URL
      setImageSrc(response.url);
    } else {
      setImageSrc('');  // Clear image if there was an error
    }
  };

  return (
    <>
      <h1>Text 2 Image Generator</h1>
      <br />
      <div className="container">
        <label htmlFor="text_input" >Create an image from text prompt: </label>
        
        <input type="text" id="text_input" ref={inputRef} placeholder='Enter Text Here...'/>
        
        <button id="btn" onClick={handleClick} disabled={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </button> <br />
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Generated"
            id="image" style={{ height: "250px", width: "250px" }}
            onError={() => {
              console.error("Error loading image");  // Debug: Log image load error
              setImageSrc('');  // Clear image if there was an error
            }}
          />
        )}
      </div>
    </>
  );
}

export default App;
