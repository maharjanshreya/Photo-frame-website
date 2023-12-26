import React, { useState } from 'react';
import Navbar from './adminNavbar';
import Stack from 'react-bootstrap/Stack';

function Dashboard() {
  const [selectedOption, setSelectedOption] = useState('Create Category');
  const [activeOption, setActiveOption] = useState('Create Category');
  return (
    <div style={{ display: 'flex' }}>
      {/* Navbar on the left */}
      <div>
        <Navbar />
      </div>
      <div style={{ flex: 1 }}>
        {/* Content on the right */}
        <div style={{ marginLeft: '250px', padding: '20px' }}>
          <div className='d-flex'>
            <div className='admin-panel'>
              <h4 className="header-text" style={{color: '#426751'}}>Admin Panel</h4>
              <Stack gap={0} className='stack'>
                <div
                  className={`p-2 ${selectedOption === 'Create Category' ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedOption('Create Category');
                    setActiveOption('Create Category');
                  }}
                >
                  Create Category
                </div>
                <div
                  className={`p-2 ${selectedOption === 'Create Product' ? 'active' : ''}`}
                  onClick={() => {setSelectedOption('Create Product');
                  setActiveOption('Create Product');
                  }}
                >
                  Create Product
                </div>
                <div
                  className={`p-2 ${selectedOption === 'Users' ? 'active' : ''}`}
                  onClick={() => {setSelectedOption('Users');
                  setActiveOption('Create Product');}}
                >
                  Users
                </div>
              </Stack>
            </div>
            <div>
              {/* Render content based on selected option */}
              {selectedOption === 'Create Category' && (
                <div>
                  <h4 className='header-text' style={{color: '#444141'}}>Manage Category</h4>
                  <form>
                    <input type='text' placeholder='Enter your category' className='category'/>
                    <input type='submit' value="Add" />
                  </form>
                </div>
              )}
              {selectedOption === 'Create Product' && (
                <div>Manage Product</div>
              )}
              {selectedOption === 'Users' && <div>Manage Users</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
