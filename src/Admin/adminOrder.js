import React from 'react';
import AdminNavbar from './adminNavbar';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { CardTitle } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
}

function Order() {
    const [orders, setOrders] = useState([]);
    const createdAtDate = new Date("2024-03-26T14:48:46.422Z");
    const [defaultStatus, setDefaultStatus] = useState('Processing');
    
    const handleDelivery = async (orderId, status) => {
        try {
            // Send a PUT request to update the order status
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
            // Refresh orders after updating status
            fetchOrders();
            // Update default status
            setDefaultStatus(status);
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };
const fetchOrders = async () => {
            try {
                const response = await fetch('/view-order');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setOrders(data);
                console.log('Orders:', data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
    
    useEffect(() => {
        

        fetchOrders();
    }, []);

    return (
        <>
            <div className='d-flex'>
    
                <div>
                    <AdminNavbar />
                </div>
                <div className="col-md-8 offset-md-2" style={{marginTop:'50px'}}>
                    <h2>Orders </h2>
                    <Button variant='primary' style={{marginRight:'4px'}}>All Status</Button>
                    <Button style={{backgroundColor:'#e6e6e6',borderColor:'#e6e6e6',color:'#7d7a7a',marginRight:'4px'}}>New Order</Button>
                    <Button style={{backgroundColor:'#e6e6e6',borderColor:'#e6e6e6',color:'#7d7a7a',marginRight:'4px'}}>On Progress</Button>
                    <Button style={{backgroundColor:'#e6e6e6',borderColor:'#e6e6e6',color:'#7d7a7a',marginRight:'4px'}}>Delivered</Button>
                    <div className='table-responsive' style={{marginTop:'70px'}}>
                        <Card style={{padding:'10px'}}>
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
                    {orders.map(order => (
                        <tr key={order._id}>
                        <td>
                        <p className="fw-normal mb-1">{order._id}</p>
                        </td>
                        <td>
                        {order.products.map(product => (
                            <div key={product._id}>
                            <p className="fw-normal mb-1">{product.name}</p>
                            <p className="text-muted mb-0">Qty - {product.quantity}</p>
                            </div>))}
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
                                {formatDate(order.createdAt)}
                            </p>
                        </td>
                        <td>
                            <button type="button" className="btn btn-link btn-sm btn-rounded">
                                {order.payment}
                            </button>
                        </td>
                        <td>
                        <DropdownButton id={`dropdown-order-${order._id}`} title={order.status}>
                                                    <Dropdown.Item onClick={() => handleDelivery(order._id, 'Processing')}>Processing</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleDelivery(order._id, 'Shipped')}>Shipped</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleDelivery(order._id, 'Delivered')}>Delivered</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleDelivery(order._id, 'Cancelled')}>Cancelled</Dropdown.Item>
                                                </DropdownButton>
                        </td>
                    </tr>
                    ))}

                    {/* More table rows here */}
                </tbody>
            </table></Card>
                    </div>
                   
                </div>
                {/* <ul>
                    {orders.map(order => (
                        <li key={order._id}>
                            <p>Order ID: {order._id}</p>
                            <p>Products: {JSON.stringify(order.products)}</p>
                            <p>Buyer ID: {order.buyer._id}</p>
                        </li>
                    ))}
                </ul> */}
    
            </div>
           
        </>
    );
            }
            export default Order;    