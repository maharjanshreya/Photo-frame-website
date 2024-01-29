import sideImage from '../Images/LoginImage.png';
import Logo from '../Images/Rectangle 1.png';
import  '../CSS/style.css';
import { Link } from 'react-router-dom';
import React from 'react';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
function Login(){
    const navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
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
        // const data = res.json();
        // console.log(data);
        // //localStorage.setItem('role', res.data.role);
        // //const role = res.data.role;
        // if(res.status === 400 || !data){
        //     window.alert("Invalid Crediaitnlas");
        // }
        // // else if(role=="admin"){
        // //     window.alert("Successfully entered as admin: Dashboard");
        // //     navigate("/adminDashboard");
        // // }
        // else{
        //     window.alert("Successfully entered as user: Homepage");
        //     navigate("/");

        // }
        try {
            const data = await res.json();
            console.log("data",data);
            console.log(data.userData.role);
            const role=data.userData.role;
            

            if (res.status === 400 || !data) {
                window.alert("Invalid Credentials");
            } else if(role==="admin") {
                window.alert("Successfully entered as user: Homepage");
                navigate("/adminDashboard");
                localStorage.setItem('status', 'true');
                localStorage.setItem('token', 'true');
            }
            else{
                navigate("/");
                localStorage.setItem('status', 'true');

            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    }
    
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
                <input type="text" id="password" name="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)}/><br/>
                <input type="submit" value="Login" onClick={loginUser}/>
                </form>
                <p>Don't have an account?<Link to='/register' > <u className='register-color'>Register Now </u></Link></p>
                <Link to='/'><button>Cancel</button></Link>
            </div>
            
        
        </div>
    );
}
export default Login;