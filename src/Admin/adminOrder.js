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
            const response = await fetch(`/update-order/${orderId}`, {
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
            const response = await fetch('/view-order');
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
        console.log('Filtered Orders:', filteredOrders);
        //setOrders(filteredOrders); // Update the orders state with filtered orders
        setFilteredOrders(newFilteredOrders);
    };

    const paginate = (items, pageNumber, pageSize) => {
        const startIndex = (pageNumber - 1) * pageSize;
        return items.slice(startIndex, startIndex + pageSize);
      };
    useEffect(() => {
        fetchOrders();
    }, []);
    const handleDeleteOrder = async (_id) => {
        console.log('The user id to be deleted is ' + _id);
        try {
          
          const response = await fetch(`/delete-order/${encodeURIComponent(_id)}`, {
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
    return (
        <>
            <AdminLayout>
           
                
                <div>
                    <h2>Orders</h2>
                    <Button  style={{ backgroundColor: activeButton === 'all' ? 'orange' : '#e6e6e6',color: activeButton === 'all' ? 'white' : '#7d7a7a', borderColor: '#e6e6e6',marginRight: '4px' }}  onClick={() => handleViewChange('all')}>All Status</Button>
                    <Button style={{ backgroundColor: activeButton === 'Cancelled' ? 'blue' : '#e6e6e6', borderColor: '#e6e6e6', color: '#7d7a7a', marginRight: '4px' }} onClick={() => handleViewChange('Cancelled')}>Cancelled</Button>
                    <Button style={{ backgroundColor: activeButton === 'Processing' ? 'blue' : '#e6e6e6', borderColor: '#e6e6e6', color: '#7d7a7a', marginRight: '4px' }} onClick={() => handleViewChange('Processing')}>On Progress</Button>
                    <Button style={{ backgroundColor: activeButton === 'Delivered' ? 'green' : '#e6e6e6', color: activeButton === 'Delivered' ? 'white' : '#7d7a7a',borderColor: '#e6e6e6', marginRight: '4px' }} onClick={() => handleViewChange('Delivered')}>Delivered</Button>
                    <div className='table-responsive' style={{ marginTop: '70px',marginBottom: '70px' }}>
                        <Card style={{ padding: '10px' }}>
                            <CardTitle>Orders</CardTitle>
                            <table className="table align-middle mb-0 bg-white">
                                <thead className="bg-light">
                                    <tr className='table-tt'>
                                        <th>Order Id</th>
                                        <th>Order Name</th>
                                        <th>Customer name</th>
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
                                                {order.buyer.email}
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
