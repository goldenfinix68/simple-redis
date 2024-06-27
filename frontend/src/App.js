import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    const fetchLayout = async () => {
      try {
        const response = await axios.get('http://localhost:8080/');
        console.log(response);
        setLayout(response.data)
      } catch (err) {
        console.log('Error fetching layout: ', err);
      }
    }

    fetchLayout();
  }, []);

  return (
    <div className="App">
      {layout}
    </div>
  );
}

export default App;
