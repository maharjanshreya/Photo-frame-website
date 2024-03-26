import { useEffect } from "react";
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
        <div>
            <h1>Success</h1>
        </div>
    )

}
export default Success;