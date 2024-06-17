import sideImage from '../Images/LoginImage.png';
import mail from '../Images/communication.png';
import Logo from '../Images/Rectangle 1.png';
import  '../CSS/style.css';
import Spinner from 'react-bootstrap/Spinner';
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {useState} from 'react';
import { Link } from 'react-router-dom';
function Reset(){
    const[response,setResponse] = useState('');
    const[error,setError] = useState('');
    const[show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const[loading, setLoading] = useState(false);
    const[user, setUser] = useState({
        email:"",
    });

    let name,value;
    const handleInputs = (e) =>{
        console.log(e);
        name =e.target.name;
        value = e.target.value;
        setUser({...user,[name]:value});
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const{email} =user;
        console.log(email);
        const res = await fetch("https://photo-frame-website.onrender.com/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
               email
            })
        });
        const data = await res.json();
        if(res.status=== 404|| !data){
            setLoading(false);
            setError(data.message);
            console.log(data.message);
            
        }else{
            setLoading(false);
            setResponse(data.message);
            setShow(true);
            console.log(data);

        }
        
    }
    return(
        <>
        <div className="full-screen-image">
            <div className="left-column">
                <img src={sideImage} alt="logout" className="full-height-image"  />
            </div>
            <div className="right-column">
                <p className='text'>Reset your password</p>
                <img src={Logo} alt="logout" className=""  />
                <form method='POST' className='input-text' onSubmit={handleSubmit}>
                <input type="text" id="username" name="email" placeholder="Your Email"  required value={user.email} onChange={handleInputs}/><br/>
                <input type="submit" value="Send"  /><br/>
                <input type="submit" value="Resend the link"  />
                {response && <div>{response}</div>}
                {error && <div style={{color:'red',fontWeight:'500'}}>{error}</div>}<br/>
                </form>
                {loading && (<Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>)}
                <p>Already have an account<Link to="/login"> <u className='register-color'>Sign-in Now </u></Link></p>
             
            </div>    
        </div>

        <Modal show={show} onHide={handleClose} centered >
        <div className="modal show" style={{ display: 'block', position: 'initial', padding: 0 }} >

          <Modal.Dialog style={{ margin: 0 }} centered>
            <Modal.Header closeButton className="d-flex align-items-center justify-content-center" centered>


            </Modal.Header>

            <Modal.Body style={{ padding: '30px 40px' }}><div className='text-center'>
              <img src={mail} width={80} height={80} /><br />
              <b>Email Confirmation</b>
            </div>

              <p className='text-center'>We have sent email to <span style={{color:'green',fontWeight:'500'}}>{user.email} </span>to confirm the validity of our email address. After receiving the email follow the link provided to reset your password.</p><br />
             <hr/>
             <p className='text-center'>If you got no any email, <span className="resend-button" onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation(); handleClose();
                  handleSubmit();
                 
                }}>Resend Confirmation Mail </span></p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="secondary" onClick={handleClose} style={{ backgroundColor: '#6c757d', width: 'auto', borderColor: '#6c757d', marginRight: '8px' }}>Close</Button>
               
              </div>
            </Modal.Body>


          </Modal.Dialog>
        </div>

      </Modal>
        </>
    );
}
export default Reset;