  import React, { useState,useEffect } from 'react';
  import Navbar from './adminNavbar';
  import Stack from 'react-bootstrap/Stack';

  import  {FiEdit} from "react-icons/fi";    
  import {MdDeleteOutline} from "react-icons/md";

  function Dashboard() {
    const [selectedOption, setSelectedOption] = useState('Create Category');
    const [activeOption, setActiveOption] = useState('Create Category');
    const [deleteId, setDeleteId] = useState(null);
    const [category, setCategory] = useState({
      name:""
    });
    let name,value;
    const handleInputs = (e) =>{
        console.log(e);
        name = e.target.name;
        value = e.target.value;
        setCategory({...category, [name]:value});
    }
    const handleSubmit = async (e) => {
      e.preventDefault();
      const{name} = category;
      const res = await fetch("/category", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              name: name
          })
      });
      if (!res.ok) {
        console.log(`HTTP error! Status: ${res.status}`);
      }    
      const data = await res.json();
      if(res.status=== 422 || !data){
          window.alert("already exists category");
          console.log("Category akready exists");
          
      }else{
          window.alert("valid Category");
          console.log("valid Category");

      }
  }

  // Function to handle category deletion
  const handleDeleteCategory = async (_id) => {
    console.log('The category name to be deleted is ' + _id);
    try {
      // Make an API call to delete the category
      const response = await fetch(`/deletecategory/${encodeURIComponent(_id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers as needed (e.g., authentication token)
        },
      });

      if (response.ok) {
        // If deletion is successful, update the state to reflect the changes
        setCategoryData(categoryData.filter(category => category._id !== _id));
      } else {
        console.error('Failed to delete category messafe');
        // Handle error, show a message, etc.
      }
    } catch (error) {
      console.error('Error during category deletion', error);
      // Handle error, show a message, etc.
    }
  };
  const [categoryData, setCategoryData] = useState([]);

      const categoryFunc = async () => {
          try {
            const res = await fetch('/category',  {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });
        
            if (!res.ok) {
              const error = new Error(res.statusText);
              throw error;
            }
        
            const datas = await res.json();
            console.log('API Response:', datas); 
            setCategoryData(datas.categories);
            console.log("Datas.data",datas.categories);
        
          } catch (err) {
            console.log('Error in fetching data', err);
          }
        };
        
      useEffect(()=>{
          categoryFunc();

      }, []);
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
                    <form method='POST'>
                      <input type='text' placeholder='Enter your category' name="name" className='category'  required value={category.name} onChange={handleInputs}/>
                      <input type='submit' value="Add" onClick={handleSubmit}/>
                    </form>
                    
                  </div>
                  
                )}
                {selectedOption === 'Create Product' && (
                  <div>Manage Product</div>
                )}
                {selectedOption === 'Users' && <div>Manage Users</div>}
              </div>
            </div>
            {categoryData && categoryData.length > 0 ? (
            <table className="table table-striped meterReader-table outer-border">
          <thead>
            <tr>
              <th>Name</th>
            <th>Action</th>
            </tr>
          </thead>
          <tbody>
          
          {categoryData.map((row) => (
              <tr key={row?.id}>
                <td>{row?.name}</td>
                <td>{row?.id}</td>
                <td>
                  <form >
                    <FiEdit size={18} alt="Edit Meter Reader" className="edit-icon" style={{marginRight:'6px'}} />
                    <MdDeleteOutline
                    size={21}
                    alt="Delete Meter Reader"
                    className="delete-icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteCategory(row?.id);
                    }}
                  />
                  </form> 
                </td>
              </tr>
            ))}
            {/*Table Data end*/}
          </tbody>
        </table>
         ) : (
          <p>No categories available.</p>
        )}
          </div>
        </div>
        
      </div>
    );
  }

  export default Dashboard;
