import React, { useState, useEffect } from 'react';
import { BiPurchaseTag } from "react-icons/bi";
import { MdOutlineDateRange } from "react-icons/md";

function OrderPage() {
    const userId = localStorage.getItem('userId');
    const [order, setOrderData] = useState([]);
    const [imageURLs, setImageURLs] = useState({}); // State to store product image URLs

    const getOrderFunc = async () => {
        try {
            const res = await fetch(`/view-my-orders/${encodeURIComponent(userId)}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!res.ok) {
                throw new Error(res.statusText);
            }

            const response = await res.json();
            setOrderData(response);

            // // Extract product IDs from orders
            // const productIds = response.flatMap(order => order.products.map(product => product._id));

            // // Fetch images for product IDs
            // imageFunc(productIds);
            console.log('API Response:', response);
        } catch (err) {
            console.log('Error in fetching data:', err);
        }
    };

    // const imageFunc = async (productIds) => {
    //     try {
    //         // Fetch images for each product ID in the array
    //         const promises = productIds.map(async (productId) => {
    //             const res = await fetch(`/product-image/${encodeURIComponent(productId)}`, {
    //                 method: 'GET',
    //                 credentials: 'include',
    //             });
    //             if (!res.ok) {
    //                 throw new Error(`Failed to fetch image for product ID: ${productId}`);
    //             }

    //             // Read the binary data as an ArrayBuffer
    //             const buffer = await res.arrayBuffer();

    //             // Convert the ArrayBuffer to a base64 string
    //             const base64Image = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));

    //             // Return the base64 image string
    //             return { productId, url: `data:image/png;base64,${base64Image}` };
    //         });

    //         // Wait for all promises to resolve
    //         const images = await Promise.all(promises);

    //         // Convert the array of images to an object with productId as keys
    //         const imageMap = {};
    //         images.forEach(image => {
    //             imageMap[image.productId] = image.url;
    //         });

    //         // Set the image URLs in state
    //         setImageURLs(imageMap);
    //     } catch (err) {
    //         console.log('Error in fetching image data:', err);
    //     }
    // };

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
                                {/* {imageURLs && imageURLs[product._id] && ( // Check if image URL exists for the product
                                <img
                                    src={imageURLs[product._id]} // Use image URL from state
                                    className="rounded-3"
                                    style={{ width: "45px" }}
                                    alt="Product"
                                />
                            )} */}


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
