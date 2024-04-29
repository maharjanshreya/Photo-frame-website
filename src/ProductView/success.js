import { useEffect, useState ,useRef} from "react";
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
    const [im, setIm] = useState({});
    const userId = localStorage.getItem('userId');
    const [payment, setPayment] = useState([]);
    const [cartData, setCartData] = useState({ cart: { items: [] } });
    const [paymentSuccessCalled, setPaymentSuccessCalled] = useState(false);
    const paymentSuccessCalledRef = useRef(false);
    const handleRemoveCart = async () => {
        // console.log('The product name to be deleted is ' + _id);
        try {
            // Make an API call to delete the categoryuserData.userId
            const response = await fetch(`/remove-item/${encodeURIComponent(userId)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });


        } catch (error) {
            console.error('Error during product deletion', error);
        }
    };

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
    }

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

    const handlePaymentSuccess = async () => {
        try {
            if (paymentSuccessCalledRef.current) {
                console.log('handlePaymentSuccess already called');
                return;
            }
            paymentSuccessCalledRef.current = true;
            console.log('handlePaymentSuccess already called');
            // Retrieve session ID from URL query parameters or state
            const sessionId = getSessionIdFromURL(); // Implement this function to retrieve the session ID
            console.log(sessionId);
            // const productIds = cartData.cart.items.map(item => item.productId._id);
            // console.log("products",productIds);t
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
                if (Array.isArray(data.orderDetails.products)) {
                    data.orderDetails.products.forEach(item => {
                        const { uploadId, _id } = item;
                        fetchImageData(uploadId, _id); // Call fetchImageData function with uploadId and productId
                    });
                }
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
        if (!paymentSuccessCalledRef.current) {
            handlePaymentSuccess();
            
        }handleRemoveCart();
    }, [paymentSuccessCalled]);
    
    return (
        <>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {payment && payment.products && payment.shippingAddress && (
                    <div id="card-container">
                        <Card style={{ width: '25rem', textAlign: 'center' }} >
                            <Card.Body>
                                <Card.Title><img src={Check} width={70} /></Card.Title>
                                <Card.Title>Payment Successful</Card.Title>
                                <Card.Text style={{ marginBottom: '25px', color: 'grey' }}>
                                    Thank you for your purchase! Your order is now being processed and will be shipped soon.
                                </Card.Text>
                                <Card.Subtitle className="mb-2 text-muted" style={{ textAlign: 'left', paddingLeft: '10px' }}>Order Details</Card.Subtitle>
                                {payment.products.map((product, index) => (
                                    <p key={index}>
                                        <Card.Text style={{ textAlign: 'left', paddingLeft: '10px', color: 'gray' }}>
                                            {im[product._id] && <img src={im[product._id]} alt="Product" fluid className="rounded-3" style={{ width: "45px", marginRight: '10px' }} />}
                                            {product.name} ( Qty - {product.quantity} )

                                        </Card.Text>
                                    </p>
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

            <center><Link to='/'><Button variant="success" style={{ margin: '20px', padding: '8px 20px' }}>Home page</Button></Link><br />
                <Button variant="success" onClick={handleDownload}>Download Product Details</Button></center>
        </>
    )

}
export default Success;