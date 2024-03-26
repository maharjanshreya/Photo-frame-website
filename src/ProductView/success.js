import { useEffect } from "react";
import Navbar from '../Navbar/navbar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Check from '../Images/correct.png';
import { Link } from "react-router-dom";
// Function to extract session ID from URL query parameters
function getSessionIdFromURL() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('session_id');
}
function Success(){
    const handlePaymentSuccess = async () => {
        try {
            // Retrieve session ID from URL query parameters or state
            const sessionId = getSessionIdFromURL(); // Implement this function to retrieve the session ID
            console.log(sessionId);
            // Construct URL for backend endpoint
            const url = `/handle-success/${encodeURIComponent(sessionId)}`;
    
            // Make HTTP request to backend
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            // Check if request was successful
            if (response.ok) {
                const data = await response.json();
                console.log('Payment success:', data);
                // Handle successful response from backend
            } else {
                console.error('Error handling payment success:', response.statusText);
                // Handle error response from backend
            }
        } catch (error) {
            console.error('Error handling payment success:', error);
            // Handle other errors
        }
    };
    useEffect(() => {
        handlePaymentSuccess();
    }, []); 
    return(
        <>
            <Navbar />
            <div style={{display: 'flex', justifyContent:'center' }}> 
                
                <Card style={{ width: '25rem' ,textAlign:'center' }}>
                    <Card.Body>
                    <Card.Title><img src= {Check} width={70}/></Card.Title>
                        <Card.Title>Payment Successful</Card.Title>
                        
                        <Card.Text style={{marginBottom:'25px',color:'grey'}}>
                        Thank you for your purchase! Your order is now being processed and will be shipped soon.
                        </Card.Text>
                        <Card.Subtitle className="mb-2 text-muted" style={{ textAlign:'left',paddingLeft:'10px' }}>Order Details</Card.Subtitle>
                        <Card.Text  style={{ textAlign:'left',paddingLeft:'10px',color:'gray' }}>
                        Shinning Wooden Chic  (5)
                        </Card.Text>
                        <Card.Subtitle className="mb-2 text-muted" style={{ textAlign:'left',paddingLeft:'10px' }}>Total Amount</Card.Subtitle>
                        <Card.Text  style={{ textAlign:'left',paddingLeft:'10px' ,color:'gray'}}>
                        NPR. 3450
                        </Card.Text>
                        <Card.Subtitle className="mb-2 text-muted" style={{ textAlign:'left',paddingLeft:'10px' }}>Delivery Address</Card.Subtitle>
                        <Card.Text  style={{ textAlign:'left',paddingLeft:'10px',color:'gray' }}>
                        Kathmandu
                        </Card.Text>
                        
                        <Link to='/'><Button variant="success" >Home page</Button></Link>
                    </Card.Body>
                    </Card>
            </div>
        </>
    )

}
export default Success;