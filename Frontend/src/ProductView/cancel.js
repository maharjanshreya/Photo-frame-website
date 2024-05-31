import { useEffect, useState } from "react";
import Navbar from '../Navbar/navbar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Error from '../Images/error.png';
import { Link } from "react-router-dom";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function Cancel() {
    const [payment, setPayment] = useState([]);

    return (
        <>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center' }}>

                <div id="card-container">
                    <Card style={{ width: '25rem', textAlign: 'center' }}>
                        <Card.Body>
                            <Card.Title><img src={Error} width={70} /></Card.Title>
                            <Card.Title>Payment Unsuccessful</Card.Title>
                            <Card.Text style={{ marginBottom: '25px', color: 'grey' }}>
                                Sorry! Your payment was unsuccessful. Please try again.
                            </Card.Text>
                            <center><Link to='/'><Button variant="success" style={{ margin: '20px' }}>Go to home page</Button></Link><br />
                            </center>

                        </Card.Body>
                    </Card>
                </div>

            </div>


        </>
    )

}
export default Cancel;