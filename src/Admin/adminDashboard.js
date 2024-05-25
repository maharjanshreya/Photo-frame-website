import React, { useState, useEffect } from 'react';
import Navbar from './adminNavbar';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import AdminLayout from './admin';
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegImage } from "react-icons/fa6";
import UpdateCategory from './updateCategory';
import UpdateProduct from './updateProduct';
import UpdateUsers from './updateUsers';
import ViewDetails from './viewDetails';
import Button from 'react-bootstrap/Button';
import PostProduct from './postProduct';
import GetUserDetails from './getUserDetails';
import Alert from '../Images/alert.png';
import { ModalBody } from 'react-bootstrap';
import PostUsers from './postUsers';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import {CategoryGetApi} from '../Components/categoryApi';
import {PostCategory} from '../Components/categoryPostApi';
function Dashboard() {
  const [selectedOption, setSelectedOption] = useState('Create Category');
  const [show, setShow] = useState(false); // for edit category
  const [show2, setShow2] = useState(false);  // for viewing details of products
  const [show3, setShow3] = useState(false); // for edit product
  const [show4, setShow4] = useState(false); // for delete category
  const [show5, setShow5] = useState(false); // for delete product
  const [show6, setShow6] = useState(false); // for delete user
  const [show7, setShow7] = useState(false); // for edit user
  const [activeOption, setActiveOption] = useState('Create Category');
  const [editId, setEditId] = useState(null);
  const [deleteIdCategory, setDeleteIdCategory] = useState(null);
  const [deleteIdProduct, setDeleteIdProduct] = useState(null);
  const [deleteIdUser, setDeleteIdUser] = useState(null);
  const [defaultName, setDefaultName] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [editFirstname, setEditFirstname] = useState('');
  const [editLastname, setEditLastname] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editUserId, setEditUserId] = useState('');
  const [productId, setProductId] = useState(null);
  const handleClose = () => setShow(false);
  const handleClose2 = () => setShow2(false);
  const handleClose3 = () => setShow3(false);
  const handleClose4 = () => setShow4(false);
  const handleClose5 = () => setShow5(false);
  const handleClose6 = () => setShow6(false);
  const handleClose7 = () => setShow7(false);

  const handleShow = (deleteIdCategory) => {

    setShow4(true);
    setDeleteIdCategory(deleteIdCategory);


  };
  const handleShow2 = (deleteIdProduct) => {

    setShow5(true);
    setDeleteIdProduct(deleteIdProduct);
  };
  const handleShow3 = (deleteIdUser) => {

    setShow6(true);
    setDeleteIdUser(deleteIdUser);
  };
  const [category, setCategory] = useState({
    name: ""
  });

  const handleEditClick = (row) => {
    console.log(row._id);
    setEditUserId(row._id);
    console.log("Edit user id: ",editUserId);
    setEditFirstname(row.firstname);
    setEditLastname(row.lastname);
    setEditEmail(row.email);
    setEditContact(row.contact);
    setShow7(true);
};
  let name, value;
  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;
    setCategory({ ...category, [name]: value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name } = category;
   try{
    const { status, data } = await PostCategory(name);
    if (status === 200) {
      toast.error("Category already exists.");
      console.log("Category already exists");

    } else {
      toast.success('Category Added Successfully.');
      console.log("Category Added Successfully.");
      categoryFunc();
    }
   }catch(error){
    console.error('Error during category creation', error);
    toast.error(error);
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
          setCategoryData(prevCategories => prevCategories.filter(category => category.id !== _id));
          toast.success('Category Deleted Successfully.');
        } catch (error) {
          console.error('Error during category deletion', error);
          toast.error(error);
          // Handle error, show a message, etc.
        }
      } else {
        console.error('Failed to delete category message');
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
          toast.success("Product Deleted Successfully");
        } catch (error) {
          toast.error(error);
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

   // Function to handle user deletion
   const handleDeleteUser = async (_id) => {
    console.log('The user id to be deleted is ' + _id);
    try {
      
      const response = await fetch(`/delete-user/${encodeURIComponent(_id)}`, {
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
          setUserData(prevUser => prevUser.filter(user => user._id !== _id));
        } catch (error) {
          console.error('Error during product deletion', error);
          
        }
      } else {
        console.error('Failed to delete product messafe');
        
      }
    } catch (error) {
      console.error('Error during product deletion', error);
      
    }
  };

  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [userData, setUserData] = useState([]);
  
  const productFunc = async () => {
    try {
      const res = await fetch('/products', {
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
      console.log("Datas.data", datas.products);

    } catch (err) {
      console.log('Error in fetching data', err);
    }
  };
  const userFunc = async () => {
    try {
      const res = await fetch('/getUser', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = new Error(res.statusText);
        throw error;
      }

      const datas = await res.json();
      console.log('API Response in user:', datas);
      setUserData(datas);

    } catch (err) {
      console.log('Error in fetching data', err);
    }
  };
  const categoryFunc = async () => {
    try {
      

      const datas = await CategoryGetApi();
      console.log('API Response:', datas);
      setCategoryData(datas.categories);
      console.log("Datas.data", datas.categories);

    } catch (err) {
      console.log('Error in fetching data', err);
    }
  };

  useEffect(() => {
    categoryFunc();
    productFunc();
    userFunc();

  }, []);
  return (
    <>
    <Navbar />
      <div style={{ display: 'flex' }}>
      
        <div style={{ flex: 1 }}>
          {/* Content on the right */}
          <AdminLayout>
            <div className='d-flex'>
              <div className='admin-panel'>
                <h4 className="header-text" style={{ color: '#426751' }}>Admin Panel</h4>
                <Stack gap={0} className='stack'>
                  <div
                    className={`p-2 ${selectedOption === 'Create Category' ? 'active-admin' : ''}`}
                    onClick={() => {
                      setSelectedOption('Create Category');
                      setActiveOption('Create Category');
                    }}
                  >
                    Create Category
                  </div>
                  <div
                    className={`p-2 ${selectedOption === 'Create Product' ? 'active-admin' : ''}`}
                    onClick={() => {
                      setSelectedOption('Create Product');
                      setActiveOption('Create Product');
                    }}
                  >
                    Create Product
                  </div>
                  <div
                    className={`p-2 ${selectedOption === 'Create Users' ? 'active-admin' : ''}`}
                    onClick={() => {
                      setSelectedOption('Create Users');
                      setActiveOption('Create Users');
                    }}
                  > 
                    Create Users
                  </div>
                </Stack>
              </div>
              <div>
                {/* Render content based on selected option */}
                {selectedOption === 'Create Category' && (
                  <div>
                    <h4 className='header-text' style={{ color: '#444141' }}>Manage Category</h4>
                    <form method='POST' onSubmit={handleSubmit} >
                      <input type='text' placeholder='Enter category name' name="name" className='category' required value={category.name} onChange={handleInputs} />
                      <input type='submit' value="Add"  />
                    </form><Toaster position="top-center" reverseOrder={true} />

                  </div>

                )}
                {selectedOption === 'Create Product' && (
                  <div>
                    <h4 className='header-text' style={{ color: '#444141' }}>Manage Product</h4>
                    <PostProduct refreshProductList={productFunc} />

                  </div>
                )}
                {selectedOption === 'Create Users' &&
                  (
                    <div>
                      <h4 className='header-text' style={{ color: '#444141' }}>Manage Users</h4>
                      <PostUsers refreshUserList={userFunc} />
                    </div>
                  )}

                {/* <CreateUser refreshProductList={createUserFUnc}/> */}

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
                            <FiEdit size={18} alt="Edit Meter Reader" className="edit-icon" style={{ marginRight: '6px' }} onClick={(e) => {
                              setEditId(row.id); setDefaultName(row.name);
                              setShow(true);
                            }} />
                            <MdDeleteOutline
                              size={21}
                              alt="Delete Meter Reader"
                              className="delete-icon"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleShow(row?.id);

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
                            <FiEdit size={18} alt="Edit Meter Reader" className="edit-icon" style={{ marginRight: '6px' }} onClick={(e) => {
                              setEditProductId(row._id);
                              setShow3(true);
                            }} />
                            <MdDeleteOutline style={{ marginRight: '6px' }}
                              size={21}
                              alt="Delete Meter Reader"
                              className="delete-icon"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleShow2(row?._id);
                              }}

                            />
                            <FaRegImage onClick={(e) => {
                              setProductId(row._id);

                              setShow2(true);
                            }} />
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


            {selectedOption === 'Create Users' && (
              userData && userData.length > 0 ? (
                <table className="table table-striped meterReader-table outer-border">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>

                    {userData.map((row, index) => (
                      <tr key={index}>
                        <td>{row?.firstname}{' '}
                            {row?.lastname}</td>
                        <td>{row?.email}</td>
                        <td>{row?.contact}</td>
                        

                        <td>
                          <form >
                            <FiEdit size={18} alt="Edit Meter Reader" className="edit-icon" style={{ marginRight: '6px' }} onClick={(e) => {
                              handleEditClick(row);
                              setShow7(true);
                            }} />
                            <MdDeleteOutline style={{ marginRight: '6px' }}
                              size={21}
                              alt="Delete User"
                              className="delete-icon"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleShow3(row?._id);
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
                <p>No user available.</p>
              ))}
          </AdminLayout>
        </div>


      </div>

      {/*pop up for updates of category*/}
      <Modal show={show} onHide={handleClose} centered >
        <div className="modal show" style={{ display: 'block', position: 'initial', padding: 0 }} >

          <Modal.Dialog style={{ margin: 0 }}>
            <Modal.Header closeButton>
              <Modal.Title>Edit </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>Change the caetgory name:</p>
              <UpdateCategory categoryName={defaultName} categoryId={editId} onClose={handleClose} refreshCategoryList={categoryFunc} />

            </Modal.Body>


          </Modal.Dialog>
        </div>

      </Modal>

      {/*pop up for single product details*/}
      <Modal show={show2} onHide={handleClose2} size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            View product details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>


          <ViewDetails productId={productId} onClose={handleClose2} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose2}>Close</Button>
        </Modal.Footer>



      </Modal>

      {/*pop up for updates of product */}
      <Modal show={show3} onHide={handleClose3}  
      centered >


        <div className="modal show" style={{ display: 'block', position: 'initial', padding: 0 }} >

          <Modal.Dialog style={{ margin: 0 }}>
            <Modal.Header closeButton >
              <Modal.Title >Edit </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <b><p>Change the product details:</p></b>
              <UpdateProduct productId={editProductId} onClose={handleClose3} refreshProductList={productFunc} />
            </Modal.Body>


          </Modal.Dialog>
        </div>
      </Modal>

      {/*pop up for delete of category */}
      <Modal show={show4} onHide={handleClose4} centered >
        <div className="modal show" style={{ display: 'block', position: 'initial', padding: 0 }} >

          <Modal.Dialog style={{ margin: 0 }} centered>
            <Modal.Header closeButton className="d-flex align-items-center justify-content-center" centered>


            </Modal.Header>

            <Modal.Body style={{ padding: '30px 40px' }}><div className='text-center'>
              <img src={Alert} width={40} height={40} /><br />
              <b>Are you sure?</b>
            </div>

              <p className='text-center'>This action cannot be undone. All values related to this Category will be deleted permanently!</p><br />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="secondary" onClick={handleClose4} style={{ backgroundColor: '#6c757d', width: 'auto', borderColor: '#6c757d', marginRight: '8px' }}>Close</Button>
                <Button variant="danger" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteCategory(deleteIdCategory);
                  handleClose4();
                }}>Delete</Button>
              </div>
            </Modal.Body>


          </Modal.Dialog>
        </div>

      </Modal>

      {/*pop up for delete of product */}
      <Modal show={show5} onHide={handleClose5} centered >
        <div className="modal show" style={{ display: 'block', position: 'initial', padding: 0 }} >

          <Modal.Dialog style={{ margin: 0 }} centered>
            <Modal.Header closeButton className="d-flex align-items-center justify-content-center" centered>


            </Modal.Header>

            <Modal.Body style={{ padding: '30px 40px' }}><div className='text-center'>
              <img src={Alert} width={40} height={40} /><br />
              <b>Are you sure?</b>
            </div>

              <p className='text-center'>This action cannot be undone. All values related to this Product will be deleted permanently!</p><br />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="secondary" onClick={handleClose5} style={{ backgroundColor: '#6c757d', width: 'auto', borderColor: '#6c757d', marginRight: '8px' }}>Close</Button>
                <Button variant="danger" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteProduct(deleteIdProduct);
                  handleClose5();
                }}>Delete</Button>
              </div>
            </Modal.Body>


          </Modal.Dialog>
        </div>

      </Modal>

       {/*pop up for delete of user */}
       <Modal show={show6} onHide={handleClose6} centered >
        <div className="modal show" style={{ display: 'block', position: 'initial', padding: 0 }} >

          <Modal.Dialog style={{ margin: 0 }} centered>
            <Modal.Header closeButton className="d-flex align-items-center justify-content-center" centered>


            </Modal.Header>

            <Modal.Body style={{ padding: '30px 40px' }}><div className='text-center'>
              <img src={Alert} width={40} height={40} /><br />
              <b>Are you sure?</b>
            </div>

              <p className='text-center'>This action cannot be undone. All values related to this User will be deleted permanently!</p><br />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="secondary" onClick={handleClose6} style={{ backgroundColor: '#6c757d', width: 'auto', borderColor: '#6c757d', marginRight: '8px' }}>Close</Button>
                <Button variant="danger" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteUser(deleteIdUser);
                  handleClose6();
                }}>Delete</Button>
              </div>
            </Modal.Body>


          </Modal.Dialog>
        </div>

      </Modal>

      {/*pop up for updates of user */}
      <Modal show={show7} onHide={handleClose7} centered >


        <div className="modal show" style={{ display: 'block', position: 'initial', padding: 0 }} >

          <Modal.Dialog style={{ margin: 0 }}>
            <Modal.Header closeButton >
              <Modal.Title >Edit </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <b><p>Change the user details:</p></b>
              <UpdateUsers userId={editUserId} firstname={editFirstname} lastname={editLastname} email={editEmail} contact={editContact} onClose={handleClose7} refreshUserList={userFunc} />
            </Modal.Body>


          </Modal.Dialog>
        </div>
      </Modal>


    </>
  );
}

export default Dashboard;
