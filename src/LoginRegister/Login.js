import sideImage from '../Images/LoginImage.png';
import Logo from '../Images/Rectangle 1.png';
import  '../CSS/style.css';
import { Link } from 'react-router-dom';
import React from 'react';
import {useState,useEffect,useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/token';
import { useUser } from '../context/user';
function Login(){
    const navigate = useNavigate();
    const [userData, setUserData] = useState([]);
    const [email,setEmail] = useState('');
    const [hasToken, setHasToken] = useState(false);

    const checkUserRole = useCallback(() => {
        const token = localStorage.getItem('tokens');
        if (token) {
        const parsedData = JSON.parse(token);
        const userRole = parsedData.userData.role;
        if (userRole === 'admin') {
            setHasToken(true);
        }
        }
    }, []);

    useEffect(() => {
        checkUserRole();
    }, [checkUserRole]);
    const [password,setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { userId, setUserId } = useUser();
    
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
    const loginUser = async (e) => {
        e.preventDefault();
        const res = await fetch('/signin', {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            
            credentials: 'include',
            body: JSON.stringify({
                email,password
            })
        });
      
    
        try {
            const data = await res.json();
           // console.log("data",data);
            console.log(data.userData.role);
            const role=data.userData.role;
            
            setUserId(data.userData._id);
            localStorage.setItem('status', 'true');
            localStorage.setItem('userId', data.userData._id);
            if (res.status == 400) {
                // Check if the response contains an 'error' property
                if (data && data.error) {
                  throw new Error(data.error);
                } else {
                  throw new Error("An unknown error occurred.");
                }
              }
            

            if (res.status === 400 || !data) {
                window.alert("Invalid Credentials");
            } else if(role==="admin") {
                
                
                localStorage.setItem('status', 'true');
                localStorage.setItem('tokens', JSON.stringify(data));
                checkUserRole();
                navigate("/adminDashboard");
            }
            else{
                
                localStorage.setItem('status', 'true');
                const apiUrl = 'account'; 
                
                // Fetch the data from the API
                fetch(apiUrl)
                .then((response) => {
                    if (!response.ok) {
                      throw new Error('An unknown error occurred.');
                    }
                    return response.json();
                  })
                .then((data) => {
                    // Update the state with the fetched data
                    setUserData(data);
                    setUserId(data._id);
                    localStorage.setItem('userId', data._id);
                    console.log("userId in login :",userId);
                    navigate("/");
                })

                .catch((error) => {
                    window.alert(error.message);
                  console.log('Error fetching data:', error.message);
                });
                
            }
        } catch (error) {
            window.alert(error.message);
            console.log('Error parsing JSON:', error.message);
        }
    }
    useEffect(() => {
        if (userId) {
          console.log("Login user id ", userId);
      
          // Additional logic (e.g., API calls) that depends on the updated userId
        }
      }, [userId]);
    return(
        <div className="full-screen-image">
            <div className="left-column">
                <img src={sideImage} alt="logout" className="full-height-image"  />
            </div>
            <div className="right-column">
                <p className='text'>Login and <br/>Design your frames with</p>
                <img src={Logo} alt="logout" className=""  />
                <form method='POST' className='input-text'>
                <input type="text" id="username" name="username" placeholder="Username" value={email} onChange={(e)=> setEmail(e.target.value)}/><br/>
                
                <input  type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)}  style={{ paddingRight: '30px' }} /><br/>
                <p style={{marginRight:'15pc'}}>
                <label htmlFor="showPassword">
                <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={handleTogglePassword}
                />
                Show Password
            </label></p>
              
                <input type="submit" value="Login" onClick={loginUser}/>
                </form>
                <p>Don't have an account?<Link to='/register' > <u className='register-color'>Register Now </u></Link></p>
                <Link to='/'><button>Cancel</button></Link>
                
            </div>
            
        
        </div>
    );
}
export default Login;