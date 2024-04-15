import sideImage from '../Images/LoginImage.png';
import Logo from '../Images/Rectangle 1.png';
import '../CSS/style.css';
import correct from '../Images/correct.png';
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
function Register() {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [user, setUser] = useState({
        firstname: "", lastname: "", username: "", email: "", password: "", cpassword: "", contact: "",
    });
    const [error, setError] = useState('');
    const [passwordError, setpasswordError] = useState('');
    const[response,setResponse] = useState('');
    const [contactError, setcontactError] = useState('');
    let name, value;
    const handleInputs = (e) => {
        console.log(e);
        name = e.target.name;
        value = e.target.value;
        setUser({ ...user, [name]: value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user.password !== user.cpassword) {
            setpasswordError("Passwords do not match. Please try again.");
            return;
        }
        if (!/^\d{10}$/.test(user.contact)) {
            setcontactError("Contact must be exactly 10 digits. Please try again.");
            return;
        }
        const { firstname, lastname, username, email, password, cpassword, contact } = user;
        const res = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstname, lastname, username, email, password, cpassword, contact, role: "consumer"
            })
        });
        const data = await res.json();
        if (res.status === 422 || !data) {
            setLoading(false);
            setError(data.message);
            setResponse(data.error);
            console.log("Invalid resgistration");

        } else {
            setLoading(false);
            setShow(true);
            console.log("valid registration");

        }
    }
    return (
        <div className="full-screen-image">
            <div className="left-column">
                <img src={sideImage} alt="logout" className="full-height-image" />
            </div>
            <div className="right-column">
                <p className='text'>Register and <br />Design your frames with</p>
                <img src={Logo} alt="logout" className="" />
                <form method='POST' className='input-text' onSubmit={handleSubmit}>
                    <input type="text" id="username" name="firstname" placeholder="Firstname" required value={user.firstname} onChange={handleInputs} /><br />
                    <input type="text" id="username" name="lastname" placeholder="Lastname" required value={user.lastname} onChange={handleInputs} /><br />
                    <input type="text" id="username" name="username" placeholder="Username" required value={user.username} onChange={handleInputs} /><br />
                    <input type="text" id="username" name="email" placeholder="Email" required value={user.email} onChange={handleInputs} /><br />
                    <input type="text" id="password" name="password" placeholder="Password" required value={user.password} onChange={handleInputs} /><br />
                    <input type="text" id="password" name="cpassword" placeholder="Confirm Password" required value={user.cpassword} onChange={handleInputs} /><br />
                    {passwordError && user.password !== user.cpassword && (
                        <div style={{ color: 'red', fontWeight: '500' }}>{passwordError}</div>
                    )}
                    <input type="text" id="contact" name="contact" placeholder="Contact" required value={user.contact} onChange={handleInputs} /><br />
                    {contactError && !/^(\d{10})?$/.test(user.contact) && (<div style={{ color: 'red', fontWeight: '500' }}>{contactError}</div>)}
                    <input type="submit" value="Register" />
                </form>
                {error && <div style={{ color: 'red', fontWeight: '500' }}>{error}</div>}
                {response && <div style={{ color: 'red', fontWeight: '500' }}>{response}</div>}
                {loading && (<Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>)}
                <p>Already have an account<Link to="/login"> <u className='register-color'>Sign-in Now </u></Link></p>

            </div>
            <Modal show={show} onHide={handleClose} centered >
                <div className="modal show" style={{ display: 'block', position: 'initial', padding: 0 }} >

                    <Modal.Dialog style={{ margin: 0 }} centered>
                        <Modal.Header closeButton className="d-flex align-items-center justify-content-center" centered>


                        </Modal.Header>

                        <Modal.Body style={{ padding: '30px 40px' }}><div className='text-center'>
                            <img src={correct} width={80} height={80} /><br />
                            <b>Registration successfull</b>
                        </div>

                            <p className='text-center'>Your registration is complete. You're now part of our community! Get ready to explore exciting features, exclusive offers, and engaging content. </p><br />
                            <hr />

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Link to='/login'><Button variant="success" >Login Now</Button></Link><br/>
                                <Button variant="secondary" onClick={handleClose} style={{ backgroundColor: '#6c757d', width: 'auto', borderColor: '#6c757d', marginRight: '8px',marginLeft:'8px' }}>Close</Button>

                            </div>
                        </Modal.Body>


                    </Modal.Dialog>
                </div>

            </Modal>

        </div>
    );
}
export default Register;