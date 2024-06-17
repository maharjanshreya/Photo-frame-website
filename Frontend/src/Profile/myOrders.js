import React, { useState, useEffect } from 'react';
import { BiPurchaseTag } from "react-icons/bi";
import { MdOutlineDateRange } from "react-icons/md";

function OrderPage() {
    const userId = localStorage.getItem('userId');
    const [order, setOrderData] = useState([]);
    const [imageURLs, setImageURLs] = useState({}); 

    const getOrderFunc = async () => {
        try {
            const res = await fetch(`https://photo-frame-website.onrender.com/view-my-orders/${encodeURIComponent(userId)}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!res.ok) {
                throw new Error(res.statusText);
            }

            const response = await res.json();
            setOrderData(response);

            console.log('API Response:', response);
        } catch (err) {
            console.log('Error in fetching data:', err);
        }
    };

  
    useEffect(() => {
        getOrderFunc();
    }, []);

    const latestOrders = order.slice(-5);

    return (
        <div>
            <div className="row">
                <div className="col-auto">
                    <BiPurchaseTag color='green' />
                </div>
                <div className="col">
                    <p>My Orders - (Latest)</p>
                </div>
            </div>
            <hr />
            {latestOrders.map((orderItem, index) => (
                <div key={index} className="order-item">
                    <h3 style={{ fontFamily: 'Fenix', fontSize: '17px' }}>Products:</h3>
                    <ul>
                        {orderItem.products.map((product, index) => (
                            <li key={index}>
                                <p>{product.name} (Qty - {product.quantity})</p>
                                <p>Price: ${product.price}</p>
                            </li>
                        ))}
                    </ul>
                    <p>Status: {orderItem.status}</p>
                    <p>Payment: ${orderItem.payment.toFixed(2)}</p>
                    <p><MdOutlineDateRange /> {new Date(orderItem.createdAt).toLocaleString()}</p>
                    <hr />
                </div>
            ))}
        </div>
    )
}

export default OrderPage;
