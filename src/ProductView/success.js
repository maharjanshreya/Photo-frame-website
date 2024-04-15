import { useEffect, useState } from "react";
import Navbar from '../Navbar/navbar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Check from '../Images/correct.png';
import { Link } from "react-router-dom";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
// Function to extract session ID from URL query parameters
function getSessionIdFromURL() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('session_id');
}
function Success() {
    const [payment, setPayment] = useState([]);
    const [cartData, setCartData] = useState({ cart: { items: [] } });
    const getCart = async () => {
        try {
          const userId = localStorage.getItem('userId');
    
    
          const res = await fetch(`/add-to-cart/${encodeURIComponent(userId)}`, {
            method: 'GET',
            credentials: 'include',
          });
          if (!res.ok) {
            const error = new Error(res.statusText);
            throw error;
          }
    
          const datas = await res.json();
          setCartData(datas);
         console.log(datas);
        } catch (err) {
          console.log('Error in fetching data', err);
        }
      };
    const handlePaymentSuccess = async () => {
        try {
            // Retrieve session ID from URL query parameters or state
            const sessionId = getSessionIdFromURL(); // Implement this function to retrieve the session ID
            console.log(sessionId);
            // const productIds = cartData.cart.items.map(item => item.productId._id);
            // console.log("products",productIds);
            // Construct URL for backend endpoint
            const url = `/handle-success/${encodeURIComponent(sessionId)}`;

            // Make HTTP request to backend
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify({ productIds }),
            });

            // Check if request was successful
            if (response.ok) {
                const data = await response.json();
                console.log('Payment success:', data);
                setPayment(data.orderDetails);
                // Handle successful response from backend
                const newUrl = window.location.href.split('?')[0];
                window.history.replaceState({}, document.title, newUrl);
            } else {
                console.error('Error handling payment success:', response.statusText);
                // Handle error response from backend
            }
        } catch (error) {
            console.error('Error handling payment success:', error);
            // Handle other errors
        }
    };
    const handleDownload = () => {
        html2canvas(document.getElementById('card-container')).then(canvas => {
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF();
            const imgWidth = 170; // Adjust as needed
            const imgHeight = canvas.height * imgWidth / canvas.width;

            // Calculate margins
            const marginX = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
            const marginY = (pdf.internal.pageSize.getHeight() - imgHeight) / 2;

            // Add image with margins
            pdf.addImage(imgData, 'PNG', marginX, marginY, imgWidth, imgHeight);
            pdf.save('product_details.pdf');
        });
    };

    useEffect(() => {
        // getCart();
        handlePaymentSuccess();
    }, []);
    return (
        <>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {payment && payment.products && payment.shippingAddress && (
                    <div id="card-container">
                        <Card style={{ width: '25rem', textAlign: 'center' }}>
                            <Card.Body>
                                <Card.Title><img src={Check} width={70} /></Card.Title>
                                <Card.Title>Payment Successful</Card.Title>
                                <Card.Text style={{ marginBottom: '25px', color: 'grey' }}>
                                    Thank you for your purchase! Your order is now being processed and will be shipped soon.
                                </Card.Text>
                                <Card.Subtitle className="mb-2 text-muted" style={{ textAlign: 'left', paddingLeft: '10px' }}>Order Details</Card.Subtitle>
                                {payment.products.map((product, index) => (
                                    <li key={index}>
                                        <Card.Text style={{ textAlign: 'left', paddingLeft: '10px', color: 'gray' }}>
                                            {product.name} ( Qty - {product.quantity} )
                                        </Card.Text>
                                    </li>
                                ))}
                                <Card.Subtitle className="mb-2 text-muted mt-4" style={{ textAlign: 'left', paddingLeft: '10px' }}>Total Amount</Card.Subtitle>
                                <Card.Text style={{ textAlign: 'left', paddingLeft: '10px', color: 'gray' }}>
                                    {payment.payment}
                                </Card.Text>
                                <Card.Subtitle className="mb-2 text-muted" style={{ textAlign: 'left', paddingLeft: '10px' }}>Delivery Address</Card.Subtitle>
                                <Card.Text style={{ textAlign: 'left', paddingLeft: '10px', color: 'gray' }}>
                                    {`${payment.shippingAddress.address.line1}, ${payment.shippingAddress.address.line2}, ${payment.shippingAddress.address.city}, ${payment.shippingAddress.address.postal_code}`}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                )}
            </div>

            <center><Link to='/'><Button variant="success" style={{ margin: '20px' }}>Home page</Button></Link><br />
                <Button variant="success" onClick={handleDownload}>Download Product Details</Button></center>
        </>
    )

}
export default Success;