import React, { useState,useEffect } from 'react';
import Navbar from './adminNavbar';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import  {FiEdit} from "react-icons/fi";    
import {MdDeleteOutline} from "react-icons/md";
import Button from 'react-bootstrap/Button';
import UpdateCategory from './updateCategory';
import { FaBars } from "react-icons/fa";

function Dashboard() {
  const [selectedOption, setSelectedOption] = useState('Create Category');
  const [show, setShow] = useState(false);
  const [activeOption, setActiveOption] = useState('Create Category');
  const [editId, setEditId] = useState(null);
  const handleClose = () => setShow(false);
  
  const handleShow = () => {
    
    setShow(true);
  };
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
        try {
          // Update the state to remove the deleted category
          setCategoryData(prevCategories => prevCategories.filter(category => category._id !== _id));
      } catch (error) {
          console.error('Error during category deletion', error);
          // Handle error, show a message, etc.
      }
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
  const [navbarVisible, setNavbarVisible] = useState(false);
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
      <>
      <div style={{ display: 'flex', position: 'relative' }}>
        {/* Navbar on the left */}
        {/* Conditionally render the Navbar based on the navbarVisible state */}
        {navbarVisible && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
          <Navbar />
        </div>
        )}
        <div style={{ flex: 1 }}>
          {/* Content on the right */}
          <div style={{ marginLeft: navbarVisible ? '250px' : '0', paddingLeft: '32px', paddingRight: '32px', transition: 'margin 0.3s'  }}>
          <FaBars
              className="toggle-button"
              onClick={() => setNavbarVisible(!navbarVisible)}
              style={{
                position: 'absolute',
                top: '10px',
                left: '32px',
                zIndex: '1000',
              }}
            />
              
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
                  <div>
                    <h4 className='header-text' style={{color: '#444141'}}>Manage Product</h4>
                    <form method='POST'>
                      <input type='text' placeholder='Enter product name' name="name" className='category'  required value={category.name} onChange={handleInputs}/>
                      <input type='text' placeholder='Product Description' name="description" className='category'  required value={category.name} onChange={handleInputs}/>
                      <input type='text' placeholder='Image' name="description" className='category'  required value={category.name} onChange={handleInputs}/>
                      <input type='number' placeholder='Enter the product price' name="price" className='category'  required value={category.name} onChange={handleInputs}/>
                      {/*Dropdown menu : out of stock or stock*/}
                      <input type='text' placeholder='stock' name="stock" className='category'  required value={category.name} onChange={handleInputs}/>
                      <input type='text' placeholder='size' name="size" className='category'  required value={category.name} onChange={handleInputs}/>
                      <input type='text' placeholder='dimension' name="dimension" className='category'  required value={category.name} onChange={handleInputs}/>
                      <input type='text' placeholder='color options' name="dimension" className='category'  required value={category.name} onChange={handleInputs}/>
                     {/*ratings by users*/}
                      <input type='text' placeholder='ratings' name="ratings" className='category'  required value={category.name} onChange={handleInputs}/>
                    <hr />

                      <input type='submit' value="Add" onClick={handleSubmit}/>
                    </form>
                  </div>
                )}
                {selectedOption === 'Users' && <div>Manage Users</div>}
              </div>
            </div>
            {categoryData && categoryData.length > 0 ? (
            <table className="table table-striped category-table outer-border">
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
               
                <td>
                  <form >
                    <FiEdit size={18} alt="Edit Meter Reader" className="edit-icon" style={{marginRight:'6px'}} onClick={(e)=>{
                      setEditId(row.id);
                      setShow(true);
                    }} />
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
      {/*pop up for updates */}
      <Modal  show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered >
        <Modal.Body style={{padding:'68px',backgroundColor:'#D9D9D9'}}>
          <center><span style={{color: '#32325D',fontSize:'30px',fontWeight:'700'}}>Edit Your Account</span></center>
          <UpdateCategory categoryId={editId} onClose={handleClose} refreshCategoryList={categoryFunc} />
          
        </Modal.Body>
      </Modal>
      </>
    );
  }

  export default Dashboard;
