import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

function DraggableResizableComponent() {
  const [file, setFile] = useState(null);

  // Function to handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <Rnd
        default={{
          x: 0,
          y: 0,
          width: 200,
          height: 200,
        }}
        
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#ccc',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Uploaded"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          ) : (
            <span>Draggable and Resizable Component</span>
          )}
        </div>
      </Rnd>
    </div>
  );
}

export default DraggableResizableComponent;
