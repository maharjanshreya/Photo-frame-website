import './App.css';

function App() {
  const imageStyle = {
    width: '300px', // Set the desired width
    height: '200px', // Set the desired height
  };

  return (
    <div className="App">
      {/*<header className="App-header">
         <img src={logo} className="App-logo" alt="logo" /> 
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        
      </header>*/}
      <h1>Photo Frames</h1>
      <div className='flex-container'>
        <div className="flex-item"><img src="https://www.ikea.com/us/en/images/products/silverhoejden-frame-gold__0638523_pe698987_s5.jpg" alt="A sample image" style={imageStyle} /></div>
        <div className="flex-item"><img src="https://www.ikea.com/us/en/images/products/silverhoejden-frame-gold__0638523_pe698987_s5.jpg" alt="A sample image" style={imageStyle} /></div>
        <div className="flex-item"><img src="https://www.ikea.com/us/en/images/products/silverhoejden-frame-gold__0638523_pe698987_s5.jpg" alt="A sample image" style={imageStyle} /></div>
        <p>Hello,p</p>
      </div>

    </div>
  );
}

export default App;
