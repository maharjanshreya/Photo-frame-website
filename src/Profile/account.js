import Navbar from '../Navbar/navbar';
import {React, useEffect,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import Button from 'react-bootstrap/Button';
import User from '../Images/user.png';
import { RiEditLine } from "react-icons/ri";
import { TbLogout2 } from "react-icons/tb";
import { useUser } from '../context/user';
import Modal from 'react-bootstrap/Modal';
import Warning from '../Images/warning.png';
function Account(){
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const { userId, setUserId } = useUser();
  const handleClose = () => setShow(false);

  console.log("account user id",userId);
  const callMyAccount = async () => {
    try {
       const res = await fetch('/account', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!res.ok) {
        const error = new Error(res.statusText);
        throw error;
      }
      
      const data = await res.json();
      setUserData(data);
      setUserId(data._id);
      console.log("user issss",userId);
      //console.log(data);
      
    } catch (err) {
      console.log('Error in fetching data', err);
      navigate('/login', { replace: true });
    }
      };
      
    useEffect(()=>{
        callMyAccount();

    }, [userData]);
    const handleLogout = async () => {
      try {
        const response = await fetch('/logout', {
          method: 'GET',
          headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
  
        if (response.ok) {
          // Handle successful logout on the client side
          localStorage.removeItem('tokens');
          localStorage.removeItem('userId');
          console.log('Logout successful'); 
          navigate('/login', { replace: true });
        } else {
          // Handle errors or display appropriate messages
          console.error('Logout failed');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };
    return(
      <>
      <div>
        <Navbar userId={userData && userData._id}/>
        <h2 className='text-center' style={{color:'#ECB800',fontFamily:'Poppins',fontWeight:'bolder'}}>Welcome to your profile</h2><br/>
        {userData && (

            <h3 className='text-center' style={{color:'#ECB800',fontFamily:'Poppins',fontWeight:'bolder'}}>{userData.firstname}!</h3>
          
        )}
        <div>
          <p style={{color:'#8B8787',
            marginLeft: '80px',fontFamily:'Gelasio, serif',fontSize:'20px'
          }}>Your information</p>
          <div className='d-flex user-information'>
            
            <div className='profilepic'>
              <img src={User} alt="profilepic" width='150px' height='150px'/>
            </div>
            <div className='profilepic'>
              {userData && (
                <p className='' style={{color:'#097D96',fontFamily:'Poppins',fontWeight:'lighter',fontSize:'32px'}}>{userData.firstname} {userData.lastname}</p>
              )}<br/>
              <span className='profile-bold-text'>Email: </span>   {userData && (
                <span className='text-center profile-text' >{userData.email} </span>
              )} <Button variant="primary"   style={{ backgroundColor: '#DB6611', borderColor: '#DB6611'}}> <RiEditLine /> Edit</Button><br/>
              <span className='profile-bold-text'> Contact: </span>   {userData && (
                <span className='text-center profile-text'>{userData.contact} </span>
              )}<br/>
              
              <Button variant="primary" onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShow(true);
                     
                    }} style={{marginTop:'20px'}}> <TbLogout2 /> Log out</Button>
            </div>
          </div>
        </div>  {/*your information ended */ }

        <div>
          <div>
            <p style={{color:'#8B8787',
              marginLeft: '80px',fontFamily:'Gelasio, serif',fontSize:'20px',marginTop:'40px'
            }}>Your Purchase</p>
          </div>
          <div className='purchase-information'>
            
            
          </div>
        </div>  
      

      </div>
      <Modal show={show} onHide={handleClose} centered >
        <div className="modal show" style={{ display: 'block', position: 'initial', padding: 0  }} >

          <Modal.Dialog style={{ margin: 0 }} centered>
            <Modal.Header closeButton className="d-flex align-items-center justify-content-center" centered>
              
              
            </Modal.Header>

            <Modal.Body style={{padding: '30px 40px'}}><div className='text-center'>
                <img src={Warning} width={30} height={20}/><br/>
                <b><h3>Log out?</h3></b>
                </div>
                 
              <p className='text-center'>Are you sure you want to log out!</p><br/>
              <div style={{ display: 'flex',alignItems:'center' , justifyContent:'center'}}>
              <Button variant="secondary" onClick={handleClose} style={{ backgroundColor: '#6c757d', width: 'auto', borderColor: '#6c757d', marginRight: '8px' }}>Close</Button>
              <Button variant="danger" onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLogout();
                      handleClose();
                    }}>Log out</Button>
                    </div>
            </Modal.Body>

            
          </Modal.Dialog>
        </div>
        
      </Modal>
      </>
    );
}
export default Account;