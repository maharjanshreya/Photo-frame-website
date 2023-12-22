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
            body: JSON.stringify({
                email,password
            })
        });
        const data = res.json();
        if(res.status === 400 || !data){
            window.alert("Invalid Crediaitnlas");
        }
        else{
            navigate("/");
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
                <form method='POST'>
                <input type="text" id="username" name="username" placeholder="Username" value={email} onChange={(e)=> setEmail(e.target.value)}/><br/>
                <input type="text" id="password" name="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)}/><br/>
                <input type="submit" value="Login" onClick={loginUser}/>
                </form>
                <p>Don't have an account?<Link to='/register' > <u className='register-color'>Register Now </u></Link></p>
                <Link to='/'><button>CAncel</button></Link>
            </div>
            
        
        </div>
    );
}
export default Login;