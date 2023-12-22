import Navbar from '../Navbar/navbar';
import {React, useEffect,useState} from 'react';
import { useNavigate } from 'react-router-dom';
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
    return(
        <div>
            <Navbar/>
            <p>My account</p>
            {userData && (
  
                <p>Name: {userData.firstname}</p>
              
            )}

            <form method='GET'>
            <p>My account</p>
            <p>Name: </p> 
                </form>
        </div>
    );
}
export default Account;