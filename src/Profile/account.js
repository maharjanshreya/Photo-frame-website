import Navbar from '../Navbar/navbar';
import {React, useEffect,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import Button from 'react-bootstrap/Button';
import User from '../Images/user.png';

import { Link } from 'react-router-dom';
import { TbLogout2 } from "react-icons/tb";
function Account(){
    const navigate = useNavigate();
    const [userData, setUserData] = useState();

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
          console.log(data);
      
        } catch (err) {
          console.log('Error in fetching data', err);
          navigate('/login');
        }
      };
      
    useEffect(()=>{
        callMyAccount();

    }, []);
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
      <div>
        <Navbar/>
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
                <p className='text-center' style={{color:'#097D96',fontFamily:'Poppins',fontWeight:'lighter',fontSize:'32px'}}>{userData.firstname} {userData.lastname}</p>
              )}<br/>
              <span className='profile-bold-text'>Email: </span>   {userData && (
                <span className='text-center profile-text' >{userData.email} </span>
              )}<br/>
              <span className='profile-bold-text'> Contact: </span>   {userData && (
                <span className='text-center profile-text'>{userData.contact} </span>
              )}<br/>
              
              <Button variant="primary" onClick={handleLogout}> <TbLogout2 /> Log out</Button>
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
    );
}
export default Account;