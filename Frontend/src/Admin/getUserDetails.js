import React, { useState, useEffect } from 'react';
function GetUserDetails(){
    const [userData, setUserData] = useState([]);
    const userFunc = async () => {
        try {
          const res = await fetch('https://photo-frame-website.onrender.com/getUser',  {
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
          
        const datas = await res.json();
        console.log('API Response:', datas); 
        setUserData(datas);
        console.log("Datas",datas);
      
        } catch (err) {
          console.log('Error in fetching data', err);
        }
        };
            
        useEffect(()=>{
          userFunc();
         
    
        }, []);
    return(<>

    <p>user details</p>
    </>)
}
export default GetUserDetails;