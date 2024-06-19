import React, { useEffect, useState } from 'react';
import AdminNavbar from './adminNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { CardTitle } from 'react-bootstrap';
import { formatDateString } from '../ProductView/time';
import { Pagination } from 'react-bootstrap';  
import AdminLayout from './admin'; 
import { paginate } from '../Components/paginate';
function Order() {
    const [searchQuery, setSearchQuery] = useState('');
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; 
    const [view, setView] = useState('all');
    const [toggleColor, setToggleColor] = useState("red");
    const [defaultStatus, setDefaultStatus] = useState('Processing');
    const [activeButton, setActiveButton] = useState('all');

    const getColor = (status) => {
        switch (status) {
            case 'Processing':
                return 'blue';   
            case 'Shipped':
                return 'orange'; 
            case 'Delivered':
                return 'green'; 
            case 'Cancelled':
                return 'red';   
            default:
                return 'black'; 
        }
    };

    const handleDelivery = async (orderId, status, color) => {
        setToggleColor({ ...toggleColor, [orderId]: color });
        try { 
            const response = await fetch(`https://photo-frame-website.onrender.com/update-order/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });
            if (!response.ok) {
                throw new Error('Failed to update order status');
            }
            const updatedOrders = orders.map(order =>
                order._id === orderId ? { ...order, status: status } : order
            );
            setOrders(updatedOrders);
            fetchOrders();
            // Update default status
            setDefaultStatus(status);
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };
    let [filteredOrders, setFilteredOrders] = useState([]);
    const fetchOrders = async () => {
        try {
            const response = await fetch('https://photo-frame-website.onrender.com/view-order');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setOrders(data);
            setFilteredOrders(data);
            console.log('Orders:', data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

   
    const handleViewChange = (status) => {
        if (status === activeButton) {
            return;
        }
        setActiveButton(status); // Update the active button state
        console.log('Active Button:', status);
        // Filter orders based on the status
        let newFilteredOrders = [];
        switch (status) {
            case 'Cancelled':
                newFilteredOrders = orders.filter(order => order.status === 'Cancelled');
                break;
            case 'Processing':
                newFilteredOrders = orders.filter(order => order.status === 'Processing');
                break;
            case 'Delivered':
                newFilteredOrders = orders.filter(order => order.status === 'Delivered');
                break;
            case 'all':
                newFilteredOrders    = orders; // Default to all orders
                break;
            default:
                break;
        }
        if (searchQuery) {
            newFilteredOrders = newFilteredOrders.filter(order => 
                (order._id && order._id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (order.buyer && order.buyer.email && order.buyer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (order.buyer && order.buyer.contact && order.buyer.contact  .toLowerCase().includes(searchQuery.toLowerCase())) ||
                (order.products && order.products.some(product => product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())))
            );
        }
        console.log('Filtered Orders:', newFilteredOrders);
        setFilteredOrders(newFilteredOrders);
    };

    const paginate = (items, pageNumber, pageSize) => {
        const startIndex = (pageNumber - 1) * pageSize;
        return items.slice(startIndex, startIndex + pageSize);
      };
    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        let newFilteredOrders = orders;
        if (searchQuery) {
            newFilteredOrders = newFilteredOrders.filter(order => 
                (order._id && order._id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (order.buyer && order.buyer.email && order.buyer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (order.buyer && order.buyer.contact && order.buyer.contact.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (order.products && order.products.some(product => product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())))
            );
        }
        setFilteredOrders(newFilteredOrders);
    }, [searchQuery, orders]);
    const handleDeleteOrder = async (_id) => {
        console.log('The user id to be deleted is ' + _id);
        try {
          
          const response = await fetch(`/delete-order/${encodeURIComponent(_id)}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
    
          if (response.ok) {
            // If deletion is successful, update the state to reflect the changes
            try {
              // Update the state to remove the deleted category
              setFilteredOrders(prevOrder=> prevOrder.filter(order => order._id !== _id));
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

      const [im, setIm] = useState({});

      const fetchImageData = async (uploadId, productId) => {
        console.log("Fetched Upload ID", uploadId);
        try {
            const response = await fetch(`/getImage-upload/${encodeURIComponent(uploadId)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch image data');
            }
            const imageData = await response.json();
            console.log(imageData);
            // Convert the buffer to a base64 string
            const base64String = btoa(
                new Uint8Array(imageData.imageData.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            const url = `data:image/png;base64,${base64String}`;

            // Set the image URL for the corresponding product ID
            setIm(prevImages => {
                const updatedImages = {
                    ...prevImages,
                    [productId]: url
                };
                console.log('Updated images:', updatedImages);
                return updatedImages;
            });


        } catch (error) {
            console.error('Error retrieving image data:', error);
        }
    };
    const [imageURL, setImageURL] = useState({});
    const fetchImage = async (productId) => {
        try {
          const response = await fetch(`/product-image/${encodeURIComponent(productId)}`);
          if (!response.ok) {
            throw new Error('Failed to fetch image');
          }
          console.log("In respionse",response);
          const imageURL = URL.createObjectURL(await response.blob());
          setImageURL(prevURLs => ({ ...prevURLs, [productId]: imageURL }));
          console.log('Updated not images:', imageURL);
        } catch (error) {
          console.error('Error fetching image:', error);
        }
      };
    

    useEffect(() => {
        // Clear previous images when orders change
        setIm({});
        setImageURL({});
    
        // Fetch images for each product in the orders
        filteredOrders.forEach(order => {
          order.products.forEach(product => {
            fetchImage(product._id)
            fetchImageData(product.uploadId,product._id);
          });
        });
      }, [filteredOrders]);

    return (
        <>
            <AdminLayout>
           
                
                <div>
                    <h2>Orders</h2>
                    <Button  style={{ backgroundColor: activeButton === 'all' ? 'orange' : '#e6e6e6',color: activeButton === 'all' ? 'white' : '#7d7a7a', borderColor: '#e6e6e6',marginRight: '4px' }}  onClick={() => handleViewChange('all')}>All Status</Button>
                    <Button style={{ backgroundColor: activeButton === 'Cancelled' ? 'blue' : '#e6e6e6', borderColor: '#e6e6e6', color: '#7d7a7a', marginRight: '4px' }} onClick={() => handleViewChange('Cancelled')}>Cancelled</Button>
                    <Button style={{ backgroundColor: activeButton === 'Processing' ? 'blue' : '#e6e6e6', borderColor: '#e6e6e6', color: '#7d7a7a', marginRight: '4px' }} onClick={() => handleViewChange('Processing')}>On Progress</Button>
                    <Button style={{ backgroundColor: activeButton === 'Delivered' ? 'green' : '#e6e6e6', color: activeButton === 'Delivered' ? 'white' : '#7d7a7a',borderColor: '#e6e6e6', marginRight: '4px' }} onClick={() => handleViewChange('Delivered')}>Delivered</Button>
                    
                    <div style={{ marginBottom: '20px',marginTop :'20px' }}>
                        <input 
                            type="text" 
                            placeholder="Search orders..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="form-control"
                        />
                    </div>
                    <div className='table-responsive' style={{ marginTop: '70px',marginBottom: '70px' }}>
                        <Card style={{ padding: '10px' }}>
                            <CardTitle>Orders</CardTitle>
                            <table className="table align-middle mb-0 bg-white">
                                <thead className="bg-light">
                                    <tr className='table-tt'>
                                        <th>Order Id</th>
                                        <th>Order Name</th>
                                        <th>Image</th>
                                        <th>Customer name</th>
                                        <th>Customer contact</th>
                                        <th>Shipping Address</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {paginate(filteredOrders, currentPage, itemsPerPage).map((order) => (
                                            <tr key={order._id}>
                                                <td>
                                                    <p className="fw-normal mb-1">{order._id}</p>
                                                </td>
                                                <td>
                                                    {order.products.map(product => (
                                                    <div key={product._id}>
                                                        <p className="fw-normal mb-1">{product.name}</p>
                                                        <p className="text-muted mb-0">Qty - {product.quantity}</p>
                                                    </div>
                                                ))}
                                            </td>
                                            
                                            <td>
                                                {order.products.map(product => (
                                                    <div key={product._id}>
                                                        

                                                    {im[product._id] 
                                                        ? <img src={im[product._id]} alt="Product" className="rounded-3" style={{ width: "45px", marginRight: '10px' }} />
                                                        : <p>No image</p>
                                                    }
                                                    </div>
                                                ))}
                                                </td>


                                            <td>
                                                {order.buyer.email}
                                            </td>
                                            <td>
                                                {order.buyer.contact}
                                            </td>
                                            <td>
                                                <p>
                                                    Kathmandu
                                                </p>
                                            </td>
                                            <td>
                                                <p>
                                                    {formatDateString(order.createdAt)}
                                                </p>
                                            </td>
                                            <td>
                                                <button type="button" className="btn btn-link btn-sm btn-rounded">
                                                    {order.payment}
                                                </button>
                                            </td>
                                            <td>
                                                <Dropdown style={{ marginTop: '6px', marginBottom: '6px', marginLeft: '10px' }}>
                                                    <Dropdown.Toggle variant="success"
                                                        id={`dropdown-toggle-${order._id}`}
                                                        style={{ backgroundColor: getColor(order.status), border: 'none' }}
                                                    >
                                                        {order.status}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={() => handleDelivery(order._id, 'Processing', "green")}>Processing</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => handleDelivery(order._id, 'Shipped', "yellow")}>Shipped</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => handleDelivery(order._id, 'Delivered', "orange")}>Delivered</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => handleDelivery(order._id, 'Cancelled', "red")}>Cancelled</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                            <td>
                                                <button type="button" className="btn btn-link btn-sm btn-rounded"  onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleDeleteOrder(order._id);
                                                }}>
                                                Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination style={{justifyContent:"center",marginTop:'9px'}}>
                                {Array.from({ length: Math.ceil(filteredOrders.length / itemsPerPage) }).map((_, index) => (
                                    <Pagination.Item
                                    key={index}
                                    active={index + 1 === currentPage}
                                    onClick={() => setCurrentPage(index + 1)}
                                    >
                                    {index + 1}
                                    </Pagination.Item>
                                ))}
                                </Pagination>
                        </Card>
                    </div>
                </div>
            
            </AdminLayout>
        </>
    );
}

export default Order;
