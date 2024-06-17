import sideImage from '../Images/LoginImage.png';
import Logo from '../Images/Rectangle 1.png';
import '../CSS/style.css';
import { Link } from 'react-router-dom';
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/token';
import { useUser } from '../context/user';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBInput
} from 'mdb-react-ui-kit';
function Login() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [hasToken, setHasToken] = useState(false);
    const [error, setError] = useState('');
    const checkUserRole = useCallback(() => {
        const token = localStorage.getItem('tokens');
        if (token) {
            const parsedData = JSON.parse(token);
            const userRole = parsedData[0]?.role;
            if (userRole === 'admin') {
                setHasToken(true);
            }
        }
    }, []);

    useEffect(() => {
        checkUserRole();
    }, [checkUserRole]);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [userId, setUserId] = useState([]);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    const loginUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('https://photo-frame-website.onrender.com/signin', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                credentials: 'include',
                body: JSON.stringify({
                    email, password
                })
            });
            if (!res.ok) {
                setLoading(false);
                const data = await res.json();
                const errorMessage = data.message || 'An unknown error occurred.';
                console.error("Error from backend:", errorMessage);
                throw new Error(errorMessage);
            }


            const data = await res.json();
            if (data.error) {
                setLoading(false);
                throw new Error(data.message); // If server sends error, throw an error with the error message
            }
            console.log("data", data);
            console.log(data.userData.role);
            console.log(data.userData.userId);
            const role = data.userData?.role;

            setUserId(data.userData?._id);
            localStorage.setItem('status', 'true');
            localStorage.setItem('userId', data.userData?.userId);
            localStorage.setItem('role', data.userData?.role);

            if (res.status === 400 || !data) {
                setLoading(false);
                console.log(data.message);
                throw new Error(data.message || "An unknown error occurred.");
            }


            if (role === 'admin') {
                setLoading(false);
                navigate("/adminDashboard");
            } else {
                setLoading(false);
                navigate("/"); // Change '/consumerPage' to the path of your consumer page
            }


        } catch (error) {
            setLoading(false);
            setError(error.message); // Set error message
            console.log('Error form catch block ', error.message);
        }
    }
    useEffect(() => {
        if (userId) {
            console.log("Login user id ", userId);

            // Additional logic (e.g., API calls) that depends on the updated userId
        }
    }, [userId]);
    return (
        <>


            <MDBContainer fluid>
                <MDBRow>

                    <MDBCol sm='7' className='d-none d-sm-block px-0'>

                        <img src={sideImage} alt="Login image" className="w-100" style={{ height: '100vh', objectFit: 'cover', objectPosition: 'left' }} />

                    </MDBCol>
                    <MDBCol sm='5'>
                        <div style={{ marginBottom: '48px' }} className='d-flex justify-content-center'>
                            <div className='d-flex flex-row ps-5 pt-5 align-items-center'>
                                <MDBIcon fas icon="crow fa-3x me-3" style={{ color: '#709085' }} />
                                <div>
                                    <center><p className='text mb-0'>Login and <br />Design your frames with</p>
                                        <Link to='/'><img src={Logo} alt="logout" className="" /></Link></center>
                                </div>
                            </div></div>
                        <div className='row justify-content-center'>
                            <div className='col-md-8'>
                                <div className='d-flex flex-column justify-content-center w-100 pt-2 pt-md-4 form-outline'>
                                    <form method='POST' onSubmit={loginUser} className='input-form'>

                                        <MDBInput wrapperClass='mb-4 mx-5 w-100' id='formControlLg' type='email' size="lg" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                                        <MDBInput wrapperClass='mb-4 mx-5 w-100' type='password' id='formControlLg' size="lg" name="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} />
                                        {error && <div style={{ color: 'red', fontWeight: '500', textAlign: 'left' }}>{error}</div>}
                                        <input type="submit" className="mb-4 px-5 mx-5 w-100" value="Login" />
                                    </form>
                                    {loading && (<Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>)}
                                    <p className="small mb-5 pb-lg-3 text-left"><Link to='/reset' className='link-info' >Forgot password?</Link></p>

                                    <p className='text-center'>Don't have an account? <Link to='/register' className="link-info">Register here</Link></p>
                                </div>
                            </div>
                        </div>


                    </MDBCol>


                </MDBRow>
            </MDBContainer>

        </>
    );
}
export default Login;