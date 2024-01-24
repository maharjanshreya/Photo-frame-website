import React, { useState,useEffect } from 'react';
import Navbar from './adminNavbar';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import  {FiEdit} from "react-icons/fi";    
import {MdDeleteOutline} from "react-icons/md";
import { FaRegImage } from "react-icons/fa6";
import UpdateCategory from './updateCategory';
import UpdateProduct from './updateProduct';
import ViewDetails from './viewDetails';
import PostProduct from './postProduct';
function Dashboard() {
  const [selectedOption, setSelectedOption] = useState('Create Category');
  const [show, setShow] = useState(false); // for edit category
  const [show2, setShow2] = useState(false);  // for viewing details of products
  const [show3, setShow3] = useState(false); // for edit product
  const [activeOption, setActiveOption] = useState('Create Category');
  const [editId, setEditId] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [productId, setProductId] = useState(null);
  const handleClose = () => setShow(false);
  const handleClose2 = () => setShow2(false);
  const handleClose3 = () => setShow3(false);
  
  const handleShow = () => {
    
    setShow(true);
  };
  const handleShow2 = () => {
    
    setShow2(true);
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

  // Function to handle product deletion
  const handleDeleteProduct = async (_id) => {
    console.log('The product name to be deleted is ' + _id);
    try {
      // Make an API call to delete the category
      const response = await fetch(`/deleteproduct/${encodeURIComponent(_id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // Add any other headers as needed (e.g., authentication token)
        },
      });

      if (response.ok) {
        // If deletion is successful, update the state to reflect the changes
        try {
          // Update the state to remove the deleted category
          setProductData(prevProduct => prevProduct.filter(product => product._id !== _id));
      } catch (error) {
          console.error('Error during product deletion', error);
          // Handle error, show a message, etc.
      }
      } else {
        console.error('Failed to delete product messafe');
        // Handle error, show a message, etc.
      }
    } catch (error) {
      console.error('Error during product deletion', error);
      // Handle error, show a message, etc.
    }
  };


  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const productFunc = async () => {
    try {
      const res = await fetch('/products',  {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) {
      const error = new Error(res.statusText);
      throw error;
    }
      
    const datas = await res.json();
    console.log('API Response in products:', datas); 
    setProductData(datas.products);
    console.log("Datas.data",datas.products);
  
    } catch (err) {
      console.log('Error in fetching data', err);
    }
    };
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
      productFunc();

    }, []);
    return (
      <>
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
                  <div>
                    <h4 className='header-text' style={{color: '#444141'}}>Manage Product</h4>
                    <PostProduct />
                   
                  </div>
                )}
                {selectedOption === 'Users' && <div>Manage Users</div>}
              </div>
            </div>

            {selectedOption === 'Create Category' && (
            categoryData && categoryData.length > 0 ? (
            <table className="table table-striped meterReader-table outer-border">
          <thead>
            <tr>
              <th>Category Name</th>
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
        ))}

        {selectedOption === 'Create Product' && (
        productData && productData.length > 0 ? (
            <table className="table table-striped meterReader-table outer-border">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Product Quantity</th>
              <th>Product Price</th>
            <th>Action</th>
            </tr>
          </thead>
          <tbody>
          
          {productData.map((row) => (
              <tr key={row?._id}>
                <td>{row?.productName}</td>
                <td>{row?.quantity}</td>
                <td>{row?.price}</td>
               
                <td>
                  <form >
                    <FiEdit size={18} alt="Edit Meter Reader" className="edit-icon" style={{marginRight:'6px'}} onClick={(e)=>{
                      setEditProductId(row._id);
                      setShow3(true);
                    }} />
                    <MdDeleteOutline style={{marginRight:'6px'}}
                    size={21}
                    alt="Delete Meter Reader"
                    className="delete-icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteProduct(row?._id);
                    }}
                    
                  />
                 <FaRegImage onClick={(e)=>{
                      setProductId(row._id); 
                      
                      setShow2(true);
                    }}/>
                  </form> 
                </td>
              </tr>
            ))}
            {/*Table Data end*/}
          </tbody>
        </table>
         ) : (
          <p>No categories available.</p>
          ))}
          </div>
        </div>
        
      </div>
      {/*pop up for updates of category*/}
      <Modal  show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered >
        <Modal.Body style={{padding:'68px',backgroundColor:'#D9D9D9'}}>
          <center><span style={{color: '#32325D',fontSize:'30px',fontWeight:'700'}}>Edit Category</span></center>
          <UpdateCategory categoryId={editId} onClose={handleClose} refreshCategoryList={categoryFunc} />
          
        </Modal.Body>
      </Modal>

      {/*pop up for single product details*/}    
      <Modal  show={show2} onHide={handleClose2} size="lg" aria-labelledby="contained-modal-title-vcenter" centered style={{borderRadius:'24px'}}>
        <Modal.Body style={{padding:'68px',paddingTop:'30px',paddingleft:'30px',backgroundColor:'#D9D9D9',borderRadius:'24px'}} >
          <center style={{marginBottom:"30px"}}><span className='title-product-details'>View product details</span></center>
          <ViewDetails productId={productId} onClose={handleClose2}  />
          
        </Modal.Body>
      </Modal>

      {/*pop up for updates of product */}
      <Modal  show={show3} onHide={handleClose3} size="lg" aria-labelledby="contained-modal-title-vcenter" centered >
        <Modal.Body style={{padding:'68px',backgroundColor:'#D9D9D9'}}>
          <center><span style={{color: '#32325D',fontSize:'30px',fontWeight:'700'}}>Edit Category</span></center>
          <UpdateProduct productId={editProductId} onClose={handleClose3} refreshCategoryList={productFunc} />
          
        </Modal.Body>
      </Modal>
      </>
    );
  }

  export default Dashboard;
